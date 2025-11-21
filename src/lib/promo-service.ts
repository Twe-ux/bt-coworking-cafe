import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  PromoConfig,
  PromoCode,
  MarketingContent,
  ScanStats,
  ScanEvent,
  DEFAULT_PROMO_CONFIG
} from '@/types/promo';

// Chemin vers le fichier de configuration
const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'promo-config.json');

class PromoService {
  private config: PromoConfig | null = null;

  // Charger la configuration depuis le fichier
  private async loadConfig(): Promise<PromoConfig> {
    try {
      const data = await fs.readFile(CONFIG_PATH, 'utf-8');
      this.config = JSON.parse(data);
      return this.config!;
    } catch (error) {
      // Si le fichier n'existe pas, créer avec la config par défaut
      console.log('📁 Création du fichier de configuration promo...');
      const defaultConfig = {
        ...DEFAULT_PROMO_CONFIG,
        current: {
          ...DEFAULT_PROMO_CONFIG.current,
          token: this.generateToken()
        }
      };
      await this.saveConfig(defaultConfig);
      this.config = defaultConfig;
      return defaultConfig;
    }
  }

  // Sauvegarder la configuration
  private async saveConfig(config: PromoConfig): Promise<void> {
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.dirname(CONFIG_PATH);
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
    this.config = config;
  }

  // Générer un token unique
  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // Obtenir la configuration complète
  async getConfig(): Promise<PromoConfig> {
    if (!this.config) {
      return this.loadConfig();
    }
    return this.config;
  }

  // Obtenir le code promo actuel
  async getCurrentPromo(): Promise<PromoCode> {
    const config = await this.getConfig();
    return config.current;
  }

  // Obtenir le token actuel (sans incrémenter les stats)
  async getCurrentToken(): Promise<string> {
    const config = await this.getConfig();
    return config.current.token;
  }

  // Obtenir un code promo par token
  async getPromoByToken(token: string): Promise<PromoCode | null> {
    const config = await this.getConfig();
    if (config.current.token === token && config.current.is_active) {
      return config.current;
    }
    return null;
  }

  // Créer un nouveau code promo
  async createPromo(promo: Omit<PromoCode, 'token' | 'current_uses' | 'created_at'>): Promise<PromoCode> {
    const config = await this.getConfig();

    // Archiver l'ancien code si actif
    if (config.current.is_active && config.current.current_uses > 0) {
      config.history.push({
        code: config.current.code,
        token: config.current.token,
        description: config.current.description,
        discount_type: config.current.discount_type,
        discount_value: config.current.discount_value,
        valid_from: config.current.valid_from,
        valid_until: config.current.valid_until,
        total_uses: config.current.current_uses,
        deactivated_at: new Date().toISOString()
      });
    }

    // Créer le nouveau code
    const newPromo: PromoCode = {
      ...promo,
      token: this.generateToken(),
      current_uses: 0,
      created_at: new Date().toISOString()
    };

    config.current = newPromo;

    // Réinitialiser les stats de scan pour le nouveau code
    config.scan_stats = {
      total_scans: 0,
      total_reveals: 0,
      total_copies: 0,
      conversion_rate_reveal: 0,
      conversion_rate_copy: 0,
      scans_by_day: {},
      scans_by_hour: {},
      average_time_to_reveal: 0
    };
    config.events = [];

    await this.saveConfig(config);
    return newPromo;
  }

  // Incrémenter les vues
  async incrementViews(): Promise<void> {
    const config = await this.getConfig();
    config.stats.total_views++;
    config.stats.views_today++;
    await this.saveConfig(config);
  }

  // Incrémenter les copies
  async incrementCopies(): Promise<void> {
    const config = await this.getConfig();
    config.stats.total_copies++;
    config.stats.copies_today++;
    config.current.current_uses++;
    await this.saveConfig(config);
  }

  // === MÉTHODES DE TRACKING ===

  // Tracker un scan (visite sur /scan)
  async trackScan(sessionId: string): Promise<void> {
    const config = await this.getConfig();

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const hourKey = `${now.getHours()}h`;

    // Ajouter l'événement
    config.events.push({
      timestamp: now.toISOString(),
      type: 'scan',
      session_id: sessionId
    });

    // Mettre à jour les stats
    config.scan_stats.total_scans++;
    config.scan_stats.scans_by_day[dateKey] = (config.scan_stats.scans_by_day[dateKey] || 0) + 1;
    config.scan_stats.scans_by_hour[hourKey] = (config.scan_stats.scans_by_hour[hourKey] || 0) + 1;

    // Recalculer les taux de conversion
    this.recalculateConversionRates(config);

    await this.saveConfig(config);
  }

  // Tracker une révélation (clic sur le bouton CTA)
  async trackReveal(sessionId: string): Promise<void> {
    const config = await this.getConfig();

    const now = new Date();

    // Ajouter l'événement
    config.events.push({
      timestamp: now.toISOString(),
      type: 'reveal',
      session_id: sessionId
    });

    // Mettre à jour les stats
    config.scan_stats.total_reveals++;

    // Calculer le temps moyen jusqu'à la révélation
    this.calculateAverageTimeToReveal(config);

    // Recalculer les taux de conversion
    this.recalculateConversionRates(config);

    await this.saveConfig(config);
  }

  // Tracker une copie du code
  async trackCopy(sessionId: string): Promise<void> {
    const config = await this.getConfig();

    // Ajouter l'événement
    config.events.push({
      timestamp: new Date().toISOString(),
      type: 'copy',
      session_id: sessionId
    });

    // Mettre à jour les stats
    config.scan_stats.total_copies++;
    config.stats.total_copies++;
    config.stats.copies_today++;
    config.current.current_uses++;

    // Recalculer les taux de conversion
    this.recalculateConversionRates(config);

    await this.saveConfig(config);
  }

  // Recalculer les taux de conversion
  private recalculateConversionRates(config: PromoConfig): void {
    const { total_scans, total_reveals, total_copies } = config.scan_stats;

    config.scan_stats.conversion_rate_reveal = total_scans > 0
      ? Math.round((total_reveals / total_scans) * 100 * 10) / 10
      : 0;

    config.scan_stats.conversion_rate_copy = total_reveals > 0
      ? Math.round((total_copies / total_reveals) * 100 * 10) / 10
      : 0;
  }

  // Calculer le temps moyen jusqu'à la révélation
  private calculateAverageTimeToReveal(config: PromoConfig): void {
    const sessionTimes: { [sessionId: string]: { scan?: number; reveal?: number } } = {};

    // Grouper les événements par session
    for (const event of config.events) {
      if (!sessionTimes[event.session_id]) {
        sessionTimes[event.session_id] = {};
      }

      const timestamp = new Date(event.timestamp).getTime();
      if (event.type === 'scan' && !sessionTimes[event.session_id].scan) {
        sessionTimes[event.session_id].scan = timestamp;
      } else if (event.type === 'reveal' && !sessionTimes[event.session_id].reveal) {
        sessionTimes[event.session_id].reveal = timestamp;
      }
    }

    // Calculer le temps moyen
    const times: number[] = [];
    for (const session of Object.values(sessionTimes)) {
      if (session.scan && session.reveal) {
        times.push((session.reveal - session.scan) / 1000); // en secondes
      }
    }

    config.scan_stats.average_time_to_reveal = times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0;
  }

  // === MÉTHODES MARKETING ===

  // Obtenir le contenu marketing
  async getMarketingContent(): Promise<MarketingContent> {
    const config = await this.getConfig();
    return config.marketing;
  }

  // Mettre à jour le contenu marketing
  async updateMarketingContent(content: MarketingContent): Promise<boolean> {
    try {
      const config = await this.getConfig();
      config.marketing = content;
      await this.saveConfig(config);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du marketing:', error);
      return false;
    }
  }

  // === MÉTHODES DE STATS ===

  // Obtenir les stats de scan
  async getScanStats(): Promise<ScanStats> {
    const config = await this.getConfig();
    return config.scan_stats;
  }

  // Obtenir les stats des 7 derniers jours
  async getWeeklyStats(): Promise<{ date: string; scans: number }[]> {
    const config = await this.getConfig();
    const result: { date: string; scans: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      result.push({
        date: dateKey,
        scans: config.scan_stats.scans_by_day[dateKey] || 0
      });
    }

    return result;
  }

  // Obtenir le top des heures de scan
  async getTopHours(): Promise<{ hour: string; count: number; percentage: number }[]> {
    const config = await this.getConfig();
    const hourData = config.scan_stats.scans_by_hour;
    const total = Object.values(hourData).reduce((a, b) => a + b, 0);

    return Object.entries(hourData)
      .map(([hour, count]) => ({
        hour,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Nettoyer les anciens événements (> 30 jours)
  async cleanupOldEvents(): Promise<number> {
    const config = await this.getConfig();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const initialCount = config.events.length;
    config.events = config.events.filter(
      event => new Date(event.timestamp).getTime() > thirtyDaysAgo
    );

    const removedCount = initialCount - config.events.length;

    if (removedCount > 0) {
      await this.saveConfig(config);
    }

    return removedCount;
  }

  // Réinitialiser les stats quotidiennes (à appeler via un cron)
  async resetDailyStats(): Promise<void> {
    const config = await this.getConfig();
    config.stats.views_today = 0;
    config.stats.copies_today = 0;
    await this.saveConfig(config);
  }
}

// Exporter une instance singleton
export const promoService = new PromoService();
