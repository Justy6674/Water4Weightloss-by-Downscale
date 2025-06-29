
'use server';

import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '../../service-account.json';

// This ensures we only initialize the app once, making it safe to import this file
// across multiple server-side modules.
const adminApp = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApp();

const adminDb = getFirestore(adminApp);
const adminMessaging = getMessaging(adminApp);

export { adminDb, adminMessaging };
