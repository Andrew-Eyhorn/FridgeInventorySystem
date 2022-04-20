import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Modal, TextInput, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs'
import DateTimePickerModal from "react-native-modal-datetime-picker";
const lodash = require("lodash");
var sortedColumn = 'bestbeforedate'
const ItemInput = (props) => {
  const [text1, setText1] = useState(props.row.item);
  const [text2, setText2] = useState(props.row.amount);
  const [text3, setText3] = useState('');
  function onTextChanged(text) {
    setText2(text.replace(/[^0-9]/g, '')
    )
  }
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setText3(dayjs(date).format('YYYY-MM-DD'))
    console.log(text3);
    hideDatePicker();
  };
  return (<Modal
    animationType="slide"
    transparent={true}
    visible={props.visibility}
    onRequestClose={() => {
      Alert.alert("Modal has been closed.");
      setModalVisible(!modalVisible);
    }}
  >
      <View style={styles.modal}>
        <Text>Enter Info</Text>
        <TextInput
          style={{ height: '10%' }}
          placeholder="Enter Name of Item"
          onChangeText={newText => setText1(newText)}
          defaultValue={props.row.item}
        />
        <TextInput
          style={{ height: '10%' }}
          placeholder="Enter Amount of this Item"
          keyboardType='numeric'
          onChangeText={value => onTextChanged(value)}
          value={text2}
        />
        <Text>{dayjs(text3).format('DD/MM/YYYY')}</Text>
        {/* <TextInput
          style={{ height: 40 }}
          placeholder="Enter Expiry Date"
          onChangeText={newText => setText3(newText)}
          defaultValue={props.row.bestbeforedate}
        /> */}
        <Button title="Show Date Picker" onPress={showDatePicker}/>
         <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
        <Button
          title='Confirm'
          onPress={() => {
            props.toggleModal(false);
            console.log(props.row.id)
            if (props.row.id === '') {
              props.data.push({
                id: props.data.length + 1,
                item: text1.toString(),
                amount: parseInt(text2),
                bestbeforedate: text3.toString()
              });
            } else {
              props.data[props.row.id - 1] = {
                id: props.row.id,
                item: text1.toString(),
                amount: parseInt(text2),
                bestbeforedate: text3.toString()
              }
            };
            props.dataUpdate(props.data); console.log(props.data)
          }}
          disbled = {() => {
            if (text2 && text2 && text3 === '' ) {
              return true
            } else {return false}}}
        >
        </Button>
        <Button
          title='Cancel'
          style={styles.button}
          onPress={() => props.toggleModal(false)} />
      </View>
  </Modal>)
}
const Inventory = (props) => {
  const [sortDirection, changeSortDirection] = useState('asc')
  const [sortedData, sortData] = useState(lodash.orderBy(props.data, 'bestbeforedate', sortDirection))
  const displayData = sortedData.map((item) =>
    <DataTable.Row onPress={() => { props.selectItem(item); props.toggleModal(true) }} key={item.id}>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.amount}</DataTable.Cell>
      <DataTable.Cell>{dayjs(item.bestbeforedate).format('DD/MM/YYYY')}</DataTable.Cell>
    </DataTable.Row>)
  function orderData(column) {
    if (column === sortedColumn) {
      if (sortDirection === 'asc') {
        changeSortDirection('desc')
      } else {
        changeSortDirection('asc')
      }
    } else {
      sortedColumn = column
      changeSortDirection('asc')
    }
    if (column === 'item') {
      sortData(lodash.orderBy(props.data, [item => item.item.toLowerCase()], sortDirection))
    } else {
    sortData(lodash.orderBy(props.data, column, sortDirection))
    }
  }
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title onPress={() => orderData('item')}>Item</DataTable.Title>
        <DataTable.Title onPress={() => orderData('amount')}>Amount </DataTable.Title>
        <DataTable.Title /*sortDirection={'ascending'}*/ onPress={() => orderData('bestbeforedate')}>Best Before Date</DataTable.Title>
      </DataTable.Header>
      {displayData}
    </DataTable>
  )
}
export default function App() {
  const [data, updateData] = useState([
    {
      id: 1,
      item: "Beans",
      amount: 1988,
      bestbeforedate: "2020-01-15"
    },
    {
      id: 2,
      item: "Eggs",
      amount: 5,
      bestbeforedate: "2021-07-29"
    },
    {
      id: 3,
      item: "Milk",
      amount: 5,
      bestbeforedate: "2021-05-21"
    },
  ])
  const [modalVisible, setModalVisible] = useState(false);
  const blankItem = {
    id: "",
    item: "",
    amount: "",
    bestbeforedate: ""
  };
  const [currentItem, setCurrentItem] = useState(blankItem)
  function dataUpdate(dataToBeUpdated) {
    updateData(dataToBeUpdated)
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Inventory data={data} selectItem={setCurrentItem} toggleModal={setModalVisible} />
      <Button
        title="Add Item"
        onPress={() => { setModalVisible(true); setCurrentItem(blankItem) }}
      />
      <ItemInput row={currentItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    height: '100%'
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%' 
  }
});
