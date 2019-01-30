import React, { Component } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer, HeaderBackButton} from 'react-navigation';
import {TabBar} from 'react-native-tab-view';

import SegmentedTab from './components/SegmentedTab';
import Drawer from './components/Drawer';
import CalificarHeader from './components/CalificarHeader';

import colors from './colors';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

import NoticiaScreen from './screens/NoticiaScreen';
import PerfilScreen from './screens/PerfilScreen';
import HorarioScreen from './screens/HorarioScreen';

import CalificacionesScreen from './screens/CalificacionesScreen';
import CalificarScreen from './screens/CalificarScreen';

import CarrerasScreen from './screens/CarrerasScreen';
import CarreraScreen from './screens/CarreraScreen';
import BoletinScreen from './screens/BoletinScreen';
import MallaScreen from './screens/MallaScreen';

import AsignaturasScreen from './screens/AsignaturasScreen';
import AsignaturaTabsScreen from './screens/AsignaturaTabsScreen';
import NotasScreen from './screens/NotasScreen';
import BitacoraScreen from './screens/BitacoraScreen';


const ES_IOS = Platform.OS === 'ios';

/*
const AsignaturaTabs = createMaterialTopTabNavigator({
  Teoria: {
    screen: AsignaturaTabsScreen,
    title: 'Teoría'
  },
  Taller: {
    screen: AsignaturaTabsScreen,
    title: 'Taller'
  },
  Laboratorio: {
    screen: AsignaturaTabsScreen,
    title: 'Laboratorio'
  },
},
{
  ...Platform.select({
    ios: {
      tabBarComponent: ({navigation}) => {
        return (
          <SegmentedTab
            values={ navigation.getParam('tipos', null) } 
            selectedIndex={ navigation.state.index }
            navigation={ navigation }
          />
          <TabBar
            navigationState={this.state}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
        );
      },
    }
  }),

  
  swipeEnabled: !ES_IOS,
  tabBarOptions: {
    style: {
        backgroundColor: colors.primario,
    },
    indicatorStyle: {
      backgroundColor: 'white',
    }
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarOnPress: ({ defaultHandler }) => {
      defaultHandler();
    }
  })
    
});

*/

const MainStack = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Inicio',
      headerLeft: () => {
        if (ES_IOS)
          return <Ionicons name={'ios-menu'} style={{fontSize: 24, padding: 12, color: colors.primario}} onPress={ () => { navigation.toggleDrawer() }}/>
        else
          return <MaterialIcons name={'menu'} style={{fontSize: 24, padding: 12, color: 'white'}} onPress={ () => { navigation.toggleDrawer() } }  />
      }
    })
  },
  Noticia: NoticiaScreen,
  Perfil: {
    screen: PerfilScreen,
    navigationOptions: {
      title: 'Perfil',
      headerStyle: {
        elevation: ES_IOS ? null : 0,
        backgroundColor: ES_IOS ? 'white' : colors.primario
      }
    }
  },
  Asignaturas: {
    screen: AsignaturasScreen,
    navigationOptions: {
      title: 'Asignaturas'
    }
  },
  Asignatura: {
    screen: AsignaturaTabsScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('nombre', 'Asignatura'),
      headerStyle: {
        elevation: (ES_IOS || (navigation.getParam('secciones').length >= 1)) ? null : 0, // TODO: Arreglar la elevación para asinaturas sin tab bar
        backgroundColor: ES_IOS ? 'white' : colors.primario
      }
    })
  },
  Notas: {
    screen: NotasScreen,
    navigationOptions: {
      title: 'Notas'
    }
  },
  Bitacora: {
    screen: BitacoraScreen,
    navigationOptions: {
      title: 'Bitácora'
    }
  },
  Carreras: {
    screen: CarrerasScreen,
    navigationOptions: {
      title: 'Carreras'
    }
  },
  Carrera: {
    screen: CarreraScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('nombre', 'Carrera'),
    })
  },
  Malla: {
    screen: MallaScreen,
    navigationOptions: {
      title: 'Malla'
    }
  },
  Boletin: {
    screen: BoletinScreen,
    navigationOptions: {
      title: 'Boletín'
    }
  },
  Horario: {
    screen: HorarioScreen,
    navigationOptions: {
      title: 'Horario'
    }
  },
  Calificaciones: {
    screen: CalificacionesScreen,
    navigationOptions: {
      title: 'Calificaciones'
    }
  },
  Calificar: {
    screen: CalificarScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HeaderBackButton tintColor={'white'} onPress={() => {
        if (navigation.getParam("estaCargando")) {
          ToastAndroid.show('Espera a que se envíe tu calificación', ToastAndroid.SHORT)
        } else {
          navigation.state.params.onGoBack(false);
          navigation.goBack()
        }
      }}/>,
      headerTitle: <CalificarHeader docente={navigation.getParam("nombreDocente", "Docente")}/>
    })
  }
},
{
  defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: ES_IOS ? 'white' : colors.primario
      },
      headerTitleStyle: {
        color: ES_IOS ? 'black' : 'white'
      },
      headerTintColor: ES_IOS ? colors.primario : 'white',
      headerBackTitleStyle: {
        color: colors.primario
      }
  }
});

const MainDrawer = createDrawerNavigator({
  Main: {
    screen: MainStack,
    navigationOptions: ({ navigation }) => ({
      title: 'Inicio',
    }),
  },
  Perfil: {
    screen: PerfilScreen,
    navigationOptions: {
      title: 'Perfil'
    }
  },
  Asignaturas: {
    screen: AsignaturaTabsScreen,
    navigationOptions: {
      title: 'Asignaturas',
      /*headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
      }*/
    }
  },
  Carreras: {
    screen: CarrerasScreen,
    navigationOptions: {
      title: 'Carreras'
    }
  },
  Horario: {
    screen: HorarioScreen,
    navigationOptions: {
      title: 'Horario'
    }
  }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    drawerIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let nombreIcono;
      if (ES_IOS) {
        if (routeName === 'Main') {
          nombreIcono = 'ios-home';
        } else if (routeName === 'Perfil') {
          nombreIcono = 'ios-contact';
        } else if (routeName === 'Asignaturas') {
          nombreIcono = 'ios-book';
        } else if (routeName === 'Carreras') {
          nombreIcono = 'ios-school';
        } else if (routeName === 'Horario') {
          nombreIcono = 'ios-time';
        }
        return <Ionicons name={nombreIcono} size={horizontal ? 20 : 25} color={tintColor} />;
      } else {
        if (routeName === 'Main') {
          nombreIcono = 'home';
        } else if (routeName === 'Perfil') {
          nombreIcono = 'account-circle';
        } else if (routeName === 'Asignaturas') {
          nombreIcono = 'book';
        } else if (routeName === 'Carreras') {
          nombreIcono = 'school';
        } else if (routeName === 'Horario') {
          nombreIcono = 'access-time';
        }
        return <MaterialIcons name={nombreIcono} size={horizontal ? 20 : 25 } color={tintColor}/>
      }
      
    }
  }),
  drawerType: ES_IOS ? 'slide' : 'front',
  contentComponent: props => <Drawer items={props}/>,
  contentOptions: {
    activeTintColor: colors.primario,
    inactiveTintColor: colors.material.grey['700']
  },
});

const AppNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  Main: MainDrawer
});

export default createAppContainer(AppNavigator);
