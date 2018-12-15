import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';
import GridContent from '../components/GridContent';
import RowLabels from '../components/RowLabels';
import ColumnLabels from '../components/ColumnLabels';
//import { getCellsByRow } from '../static/data';
const datos = [
  ['A','B','C','D','E','F'],
  ['uwu','awa','owo','ewe','iwi','ywy'],
  ['A','B','C','D','E','F'],
  ['uwu','awa','owo','ewe','iwi','ywy'],
  ['A','B','C','D','E','F'],
  ['uwu','awa','owo','ewe','iwi','ywy'],
  ['A','B','C','D','E','F'],
  ['uwu','awa','owo','ewe','iwi','ywy'],
  ['1','2','3','4','5','6']
];
const labelC = ['Lunes', 'Martes','Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const labelF = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];


export default class HorarioScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //const cellsByRow = getCellsByRow();

    return (
      <ScrollView
        bounces={true}
        bouncesZoom={true}
        maximumZoomScale={1.5}
        minimumZoomScale={0.75}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <ScrollViewChild scrollDirection={'both'}>
          <GridContent data={datos}/>
        </ScrollViewChild>
        <ScrollViewChild scrollDirection={'vertical'} style={styles.rowLabelsContainer}>
          <RowLabels data={labelF}/>
        </ScrollViewChild>
        <ScrollViewChild scrollDirection={'horizontal'} style={styles.columnLabelsContainer}>
          <ColumnLabels data={labelC} />
        </ScrollViewChild>
      </ScrollView>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 1080,
    width: 1080,
  },
  rowLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
  },
  columnLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 30,
  },
})