// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {View, Text, SafeAreaView, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
   const navigation = useNavigation();
   return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <View>
            <Button
                title="영수증 촬영"
                onPress={() => navigation.navigate('cameraScreenStack')}
            />
            <Button
                title="가계부"
                onPress={() => navigation.navigate('ledgerScreenStack')}
            />
            <Button
                title="추천"
                onPress={() => navigation.navigate('recommendScreenStack')}
            />
            <Button
                title="설정"
                onPress={() => navigation.navigate('settingScreenStack')}
            />
        </View>
      </View>
    </SafeAreaView>
    );
};

export default HomeScreen;
