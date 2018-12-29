import React, { Component } from 'react';
import { SafeAreaView, StatusBar, Button } from 'react-native';

export default class CarreraScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('nombre', 'Carrera'),
        };
    };

    constructor(props) {
        super(props);
    }

    _onPressMalla() {
        this.props.navigation.navigate('Malla', {
            id: this.props.navigation.getParam('id', null)
        });
    }

    _onPressBoletin() {
        this.props.navigation.navigate('Boletin', {
            id: this.props.navigation.getParam('id', null)
        });
    }

    render() {
        return (
            <SafeAreaView>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primarioOscuro} />

                <Button
                    onPress={this._onPressMalla.bind(this)}
                    title="Ir a Malla" />

                <Button
                    onPress={this._onPressBoletin.bind(this)}
                    title="Ir a Boletín" />
            </SafeAreaView>
        );
    }
}