import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './MainScreen';
import CameraScreen from './CameraScreen';
import LedgerScreen from './LedgerScreen';
import RecommendScreen from './RecommendScreen';
import SettingScreen from './SettingScreen';


const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MAIN">
        <Stack.Screen name="MAIN" component={MainScreen}
          options={{
            title: '메인화면'
        }}/>
        <Stack.Screen name="Camera" component={CameraScreen}
          options={{
            title: '영수증촬영'
        }}/>
        <Stack.Screen name="Ledger" component={LedgerScreen}
          options={{
            title: '가계부'
        }}/>
        <Stack.Screen name="Recommend" component={RecommendScreen}
          options={{
            title: '추천'
        }}/>
        <Stack.Screen name="Setting" component={SettingScreen}
          options={{
            title: '설정'
         }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
