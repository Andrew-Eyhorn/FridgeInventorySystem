/*
THe actual app, conatins a navtigaiton container that has the 2 screens that are displayed.
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
