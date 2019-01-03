import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native';

import colors from '../colors';

const ES_IOS = Platform.OS === 'ios';

const colores = [
  colors.material.pink['400'],
  colors.material.purple['400'],
  colors.material.blue['600'],
  colors.material.lime['600'],
  colors.material.orange['800'],
  //colors.material.yellow['600'],
  colors.material.green['500'],
  colors.material.teal['500'],
  colors.material.red['600']
]

var arreglo = [];

export default class HorarioCeldas extends Component {

  render() {
    return (
      <View style={styles.container}>
        { this.props.data.map((fila, index) => this._renderFila(fila, index)) }
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
      <View style={[styles.contentContainer, {backgroundColor: color}]}>
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

  _renderCelda(celda, indexF, indexC) {
    var objeto={};
    var coloresAux = colores;

    if (celda != null) {
      var codigoAux = celda.codigo;
      var aux = coloresAux[Math.floor((Math.random() * (coloresAux.length)))];

      if (arreglo == null) {
        objeto = {
          codigo: codigoAux,
          color: aux
        }
        arreglo.push(objeto);
        coloresAux.splice(coloresAux.indexOf(aux),1);
      } else {
        var cont = 0;
        for (var i=0; i < arreglo.length; i++) {
          if (arreglo[i].codigo != codigoAux) {
            cont++;
          } else {
            aux = arreglo[i].color;
          }
        }

        if (cont == arreglo.length) {
          objeto = {
            codigo: codigoAux,
            color: aux
          }
          arreglo.push(objeto);
          coloresAux.splice(coloresAux.indexOf(aux),1);
        }
      }

      return Platform.select({
        android: (
            <View style={styles.cellContainer}>
              <TouchableNativeFeedback
                style={{flex: 1}}
                onPress={ () => { this._onCellPressed(celda, indexF, indexC) } }
                background={TouchableNativeFeedback.SelectableBackground()} >
                {this._renderContent(celda, aux)}
              </TouchableNativeFeedback>
            </View>
        ),
        ios: (
            <TouchableOpacity
              style={styles.cellContainer}
              onPress={ () => { this._onCellPressed(celda, indexF, indexC) } } >
              {this._renderContent(celda, aux)}
            </TouchableOpacity>
        )
      });

    } else {
      return (
        <TouchableOpacity style={styles.noCell}></TouchableOpacity>
      )
    }
  }

  _onCellPressed(celda, i, j) {
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
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    padding: 10,
    width: 120,
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'white',
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