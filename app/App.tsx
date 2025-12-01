
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store"; 
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ShoppingApp from "../screens/ShoppingListScreen"; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
     
        <Stack.Navigator
          initialRouteName="ShoppingApp"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="ShoppingApp" component={ShoppingApp} />
        </Stack.Navigator>
      
    </Provider>
  );
}
