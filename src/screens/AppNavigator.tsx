import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen, { RootStackParamList } from '../screens/DashboardScreen';
import ScholarshipScreen from '../screens/ScholarshipScreen';
import ScholarshipFormScreen from '../screens/ScholarshipFormScreen';
import ScholarshipDetailScreen from '../screens/ScholarshipDetailScreen';
import StudentScreen from '../screens/StudentScreen';
import StudentFormScreen from '../screens/StudentFormScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import ApplicationScreen from '../screens/ApplicationScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import ApplicationDetailScreen from '../screens/ApplicationDetailScreen';
import SelectionScreen from '../screens/SelectionScreen';
import SelectionDetailScreen from '../screens/SelectionDetailScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, typography } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.divider, primary: colors.blue600 },
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.blue600,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused, color, size }) => {
                    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
                        Dashboard: focused ? 'grid' : 'grid-outline',
                        Beasiswa: focused ? 'ribbon' : 'ribbon-outline',
                        Mahasiswa: focused ? 'people' : 'people-outline',
                        Pendaftaran: focused ? 'document-text' : 'document-text-outline',
                        Seleksi: focused ? 'checkmark-done' : 'checkmark-done-outline',
                    };
                    return <Ionicons name={map[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Beasiswa" component={ScholarshipScreen} />
            <Tab.Screen name="Mahasiswa" component={StudentScreen} />
            <Tab.Screen name="Pendaftaran" component={ApplicationScreen} />
            <Tab.Screen name="Seleksi" component={SelectionScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="ScholarshipForm" component={ScholarshipFormScreen} />
                <Stack.Screen name="ScholarshipDetail" component={ScholarshipDetailScreen} />
                <Stack.Screen name="StudentForm" component={StudentFormScreen} />
                <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
                <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} />
                <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
                <Stack.Screen name="SelectionDetail" component={SelectionDetailScreen} />
                <Stack.Screen name="Announcement" component={AnnouncementScreen} />
                <Stack.Screen name="Report" component={ReportScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: { backgroundColor: colors.surface, borderTopColor: colors.divider, borderTopWidth: 1, height: 62, paddingTop: 6, paddingBottom: 8, elevation: 0 },
    tabLabel: { ...typography.tiny, fontWeight: '600', marginTop: -2 },
});