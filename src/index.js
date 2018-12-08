import React, { Component } from 'react';
import { Platform } from 'react-native';
import {createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import NoticiaScreen from './screens/NoticiaScreen';

const MainDrawer = createDrawerNavigator({
  Main: MainScreen,
  Malla: MallaScreen,
  Perfil: PerfilScreen,
});

const AsignaturaNavigator = Platform.select({
  ios: createBottomTabNavigator({
    Main: MainScreen,
    Malla: MallaScreen,
  }),
  android: createMaterialTopTabNavigator({
    Main: MainScreen,
    Malla: MallaScreen,
  })
});

const AppNavigator = createSwitchNavigator({
  //Login: LoginScreen,
  Main: AsignaturaNavigator
});

export default createAppContainer(AppNavigator);
