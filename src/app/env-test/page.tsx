'use client';

export default function EnvTestPage() {
  return (
    <div style={{ padding: '20px', marginTop: '320px' }}>
      <h1>Environment Variable Test Page</h1>
      <p>This page should show the environment debugger above without triggering Firebase.</p>
      <p>Check the black debug panel at the top of the page and browser console for details.</p>
    </div>
  );
} 