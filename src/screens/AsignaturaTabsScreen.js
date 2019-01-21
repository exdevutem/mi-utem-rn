import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import SeccionScreen from './SeccionScreen'
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
                    renderScene={SceneMap(this._parseMapa())}
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