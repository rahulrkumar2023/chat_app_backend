import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';


export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});


if (!admin.apps.length) {
  admin.initializeApp({
   
    credential: process.env.FIREBASE_CREDENTIALS_PATH 
      ? admin.credential.cert(require(process.env.FIREBASE_CREDENTIALS_PATH))
      : admin.credential.applicationDefault(),
  });
}

export const firestore = admin.firestore();
export const FirebaseFieldValue = admin.firestore.FieldValue;
