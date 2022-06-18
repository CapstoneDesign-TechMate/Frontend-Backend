
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
     const now = new Date();
     const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
     const month = months[now.getMonth()];
     const date = now.getDate();
     const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
     const day = weekday[now.getDay()];

     return (
          <View style={{ flex: 1 ,flexWrap:'wrap',paddingHorizontal:1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textstyle}>Hi, JinWoo</Text>
               <Image
                   source={require('../../Image/profile.png')}
                   style={{
                     width: 36,
                     height: 36,
                     borderRadius: 18,
                     marginLeft: 110,
                     marginTop: 10
                 }}
               />
             </View>
            <Text style={styles.textstyle_day}>{day} {date} {month}</Text>
            <View style={{flexDirection: "row",  alignItems:'center', justifyContent:'center', marginTop: 45}}>
              <TouchableOpacity onPress={() => navigation.navigate('cameraScreenStack')}  style={styles.buttonStyles}>
                  <Text style={{color: "#000000"}}>영수증</Text>
                  <Image
                       source={require('../../Image/camera.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ledgerScreenStack')}  style={styles.buttonStyles}>
                  <Text style={{color: "#000000"}}>가계부</Text>
                  <Image
                       source={require('../../Image/invoice.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row",  alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('recommendScreenStack')}  style={styles.buttonStyles}>
                  <Text style={{color: "#000000"}}>추천</Text>
                  <Image
                       source={require('../../Image/chef.png')}
                       style={styles.ImageIconStyle}
                  />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('settingScreenStack')}  style={styles.buttonStyles}>
                  <Text style={{color: "#000000"}}>설정</Text>
                  <Image
                       source={require('../../Image/setting.png')}
                       style={styles.ImageIconStyle_setting}
                  />
              </TouchableOpacity>
            </View>
          </View>
      );

};

export default HomeScreen;

const styles = StyleSheet.create({
  ImageIconStyle: {
    padding: 10,
    margin: 40,
    height: 35,
    width: 35,
    resizeMode: 'stretch',
  },
  ImageIconStyle_setting: {
    padding: 10,
    margin: 43,
    height: 30,
    width: 30,
    resizeMode: 'stretch',
  },
  buttonStyles: {
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderWidth: 1,
    marginVertical:15,
    marginHorizontal:15,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20,
    width:140,
    height:200,
    borderColor: '#AB95FF',
  },
  textstyle: {
    color: 'black',
    paddingHorizontal: 53,
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5
  },
  textstyle_day: {
    color: '#8869FF',
    paddingHorizontal: 53,
    fontSize : 12
  }
});

/*
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

  */