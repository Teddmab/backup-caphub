import { FirestoreRepository } from '@/domain/repositories/FirestoreRepository';
import { TestDocument } from '@/domain/entities/TestDocument';
import { firestoreInstance } from '../firebase/firebaseConfig';

export class FirebaseFirestoreRepository implements FirestoreRepository {
  private readonly testCollection = 'test';

  async writeTestDocument(message: string): Promise<void> {
    const testDoc: Omit<TestDocument, 'id'> = {
      message,
      timestamp: new Date(),
    };

    await firestoreInstance.collection(this.testCollection).add(testDoc);
  }

  async readTestDocument(): Promise<TestDocument | null> {
    const snapshot = await firestoreInstance
      .collection(this.testCollection)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      message: doc.data().message,
      timestamp: doc.data().timestamp.toDate(),
    };
  }
}
