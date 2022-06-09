// Import React and Component
import React, {useState, Component} from 'react';
import {Alert, View, Text, SafeAreaView, TextInput, StyleSheet, Image, Pressable, Dimensions, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars'
import {
  LineChart,
  ProgressChart,
  ContributionGraph,
} from "react-native-chart-kit";


 const LedgerScreen = () => {
  const [bill, setBill] = useState([]);
  const [datebill, setDateBill] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const get_today = async() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const userData = await AsyncStorage.getItem('userData');
    const profile = JSON.parse(userData);

    fetch('http://13.209.105.69:8001/user/date/', {
    //fetch('http://localhost:8000/user/date/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Token " + profile.token,
      },
      body: JSON.stringify({
        year: year,
        month: month,
        day: day,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson.status === 'success') {
              setBill(responseJson.list);
        } else {
            alert("fail");
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }

  const get_calendar_day = async(Date) => {
      const year = Date.year
      const month = Date.month
      const day = Date.day

      const userData = await AsyncStorage.getItem('userData');
      const profile = JSON.parse(userData);

      fetch('http://13.209.105.69:8001/user/date/', {
      //fetch('http://localhost:8000/user/date/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Token " + profile.token,
        },
        body: JSON.stringify({
          year: year,
          month: month,
          day: day,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);
          if(responseJson.status === 'success') {
              setDateBill(responseJson.list);
          } else {
              alert("fail");
          }
      })
      .catch((error) => {
          console.error(error);
      });
  }


  return (
  <View>
    <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
    >
      <View style={styles.modalView}>
        <Calendar
            onDayPress={day => {
                get_calendar_day(day)
            }}
            style={styles.calendar}
            hideExtraDays={true}
        />
        <Pressable
            onPress={() => setModalVisible(!modalVisible)}
        >
            <Text style={styles.textStyle}>접기</Text>
        </Pressable>
      </View>
    </Modal>
    <View style={styles.view}>
      <Pressable
          onPress={() => setModalVisible(true)}
      >
          <Image
            source={require('../../Image/calendar.png')}
            style={styles.ImageIconStyle}
          />
      </Pressable>
      <TouchableOpacity
          onPress={() => get_today()}
      >
        <Text>오늘의 소비</Text>
      </TouchableOpacity>
    </View>
          {bill.map((x, i) => {
              return <Text>{x.name} {x.price}</Text>
          })}
          {datebill.map((x, i) => {
              return <Text>{x.name} {x.price}</Text>
          })}
  </View>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
   textStyle: {
      color: "black",
      textAlign: "center"
   },
   ImageIconStyle: {
        padding: 10,
        margin: 10,
        height: 25,
        width: 25,
   },
   view: {
     padding: 10,
     margin: 45,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
   }
});


