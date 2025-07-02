"use client";

export default function EnvDebug() {
  return (
    <div className="p-4 text-sm text-red-500 bg-black">
      <h2 className="font-bold">🔍 ENV DEBUG</h2>
      <ul>
        <li>API KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "❌ Missing"}</li>
        <li>AUTH DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "❌ Missing"}</li>
        <li>PROJECT ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "❌ Missing"}</li>
        <li>STORAGE BUCKET: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "❌ Missing"}</li>
        <li>SENDER ID: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "❌ Missing"}</li>
        <li>APP ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "❌ Missing"}</li>
      </ul>
    </div>
  );
} 