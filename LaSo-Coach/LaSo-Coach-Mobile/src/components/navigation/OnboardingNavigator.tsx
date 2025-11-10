import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';

// Placeholder screens - these will be implemented in the next phase
import WelcomeScreen from '../../screens/onboarding/WelcomeScreen';
import ProfileScreen from '../../screens/onboarding/ProfileScreen';
import GoalsScreen from '../../screens/onboarding/GoalsScreen';
import RecommendationsScreen from '../../screens/onboarding/RecommendationsScreen';
import RendezvousScreen from '../../screens/onboarding/RendezvousScreen';
import SubscriptionScreen from '../../screens/onboarding/SubscriptionScreen';
import SuccessScreen from '../../screens/onboarding/SuccessScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
        gestureEnabled: false, // Disable swipe gestures during onboarding
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Rendezvous"
        component={RendezvousScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          animationTypeForReplace: 'push',
          gestureEnabled: false, // Prevent going back from success
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator; 