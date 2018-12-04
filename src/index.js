import React, { Component } from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen
  },
  Main: {
    screen: MainScreen
  },
  Malla: {
    screen: MallaScreen
  },
});

export default createAppContainer(AppNavigator);
