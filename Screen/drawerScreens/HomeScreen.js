
// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {View, Text, SafeAreaView, Button, StyleSheet, Animated, TouchableOpacity, ImageBackground, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = (props) => {
     const navigation = useNavigation();
     const [sel,setSel] = React.useState(1);
     const onPress = (item) => setSel(item)
     //justifyContent:'space-between'
     return (
          <View style={{ flex: 1 ,flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20, justifyContent:'space-between'}}>

              <TouchableOpacity onPress={() => navigation.navigate('cameraScreenStack')}  style={styles.buttonStyles}>
                  <Text>영수증</Text>
                  <Image
                       source={require('../../Image/camera.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ledgerScreenStack')}  style={styles.buttonStyles}>
                  <Text>가계부</Text>
                  <Image
                       source={require('../../Image/invoice.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('recommendScreenStack')}  style={styles.buttonStyles}>
                  <Text>추천</Text>
                  <Image
                       source={require('../../Image/chef.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('settingScreenStack')}  style={styles.buttonStyles}>
                  <Text>설정</Text>
                  <Image
                       source={require('../../Image/setting.png')}
                       style={styles.ImageIconStyle_setting}
                  />
              </TouchableOpacity>
          </View>
      );

};

export default HomeScreen;

const styles = StyleSheet.create({
  ImageIconStyle: {
    padding: 25,
    margin: 20,
    height: 35,
    width: 35,
    resizeMode: 'stretch',
  },
  ImageIconStyle_setting: {
    padding: 25,
    margin: 20,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  buttonStyles: {
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderWidth: 1,
    marginVertical:70,
    marginHorizontal:32,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20,
    width:120,
    height:180,
  }
});
