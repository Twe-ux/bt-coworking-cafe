// Types pour le système de codes promo

export interface PromoCode {
  code: string;
  token: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export interface PromoHistory {
  code: string;
  token: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'free_item';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  total_uses: number;
  deactivated_at: string;
}

export interface PromoStats {
  total_views: number;
  total_copies: number;
  views_today: number;
  copies_today: number;
}

export interface ScanStats {
  total_scans: number;
  total_reveals: number;
  total_copies: number;
  conversion_rate_reveal: number;  // scans → reveals (%)
  conversion_rate_copy: number;    // reveals → copies (%)
  scans_by_day: { [date: string]: number };
  scans_by_hour: { [hour: string]: number };
  average_time_to_reveal: number;  // en secondes
}

export interface MarketingContent {
  title: string;
  message: string;
  image_url?: string;
  cta_text: string;
}

export interface ScanEvent {
  timestamp: string;
  type: 'scan' | 'reveal' | 'copy';
  session_id: string;
}

export interface PromoConfig {
  current: PromoCode;
  history: PromoHistory[];
  stats: PromoStats;
  scan_stats: ScanStats;
  marketing: MarketingContent;
  events: ScanEvent[];
}

// Contenu marketing par défaut
export const DEFAULT_MARKETING: MarketingContent = {
  title: "🎉 Bienvenue chez Cow-or-King !",
  message: `
    <p class="lead">Vous avez scanné notre QR code exclusif !</p>

    <h5 class="mt-4 mb-3">✨ Vos avantages :</h5>
    <ul class="list-unstyled">
      <li>✅ Première heure offerte</li>
      <li>✅ Boissons à volonté incluses</li>
      <li>✅ Wifi très haut débit</li>
    </ul>

    <p class="text-muted small mt-4">
      Cliquez ci-dessous pour découvrir votre code promo personnalisé
    </p>
  `,
  cta_text: "🎁 Découvrir mon code promo"
};

// Configuration par défaut
export const DEFAULT_PROMO_CONFIG: PromoConfig = {
  current: {
    code: "BIENVENUE2024",
    token: "",
    description: "1ère heure offerte pour les nouveaux clients",
    discount_type: "free_item",
    discount_value: 6,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    max_uses: 100,
    current_uses: 0,
    is_active: true,
    created_at: new Date().toISOString()
  },
  history: [],
  stats: {
    total_views: 0,
    total_copies: 0,
    views_today: 0,
    copies_today: 0
  },
  scan_stats: {
    total_scans: 0,
    total_reveals: 0,
    total_copies: 0,
    conversion_rate_reveal: 0,
    conversion_rate_copy: 0,
    scans_by_day: {},
    scans_by_hour: {},
    average_time_to_reveal: 0
  },
  marketing: DEFAULT_MARKETING,
  events: []
};
