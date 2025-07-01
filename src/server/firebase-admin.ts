
'use server';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';
import { validateServerEnv } from '@/lib/env-validation';
import { logError, createValidationError } from '@/lib/error-handling';

// Environment validation schema
interface ServiceAccountConfig {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
}

function validateServiceAccount(config: any): ServiceAccountConfig {
    const required = [
        'type', 'project_id', 'private_key_id', 'private_key', 
        'client_email', 'client_id', 'auth_uri', 'token_uri'
    ];
    
    for (const field of required) {
        if (!config[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    // Validate private key format
    if (!config.private_key.includes('BEGIN PRIVATE KEY')) {
        throw new Error('Invalid private key format');
    }
    
    return config as ServiceAccountConfig;
}

function parseServiceAccountJson(jsonString: string): ServiceAccountConfig {
    try {
        // Handle escaped newlines in environment variables
        const normalizedJson = jsonString.replace(/\\n/g, '\n');
        const parsed = JSON.parse(normalizedJson);
        return validateServiceAccount(parsed);
    } catch (parseError) {
        console.error('Failed to parse SERVICE_ACCOUNT_JSON:', parseError);
        throw new Error(`Invalid SERVICE_ACCOUNT_JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
}

// Singleton pattern for Firebase Admin initialization
class FirebaseAdmin {
    private static instance: FirebaseAdmin;
    private app: App | null = null;
    private db: Firestore | null = null;
    private messaging: Messaging | null = null;
    private initPromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): FirebaseAdmin {
        if (!FirebaseAdmin.instance) {
            FirebaseAdmin.instance = new FirebaseAdmin();
        }
        return FirebaseAdmin.instance;
    }

    async initialize(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this.doInitialize();
        return this.initPromise;
    }

    private async doInitialize(): Promise<void> {
        try {
            // Check if app already exists
            const existingApp = getApps().find(app => app.name === 'firebase-admin-app');
            if (existingApp) {
                this.app = existingApp;
                this.db = getFirestore(this.app);
                this.messaging = getMessaging(this.app);
                return;
            }

            // Validate environment variables
            const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
            if (!serviceAccountJson) {
                throw new Error("SERVICE_ACCOUNT_JSON environment variable is not set");
            }

            // Parse and validate service account
            const serviceAccount = parseServiceAccountJson(serviceAccountJson);

            // Initialize Firebase Admin
            this.app = initializeApp({
                credential: cert(serviceAccount as any),
                databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
            }, 'firebase-admin-app');

            this.db = getFirestore(this.app);
            this.messaging = getMessaging(this.app);

            console.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('CRITICAL: Firebase Admin SDK initialization failed:', error);
            throw new Error(`Firebase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    getApp(): App {
        if (!this.app) {
            throw new Error('Firebase Admin not initialized. Call initialize() first.');
        }
        return this.app;
    }

    getDb(): Firestore {
        if (!this.db) {
            throw new Error('Firebase Admin not initialized. Call initialize() first.');
        }
        return this.db;
    }

    getMessaging(): Messaging {
        if (!this.messaging) {
            throw new Error('Firebase Admin not initialized. Call initialize() first.');
        }
        return this.messaging;
    }
}

// Initialize the singleton
const firebaseAdmin = FirebaseAdmin.getInstance();

// Export async getters that ensure initialization
export async function getAdminApp(): Promise<App> {
    await firebaseAdmin.initialize();
    return firebaseAdmin.getApp();
}

export async function getAdminDb(): Promise<Firestore> {
    await firebaseAdmin.initialize();
    return firebaseAdmin.getDb();
}

export async function getAdminMessaging(): Promise<Messaging> {
    await firebaseAdmin.initialize();
    return firebaseAdmin.getMessaging();
}

// For immediate synchronous access (use with caution)
let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminMessaging: Messaging | undefined;

// Initialize in background for legacy compatibility
firebaseAdmin.initialize().then(() => {
    adminApp = firebaseAdmin.getApp();
    adminDb = firebaseAdmin.getDb();
    adminMessaging = firebaseAdmin.getMessaging();
}).catch(error => {
    console.error("CRITICAL FAILURE: Could not initialize Firebase Admin SDK.", error);
});

// Legacy exports for backward compatibility (deprecated)
export { adminApp, adminDb, adminMessaging };
export { firebaseAdmin as admin };
