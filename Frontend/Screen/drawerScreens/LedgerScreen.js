// Import React and Component
import React, {useState, Component} from 'react';
import {Alert, View, Text, SafeAreaView, TextInput, StyleSheet, Image, Pressable, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
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
  const [monthbill, setMonthBill] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showtoday, setShowtoday] = useState(false);
  const [showcalendar, setCalendar] = useState(false);
  const [showmonth, setMonth] = useState(false);

  const [user, setUser] = useState('');
  const [chartyear, setYear] = useState();
  const [chartmonth, setChartmonth] = useState();
  const [calendardate, setCalendardate] = useState();
  const [calendarmonth, setCalendarmonth] = useState();

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
              setShowtoday(true);
              setCalendar(false);
              setMonth(false);
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

      setCalendardate(Date.day);
      setCalendarmonth(Date.month);

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
              setShowtoday(false);
              setCalendar(true);
              setMonth(false);
          } else {
              alert("fail");
          }
      })
      .catch((error) => {
          console.error(error);
      });
  }

  const get_month = async() => {
        const now = new Date();
        const year = now.getFullYear();
        setYear(year);
        setChartmonth(now.getMonth());

        const userData = await AsyncStorage.getItem('userData');
        const profile = JSON.parse(userData);
        setUser(profile.username);

        fetch('http://13.209.105.69:8001/user/month/', {
        //fetch('http://localhost:8000/user/date/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Token " + profile.token,
          },
          body: JSON.stringify({
            year: year,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.status === 'success') {
                setMonthBill(responseJson);
                setShowtoday(false);
                setCalendar(false);
                setMonth(true);
            } else {
                alert("fail");
            }
        })
        .catch((error) => {
            console.error(error);
        });
  }

  const show_month = () => {
    return(
        <View>
            <Text style={styles.textStyle}>{user}님의 {chartyear}년 소비</Text>
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"],
                datasets: [
                  {
                    data: [
                      monthbill[1],
                      monthbill[2],
                      monthbill[3],
                      monthbill[4],
                      monthbill[5],
                      monthbill[6],
                      monthbill[7],
                      monthbill[8],
                      monthbill[9],
                      monthbill[10],
                      monthbill[11],
                      monthbill[12]
                    ]
                  }
                ]
              }}
              withShadow={false}
              withInnerLines={false}
              width={Dimensions.get('window').width - 30} // from react-native
              height={210}
              yAxisSuffix="₩"
              chartConfig={{
                backgroundColor: "#FFFFFF",
                backgroundGradientFrom: "#FFFFFF",
                backgroundGradientTo: "#FFFFFF",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(145, 141, 254, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(145, 141, 254, ${opacity})`,
                style: {
                  borderRadius: 1
                },

                propsForDots: {
                  r: "3",
                }

              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 10,
                alignItems: 'center',
              }}
            />
            <ScrollView keyboardShouldPersistTaps="always">
              { chartmonth+1 >= 1 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>1월</Text>
                      <Text style={styles.textp}>{monthbill[1]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 2 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>2월</Text>
                      <Text style={styles.textp}>{monthbill[2]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 3 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>3월</Text>
                      <Text style={styles.textp}>{monthbill[3]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 4 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>4월</Text>
                      <Text style={styles.textp}>{monthbill[4]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 5 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>5월</Text>
                      <Text style={styles.textp}>{monthbill[5]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 6 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>6월</Text>
                      <Text style={styles.textp}>{monthbill[6]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 7 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>7월</Text>
                      <Text style={styles.textp}>{monthbill[7]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 8 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>8월</Text>
                      <Text style={styles.textp}>{monthbill[8]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 9 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>9월</Text>
                      <Text style={styles.textp}>{monthbill[9]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 10 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>10월</Text>
                      <Text style={styles.textp}>{monthbill[10]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 11 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>11월</Text>
                      <Text style={styles.textp}>{monthbill[11]}원</Text>
                  </View>
              }
              { chartmonth+1 >= 12 &&
                  <View style={styles.elem}>
                      <Text style={styles.text}>12월</Text>
                      <Text style={styles.textp}>{monthbill[12]}원</Text>
                  </View>
              }
           </ScrollView>
        </View>
    )
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
      <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../Image/calendar.png')}
            style={styles.ImageIconStyle}
          />
      </Pressable>
      <View style={styles.billview}>
        <TouchableOpacity onPress={() => get_today()}>
            <Text style={styles.textmenu}>오늘의 소비</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => get_month()}>
            <Text style={styles.textmenu}>올해의 소비</Text>
        </TouchableOpacity>
      </View>
    </View>
          {showtoday && <Text style={styles.texttitle}>Today</Text>}

          {bill.map((x, i) => {
              return (showtoday &&
                <View style={styles.elem}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                        source={require('../../Image/won.png')}
                        style={styles.Imagewon}
                    />
                    <Text style={styles.text}>{x.name}</Text>
                  </View>
                  <Text style={styles.textp}>{x.price}원</Text>
                </View>
              )
          })}
          {showcalendar && <Text style={styles.texttitle}>{user}님의 {calendarmonth}월 {calendardate}일 소비</Text>}
          {datebill.map((x, i) => {
              return (showcalendar &&
                <View style={styles.elem}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                        source={require('../../Image/won.png')}
                        style={styles.Imagewon}
                    />
                    <Text style={styles.text}>{x.name}</Text>
                  </View>
                  <Text style={styles.textp}>{x.price}원</Text>
                </View>
              )
          })}
          { showmonth && show_month() }
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
   textmenu:{
      color: "black",
      ontsize: 16,
      margin: 1,
   },
   texttitle:{
        color: "black",
        fontsize: 16,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 23
   },
   text: {
       color: "black",
       fontSize: 20,
       marginTop: 5,
       marginBottom: 5,
       marginLeft: 10,
       marginRight: 20,
   },
   textp: {
          color: "#9996FA",
          fontSize: 20,
          marginTop: 5,
          marginBottom: 5,
          marginLeft: 20,
          marginRight: 20,
   },
   ImageIconStyle: {
        padding: 10,
        margin: 10,
        height: 35,
        width: 35,
   },
   Imagewon: {
        padding: 1,
        marginLeft: 10,
        height: 35,
        width: 35,
   },
   view: {
     padding: 10,
     marginTop: 45,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
   },
   billview: {
     flexDirection: 'column',
   },
   elem: {
     width: '100%',
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     borderColor:'#C1C1C1',
     borderBottomWidth:0.5,
     padding: 5,
   },
});


