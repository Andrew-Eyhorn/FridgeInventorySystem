/*
The actual app, contains a navigation container that displays either the main screen or the shopping list screen.
*/
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './components/MainScreen';
import ShoppingListScreen from './components/ShoppingListScreen'
export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainScreen}
        />
        <Stack.Screen
          name="Items that should be in Inventory"
          component={ShoppingListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
