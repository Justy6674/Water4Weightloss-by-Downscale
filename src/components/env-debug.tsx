'use client';

import { useEffect, useState } from 'react';

export function EnvDebugger() {
  const [envState, setEnvState] = useState<{
    client: Record<string, string | undefined>;
    hasWindow: boolean;
    processEnv: boolean;
  }>({
    client: {},
    hasWindow: false,
    processEnv: false
  });

  useEffect(() => {
    const firebaseVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const clientEnv: Record<string, string | undefined> = {};
    
    firebaseVars.forEach(varName => {
      clientEnv[varName] = process.env[varName];
    });

    setEnvState({
      client: clientEnv,
      hasWindow: typeof window !== 'undefined',
      processEnv: typeof process !== 'undefined' && !!process.env
    });

    // Also log to console for debugging
    console.log('🔍 Environment Debug Info:');
    console.log('Has window:', typeof window !== 'undefined');
    console.log('Has process:', typeof process !== 'undefined');
    console.log('Has process.env:', typeof process !== 'undefined' && !!process.env);
    console.log('Firebase env vars:', clientEnv);
    console.log('Full process.env keys:', Object.keys(process.env || {}).filter(k => k.startsWith('NEXT_PUBLIC')));
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxHeight: '300px',
      overflow: 'auto',
      width: '100%'
    }}>
      <h3>🔍 Environment Debug</h3>
      <p><strong>Has Window:</strong> {envState.hasWindow ? '✅' : '❌'}</p>
      <p><strong>Has process.env:</strong> {envState.processEnv ? '✅' : '❌'}</p>
      
      <h4>Firebase Environment Variables:</h4>
      {Object.entries(envState.client).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value ? `✅ ${value.substring(0, 20)}...` : '❌ undefined'}
        </div>
      ))}
      
      <h4>All NEXT_PUBLIC vars:</h4>
      <div>
        {Object.keys(process.env || {})
          .filter(k => k.startsWith('NEXT_PUBLIC'))
          .map(key => (
            <div key={key}>
              {key}: {process.env[key] ? '✅' : '❌'}
            </div>
          ))}
      </div>
    </div>
  );
} 