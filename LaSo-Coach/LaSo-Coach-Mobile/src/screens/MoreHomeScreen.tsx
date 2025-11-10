import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../constants/colors';
import TYPOGRAPHY from '../constants/typography';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  badge?: number;
}

const MoreHomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Notifications',
      subtitle: 'Gérer vos notifications',
      icon: 'notifications',
      route: 'Notifications',
      badge: 3,
    },
    {
      id: '2',
      title: "L'Agora",
      subtitle: 'Communauté et discussions',
      icon: 'people',
      route: 'Community',
    },
    {
      id: '3',
      title: 'Messages',
      subtitle: 'Chat avec votre coach',
      icon: 'chat',
      route: 'Chat',
      badge: 1,
    },
    {
      id: '4',
      title: 'Agenda',
      subtitle: 'Rendez-vous et planification',
      icon: 'event',
      route: 'Agenda',
    },
    {
      id: '5',
      title: 'Paramètres',
      subtitle: 'Configuration de l\'app',
      icon: 'settings',
      route: 'Settings',
    },
    {
      id: '6',
      title: 'Mon Profil',
      subtitle: 'Informations personnelles',
      icon: 'person',
      route: 'Profile',
    },
  ];

  const handleMenuPress = (route: string) => {
    navigation.navigate(route as never);
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={24} color={COLORS.primary} />
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
        
        <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plus</Text>
        <Text style={styles.headerSubtitle}>Accédez à toutes les fonctionnalités</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fonts.bold,
    color: COLORS.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fonts.regular,
    color: COLORS.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fonts.bold,
    color: COLORS.white,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fonts.medium,
    color: COLORS.black,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fonts.regular,
    color: COLORS.gray[600],
  },
});

export default MoreHomeScreen; 