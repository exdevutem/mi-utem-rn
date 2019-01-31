import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

const coloresOriginales = [
  colors.material.indigo['500'],
  colors.material.pink['400'],
  colors.material.purple['400'],
  colors.material.blue['600'],
  colors.material.lime['600'],
  colors.material.orange['800'],
  colors.material.green['500'],
  colors.material.teal['500'],
  colors.material.red['600']
]

var coloresCopia;
var asignaturasColores;

export default class HorarioCeldas extends Component {
  constructor(props) {
    super(props);
    coloresCopia = coloresOriginales.slice();
    asignaturasColores = [];
  }

  render() {
    return (
      <View style={styles.container}>
        { this.props.datos.map((fila, index) => this._renderFila(fila, index)) }
      </View>
    );
  }

  _renderFila(fila, i) {
    return (
      <View style={styles.rowContainer}>
        { fila.map((celda, j) => this._renderCelda(celda, i, j)) }
      </View>
    );
  }

  _renderContent(celda, color) {
    return (
      <View style={[styles.contentContainer, {backgroundColor: color}]} pointerEvents='box-only'>
        <Text style={styles.textoLargo} numberOfLines={1}>
          {celda.codigo}/{celda.seccion}
        </Text>
        <Text style={styles.textoNombre} numberOfLines={2}>
          {celda.nombre}
        </Text>
        <Text style={celda.sala.length < 8 ? styles.textoSala : styles.textoLargo} numberOfLines={2}>
          {celda.sala}
        </Text>
      </View>
    );
  }

  _getColor = (celda) => {
    var asignaturaColor;

    var color = coloresCopia[Math.floor((Math.random() * (coloresCopia.length)))];
    asignaturaColor = {
      codigo: celda.codigo,
      color: color
    }
      
    var loEncontro = false;

    for (var i=0; i < asignaturasColores.length; i++) {
      if (asignaturasColores[i].codigo == celda.codigo) {
        asignaturaColor.color = asignaturasColores[i].color;
        loEncontro = true;
      }
    }

    if (!loEncontro) {
      coloresCopia.splice(coloresCopia.indexOf(color), 1);
      asignaturaColor.color = color;
      asignaturasColores.push(asignaturaColor);
    }

    
    
    if (coloresCopia.length == 0) {
      this.setState({
        colores: coloresOriginales
      });
    }

    return asignaturaColor.color;
  }

  _renderCelda(celda, indexF, indexC) {
    if (celda) {
      const color = this._getColor(celda);
      return Platform.select({
        android: (
            <View style={styles.cellContainer}>
              <TouchableNativeFeedback
                style={{flex: 1}}
                onPress={ () => { this._onCellPressed(celda, indexF, indexC) } }
                background={TouchableNativeFeedback.SelectableBackground()} >
                {this._renderContent(celda, color)}
              </TouchableNativeFeedback>
            </View>
        ),
        ios: (
            <TouchableOpacity
              style={styles.cellContainer}
              onPress={ () => { this._onCellPressed(celda, indexF, indexC) } } >
              {this._renderContent(celda, color)}
            </TouchableOpacity>
        )
      });
    } else {
      return (
        <View style={[styles.cellContainer, styles.noCell]}></View>
      )
    }
  }

  _onCellPressed(celda, i, j) {
    firebase.analytics().logEvent("press_asignatura_horario", celda);
    if (ES_IOS) {
      Alert.alert('Esta función pronto estará diponible 💪 ');
    } else {
      ToastAndroid.show('Esta función pronto estará diponible 💪 ', ToastAndroid.SHORT);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingLeft: 55
  },
  rowContainer: {
    flexDirection: 'row'
  },
  cellContainer: {
    height: 100,
    width: 120,
    margin: 5
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  noCell: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: colors.material.grey['100'],
    borderStyle: 'dashed',
    borderColor: colors.material.grey['300'],
    borderWidth: 1
  },
  textoNombre: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textoSala: {
    color: 'white',
    textAlign: 'center'
  },
  textoLargo: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12
  }
});