import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import { Cache } from "react-native-cache";

import HorarioCeldas from '../components/HorarioCeldas';
import HorarioPeriodos from '../components/HorarioPeriodos';
import HorarioDias from '../components/HorarioDias';

import ApiUtem from '../ApiUtem';

const ES_IOS = Platform.OS === 'ios';

const labelC = ['Lunes', 'Martes','Miércoles', 'Jueves', 'Viernes', 'Sábado'];

var apiUtem = new ApiUtem();

var cache = new Cache({
  namespace: "estudiantes",
  policy: {
      maxEntries: 50000
  },
  backend: AsyncStorage
});

export default class HorarioScreen extends Component {
  constructor(props) {
    super(props);
    this.horarioScroll;
    this.state = {
        datos: [],
        estaCargando: true,
    }
  }

  _parseHorario(horario){
    var datos=[];
    var dia=[];

    for(var key in horario[0].horario){
      console.log(key);
      if(key != 'domingo'){
        horario[0].horario[key].forEach(function(elemento){
          if(elemento.bloques[0] != null){
            var auxNombre;
            for(var i=0; i < horario[0].asignaturas.length; i++){
              if(horario[0].asignaturas[i] != null){
                if(elemento.bloques[0].codigoAsignatura == horario[0].asignaturas[i].codigo){
                  auxNombre = horario[0].asignaturas[i].nombre;
                }
              }
            }
            var bloque={
              nombre: auxNombre,
              codigo: elemento.bloques[0].codigoAsignatura,
              seccion: elemento.bloques[0].seccionAsignatura,
              sala: elemento.bloques[0].sala,
            }
            dia.push(bloque)
          }
          else{
            dia.push(null);
          }
        })
        datos.push(dia);
        dia=[];
      }
    }

    var aux = [];
    for(var i=0; i < 9; i++){
      var diaAux = [];
      for(var j=0; j < 6; j++){
        diaAux.push(datos[j][i])
      }
      aux.push(diaAux);
    }

    this.setState({
      datos: aux
    });
  }

  componentWillMount(){
    this._getHorario();
  }

  _getHorario = async () => {
    const rut = await AsyncStorage.getItem('rut');
    const key = rut + 'horarios';
    cache.getItem(key, async (err, horariosCache) => {
      
        if (err || !horariosCache) {
            const horarios = await apiUtem.getHorarios(rut);
            cache.setItem(key, horarios, (err) => {
                if (err) console.error(err);
                this.setState({
                    estaCargando: false
                });
    
                this._parseHorario(horarios);
            });
        } else {
          
            this.setState({
                estaCargando: false
            });

            this._parseHorario(horariosCache)
        }
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={ES_IOS ? "dark-content" : "light-content"}
          backgroundColor={colors.primarioOscuro} />

        <ActivityIndicator 
          size="large" 
          color={colors.primario} 
          style={[styles.cargando, this.state.estaCargando ? {opacity: 1} : {opacity: 0}]}/>

        <ScrollView
          ref={component => this.horarioScroll = component}
          bounces={false}
          bouncesZoom={false}
          maximumZoomScale={2.0}
          minimumZoomScale={0.5}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          style={[styles.container, this.state.estaCargando ? {opacity: 0} : {opacity: 1}]}>
          

          <ScrollViewChild scrollDirection={'both'}>
            <HorarioCeldas data={this.state.datos}/>
          </ScrollViewChild>
          <ScrollViewChild scrollDirection={'vertical'} style={styles.rowLabelsContainer}>
            <HorarioPeriodos/>
          </ScrollViewChild>
          <ScrollViewChild scrollDirection={'horizontal'} style={styles.columnLabelsContainer}>
            <HorarioDias data={labelC} />
          </ScrollViewChild>
        </ScrollView>
      </View>
    );
  }

}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 995,
    width: 815
  },
  rowLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 100
  },
  columnLabelsContainer: {
    position: 'absolute',
    height: 30,
  },
  cargando: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0, 
    left: 0,
    bottom: 0,
    right: 0
  }
})