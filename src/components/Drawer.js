import React, { Component } from 'react';
import { Platform, View, SafeAreaView, Text, ScrollView, Image, TouchableHighlight, StyleSheet, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

export default class Drawer extends Component {
    constructor(props) {
        super(props);
    }

    _onLogoutPress = async () => {
        console.log(this.props);
        
        await AsyncStorage.setItem('userToken', respuesta.token);
        await AsyncStorage.setItem('rut', respuesta.rut.toString());
        await AsyncStorage.setItem('correo', respuesta.correo);
        this.props.items.navigation.navigate('Login');
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
                    <DrawerItems {...items} />
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableHighlight
                        onPress={() => this._onLogoutPress()} >
                        {
                            ES_IOS ? <MaterialCommunityIcons name="logout" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/> :
                            <Ionicons name="ios-log-out" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/>
                        }
                        
                    </TouchableHighlight>
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
