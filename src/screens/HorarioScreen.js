import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';

export default class HorarioScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Periodo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      tableTitle: ['Title', 'Title2', 'Title3', 'Title4', 'Title5', 'Title6', 'Title7', 'Title8'],
      widthArr: [50, 60, 80, 100, 120, 140, 160]
    }
  }

/*  render() {
    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 9; i += 1) {
        const rowData = [];
        for (let j = 0; j < 6; j += 1) {   
            rowData.push(`${i}${j}`);
        }
        tableData.push(rowData);
    }

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
            <View>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                    <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
                    <Row>
                        <Col data={state.tableTitle} style={styles.col} textStyle={styles.text}/>
                        <ScrollView>
                            <Col>
                                
                            </Col>
                        </ScrollView>
                    </Row>
                </Table>
            </View>
        </ScrollView>
      </View>
    )
    return(
        <View style={styles.container}>
        <Table>
            <Row data={state.tableHead}/>
            <TableWrapper style={styles.wrapper}>
                <Col data={state.tableTitle} heightArr={[50,50]}/>
                <Rows data={state.tableData}/>
            </TableWrapper>
            </Table>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: 'yellow' },
  row: { height: 40, backgroundColor: 'blue' },
  col: { width: 50, backgroundColor: 'red'},
});*/

  render() {
    return (
      <ScrollView
        bounces={true}
        bouncesZoom={true}
        maximumZoomScale={2.0}
        minimumZoomScale={0.5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <Table>
            <ScrollViewChild scrollDirection={'both'}>
                <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                    textStyle={styles.text}
                />
            </ScrollViewChild>
            <ScrollViewChild scrollDirection={'vertical'}>
            <Col data={state.tableHead}/>
            </ScrollViewChild>
            <ScrollViewChild scrollDirection={'horizontal'}>
            <Row data={this.state.tableTitle}/>
            </ScrollViewChild>
        </Table>
      </ScrollView>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 1000,
    width: 1000,
  },
})