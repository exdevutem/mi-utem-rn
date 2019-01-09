import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const periodos = [
{
  horaInicio: '08:00',
  horaMedio: '08:45',
  horaTermino: '09:30'
}, {
  horaInicio: '09:40',
  horaMedio: '10:25',
  horaTermino: '11:10'
}, {
  horaInicio: '11:20',
  horaMedio: '12:05',
  horaTermino: '12:50'
}, {
  horaInicio: '13:00',
  horaMedio: '13:45',
  horaTermino: '14:30'
}, {
  horaInicio: '14:40',
  horaMedio: '15:25',
  horaTermino: '16:10'
}, {
  horaInicio: '16:20',
  horaMedio: '17:05',
  horaTermino: '17:50'
}, {
  horaInicio: '18:00',
  horaMedio: '18:45',
  horaTermino: '19:30'
}, {
  horaInicio: '19:40',
  horaMedio: '20:25',
  horaTermino: '21:10'
}, {
  horaInicio: '21:20',
  horaMedio: '22:05',
  horaTermino: '22:50'
}];

export default class HorarioPeriodos extends Component {
 
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { periodos.slice(0, this.props.largo).map((e, index) => this._renderPeriodoLabel(e)) }
      </View>
    );
  }

  _renderPeriodoLabel(periodo) {
    return (
      <View style={styles.rowLabel} pointerEvents={'box-none'}>
        <Text style={styles.Extremos}> {periodo.horaInicio} </Text>
        <Text style={styles.Intermedio}> {periodo.horaMedio} </Text>
        <Text style={styles.Extremos}> {periodo.horaTermino} </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderColor: '#bdbdbd',
    width: 50,
    paddingTop: 35
  },
  rowLabel: {
    height: 110,    
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingRight: 5,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  Extremos: {
    fontWeight: '400',
    fontSize: 14,
    color: 'grey',
  },
  Intermedio: {
    fontWeight: '400',
    fontSize: 11,
    color: 'grey'
  },
});