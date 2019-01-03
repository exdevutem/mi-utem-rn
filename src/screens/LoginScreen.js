import React, { Component } from 'react';
import {Dimensions, Text, View, SafeAreaView, TextInput, StyleSheet, Image, TouchableHighlight, AsyncStorage, StatusBar, Linking, Animated, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import { Cache } from "react-native-cache";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation';

import ApiUtem from '../ApiUtem';
import colors from '../colors';

var cache = new Cache({
    namespace: "estudiantes",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});
var apiUtem = new ApiUtem();

const win = Dimensions.get('window');

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchoMaximoBoton: 0,
            altoBoton: null,
            animationAnchoBoton: new Animated.Value(),
            estaCargando: false,
            colorCorreo: 'white',
            colorContrasenia: 'white',
            correoEsValido: null,
            contraseniaEsValido: null,
            correo: "",
            contrasenia: ""
        };
    }

     _login = async function(correo, contrasenia) {
        apiUtem.getToken(correo, contrasenia).then(async (respuesta) => {
            const rut = respuesta.rut;
            const datos = await apiUtem.getPrincipales(rut);
            const perfil = datos[0];
            const horarios = datos[1];
            const carreras = datos[2];
            
            const nombre = perfil.nombre.completo ? perfil.nombre.completo : (perfil.nombre.apellidos ? perfil.nombre.nombres + " " + perfil.nombre.apellidos : perfil.nombre);
            const fotoUrl = perfil.fotoUrl;
            const correoUtem = perfil.correoUtem;
            const navigation = this.props.navigation;
            cache.setItem(rut + "horarios", horarios, (err) => {
                if (err) console.error(err);
                cache.setItem(rut + "carreras", carreras, (err) => {
                    if (err) console.error(err);
                    cache.setItem(rut, perfil, (err) => {
                        if (err) console.error(err);
                        navigation.navigate('Main', {
                            nombre: nombre,
                            foto: fotoUrl,
                            correo: correoUtem,
                            carrerasN: carreras.length,
                            carreraId: carreras.length == 1 ? carreras[0]._id : null,
                            horariosN: horarios.length || null,
                            horarioId: horarios.length == 1 ? horarios[0].carrera.codigo : null,
                            asignaturasN: null,
                            asignaturaId: null
                        });
                    });
                });
            });
        }).catch(err => {
            console.log(err);
            
            this.setState({
                colorCorreo: colors.material.red['600'],
                correoEsValido: false,
                colorContrasenia: colors.material.red['600'],
                contraseniaEsValido: false
            });
            this._toggleCargando();
        })
        
    };

    _onSubmitPress = () => {
        if (this.state.correo != '' && this.state.contrasenia != '') {
            if (this.state.correo.endsWith('@utem.cl')) {
                this._toggleCargando();
                this._login(this.state.correo, this.state.contrasenia);
            } else {
                this.setState({
                    colorCorreo: colors.material.red['600']
                });
            }
        } else {
            if (this.state.correo == '') {
                this.setState({
                    colorCorreo: colors.material.red['600']
                });
            }
            if (this.state.contrasenia == '') {
                this.setState({
                    colorContrasenia: colors.material.red['600']
                });
            }
        }
    }

    _onCorreoFocus = () => {
        this.setState({
            colorCorreo: colors.primario,
            correoEsValido: null
        });
    }

    _onContraseniaFocus = () => {
        this.setState({
            colorContrasenia: colors.primario,
            contraseniaEsValido: null
        });
    }

    _onCorreoBlur = () => {
        var esValido = this.state.correo != '' && this.state.correo.endsWith('@utem.cl');
        if (esValido) {
            this.setState({
                colorCorreo: 'white',
                correoEsValido: esValido
            });
        } else {
            this.setState({
                colorCorreo: colors.material.red['600'],
                correoEsValido: esValido
            });
        }
    }

    _onContraseniaBlur = () => {
        var esValido = this.state.contrasenia != '';
        if (esValido) {
            this.setState({
                colorContrasenia: 'white',
                contraseniaEsValido: esValido
            });
        } else {
            this.setState({
                colorContrasenia: colors.material.red['600'],
                contraseniaEsValido: esValido
            });
        }
        
    }

    _abrirUrl() {
        if (!this.state.estaCargando) {
            const url = "https://pasaporte.utem.cl/reset";
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                }
            });
        }
    }

    _setDimensionesBoton(event){
        if (this.state.anchoMaximoBoton == 0) {
            this.setState({
                anchoMaximoBoton: event.nativeEvent.layout.width,
                altoBoton: event.nativeEvent.layout.height
            });
        }
        
    }

    _toggleCargando() {
        let valorInicial = this.state.estaCargando ? this.state.altoBoton : this.state.anchoMaximoBoton;
        let valorFinal = this.state.estaCargando ? this.state.anchoMaximoBoton : this.state.altoBoton;

        var estabaCargando = this.state.estaCargando;
        if (!estabaCargando) {
            this.setState({
                estaCargando: !estabaCargando
            });
        }

        this.state.animationAnchoBoton.setValue(valorInicial);
        Animated.timing(this.state.animationAnchoBoton, {
            toValue: valorFinal,
            duration: 500
        }).start(({finished}) => {
            if (finished) {
                if (estabaCargando) {
                    this.setState({
                        estaCargando: !estabaCargando
                    });
                }
            }
        });
    }

    componentDidMount() {
        Orientation.lockToPortrait();
    }

    render() {
        const {estaCargando, colorCorreo, colorContrasenia, correoEsValido, contraseniaEsValido} = this.state;
        var iconoCorreo = correoEsValido == null ? null : (correoEsValido ? "check-circle" : "cancel");
        var iconoContrasenia = contraseniaEsValido == null ? null : (contraseniaEsValido ? "check-circle" : "cancel");
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    translucent={true}
                    backgroundColor="rgba(255, 255, 255, 0)" />

                <Image
                    source={require('../assets/images/login-background.png')}
                    resizeMode='cover'
                    style={styles.poster} />
                
                <Video 
                    repeat
                    muted
                    source={require('../assets/videos/login-background.mp4')}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill} />
                
                <View style={styles.overlay} />
                
                <SafeAreaView style={styles.contentContainer}>
                    <Image 
                        source={require('../assets/images/utem-logo-color-blanco.png')}
                        resizeMode="contain"
                        style={styles.logo} />

                    <View style={styles.formContainer}>
                        <View style={{opacity: estaCargando ? 0.7 : 1}}>
                            <Text style={styles.texto}>Correo</Text>
                            <View style={styles.inputContainer}>
                                <MaterialIcons style={styles.icono} name={iconoCorreo} size={ 20 } color={colorCorreo}/>
                                <TextInput
                                    style={[styles.textInput, {borderColor: colorCorreo}]} 
                                    keyboardType='email-address'
                                    placeholder='correo@utem.cl'
                                    autoCorrect={false}
                                    editable={!this.state.estaCargando}
                                    placeholderTextColor='rgba(255, 255, 255, 0.7)'
                                    selectionColor='#009d9b'
                                    autoCapitalize='none'
                                    textContentType='emailAddress'
                                    onFocus={this._onCorreoFocus}
                                    onBlur={this._onCorreoBlur}
                                    onChangeText={(texto) => 
                                        this.setState({
                                            correo: texto
                                        })
                                    } />
                            </View>
                            <Text style={styles.texto}>Contraseña</Text>
                            <View style={styles.inputContainer}>
                                <MaterialIcons style={styles.icono} name={iconoContrasenia} size={ 20 } color={colorContrasenia}/>
                                <TextInput 
                                style={[styles.textInput, {borderColor: colorContrasenia}]} 
                                placeholder='••••••••••'
                                autoCorrect={false}
                                editable={!this.state.estaCargando}
                                secureTextEntry={true}
                                textContentType='password'
                                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                                selectionColor='#009d9b'
                                onFocus={this._onContraseniaFocus}
                                onBlur={this._onContraseniaBlur}
                                onChangeText={(texto) => 
                                    this.setState({
                                        contrasenia: texto
                                    })
                                } />
                            </View>
                            
                            <Text
                                style={[styles.texto, styles.url]}
                                onPress={this._abrirUrl.bind(this)}> 
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </View>
                        
                        <Animated.View
                            style={[styles.botonContainer, {width: this.state.animationAnchoBoton, height: this.state.altoBoton}]}>
                            <TouchableHighlight 
                                onPress={this.state.estaCargando ? null : this._onSubmitPress}
                                style={styles.boton}
                                underlayColor={colors.primarioOscuro}
                                onLayout={this._setDimensionesBoton.bind(this)} >
                                <View>
                                    <ActivityIndicator size="small" color="white" style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>
                                    <Text style={[styles.textoBoton, this.state.estaCargando ? {opacity: 0} : {opacity: 1}]}>Entrar</Text>
                                </View>
                            </TouchableHighlight>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

// <Text style={styles.footer}>Creado por el Club de Innovación y Desarrollo UTEM</Text>

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        flex: 1,
        backgroundColor: 'black'
    },
    poster: {
        position: 'absolute',
        alignSelf: 'center',
        width: win.width,
        height: win.height,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 20,
        zIndex: 10
    },
    logo: {
        flex: 1,
        margin: 40,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    formContainer: {
        flex: 2,
        margin: 10
    },
    texto: {
        color: 'white',
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    url: {
        textDecorationLine: 'underline'
    },
    inputContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 15
    },
    textInput: {
        color: 'white',
        paddingHorizontal: 15,
        padding: 10,
        borderRadius: 26,
        borderWidth: 2,
        maxHeight: 40
    },
    icono: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 10
    },
    botonContainer: {
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    boton: {
        backgroundColor: '#009d9b'
    },
    textoBoton: {
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 40
    },
    cargando: {
        position: 'absolute',
        alignSelf: 'center',
        top: 0, 
        left: 0,
        bottom: 0,
        right: 0
    },
    footer: {
        color: 'white',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10
    }
});