import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegistoScreen from './src/screens/RegistoScreen';
import HomeScreen from './src/screens/HomeScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ServicosScreen from './src/screens/ServicosScreen';
import PostosScreen from './src/screens/PostosScreen';
import MarcacoesScreen from './src/screens/MarcacoesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registo" component={RegistoScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Servicos" component={ServicosScreen} />
        <Stack.Screen name="Postos" component={PostosScreen} />
        <Stack.Screen name="Marcacoes" component={MarcacoesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}