import * as admin from 'firebase-admin';

/**
 * Inicializar Firebase Admin
 */
admin.initializeApp();

/**
 * Exportar Firestore
 */
export const db = admin.firestore();