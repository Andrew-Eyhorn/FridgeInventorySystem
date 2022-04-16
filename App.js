import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Modal, TextInput } from 'react-native';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import { Button } from 'react-native-web';
import dayjs from 'dayjs'
const Inventory = (props) => {
  return (<View>
    <div className="main">
      <DataTableExtensions
        columns={props.columns}
        data={props.data}
        print={false}
        export={false}
      >
        <DataTable
          // columns={columns}
          // data={data}
          noHeader
          // defaultSortField="id"
          // defaultSortAsc={false}
          highlightOnHover
          onRowDoubleClicked={(row) => props.onEdit(row)}
        />
      </DataTableExtensions>
    </div>
  </View>)
}
const ItemInput = (props) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  return (<Modal
    animationType="slide"
    transparent={true}
    visible={props.visibility}
    onRequestClose={() => {
      Alert.alert("Modal has been closed.");
      setModalVisible(!modalVisible);
    }}
  >
    <View style={styles.itemInput}>
      <View style={styles.container}>
        <Text style={styles.container}>Enter Info</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Enter Name of Item"
          onChangeText={newText => setText1(newText)}
          defaultValue={props.row.item}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Enter Amount of this Item"
          onChangeText={newText => setText2(newText)}
          defaultValue={props.row.amount}
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Enter Expiry Date"
          onChangeText={newText => setText3(newText)}
          defaultValue={props.row.bestbeforedate}
        />
        <Button
          style={styles.button}
          onPress={() => {
            props.toggleModal(false);
            if (props.row.id === '') {
              props.data.push({
                id: props.data.length + 1,
                item: text1.toString(),
                amount: parseInt(text2),
                bestbeforedate: text3.toString()
              });
            } else {
              props.data[props.row.id-1] = {
                id: props.row.id,
                item: text1.toString(),
                amount: parseInt(text2),
                bestbeforedate: text3.toString()
              }
            }
            props.dataUpdate(props.data)
          }}
        >
          <Text>Confirm</Text>
        </Button>
        <Button
          style={styles.button}
          onPress={() => props.toggleModal(false)}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  </Modal>)
}
export default function App() {
  const columns = [
    {
      name: "Item",
      selector: row => row.item,
      sortable: true
    },
    {
      name: "Amount", //needs to be interger not string
      selector: row => row.amount,
      sortable: false
    },
    {
      name: "Best Before Date", //need to make this a date not a string
      selector: row => row.bestbeforedate,
      sortable: true,
      cell: d => <span>{dayjs(d.bestbeforedate).format('DD/MM/YYYY ')}</span>,
    },
  ];
  const [data, updateData] = useState([
    {
      id: 1,
      item: "Beans",
      amount: "1988",
      bestbeforedate: "2020-01-15"
    },
    {
      id: 2,
      item: "Eggs",
      amount: "5",
      bestbeforedate: "2021-03-29"
    },
    {
      id: 3,
      item: "Milk",
      amount: "5L",
      bestbeforedate: "2021-05-21"
    },
  ])
  const [modalVisible, setModalVisible] = useState(false);
  const blankItem = [{
    id: "",
    item: "",
    amount: "",
    bestbeforedate: ""
  }];
  const [currentItem, setCurrentItem] = useState(blankItem)
  function dataUpdate(dataToBeUpdated) {
    updateData(dataToBeUpdated)
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title="Add Item"
        style={[styles.button, styles.buttonOpen]}
        onPress={() => { setModalVisible(true); setCurrentItem(blankItem) }}
      >
      </Button>
      <ItemInput row={currentItem} action='add' visibility={modalVisible} dataUpdate = {dataUpdate} toggleModal = {setModalVisible} data = {data}/>
      <Inventory columns={columns} data={data} onEdit = {(item) => { setModalVisible(true); setCurrentItem(item) }}/>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInput: {
    maxWidth: 500,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    size: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
