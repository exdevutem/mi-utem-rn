import React, { Component } from 'react';
import {Text, AsyncStorage, StatusBar, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const API_URL = 'https://api-utem.herokuapp.com/';

export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
        this.state = {
            progress: new Animated.Value(0),
            esValido: null
        };
    }

    componentDidMount() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 8000
        }).start(({ finished }) => {
            if (finished) {
                if (this.state.esValido != null) {
                    if (this.state.esValido) {
                        this.props.navigation.navigate('Login');
                    } else {
                        this.props.navigation.navigate('Login');
                    } 
                }
            }
        });
    }


    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        const rut = await AsyncStorage.getItem('rut');
        const correo = await AsyncStorage.getItem('correo');
        if (userToken && rut && correo) {
            var placebo = await fetch(API_URL + 'token/placebo', {
                headers: {
                    Authorization: 'Bearer ' + userToken
                }
            }).then(response => response.json());
            
            if (placebo.esValido) {
                this.setState(previousState => ({
                    progress: previousState.progress,
                    esValido: true
                }));
            } else {
                this.setState(previousState => ({
                    progress: previousState.progress,
                    esValido: false
                }));
            }
        } else {
            this.setState(previousState => ({
                progress: previousState.progress,
                esValido: false
            }));
        }
        
    }

    render() {
        return (
            <LinearGradient style={styles.container} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={['#06607a', '#1d8e5c']}>
                <StatusBar
                    translucent={true}
                />
                <Text style={styles.footer}>Creado por el Club de Innovación y Desarrollo UTEM</Text>
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    source={require('../assets/animations/utem.json')}
                    loop={false}
                    progress={this.state.progress}
                    />
                
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009d9b'
    },
    footer: {
        color: 'white',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10
    }
});