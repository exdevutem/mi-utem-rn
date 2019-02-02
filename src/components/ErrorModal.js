import React, { Component } from 'react';
import { View, StyleSheet, TouchableNativeFeedback, Text } from 'react-native';
import Modal from "react-native-modal";
import LottieView from 'lottie-react-native';
import colors from '../colors.js';

export default class ErrorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: this.props.isVisible
        }
    }

    _onAcceptPress = () => {
        this.setState({
            isVisible: false
        })
    }

    render() {
        return (
            <Modal isVisible={this.state.isVisible}>
                <View style={styles.container}>
                    <View style={{padding: 20}}>
                        <View>
                            <Text style={styles.title}>Error de la plataforma</Text>
                            <Text style={styles.description}>Parece que el SISEI metió la pata otra vez. Sólo queda esperar.</Text>
                        </View>
                        
                        <View style={styles.animationContainer}>
                            <View style={styles.backgroundDecoration}/>
                            <LottieView
                                source={require('../assets/animations/monito.json')}
                                autoPlay
                                loop />
                        </View>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.SelectableBackground()}
                            onPress={this._onAcceptPress}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>ENTENDIDO</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: 'white',
        elevation: 4,
        borderRadius: 8
    },
    title: {
        fontWeight: 'bold',
        color: colors.primario,
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5
    },
    description: {
        textAlign: 'center'
    },
    backgroundDecoration: {
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: colors.material.grey['300'],
        position: 'absolute',
        alignSelf: 'center'
    },
    animationContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    button: {
        backgroundColor: colors.primario,
        borderRadius: 50,
        padding: 10
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    }
});