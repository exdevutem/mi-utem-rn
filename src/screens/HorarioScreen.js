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
        numeroDias: 6,
        numeroPeriodos: 9,
        estaCargando: true,
    }
  }

  UltimosBloques(horario){
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


    for(var key in horario[0].horario){
      auxiliar = horario[0].horario[key];
      if(sinUltimo == true){
        auxiliar.splice(8, 1);
        numeroPeriodos--;

        if(sinPenultimo == true){
          auxiliar.splice(7, 1);
          numeroPeriodos--;
        }
      }
    }
    
    this.setState({
    numeroDias: nDias,
    numeroPeriodos: nPeriodos
    });

    this._parseHorario(numeroDias, numeroPeriodos, horario);
  }

  _parseHorario(nDias, nPeriodos, horario){
    var datos=[];
    var dia=[];

    for(var key in horario[0].horario){
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

    var aux = [];
    for(var i=0; i < nPeriodos; i++){
      var diaAux = [];
      for(var j=0; j < nDias; j++){
        diaAux.push(datos[j][i])
      }
      aux.push(diaAux);
    }

    this.setState({
      datos: aux,
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
    
                this.UltimosBloques(horarios);
            });
        } else {
          
            this.setState({
                estaCargando: false
            });

            this.UltimosBloques(horariosCache)
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
            <HorarioPeriodos largo={this.state.numeroPeriodos}/>
          </ScrollViewChild>
          <ScrollViewChild scrollDirection={'horizontal'} style={styles.columnLabelsContainer}>
            <HorarioDias largo={this.state.numeroDias} data={labelC} />
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
    width: 815,
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