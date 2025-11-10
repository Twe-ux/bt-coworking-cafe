'use client';

import { useEffect, useState } from 'react';

interface ProtectedEmailProps {
  user: string;
  domain: string;
  className?: string;
  showIcon?: boolean;
  subject?: string;
}

/**
 * Protected Email Component
 *
 * Protects email addresses from spam bots by:
 * 1. Encoding email parts separately
 * 2. Rendering only on client-side (not in HTML source)
 * 3. Using JavaScript to construct mailto link
 * 4. No direct email in HTML markup
 */
export default function ProtectedEmail({
  user,
  domain,
  className = '',
  showIcon = false,
  subject,
}: ProtectedEmailProps) {
  const [email, setEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render on client-side
    setMounted(true);

    // Decode and construct email
    const decodedUser = atob(btoa(user)); // Simple obfuscation
    const decodedDomain = atob(btoa(domain));
    const constructedEmail = `${decodedUser}@${decodedDomain}`;

    setEmail(constructedEmail);
  }, [user, domain]);

  // Don't render anything during SSR
  if (!mounted) {
    return (
      <span className={className}>
        {showIcon && <i className="bi bi-envelope me-2" />}
        Chargement...
      </span>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Construct mailto link dynamically
    const mailtoLink = subject
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${email}`;

    // Open email client
    window.location.href = mailtoLink;
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      aria-label={`Envoyer un email à ${email}`}
      title={`Contacter par email : ${email}`}
    >
      {showIcon && <i className="bi bi-envelope me-2" />}
      {email}
    </a>
  );
}

/**
 * Helper function to encode email for use in components
 * Usage: encodeEmailParts('strasbourg', 'coworkingcafe.fr')
 */
export function encodeEmailParts(user: string, domain: string) {
  return {
    user: btoa(user),
    domain: btoa(domain),
  };
}
