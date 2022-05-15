import React, { Component} from 'react';
import {View, Text, Button} from 'react-native';

export default class MainScreen extends Component{
    render() {
        return(
            <View>
                <Text style={{fontSize:30}}>Main Screen</Text>
                <Button onPress={() => this.goMainScreen_1()} title='Camera'/>
                <Button onPress={() => this.goMainScreen_2()} title='Ledger'/>
                <Button onPress={() => this.goMainScreen_3()} title='Recommend'/>
                <Button onPress={() => this.goMainScreen_4()} title='Setting'/>
            </View>
        );
    }

    goMainScreen_1(){
        this.props.navigation.navigate('Camera')
    }
    goMainScreen_2(){
        this.props.navigation.navigate('Ledger')
    }
    goMainScreen_3(){
        this.props.navigation.navigate('Recommend')
    }
    goMainScreen_4(){
        this.props.navigation.navigate('Setting')

    }
}