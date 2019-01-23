import React, { Component } from 'react';
import { Platform, StatusBar, FlatList, StyleSheet, View, Image, Text } from 'react-native';
import {calificaciones} from '../static/estudiantes'
import ScrollView from 'react-native-directed-scrollview';
import ComentariosCalificaciones from '../components/CalificacionesComentarios';
import Estrellas from '../components/CalificacionEstrellas';
const ES_IOS = Platform.OS === 'ios';

export default class CalificacionesScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            campos:[],
            perfil:null
        }
    }

    _renderListaCom=(datos)=>{
        var lista = []
        datos.calificaciones.comentarios.map((index)=>this._renderComentario(index,lista));
    }
    _renderComentario = (datos,campos)=>{
        if(datos.comentario!=null)
            campos.push({
                Foto: datos.estudiante.fotoUrl,
                nombre: datos.estudiante.nombre,
                evaluacion: datos.calificacion,
                fecha: datos.fecha,
                coment: datos.comentario
            })
        this.setState({
            campos: campos,
            perfil: datos
        })
    }
    componentWillMount() {
        this._renderListaCom(calificaciones);
    }
    render() {
        
        
        console.log(this.state.campos);
        return (
            <ScrollView>
                <StatusBar
                    barStyle={ES_IOS ? "dark-content" : "light-content"}
                    backgroundColor={colors.primarioOscuro} />
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.docenteContainer}>
                            <Image source={{uri: calificaciones.docente.fotoUrl}} style={styles.foto} />
                            <View style={styles.datosDocenteContainer}>
                                <Text 
                                    style={styles.nombreDocenteTexto}
                                    numberOfLines={2}>
                                    {calificaciones.docente.nombre}
                                </Text>
                                <Text> {calificaciones.docente.correo}</Text>
                                <Estrellas rating={calificaciones.calificaciones.promedio}></Estrellas>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.textoNombre}>Comentarios</Text>
                </View>
                <FlatList
                    data={this.state.campos}
                    style={styles.lista}
                    renderItem={({item}) => 
                        <ComentariosCalificaciones/>
                    }/>
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 5,
        padding: 20,
        elevation: 2
    },
    container: {
        flex: 1,
        backgroundColor: colors.material.grey['200'],
        paddingVertical: 5,
    },
    textoNombre: {
        fontWeight: 'bold',
        fontSize: 16
    },
    foto: {
        height: 80,
        width: 80,
        borderRadius: 35,
        marginRight: 20
    },
    docenteContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nombreDocenteTexto: {
        fontWeight: 'bold',
        fontSize: 16
    },
});