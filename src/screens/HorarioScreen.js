import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import { Cache } from "react-native-cache";
import firebase from 'react-native-firebase';

import HorarioCeldas from '../components/HorarioCeldas';
import HorarioPeriodos from '../components/HorarioPeriodos';
import HorarioDias from '../components/HorarioDias';

import ApiUtem from '../ApiUtem';

const ES_IOS = Platform.OS === 'ios';

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
    firebase.analytics().setCurrentScreen("HorarioScreen", "HorarioScreen");
    this.horarioScroll;
    this.state = {
        datos: [],
        //numeroDias: 0,
        //numeroPeriodos: 0,
        estaCargando: true,
    }
  }

  _reducirHorario = (horario) => {
    delete(horario[0].horario['domingo']);
    var numeroDias = 6;
    var numeroPeriodos = 9;

    var sinSabado = true;
    horario[0].horario['sabado'].forEach(function(sabado){
      if(sabado.bloques[0] != null){
        sinSabado = false;
      }
    });

    if(sinSabado == true){
      delete(horario[0].horario['sabado']);
      numeroDias--;
    }

    var sinUltimo = true;
    var sinPenultimo = true;
    var auxiliar;

    for(var dia in horario[0].horario){
      auxiliar = horario[0].horario[dia];
      if(auxiliar[8].bloques[0] != null){
        sinUltimo = false;
      }
      if(auxiliar[7].bloques[0] != null){
        sinPenultimo = false;
      }
    }

    if(sinUltimo == true) {
      numeroPeriodos--;
      if(sinPenultimo == true) {
        numeroPeriodos--;
      }
    }

    for(var key in horario[0].horario){
      auxiliar = horario[0].horario[key];
      if(sinUltimo == true) {
        auxiliar.splice(8, 1);

        if(sinPenultimo == true) {
          auxiliar.splice(7, 1);
        }
      }
    }

    this._parseHorario(numeroDias, numeroPeriodos, horario);
  }

  _parseHorario = (nDias, nPeriodos, horario) => {
    
    var datos=[];
    
    for (var key in horario[0].horario){
      var dia = [];
      horario[0].horario[key].forEach(function(elemento) {
        if(elemento.bloques[0] != null){
          var auxNombre;
          for(var i=0; i < horario[0].asignaturas.length; i++){
            if(horario[0].asignaturas[i] != null){
              if(elemento.bloques[0].codigoAsignatura == horario[0].asignaturas[i].codigo){
                auxNombre = horario[0].asignaturas[i].nombre;
              }
            }
          }
          var bloque = {
            nombre: auxNombre,
            codigo: elemento.bloques[0].codigoAsignatura,
            seccion: elemento.bloques[0].seccionAsignatura,
            sala: elemento.bloques[0].sala,
          }
          dia.push(bloque)
        } else {
          dia.push(null);
        }
      });

      datos.push(dia);
    }

    var aux = [];
    for(var i=0; i < nPeriodos; i++) {
      var diaAux = [];
      for(var j=0; j < nDias; j++) {
        diaAux.push(datos[j][i])
      }
      aux.push(diaAux);
    }

    this.setState({
      datos: aux,
      numeroDias: nDias,
      numeroPeriodos: nPeriodos
    });
  }

  componentWillMount(){
    this._getHorario();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.datos !== nextState.datos) {
      return true;
    }
    return false;
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
    
                this._reducirHorario(horarios);
            });
        } else {
          
            this.setState({
                estaCargando: false
            });

            this._reducirHorario(horariosCache)
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
          contentContainerStyle={{width: this.state.numeroDias * 130 + 55, height: this.state.numeroPeriodos * 110 + 35}}
          style={[styles.container, this.state.estaCargando ? {opacity: 0} : {opacity: 1}]}>
          

          <ScrollViewChild scrollDirection={'both'}>
            <HorarioCeldas datos={this.state.datos}/>
          </ScrollViewChild>
          <ScrollViewChild scrollDirection={'vertical'} style={styles.rowLabelsContainer}>
            <HorarioPeriodos largo={this.state.numeroPeriodos}/>
          </ScrollViewChild>
          <ScrollViewChild scrollDirection={'horizontal'} style={styles.columnLabelsContainer}>
            <HorarioDias largo={this.state.numeroDias} />
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
  rowLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 50
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