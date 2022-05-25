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
                fd.append('receipt', {
                    kim: "kim,m,m",
                    name: response.assets[0].fileName,
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                });

                fetch('http://localhost:8000/user/check/', {
                    body: fd,
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                       Authorization: "Token " + profile.token,
                    },
                })
                  .then(res => {

                  })
                  .catch(error => {

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