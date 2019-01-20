import React, {Component} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap, PagerExperimental } from 'react-native-tab-view';
import * as GestureHandler from 'react-native-gesture-handler';

import AsignaturaScreen from './AsignaturaScreen'
import colors from '../colors';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class AsignaturaTabsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: this._renderRoutes()
        }
    }

    _renderRoutes = () => {
        const secciones = this.props.navigation.getParam('secciones');
        var rutas = [];

        secciones.forEach(seccion => {
            if (seccion.tipo == 'Teoria') {
                rutas.push({ key: 'teoria', title: 'Teoría' });
            } else if (seccion.tipo == 'Taller') {
                rutas.push({ key: 'taller', title: 'Taller' });
            } else if (seccion.tipo == 'Laboratorio') {
                rutas.push({ key: 'laboratorio', title: 'Laboratorio' });
            } else {
                rutas.push({ key: seccion.tipo.toLowerCase(), title: seccion.tipo });
            }
            
        });

        return rutas
    }

    _handleIndexChange = index => this.setState({ 
        index: index
    });

    _renderTabBar = props => (
        <TabBar {...props} style={styles.tabBar} labelStyle={styles.label} indicatorStyle={styles.indicator}/>
    );

    _parseMapa = () => {
        const secciones = this.props.navigation.getParam('secciones');
        console.log(secciones)
        var mapa = {};

        secciones.forEach(seccion => {
            if (seccion.tipo == 'Teoria') {
                mapa['teoria'] = () => <AsignaturaScreen datos={seccion}/>
            } else if (seccion.tipo == 'Taller') {
                mapa['taller'] = () => <AsignaturaScreen datos={seccion}/>
            } else if (seccion.tipo == 'Laboratorio') {
                mapa['laboratorio'] = () => <AsignaturaScreen datos={seccion}/>
            } else {
                mapa[seccion.tipo.toLowerCase()] = () => <AsignaturaScreen datos={seccion}/>
            }
            
        });
        return mapa;
    }

    _renderPager = props => {
        console.log(props);
        
        return (<PagerExperimental GestureHandler={GestureHandler} {...props} />)
    };

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={SceneMap(this._parseMapa())}
                renderTabBar={this._renderTabBar}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
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