import { TestDocument } from '../entities/TestDocument';

export interface FirestoreRepository {
  writeTestDocument(message: string): Promise<void>;
  readTestDocument(): Promise<TestDocument | null>;
}
