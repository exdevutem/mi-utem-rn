import React, { Component } from 'react';
import { Platform, Text, SegmentedControlIOS, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Header, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

import NoticiaScreen from './screens/NoticiaScreen';
import PerfilScreen from './screens/PerfilScreen';

import CarreraScreen from './screens/CarreraScreen';
import BoletinScreen from './screens/BoletinScreen';
import MallaScreen from './screens/MallaScreen';
import HorarioScreen from './screens/HorarioScreen';

import AsignaturaScreen from './screens/AsignaturaScreen';
import NotasScreen from './screens/NotasScreen';
import BitacoraScreen from './screens/BitacoraScreen';

const ES_IOS = Platform.OS === 'ios';

const AsignaturaTabs = createMaterialTopTabNavigator({
  Teoria: AsignaturaScreen,
  Taller: AsignaturaScreen,
  Laboratorio: AsignaturaScreen,
},
{
  tabBarComponent: Platform.select({
    ios: () => {<View style={{backgroundColor: 'green'}}>
        <SegmentedControlIOS
          values={['Teoría', 'Taller', 'Laboratorio']}
          tintColor='#009d9b'
          style={ {marginHorizontal: 20, marginVertical: 10, backgroundColor: 'red'} }/>
    </View>},
  })
    
});

const AsignaturaNavigator = createStackNavigator({
  Asignatura: AsignaturaTabs,
  Notas: NotasScreen,
  Bitacora: BitacoraScreen,
});

const MainStack = createStackNavigator({
  Main: MainScreen
},
{
  defaultNavigationOptions: {
      title: 'Inicio',
      headerStyle: {
          backgroundColor: ES_IOS ? 'white' : '#009d9b',
      },
      headerTintColor: (ES_IOS) ? '' : 'white',
  }
});

const MainNavigator = createDrawerNavigator({
    Main: {
      screen: MainStack,
      navigationOptions: ({ navigation }) => ({
        title: 'Inicio',
      }),
    },
    Perfil: {
      screen: PerfilScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        drawerLockMode: 'locked-closed'
      }),
    },
    Asignatura: {
      screen: AsignaturaNavigator,
      navigationOptions: ({ navigation }) => ({
        title: 'Asignatura',
        drawerLockMode: 'locked-closed'
      }),
    },
    Carrera: {
      screen: CarreraScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Carrera',
        drawerLockMode: 'locked-closed'
      }),
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      drawerIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let nombreIcono;
        if (routeName === 'Main') {
          nombreIcono = 'ios-home';
        } else if (routeName === 'Perfil') {
          nombreIcono = 'ios-contact';
        } else if (routeName === 'Asignatura') {
          nombreIcono = 'ios-book';
        } else if (routeName === 'Carrera') {
          nombreIcono = 'ios-school';
        }

        return <Ionicons name={nombreIcono} size={horizontal ? 20 : 25} color={tintColor} />;
      }
    }),
  drawerType: 'slide',
  contentOptions: {
    activeTintColor: '#009d9b',
  },
  Horario: {
    screen: HorarioScreen
  },
});

const AppNavigator = createSwitchNavigator({
  //Login: LoginScreen,
  Main: MainNavigator
});

export default createAppContainer(AppNavigator);
