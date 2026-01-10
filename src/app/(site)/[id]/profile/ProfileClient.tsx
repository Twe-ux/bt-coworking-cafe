'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ProfileClientProps {
  name: string;
  email: string;
  username: string;
  roleName: string;
  phone?: string;
  companyName?: string;
}

export default function ProfileClient({ name, email, username, roleName, phone, companyName }: ProfileClientProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: name || '',
    email: email || '',
    phone: phone || '',
    companyName: companyName || '',
  });

  // Update profile data when props change
  useEffect(() => {
    setProfileData({
      name: name || '',
      email: email || '',
      phone: phone || '',
      companyName: companyName || '',
    });
  }, [name, email, phone, companyName]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        setIsEditingProfile(false);

        // Update NextAuth session - this will reload data from database
        if (update) {
          await update();
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingPassword(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors du changement de mot de passe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message.text && (
        <div
          className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show border-start border-3 mb-4`}
          role="alert"
        >
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage({ type: '', text: '' })}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Profile Information */}
      <div className="mb-4">
        <h2 className="section-title">Informations personnelles</h2>
      </div>
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-semibold" style={{ color: '#142220' }}>Détails du compte</h5>
            {!isEditingProfile && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: '#417972',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  border: 'none',
                }}
                onClick={() => setIsEditingProfile(true)}
              >
                <i className="bi bi-pencil me-2"></i>
                Modifier
              </button>
            )}
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                Nom complet
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditingProfile}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: isEditingProfile ? '#fff' : '#f8f9fa',
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                disabled
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: '#e3ece7',
                  color: '#6e6f75',
                }}
              />
              <div className="border-start border-3 p-2 mt-1" style={{ borderLeftColor: '#f2d381', backgroundColor: 'rgba(242, 211, 129, 0.1)', borderRadius: '4px' }}>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Le nom d'utilisateur ne peut pas être modifié
                </small>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditingProfile}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: isEditingProfile ? '#fff' : '#f8f9fa',
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-semibold">
                Téléphone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditingProfile}
                placeholder="06 XX XX XX XX"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: isEditingProfile ? '#fff' : '#f8f9fa',
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="companyName" className="form-label fw-semibold">
                Raison sociale
              </label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                disabled={!isEditingProfile}
                placeholder="Nom de votre société (optionnel)"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: isEditingProfile ? '#fff' : '#f8f9fa',
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-semibold">
                Rôle
              </label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={roleName}
                disabled
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e3ece7',
                  padding: '12px',
                  backgroundColor: '#e3ece7',
                  color: '#6e6f75',
                }}
              />
            </div>

            {isEditingProfile && (
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{
                    backgroundColor: '#417972',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    border: 'none',
                  }}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileData({ name: name || '', email: email || '', phone: phone || '', companyName: companyName || '' });
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    backgroundColor: '#e3ece7',
                    color: '#142220',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    border: 'none',
                  }}
                >
                  Annuler
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-4">
        <h2 className="section-title">Sécurité</h2>
      </div>
      <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-semibold" style={{ color: '#142220' }}>Changer le mot de passe</h5>
            {!isEditingPassword && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: '#417972',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  border: 'none',
                }}
                onClick={() => setIsEditingPassword(true)}
              >
                <i className="bi bi-key me-2"></i>
                Modifier
              </button>
            )}
          </div>

          {isEditingPassword ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label fw-semibold">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    padding: '12px',
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-semibold">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e3ece7',
                    padding: '12px',
                  }}
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e3ece7',
                    padding: '12px',
                  }}
                  autoComplete="new-password"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{
                    backgroundColor: '#417972',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    border: 'none',
                  }}
                >
                  {loading ? 'Modification...' : 'Changer le mot de passe'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    backgroundColor: '#e3ece7',
                    color: '#142220',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    border: 'none',
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="border-start border-3 border-primary p-3 rounded" style={{ backgroundColor: 'rgba(65, 121, 114, 0.05)' }}>
              <p className="text-muted mb-0">
                <i className="bi bi-shield-lock me-2"></i>
                Cliquez sur "Modifier" pour changer votre mot de passe
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
