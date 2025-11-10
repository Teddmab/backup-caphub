import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MoreStackParamList } from '../../types';

// Placeholder screens - these will be implemented in the next phase
import MoreHomeScreen from '../../screens/MoreHomeScreen';
import NotificationsScreen from '../../screens/notifications/NotificationsScreen';
import CommunityScreen from '../../screens/community/CommunityScreen';
import ChatScreen from '../../screens/chat/ChatScreen';
import AgendaScreen from '../../screens/agenda/AgendaScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import ProfileScreen from '../../screens/settings/ProfileScreen';

const Stack = createStackNavigator<MoreStackParamList>();

const MoreNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MoreHome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name="MoreHome"
        component={MoreHomeScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
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
    </Stack.Navigator>
  );
};

export default MoreNavigator; 