import '@tensorflow/tfjs-react-native'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SignInScreen from './src/screens/SignInScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import TabNavigator from './src/navigation/TabNavigator'; // Onde o Ranking já está!
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import ChallengeSelectionScreen from './src/screens/ChallengeSelectionScreen';
import WorkoutCameraScreen from './src/screens/WorkoutCameraScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="ChallengeSelection" component={ChallengeSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorkoutCamera" component={WorkoutCameraScreen} />
        
        {/* Este 'Dashboard' carrega o TabNavigator, que já tem o Ranking lá dentro */}
        <Stack.Screen name="Dashboard" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}