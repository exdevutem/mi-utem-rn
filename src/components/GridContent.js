import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

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
        onPress={() => { this._onCellPressed(indexF, indexC); }}
      >
      <Text>{celda.nombre}</Text>
      <Text>{celda.sala}</Text>
      <Text>{celda.codigo}/{celda.seccion}</Text>
      </TouchableOpacity>
    );}
    else{
      return(
        <TouchableOpacity
        style={styles.noCell}></TouchableOpacity>
      )
    }
  }

  _onCellPressed(i, j) {
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
    alignItems: 'center',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'cyan',
  },
  noCell: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  }
});