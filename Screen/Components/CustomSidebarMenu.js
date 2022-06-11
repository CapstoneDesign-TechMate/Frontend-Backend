// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {View, Text, Alert, StyleSheet, Image} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const CustomSidebarMenu = (props) => {
  const logout = async() => {
        const userData = await AsyncStorage.getItem('userData');
        const profile = JSON.parse(userData);

        fetch('http://13.209.105.69:8001/user/logout/', {
        //fetch('http://localhost:8000/user/logout/', {
          method: 'POST',
          headers: {
            //Header Defination
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Token " + profile.token,
          },
          body: JSON.stringify({
            username: profile.username,
            password: profile.password,
          })
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //Hide Loader
            //setLoading(false);
            console.log(responseJson);
            // If server response message same as Data Matched
            if (responseJson.status === 'success') {
              AsyncStorage.removeItem('userData');
              props.navigation.replace('Auth');
            } else {
              setErrortext(responseJson.error);
            }
          })
          .catch((error) => {
            //Hide Loader
            setLoading(false);
            console.error(error);
          });
  }

  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
            <Image
                source={require('../../Image/profile.png')}
                style={{
                  width: 40,
                  height: 40,
                  //resizeMode: 'contain',
                  borderRadius: 20,
                  margin: 30,
                }}
            />
        </View>
        <Text style={stylesSidebar.profileHeaderText}> Hi, Jinwoo</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={({color}) => <Text style={{color: '#d8d8d8'}}>Logout</Text>}
          onPress={
            //props.navigation.toggleDrawer(),
            logout
          }
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#A486FA',
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#7F54FB',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  },
});
