import React, { Component } from 'react';
import { Platform, View, SafeAreaView, Text, TouchableNativeFeedback, ScrollView, Image, TouchableOpacity, StyleSheet, AsyncStorage, Alert, ToastAndroid } from 'react-native';
import { DrawerItems } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

export default class Drawer extends Component {
    constructor(props) {
        super(props);
    }

    _onLogoutPress = async () => {
        firebase.analytics().logEvent("logout");
        AsyncStorage.multiRemove(['token', 'rut', 'correo'], (err) => {
            if (err) console.error(err);
            this.props.items.navigation.navigate('Login');
        });
    }

    _onItemPress = (route, focused) => {
        const {items} = this.props;
        switch (route.key) {
            case 'Carreras':

                items.navigation.navigate('Carreras')
                /*
                
                if (ES_IOS) {
                    Alert.alert('Esta función pronto estará diponible 💪 ');
                } else {
                    ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
                }
                */
                break;
            
            case 'Asignaturas':
                
                if (items.navigation.getParam('asignaturasN', null) == 1) {
                    items.navigation.navigate('Asignatura', {
                        id: items.navigation.getParam('asignaturaId', null)
                    })
                } else {
                    items.navigation.navigate('Asignaturas')
                }
                /*
                if (ES_IOS) {
                    Alert.alert('Esta función pronto estará diponible 💪 ');
                } else {
                    ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
                }*/
                break;

            case 'Horarios':
                if (items.navigation.getParam('horariosN', null) == 1) {
                    items.navigation.navigate('Horario', {
                        id: items.navigation.getParam('horarioId', null)
                    })
                } else {
                    items.navigation.navigate('Horarios')
                }
                break;
            /*case 'Calificaciones':
                if (ES_IOS) {
                    Alert.alert('Esta función pronto estará diponible 💪 ');
                } else {
                    ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
                }
                break;*/
        
            default:
                items.onItemPress({ route, focused })
                break;
        }
        
        
        
    }

    _renderFooter = () => {
        return Platform.select({
            android: (
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => this._onLogoutPress()} >
                    <View>
                        {
                            ES_IOS ? <MaterialCommunityIcons name="logout" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/> :
                            <Ionicons name="ios-log-out" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/>
                        }
                    </View>
                </TouchableNativeFeedback>
            ),
            ios: (
                <TouchableOpacity
                  onPress={() => this._onLogoutPress()} >
                        {
                            ES_IOS ? <MaterialCommunityIcons name="logout" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/> :
                            <Ionicons name="ios-log-out" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/>
                        }
                </TouchableOpacity>
            )
        });
    }

    render() {
        const {items} = this.props;
        return (
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={styles.header}>
                    <Image source={{uri: items.navigation.getParam("foto")}} style={styles.foto} />
                    <Text style={styles.nombreText}>{items.navigation.getParam("nombre")}</Text>
                    <Text style={styles.correoText}>{items.navigation.getParam("correo")}</Text>
                </View>
                <ScrollView>
                    <DrawerItems {...items} onItemPress={({ route, focused }) => this._onItemPress(route, focused)} />
                </ScrollView>
                <View style={styles.footer}>
                    {this._renderFooter()}
                </View>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: colors.material.grey['300']
    },
    foto: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginBottom: 10
    },
    nombreText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    correoText: {
        color: colors.material.grey['600']
    },
    footer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: colors.material.grey['300']
    }
});
