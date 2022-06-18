 // Import React and Component
 import React, {useState, useEffect, Component} from 'react';
 import {StyleSheet, View, Text, SafeAreaView, Image, Button, TouchableOpacity} from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import Geolocation from '@react-native-community/geolocation';

 class RecommendScreen extends Component{
   state = {
     img_uri: '',
     name: '',
     address: '',
     username: '',
     la: 0,
     lo: 0,
   }

   get_reco = async() => {
       const userData = await AsyncStorage.getItem('userData');
       const profile = JSON.parse(userData);
       this.setState({
         username: profile.username
       })

       Geolocation.getCurrentPosition(
            position => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);

                this.setState({
                    la: latitude,
                    lo: longitude,
                })
                console.log(latitude)
                console.log(longitude)
            },
            error => { console.log(error.code, error.message); },
            {enableHighAccuracy:false, timeout: 15000, /*maximumAge: 10000*/ },
       )

       fetch('http://13.209.105.69:8001/user/reco/', {
       //fetch('http://localhost:8000/user/date/', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           Authorization: "Token " + profile.token,
         },
         body: JSON.stringify({
            la: this.state.la,
            lo: this.state.lo,
         })
       })
       .then((response) => response.json())
       .then((responseJson) => {
           console.log(responseJson);
           if(responseJson.status === 'success') {
                 const info = responseJson.data;
                 this.setState({
                    img_uri: info.img,
                    name: info.name,
                    address: "📍" + info.address
                 });
           } else {
                alert("fail");
           }
       })
       .catch((error) => {
           console.error(error);
       });
   }

    render() {
        return (
         <SafeAreaView style={{flex: 1}}>
           <View style={{flex: 1, padding: 16, alignItems: 'center'}}>
                <TouchableOpacity
                   activeOpacity={0.5}
                   onPress={() => {
                       this.get_reco()
                   }}
                >
                  <Text style={styles.text}>{this.state.username}님을 위한 오늘의 장소</Text>
                </TouchableOpacity>
                <View style={{marginRight: 180}}>
                  <Text style={styles.nametext}>{this.state.name}</Text>
                  <Text style={styles.infotext}>{this.state.address}</Text>
                </View>
                <Image
                    source = {{uri:this.state.img_uri}}
                    style={styles.avatar}
                />
           </View>
         </SafeAreaView>
        );
    }
 };

 export default RecommendScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 300,
    height: 350,
    alignItems: 'center',
    borderRadius: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    margin: 10,
    color: 'black',
    marginBottom: 40
  },
  nametext: {
    fontSize: 12,
    padding: 1,
    margin: 1,
    color: 'black',
  },
  infotext: {
    fontSize: 10,
    padding: 1,
    margin: 1,
  }
})
