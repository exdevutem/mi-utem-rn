import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const colors = [
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#f39c12',
  '#e74c3c',
  '#d35400'
]

export default class GridContent extends Component {

  render() {
    return (
      <View style={styles.container}>
        { this.props.data.map((row, index) => this._renderRow(row, index)) }
      </View>
    );
  }

  _renderRow(fila, i) {
    return (
      <View style={styles.rowContainer}>
        { fila.map((celda, j) => this._renderCell(celda, i, j)) }
      </View>
    );
  }

  _renderCell(celda, indexF, indexC) {
    if(celda != null){
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={() => { this._onCellPressed(celda, indexF, indexC); }}>
        <Text style={styles.textoLargo} numberOfLines={1}>
          {celda.codigo}/{celda.seccion}
        </Text>
        <Text style={styles.textoNombre} numberOfLines={2}>
          {celda.nombre}
        </Text>
        <Text style={celda.sala.length < 8 ? styles.textoSala : styles.textoLargo} numberOfLines={2}>
          {celda.sala}
        </Text>
      </TouchableOpacity>
    );}
    else{
      return(
        <TouchableOpacity style={styles.noCell}></TouchableOpacity>
      )
    }
  }

  _onCellPressed(celda, i, j) {
    Alert.alert(`Pressed (${i}, ${j})`);
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 50
  },
  rowContainer: {
    flexDirection: 'row'
  },
  cellContainer: {
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    height: 100,
    width: 120,
    margin: 5,
    borderRadius: 5,
    backgroundColor: colors[Math.floor((Math.random() * 7))],
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