import React, {Component} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import {launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

class CameraScreen extends Component {
  //send image to server
  state = {
    avatar: ''
  }

  save_receipt = async(data) => {
    const userData = await AsyncStorage.getItem('userData');
    const profile = JSON.parse(userData);

    alert(JSON.stringify(data));
    //모달 창에 스크롤뷰로 text input 넣고 사용자가 수정, 빈 거 채워넣기
    //수정ㅇ

    fetch('http://13.209.105.69:8001/user/save/', {
    //fetch('http://localhost:8000/user/save/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Token " + profile.token,
        },
        body: JSON.stringify({
            location: data.location,
            price: data.price,
            year: data.year,
            month: data.month,
            day: data.day,
            name: data.store_name,
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

  showImage = async () => {
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
                this.setState({
                    avatar: response.assets[0].uri
                });
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
                        this.save_receipt(responseJson.data);
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

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{uri:this.state.avatar}}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => {
                this.showImage()
            }
          }
        >
          <Text style={styles.buttonTextStyle}>영수증 등록하기</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#8E66FF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#8E66FF',
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },

  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 8,
    fontSize: 16,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: '100%',
    height: 400
  }
})

export default CameraScreen;