import React, { Component } from 'react';
import {createStackNavigator, createDrawerNavigator, createAppContainer} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';

const MainStack = createStackNavigator({
  Login: LoginScreen,
  Main: MainScreen
});

const AppStack = createDrawerNavigator({
  Main: MainStack,
  Malla: MallaScreen,
  Perfil: PerfilScreen
});

export default createAppContainer(AppStack);
