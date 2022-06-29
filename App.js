import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Modal, TextInput, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
const lodash = require("lodash");
const ItemInput = (props) => {
  useEffect(() => {
    validation()
  }, [props.selectedItem])
  function onTextChanged(text) {
    props.editItem((prevstate) => ({
      ...prevstate,
      amount: text.replace(/[^0-9]/g, '')
    }
    ))
  }
  const [validInput, validateInput] = useState(false)
  function validation() {
    let isValid = false;
    if (props.selectedItem.item.trim() !== '' && props.selectedItem.amount.toString().trim() !== '') {
      isValid = true;
    }
    if (isValid !== validInput) {
      validateInput(isValid);
    }
  }
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    props.editItem((prevstate) => ({
      ...prevstate,
      bestBeforeDate: dayjs(date).format('YYYY-MM-DD')
    }
    ))
    validation()
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
        onChangeText={newText => props.editItem((prevstate) => ({
          ...prevstate,
          item: newText
        }
        ))}
        value={props.selectedItem.item}
      />
      <TextInput
        style={{ height: '10%' }}
        placeholder="Enter Amount of this Item"
        keyboardType='numeric'
        onChangeText={value => onTextChanged(value)}
        value={props.selectedItem.amount.toString()}
      />
      <Text>{dayjs(props.selectedItem.bestBeforeDate).format('DD/MM/YYYY')}</Text>
      <Button title="Show Date Picker" onPress={showDatePicker} />
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
          if (props.selectedItem.id === '') {
            props.data.push({
              id: uuid.v4(),
              item: props.selectedItem.item.toString(),
              amount: parseInt(props.selectedItem.amount),
              bestBeforeDate: props.selectedItem.bestBeforeDate.toString()
            });
          } else {
            let editedItem = props.data.find(row => row.id === props.selectedItem.id);
            editedItem.item = props.selectedItem.item.toString();
            editedItem.amount = parseInt(props.selectedItem.amount);
            editedItem.bestBeforeDate = props.selectedItem.bestBeforeDate;            
          }
          props.dataUpdate(props.data); 
        }}
        disabled={!validInput}
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
  function sortData(column) {
    if (column === 'item') {
      return lodash.orderBy(props.data, [item => item.item.toLowerCase()], props.sortDirection)
    } else {
    return lodash.orderBy(props.data, column, props.sortDirection)
    }
  }
  function displaySort(column) {
    if (column === props.sortedColumn) {
      if (props.sortDirection === 'asc') {
        return 'ascending'
      } else {return 'descending'}
    } else {return null}
  }
  const sortedData = sortData(props.sortedColumn)
  const displayData = sortedData.map((item) =>
    <DataTable.Row onPress={() => { 
      props.selectItem(item); 
      props.selectItem2(item);
      props.toggleModal(true) }} key={item.id}>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.amount}</DataTable.Cell>
      <DataTable.Cell>{dayjs(item.bestBeforeDate).format('DD/MM/YYYY')}</DataTable.Cell>
    </DataTable.Row>)
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title sortDirection={displaySort('item')} onPress={() => props.chooseSort('item')}>Item</DataTable.Title>
        <DataTable.Title sortDirection={displaySort('amount')} onPress={() => props.chooseSort('amount')}>Amount </DataTable.Title>
        <DataTable.Title sortDirection={displaySort('bestBeforeDate')} onPress={() => props.chooseSort('bestBeforeDate')}>Best Before Date</DataTable.Title>
      </DataTable.Header>
      {displayData}
    </DataTable>
  )
}
export default function App() {
  const [sortDirection, changeSortDirection] = useState('asc')
  const [sortedColumn, changeSortedColumn] = useState('bestBeforeDate')
  function chooseSort(column) {
    if (column === sortedColumn) {
      if (sortDirection === 'asc') {
        changeSortDirection('desc')
      } else {
        changeSortDirection('asc')
      }
    } else {
      changeSortDirection('asc')
    }
    changeSortedColumn(column)
  }
  const defaultData = [
    {
      id: "65533777-9d9a-4498-aace-279890c2a887",
      item: "Beans",
      amount: 1988,
      bestBeforeDate: "2020-01-15"
    },
    {
      id: "4880dc0f-3040-4573-8ced-8127b698a8fe",
      item: "Eggs",
      amount: 5,
      bestBeforeDate: "2021-07-29"
    },
    {
      id: "c9af5a25-d7ee-422a-b260-ce502a271c0f",
      item: "Milk",
      amount: 5,
      bestBeforeDate: "2021-05-21"
    },
  ]
  const [modalVisible, setModalVisible] = useState(false);
  const blankItem = {
    id: "",
    item: "",
    amount: "",
    bestBeforeDate: new Date()
  };
  const [currentItem, setCurrentItem] = useState(blankItem)
  const [selectedItem, updateSelectedItem] = useState(currentItem)
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('inventory', jsonValue)
    } catch (e) {
      // saving error
    }
  }
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('inventory')
      const newLocal = jsonValue != null ? JSON.parse(jsonValue) : defaultData;
      return newLocal;
    } catch (e) {
      // error reading value
    }
  }
  const [data, updateData] = useState([])
  function dataUpdate(dataToBeUpdated) {
    updateData(dataToBeUpdated)
    storeData(dataToBeUpdated)
  }
  getData().then((value) => updateData(value));
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Inventory data={data} selectItem={setCurrentItem} selectItem2={updateSelectedItem} toggleModal={setModalVisible} sortDirection={sortDirection} sortedColumn={sortedColumn} chooseSort={chooseSort} />
      <Button
        title="Add Item"
        onPress={() => { updateSelectedItem(blankItem); setModalVisible(true); setCurrentItem(blankItem) }}
      />
      <ItemInput selectedItem={selectedItem} editItem = {updateSelectedItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
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
