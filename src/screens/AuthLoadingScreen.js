import React, { Component } from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View} from 'react-native';

const API_URL = 'https://api-utem.herokuapp.com/';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const rut = await AsyncStorage.getItem('rut');
    const correo = await AsyncStorage.getItem('correo');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken && rut && correo) {
        var placebo = await fetch(API_URL + 'token/placebo', {
            headers: {
                Authorization: 'Bearer ' + userToken
            }
        }).then(response => response.json());
        
        if (placebo.esValido) {
            this.props.navigation.navigate('Main');
        } else {
            this.props.navigation.navigate('Login');
        }
    } else {
        this.props.navigation.navigate('Login');
    }
    
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});