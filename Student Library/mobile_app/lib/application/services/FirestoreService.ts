import { FirestoreRepository } from '@/domain/repositories/FirestoreRepository';
import { TestDocument } from '@/domain/entities/TestDocument';

export class FirestoreService {
  constructor(private firestoreRepository: FirestoreRepository) {}

  async writeTestDocument(message: string): Promise<void> {
    return this.firestoreRepository.writeTestDocument(message);
  }

  async readTestDocument(): Promise<TestDocument | null> {
    return this.firestoreRepository.readTestDocument();
  }
}
