'use client';

import { useEffect, useState } from 'react';

/**
 * Debug page to test middleware execution
 * Access this at: http://localhost:3000/auth/debug
 * REMOVE THIS IN PRODUCTION!
 */
export default function MiddlewareDebugPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch environment status from debug API
    fetch('/api/debug/env')
      .then((res) => res.json())
      .then((data) => {
        setEnvStatus(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching env status:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔍 Middleware Debug Page</h1>
      <p>
        <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
      </p>

      <hr />

      <h2>Environment Variables Status (API Route)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify(envStatus, null, 2)}
        </pre>
      )}

      <hr />

      <h2>Middleware Check</h2>
      <div style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <p>
          <strong>To check if middleware executed:</strong>
        </p>
        <ol>
          <li>Open Browser DevTools (F12)</li>
          <li>Go to the <strong>Network</strong> tab</li>
          <li>Refresh this page</li>
          <li>Click on the request for this page (usually "debug" or the page name)</li>
          <li>Look at the <strong>Response Headers</strong></li>
          <li>
            <strong>If middleware ran</strong>, you should see:
            <ul>
              <li>
                <code>X-Middleware-Executed: true</code>
              </li>
              <li>
                <code>X-Middleware-Path: /auth/debug</code>
              </li>
              <li>
                <code>X-Middleware-Time: [timestamp]</code>
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <p>
          <strong>To check console logs:</strong>
        </p>
        <ol>
          <li>
            Look at your <strong>terminal</strong> where <code>npm run dev</code> is running
          </li>
          <li>
            You should see logs like:
            <pre style={{ background: '#fff', padding: '0.5rem', marginTop: '0.5rem' }}>
              🔧 MIDDLEWARE MODULE LOADED{'\n'}🔒 MIDDLEWARE EXECUTING{'\n'}🔒 Path: /auth/debug
            </pre>
          </li>
        </ol>
      </div>

      <div style={{ background: '#f8d7da', padding: '1rem', borderRadius: '4px' }}>
        <p>
          <strong>If you don't see any of these:</strong>
        </p>
        <ul>
          <li>Middleware is NOT executing</li>
          <li>Check that <code>middleware.ts</code> is at project root</li>
          <li>
            Try stopping the dev server, deleting <code>.next</code> folder, and restarting
          </li>
          <li>Check for any build errors in the terminal</li>
        </ul>
      </div>

      <hr />

      <h2>Actions</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Refresh Page
        </button>
        <button
          onClick={() => (window.location.href = '/auth/login')}
          style={{
            padding: '0.5rem 1rem',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go to Login
        </button>
        <button
          onClick={() => (window.location.href = '/dashboard/admin')}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
}
