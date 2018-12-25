import React, { Component } from 'react';
import { Platform, View, SafeAreaView, Text, ScrollView, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from '../colors';

export default class Drawer extends Component {
    constructor(props) {
        super(props);
    }

    _onLogoutPress = () => {
        //this.props.navigation.navigate('Login')
    }

    render() {
        const {items} = this.props;
        return (
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={styles.header}>
                    <Image source={{uri: 'https://raw.githubusercontent.com/mapacheverdugo/android-utem/master/app/src/main/res/drawable/profile.jpeg'}} style={styles.foto} />
                    <Text style={styles.nombreText}>Jorge Verdugo Chacon</Text>
                    <Text style={styles.correoText}>jorge.verdugoc@utem.cl</Text>
                </View>
                <ScrollView>
                    <DrawerItems {...items} />
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableHighlight
                        onPress={() => this._onLogoutPress()} >
                        <MaterialIcons name="logout" size={ 25 } style={{padding: 15}} color={colors.material.grey['600']}/>
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
