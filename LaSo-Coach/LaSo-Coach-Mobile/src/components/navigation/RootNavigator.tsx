import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { selectIsFirstLaunch } from '../../store/slices/appSlice';
import { setFirstLaunch } from '../../store/slices/appSlice';
import { RootStackParamList } from '../../types';

// Navigators
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';

// Screens
import SplashScreen from '../../screens/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isFirstLaunch = useAppSelector(selectIsFirstLaunch);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Add any initialization logic here
        // Check for stored authentication, load cached data, etc.
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mark first launch as complete
        if (isFirstLaunch) {
          dispatch(setFirstLaunch(false));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch, isFirstLaunch]);

  // Show splash screen during app initialization
  if (isLoading) {
    return <SplashScreen />;
  }

  // Determine which navigator to show
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return 'Auth';
    }
    
    if (user && !user.onboardingCompleted) {
      return 'Onboarding';
    }
    
    return 'Main';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Onboarding"
        component={OnboardingNavigator}
        options={{
          animationTypeForReplace: 'push',
          gestureEnabled: false, // Prevent going back during onboarding
        }}
      />
      
      <Stack.Screen
        name="Main"
        component={MainNavigator}
        options={{
          animationTypeForReplace: 'push',
          gestureEnabled: false, // Prevent going back to auth
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator; 