import React, {Component} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {launchCamera, launchImageLibrary } from 'react-native-image-picker'

class CameraScreen extends Component {
  send

  state = {
    avatar: ''
  }

  showImage = () => {
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
                let source = response;
                this.setState({
                    avatar: response.assets[0].uri
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
            this.showImage()}

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