import React, {Component} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {launchCamera, launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

class CameraScreen extends Component {
  //send image to server
  state = {
    avatar: ''
  }

  showImage = async () => {
        const userData = await AsyncStorage.getItem('userData');
        const profile = JSON.parse(userData);

        launchImageLibrary({}, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                alert('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                alert('ImagePicker Error: ' + response.error);
            }
            else {
                alert(response.assets[0])
                let source = response;
                this.setState({
                    avatar: response.assets[0].uri
                });

                const fd = new FormData();
                fd.append('file', {
                    uri: response.assets[0].uri,
                    name: response.assets[0].fileName,
                    type: response.assets[0].type,
                });
                alert(fd);
                fetch('http://localhost:8000/user/check/', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL',
                      Authorization: "Token " + profile.token,
                      Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        fd,
                    })
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                        console.log(responseJson);
                    if(responseJson.status === 'success') {
                        alert("hi");
                    } else {
                        alert("fail");
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
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
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