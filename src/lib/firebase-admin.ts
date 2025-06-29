
'use server';

import * as admin from 'firebase-admin';

// Using the full service account object directly to ensure correctness and stability.
// The private key is sensitive and should ideally be loaded from a secure vault or environment variable in production.
const serviceAccount = {
  "type": "service_account",
  "project_id": "water4weightloss-by-downscale",
  "private_key_id": "1ee16fa2a16100ce4283ebc7dc86627f0d7e246a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCo+7FzuAScsxRe\n9Ecc/8RtA5RKPku9C2eRlqaroZ0kEutYFypcKnGmvZKR3VUBOsAwG9lmD6Yh1TQe\nyP3mwBh0kEA0vLGhzRTOqr/xDkpqczvao2h7TY8hCPFyIwnOHcJbiGEhXwzCJbG6\nh6oaxFJM94i+ME4fHJbgZwi3EzMdb+Hr/yQPajUm9Ou4TQ+kC6WbC26BlA/fugDp\nyUc1tlG6pimBYnCzm7E0XjAddJPZEICWycAgljjpeh92k65dbG9FY9BkMvQrbnqd\ncI6GxadHhNMMvEBRy8HQMwbb9kIDz7KuimDvti2AdaJ9kQi5x8KnjBMCPe9FXO7t\nEf0o206pAgMBAAECggEAAQ1QFYBXxwH2ZoDu0GdnOaaEDdJFdm/TvTxK3VasO8VC\nYdIDGX/KJVeYyf+uv8s11xbVS6VdS2igYnCt4/neLRuYyrtB/9ffAUpe14lXPUJq\nZPoPdHUPJw1/M060iOv2gctfj22gDrVdXePqUzBVstT3rPdwBRGQfuUlUL512wEM\sswEBW2Xqa+i2Lz+Cmc3+T2RAXeCTRqsnMxK1AQpTulHc38jMY9k1EVhIKHvW+o+\n7dzQ/Mk2eoyOfIJcvOtHwaBEOKGc7pZ9ud3fw4eghVqCu1ZvzD6eG+eK2p9wGArQ\noKb6Ky78ubyVlQNRJzx+RS6vDl45frmPGbd2lq4WYQKBgQDr3LG3ZAwaismLlO/\n1YvU8QhLa4VgwTprUHtJq/fZrDW6uHuFPlIyJ8R4FT9UFHTUD8hsuIugGYOPRUtkV\nJJpH90wqIfXbhS/MSKgx/+XtihRyj+A+QNu790Ljr1BM/o74FjTq9OikYT/lqm3I\nVSjqhalerKg9R8LlWxc/QjUSmwKBgQC3aTURaRmnnJv7gtZW3mpA5xBD6zR9TL65\nrEdokryPalagi4v9i933yWTv0LipLk0nPfCL90fBveX4IzJJW/JbcTceKn/hTsOA\n7iGw+rUG7bueErbnSSXDApGLOkThRK69cGzJ9Q7Y+0A0SwtN2YxUkjpl3tIEN+u3\nM4IUZjmmCwKBgFaIRXsu7XHfcUoQfmjcwXQ2GYzMF/rBG/SuyiwOuJVV/EFNewQj\nT9xb5dO1EkYqDQVBkc8/ZzjP20U0zAgBwcidZggfJYBAQOUF0w9k/wpDGnVda7vr\nN7KiaJv3+dIFopZKL2f0KlYEh9jOyjAxbi18lELzvVWeOlbDMKg4thf5AoGARvjf\nIC2bT9C6S0kFx/epBhRjpuSNGy9nXlHcEAs4DAcKHnXhZeuJqSi1dlc+HbldAaJm\nQsMdcUsagjqcaua5kcjtmy627widHncHcoSRKG01/KUhQb58bknAKDAUF1eMhqHK\ndxvs8unGnnWrmiRkuRUco+7lNdytyeaUn3AvPqECgYAcDuGQGF1HqZXFJQcPlxLq\ndLFEdhHwA1zye0rYGpVs/prz/We3Qdzvvvwg2kyXOI7pudQpwFhlReT+m2UafEI6\n0eBVFi8+u/QP7POYlJvDDady/dP6838bPcG0WnGDJX+vkR7Hr9x6wpJdmjSgDLa2\nt/00VBjjT8k1nE2NgbjWPg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@water4weightloss-by-downscale.iam.gserviceaccount.com",
  "client_id": "107317112451695026304",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40water4weightloss-by-downscale.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
} as admin.ServiceAccount;


// This check prevents re-initializing the app on every hot-reload
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('CRITICAL: Firebase admin initialization failed.', error);
    // This is a critical error. The application cannot function without the admin SDK.
    // We throw an error to halt server startup and make the problem visible immediately.
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}. Check server logs for details.`);
  }
}

export const adminMessaging = admin.messaging();
