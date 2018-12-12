import React, { Component } from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';
import HorarioScreen from './screens/HorarioScreen';

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
  Horario: {
    screen: HorarioScreen
  },
});

export default createAppContainer(AppNavigator);
