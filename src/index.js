import React, { Component } from 'react';
import {createStackNavigator, createDrawerNavigator, createAppContainer} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';

const MainStack = createStackNavigator({
  Main: MainScreen,
  Malla: MallaScreen,
});

const AppStack = createDrawerNavigator({
  Main: MainStack,
  Malla: MallaScreen,
});

export default createAppContainer(AppStack);
