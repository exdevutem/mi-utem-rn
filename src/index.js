import React, { Component } from 'react';
import { Platform, Button, StyleSheet, View, ScrollView, Text, StatusBar, SafeAreaView, SectionList } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import MallaScreen from './screens/MallaScreen';

const AppNavigator = createStackNavigator({
  Main: {
    screen: MainScreen
  },
  Malla: {
    screen: MallaScreen
  },
});

export default createAppContainer(AppNavigator);
