import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './shared/GameContext';

import HomeScreen from './screens/HomeScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import GameScreen from './screens/GameScreen';
import ShopScreen from './screens/ShopScreen';
import CollectablesScreen from './screens/CollectablesScreen';
import SettingsScreen from './screens/SettingsScreen';
import GameOverScreen from './screens/GameOverScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" hidden />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            orientation: 'landscape',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Collectables" component={CollectablesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
