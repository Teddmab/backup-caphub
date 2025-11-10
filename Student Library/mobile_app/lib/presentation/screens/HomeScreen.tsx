import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FirestoreService } from '@/application/services/FirestoreService';
import { FirebaseFirestoreRepository } from '@/infrastructure/repositories/FirebaseFirestoreRepository';
import { TestDocument } from '@/domain/entities/TestDocument';

const HomeScreen: React.FC = () => {
  const [testDocument, setTestDocument] = useState<TestDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const firestoreService = new FirestoreService(new FirebaseFirestoreRepository());

  const writeTestDocument = async () => {
    try {
      setLoading(true);
      setLastAction('Writing test document...');
      
      await firestoreService.writeTestDocument('Hello from React Native!');
      
      setLastAction('Test document written successfully!');
      Alert.alert('Success', 'Test document written to Firestore!');
      
      // Read the document back
      await readTestDocument();
    } catch (error) {
      console.error('Error writing test document:', error);
      setLastAction('Error writing test document');
      Alert.alert('Error', 'Failed to write test document');
    } finally {
      setLoading(false);
    }
  };

  const readTestDocument = async () => {
    try {
      setLoading(true);
      setLastAction('Reading test document...');
      
      const document = await firestoreService.readTestDocument();
      setTestDocument(document);
      
      if (document) {
        setLastAction('Test document read successfully!');
      } else {
        setLastAction('No test document found');
      }
    } catch (error) {
      console.error('Error reading test document:', error);
      setLastAction('Error reading test document');
      Alert.alert('Error', 'Failed to read test document');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Read test document on component mount
    readTestDocument();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Library App</Text>
      <Text style={styles.subtitle}>Firebase Integration Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Last Action:</Text>
        <Text style={styles.statusText}>{lastAction}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.writeButton]}
          onPress={writeTestDocument}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Write Test Document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.readButton]}
          onPress={readTestDocument}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Read Test Document</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      {testDocument && (
        <View style={styles.documentContainer}>
          <Text style={styles.documentTitle}>Latest Test Document:</Text>
          <Text style={styles.documentMessage}>{testDocument.message}</Text>
          <Text style={styles.documentTimestamp}>
            {testDocument.timestamp.toLocaleString()}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This screen demonstrates Firebase Firestore integration.
        </Text>
        <Text style={styles.infoText}>
          Tap "Write Test Document" to create a test entry.
        </Text>
        <Text style={styles.infoText}>
          Tap "Read Test Document" to fetch the latest entry.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  writeButton: {
    backgroundColor: '#4CAF50', // Green
    shadowColor: '#388E3C',
  },
  readButton: {
    backgroundColor: '#2196F3', // Blue
    shadowColor: '#1976D2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  documentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  documentMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  documentTimestamp: {
    fontSize: 14,
    color: '#888',
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
