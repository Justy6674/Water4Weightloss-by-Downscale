"use client";

export default function DebugPage() {
  // Get all environment variables
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Check all process.env keys that start with NEXT_PUBLIC
  const allPublicEnvs = Object.keys(process.env || {})
    .filter(key => key.startsWith('NEXT_PUBLIC'))
    .reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {} as Record<string, string | undefined>);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: 'black', 
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>🔍 ENVIRONMENT VARIABLE DEBUG</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: 'yellow' }}>Required Firebase Variables:</h2>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} style={{ margin: '10px 0', padding: '5px', backgroundColor: '#333' }}>
            <strong>{key}:</strong> {
              value ? 
                <span style={{ color: 'green' }}>✅ {value.substring(0, 30)}...</span> : 
                <span style={{ color: 'red' }}>❌ MISSING</span>
            }
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: 'yellow' }}>All NEXT_PUBLIC Environment Variables:</h2>
        {Object.keys(allPublicEnvs).length === 0 ? (
          <div style={{ color: 'red', fontSize: '18px' }}>❌ NO NEXT_PUBLIC VARIABLES FOUND</div>
        ) : (
          Object.entries(allPublicEnvs).map(([key, value]) => (
            <div key={key} style={{ margin: '5px 0' }}>
              <strong>{key}:</strong> {value ? '✅' : '❌'}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: 'yellow' }}>System Info:</h2>
        <div>Has window: {typeof window !== 'undefined' ? '✅' : '❌'}</div>
        <div>Has process: {typeof process !== 'undefined' ? '✅' : '❌'}</div>
        <div>Has process.env: {typeof process !== 'undefined' && !!process.env ? '✅' : '❌'}</div>
        <div>Total process.env keys: {Object.keys(process.env || {}).length}</div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222', border: '2px solid red' }}>
        <h2 style={{ color: 'red' }}>DIAGNOSIS:</h2>
        {Object.values(envVars).every(v => !v) ? (
          <div style={{ color: 'red', fontSize: '18px' }}>
            🚨 ALL FIREBASE ENVIRONMENT VARIABLES ARE MISSING<br/>
            This confirms Vercel is NOT injecting the environment variables into the client bundle.
          </div>
        ) : (
          <div style={{ color: 'green', fontSize: '18px' }}>
            ✅ Some environment variables are present - the issue is elsewhere.
          </div>
        )}
      </div>
    </div>
  );
} 