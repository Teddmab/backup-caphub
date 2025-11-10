import TouchID from 'react-native-touch-id';
import { Platform } from 'react-native';

export interface BiometricOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  fallbackLabel?: string;
  cancelLabel?: string;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

class BiometricService {
  private static instance: BiometricService;
  private isSupported = false;
  private biometryType: string | null = null;

  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  async checkAvailability(): Promise<BiometricResult> {
    try {
      const biometryType = await TouchID.isSupported();
      
      this.isSupported = true;
      this.biometryType = biometryType;
      
      return {
        success: true,
        biometryType: biometryType as string,
      };
    } catch (error: any) {
      this.isSupported = false;
      this.biometryType = null;
      
      return {
        success: false,
        error: error.message || 'Biometric authentication not supported',
      };
    }
  }

  async authenticate(options?: BiometricOptions): Promise<BiometricResult> {
    if (!this.isSupported) {
      return {
        success: false,
        error: 'Biometric authentication not supported on this device',
      };
    }

    const defaultOptions = {
      title: 'Authentification biométrique',
      subtitle: 'Utilisez votre empreinte digitale ou Face ID',
      description: 'Placez votre doigt sur le capteur ou regardez votre appareil',
      fallbackLabel: 'Utiliser le mot de passe',
      cancelLabel: 'Annuler',
    };

    const authOptions = { ...defaultOptions, ...options };

    try {
      const config = Platform.select({
        android: {
          title: authOptions.title,
          subtitle: authOptions.subtitle,
          description: authOptions.description,
          cancelLabel: authOptions.cancelLabel,
          color: '#AED036', // LaSo green
        },
        ios: {
          fallbackLabel: authOptions.fallbackLabel,
          cancelLabel: authOptions.cancelLabel,
        },
      });

      const result = await TouchID.authenticate(authOptions.description, config);
      
      return {
        success: true,
        biometryType: this.biometryType || undefined,
      };
    } catch (error: any) {
      let errorMessage = 'Authentication failed';
      
      // Handle specific error codes
      switch (error.name) {
        case 'LAErrorUserCancel':
        case 'UserCancel':
          errorMessage = 'Authentication cancelled by user';
          break;
        case 'LAErrorUserFallback':
        case 'UserFallback':
          errorMessage = 'User chose to use fallback authentication';
          break;
        case 'LAErrorSystemCancel':
        case 'SystemCancel':
          errorMessage = 'Authentication cancelled by system';
          break;
        case 'LAErrorTouchIDNotAvailable':
        case 'BiometryNotAvailable':
          errorMessage = 'Biometric authentication not available';
          break;
        case 'LAErrorTouchIDNotEnrolled':
        case 'BiometryNotEnrolled':
          errorMessage = 'No biometric data enrolled';
          break;
        case 'LAErrorTouchIDLockout':
        case 'BiometryLockout':
          errorMessage = 'Biometric authentication locked out';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Check if biometric authentication is supported
  isSupported(): boolean {
    return this.isSupported;
  }

  // Get the type of biometric authentication available
  getBiometryType(): string | null {
    return this.biometryType;
  }

  // Get user-friendly name for biometry type
  getBiometryDisplayName(): string {
    switch (this.biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Fingerprint':
        return 'Empreinte digitale';
      case 'Face':
        return 'Reconnaissance faciale';
      default:
        return 'Authentification biométrique';
    }
  }

  // Quick authentication for login
  async authenticateForLogin(): Promise<BiometricResult> {
    return this.authenticate({
      title: 'Connexion LaSo Coach',
      subtitle: 'Authentifiez-vous pour accéder à votre compte',
      description: 'Utilisez votre biométrie pour vous connecter rapidement',
    });
  }

  // Authentication for sensitive operations
  async authenticateForSensitiveOperation(operation: string): Promise<BiometricResult> {
    return this.authenticate({
      title: 'Authentification requise',
      subtitle: `Confirmer: ${operation}`,
      description: 'Authentifiez-vous pour continuer cette action',
    });
  }

  // Authentication for payments
  async authenticateForPayment(amount: string): Promise<BiometricResult> {
    return this.authenticate({
      title: 'Confirmer le paiement',
      subtitle: `Montant: ${amount}`,
      description: 'Authentifiez-vous pour confirmer ce paiement',
    });
  }
}

export default BiometricService.getInstance(); 