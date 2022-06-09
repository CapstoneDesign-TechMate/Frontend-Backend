// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import HomeScreen from './DrawerScreens/HomeScreen';
import CameraScreen from './DrawerScreens/CameraScreen';
import LedgerScreen from './DrawerScreens/LedgerScreen';
import RecommendScreen from './DrawerScreens/RecommendScreen';
import SettingsScreen from './DrawerScreens/SettingScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#8E66FF', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const CameraScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="CameraScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#8E66FF', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: '영수증', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const LedgerScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="LedgerScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#8E66FF', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="LedgerScreen"
        component={LedgerScreen}
        options={{
          title: '가계부', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const RecommendScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="RecommendScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#8E66FF', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="RecommendScreen"
        component={RecommendScreen}
        options={{
          title: '추천', //Set Header Title
        }}

      />
    </Stack.Navigator>
  );
};

const SettingScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#8E66FF', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: '설정', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#8E66FF',
        color: '#8E66FF',
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: '#8E66FF',
        },
      }}
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="homeScreenStack"
        options={{drawerLabel: 'Home'}}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="cameraScreenStack"
        options={{drawerLabel: '영수증'}}
        component={CameraScreenStack}
      />
      <Drawer.Screen
        name="ledgerScreenStack"
        options={{drawerLabel: '가계부'}}
        component={LedgerScreenStack}
      />
      <Drawer.Screen
         name="recommendScreenStack"
         options={{drawerLabel: '추천'}}
         component={RecommendScreenStack}
      />
      <Drawer.Screen
        name="settingScreenStack"
        options={{drawerLabel: '설정'}}
        component={SettingScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
