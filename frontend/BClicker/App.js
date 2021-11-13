import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Cookie from './screens/Cookie';
import Upgrades from './screens/Upgrades';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cookie">
        <Stack.Screen name="Cookie" component={Cookie} options={{ headerShown: false }} />
        <Stack.Screen name="Upgrades" component={Upgrades} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default App;
