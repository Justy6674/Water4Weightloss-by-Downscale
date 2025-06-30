
'use server';

import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const json = process.env.SERVICE_ACCOUNT_JSON;
if (!json) {
  throw new Error('SERVICE_ACCOUNT_JSON env-var is missing. See README.');
}

const creds = JSON.parse(json);

const admin = getApps().length ? getApp() : initializeApp({ credential: cert(creds) });

export const adminDb = getFirestore(admin);
export const adminMessaging = getMessaging(admin);
