 // Import React and Component
 import React, {useState, useEffect, Component} from 'react';
 import {StyleSheet, View, Text, SafeAreaView, Image, Button, TouchableOpacity} from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 class RecommendScreen extends Component{
   state = {
     img_uri: '',
     name: '',
     address: '',
     username: '',
   }

   get_reco = async() => {
       const userData = await AsyncStorage.getItem('userData');
       const profile = JSON.parse(userData);
       this.setState({
         username: profile.username
       })
       console.log(this.state.username)
       fetch('http://13.209.105.69:8001/user/reco/', {
       //fetch('http://localhost:8000/user/date/', {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           Authorization: "Token " + profile.token,
         },
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
           <View style={{flex: 1, padding: 16}}>
                <TouchableOpacity
                   activeOpacity={0.5}
                   onPress={() => {
                       this.get_reco()
                   }}
                >
                  <Text style={styles.text}>{this.state.username}님을 위한 오늘의 장소</Text>
                </TouchableOpacity>
                <Image
                    source = {{uri:this.state.img_uri}}
                    style={styles.avatar}
                />
                <Text>{this.state.name}</Text>
                <Text>{this.state.address}</Text>
           </View>
         </SafeAreaView>
        );
    }
 };

 export default RecommendScreen;

const styles = StyleSheet.create({
  avatar: {
    width: '100%',
    height: 400
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    margin: 10,
  }
})

/*
<TouchableOpacity
                   activeOpacity={0.5}
                   onPress={() => {
                       this.get_reco()
                   }}
                >
                  <Text style={styles.text}>{this.state.username}을 위한 오늘의 장소 추천</Text>
                </TouchableOpacity>


                */