import React, { Component } from 'react';
import { Platform, Text, SegmentedControlIOS, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';

import SegmentedTab from './components/SegmentedTab';

import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';

import NoticiaScreen from './screens/NoticiaScreen';
import PerfilScreen from './screens/PerfilScreen';
import HorarioScreen from './screens/HorarioScreen';

import CarreraScreen from './screens/CarreraScreen';
import BoletinScreen from './screens/BoletinScreen';
import MallaScreen from './screens/MallaScreen';

import AsignaturaScreen from './screens/AsignaturaScreen';
import NotasScreen from './screens/NotasScreen';
import BitacoraScreen from './screens/BitacoraScreen';

const ES_IOS = Platform.OS === 'ios';

const colors = {
  principal: '#009d9b',
  azulIos: '#007AFF'
}

const AsignaturaTabs = createMaterialTopTabNavigator({
  Teoria: {
    screen: AsignaturaScreen,
    title: 'Teoría'
  },
  Taller: {
    screen: AsignaturaScreen,
    title: 'Taller'
  },
  Laboratorio: {
    screen: AsignaturaScreen,
    title: 'Laboratorio'
  },
},
{
  ...Platform.select({
    ios: {
      tabBarComponent: ({navigation}) => {
        return (
          <SegmentedTab
            routes={ ['Teoria', 'Taller', 'Laboratorio'] }
            values={ ['Teoría', 'Taller', 'Laboratorio'] } 
            selectedIndex={ navigation.state.index }
            navigation={ navigation }
          />
        );
      },
    }
  })
  ,
  swipeEnabled: !ES_IOS,
  tabBarOptions: {
    style: {
        backgroundColor: colors.principal,
    },
    indicatorStyle: {
      backgroundColor: 'white',
    }
  },
  defaultNavigationOptions: {
    tabBarOnPress: ({ defaultHandler }) => {
      defaultHandler();
    }
  }
    
});

const MainStack = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Inicio',
      headerLeft: () => {
        if (ES_IOS)
          return <Ionicons name={'ios-menu'} style={{fontSize: 24, padding: 12, color: colors.azulIos}} onPress={ () => { navigation.toggleDrawer() }}/>
        else
          return <MaterialIcons name={'menu'} style={{fontSize: 24, padding: 12, color: 'white'}} onPress={ () => { navigation.toggleDrawer() } }  />
      }
    })
  },
  Noticia: NoticiaScreen,
  Perfil: {
    screen: PerfilScreen,
    navigationOptions: {
      title: 'Perfil'
    }
  },
  Asignatura: {
    screen: AsignaturaTabs,
    navigationOptions: {
      title: 'Asignatura',
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: ES_IOS ? 'white' : colors.principal
      }
    }
  },
  Carrera: {
    screen: CarreraScreen,
    navigationOptions: {
      title: 'Carrera'
    }
  },
},
{
  defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: ES_IOS ? 'white' : colors.principal,
      },
      headerTintColor: (ES_IOS) ? '' : 'white',
      headerBackTitleStyle: {
        color: colors.azulIos
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
  Asignatura: {
    screen: AsignaturaTabs,
    navigationOptions: {
      title: 'Asignatura',
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
      }
    }
  },
  /*
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
  */
  Carrera: {
    screen: CarreraScreen,
    navigationOptions: {
      title: 'Carrera'
    }
  },
  Horario: {
    screen: HorarioScreen,
    navigationOptions: {
      title: 'Horario'
    }
  }
  /*
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
  }*/
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
        } else if (routeName === 'Asignatura') {
          nombreIcono = 'ios-book';
        } else if (routeName === 'Carrera') {
          nombreIcono = 'ios-school';
        }
        return <Ionicons name={nombreIcono} size={horizontal ? 20 : 25} color={tintColor} />;
      } else {
        if (routeName === 'Main') {
          nombreIcono = 'home';
        } else if (routeName === 'Perfil') {
          nombreIcono = 'account-circle';
        } else if (routeName === 'Asignatura') {
          nombreIcono = 'book';
        } else if (routeName === 'Carrera') {
          nombreIcono = 'school';
        }
        return <MaterialIcons name={nombreIcono} size={horizontal ? 20 : 25 } color={tintColor}/>
      }
      
    }
  }),
  drawerType: ES_IOS ? 'slide' : 'front',
  contentOptions: {
    activeTintColor: ES_IOS ? colors.azulIos : colors.principal,
  },
});

const AppNavigator = createSwitchNavigator({
  //Login: LoginScreen,
  Main: MainDrawer
});

export default createAppContainer(AppNavigator);
