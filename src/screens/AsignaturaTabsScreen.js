import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import firebase from 'react-native-firebase';

import SeccionScreen from './SeccionScreen'
import colors from '../colors';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class AsignaturaTabsScreen extends Component {
    constructor(props) {
        super(props);
        firebase.analytics().setCurrentScreen("AsignaturaScreen", "AsignaturaTabsScreen");
        this.state = {
            index: 0,
            routes: this._renderRoutes()
        }
        this.sceneMap = this._crearMapa();
    }

    _renderRoutes = () => {
        const secciones = this.props.navigation.getParam('secciones');
        var rutas = [];

        secciones.forEach(seccion => {
            if (seccion.tipo == 'Teoria') {
                rutas.push({ key: 'teoria', title: 'Teoría' });
            } else {
                rutas.push({ key: seccion.tipo.toLowerCase(), title: seccion.tipo });
            }
            
        });

        return rutas
    }

    _handleIndexChange = index => this.setState({ 
        index: index
    });

    _renderTabBar = props => {
        const secciones = this.props.navigation.getParam('secciones');
        return (
            <TabBar {...props} style={[styles.tabBar, secciones.length > 1 ? null : {height: 0}]} labelStyle={styles.label} indicatorStyle={styles.indicator}/>
        )
    };

    _crearMapa = () => {
        const secciones = this.props.navigation.getParam('secciones');
        var mapa = {};

        secciones.forEach((seccion, i) => {
            const tabView = () => <SeccionScreen index={i} asignatura={asignatura} navigation={this.props.navigation} seccion={seccion}/>
            
            var asignatura = {
                id: this.props.navigation.getParam('id'),
                nombre: this.props.navigation.getParam('nombre')
            }
            
            if (seccion.tipo == 'Teoria') {
                mapa['teoria'] = tabView;
            } else {
                mapa[seccion.tipo.toLowerCase()] = tabView;
            }
            
        });
        return mapa;
        
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap(this.sceneMap)}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={initialLayout}
                />
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBar: {
        backgroundColor: colors.primario,
    },
    indicator: { 
        backgroundColor: 'white'
    },
    label: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13
    }
});