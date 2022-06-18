import React, {Component, useState} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Pressable, KeyboardAvoidingView, Keyboard} from 'react-native'
import {launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

const CameraScreen = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [price, setPrice] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [store, setStore] = useState(null);
  const [day, setDay] = useState(null);
  const [avatar, setAvatar] = useState('');

  const save_receipt = async() => {
    const userData = await AsyncStorage.getItem('userData');
    const profile = JSON.parse(userData);


    //모달 창에 스크롤뷰로 text input 넣고 사용자가 수정, 빈 거 채워넣기


    fetch('http://13.209.105.69:8001/user/save/', {
    //fetch('http://localhost:8000/user/save/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Token " + profile.token,
        },
        body: JSON.stringify({
            location: location,
            price: price,
            year: year,
            month: month,
            day: day,
            name: store,
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson.status === 'success') {
            alert("영수증이 가계부에 기록되었습니다.")
        } else {
            alert("save fail");
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }

  const showImage = async () => {
        const userData = await AsyncStorage.getItem('userData');
        const profile = JSON.parse(userData);

        launchImageLibrary({}, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                //alert('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            }
            else {
                let source = response;
                setAvatar(response.assets[0].uri);

                const fd = new FormData();
                fd.append("file", {
                    uri: response.assets[0].uri,
                    name: response.assets[0].fileName,
                    type: response.assets[0].type,
                });
                fetch('http://13.209.105.69:8001/user/check/', {
                //fetch('http://localhost:8000/user/check/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL',
                      Authorization: "Token " + profile.token,
                    },
                    body: fd,
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                        console.log(responseJson);
                    if(responseJson.status === 'success') {
                        //alert(responseJson.data.store_name);
                        /////
                        setLocation(responseJson.data.location);
                        setPrice(responseJson.data.price);
                        setDay(responseJson.data.day);
                        setMonth(responseJson.data.month);
                        setYear(responseJson.data.year);
                        setStore(responseJson.data.store_name)
                        setModalVisible(true)
                    }
                    else{
                        alert("올바른 영수증 사진을 등록해주세요!");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });

            }
        });
  }

   return (
     <View style={styles.container}>
       <Modal
           transparent={true}
           visible={modalVisible}
           onRequestClose={() => {
               setModalVisible(!modalVisible);
           }}
       >
         <View style={styles.modalView}>
           <Text>필요한 정보를 수정해주세요</Text>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>주소</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(location) =>
                 setLocaiton(location)
               }
               placeholder={location}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               returnKeyType="next"
               underlineColorAndroid="#f000"
               blurOnSubmit={false}
             />
           </View>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>가격</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(price) =>
                 setPrice(price)
               }
               placeholder={price}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               keyboardType="default"
               //ref={passwordInputRef}
               onSubmitEditing={Keyboard.dismiss}
               blurOnSubmit={false}
               //secureTextEntry={true}
               underlineColorAndroid="#f000"
               returnKeyType="next"
             />
           </View>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>년도</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(year) =>
                 setYear(year)
               }
               placeholder={year}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               returnKeyType="next"
               underlineColorAndroid="#f000"
               blurOnSubmit={false}
             />
           </View>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>월</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(month) =>
                 setMonth(month)
               }
               placeholder={month}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               keyboardType="default"
               //ref={passwordInputRef}
               onSubmitEditing={Keyboard.dismiss}
               blurOnSubmit={false}
               //secureTextEntry={true}
               underlineColorAndroid="#f000"
               returnKeyType="next"
             />
           </View>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>일</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(day) =>
                 setDay(day)
               }
               placeholder={day}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               returnKeyType="next"
               underlineColorAndroid="#f000"
               blurOnSubmit={false}
             />
           </View>
           <View style={styles.SectionStyle}>
             <Text style={styles.text}>상호명</Text>
             <TextInput
               style={styles.inputStyle}
               onChangeText={(store) =>
                 setStore(store)
               }
               placeholder={store}
               placeholderTextColor="#8b9cb5"
               autoCapitalize="none"
               keyboardType="default"
               //ref={passwordInputRef}
               onSubmitEditing={Keyboard.dismiss}
               blurOnSubmit={false}
               //secureTextEntry={true}
               underlineColorAndroid="#f000"
               returnKeyType="next"
             />
           </View>
           <TouchableOpacity
               onPress={() => save_receipt()}
           >
               <Text style={styles.textStyle}>등록</Text>
           </TouchableOpacity>
           <TouchableOpacity
               onPress={() => setModalVisible(!modalVisible)}
           >
               <Text style={styles.textStyle}>닫기</Text>
           </TouchableOpacity>
         </View>
       </Modal>
       <Image
         source={{uri:avatar}}
         style={styles.avatar}
       />
       <TouchableOpacity
         style={styles.buttonStyle}
         activeOpacity={0.5}
         onPress={() => {
               showImage();
           }
         }
       >
         <Text style={styles.buttonTextStyle}>영수증 선택</Text>
       </TouchableOpacity>
     </View>
   )

}

const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#8E66FF',
    height: 40,
    alignItems: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },

  buttonTextStyle: {
    color: '#8E66FF',
    paddingVertical: 8,
    fontSize: 16,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: '80%',
    height: 400
  },

  modalView: {
     margin: 20,
     backgroundColor: "white",
     borderRadius: 20,
     padding: 35,
     alignItems: "center",
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 2
     },
     shadowOpacity: 0.25,
     shadowRadius: 4,
     elevation: 5
  },
   SectionStyle: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 35,
      marginRight: 35,
      margin: 10,
    },
   inputStyle: {
       flex: 1,
       color: 'white',
       paddingLeft: 15,
       paddingRight: 15,
       borderWidth: 1,
       borderRadius: 30,
       borderColor: '#dadae8',
     },
   text: {
     marginTop: 10,
     marginRight: 10
   }
})

export default CameraScreen;