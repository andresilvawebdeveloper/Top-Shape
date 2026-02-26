import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importe os TRÊS ecrãs corretamente
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SignInScreen from './src/screens/SignInScreen'; 
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        {/* Rota inicial: Splash/Branding */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Rota para o formulário de entrada */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        
        {/* Rota para o formulário de registo */}
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}