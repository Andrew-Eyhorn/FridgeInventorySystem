import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Modal, TextInput, Button } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
      {props.table === 'inventory' && <Text>{dayjs(props.selectedItem.bestBeforeDate).format('DD/MM/YYYY')}</Text>}
      {props.table === 'inventory' && <Button title="Show Date Picker" onPress={showDatePicker} />}
      {props.table === 'inventory' && <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> }
      <Button
        title='Confirm'
        onPress={() => {
          props.toggleModal(false);
          if (props.selectedItem.id === '') {
            if (props.table === 'inventory' ) {
            props.data.push({
              id: uuid.v4(),
              item: props.selectedItem.item.toString(),
              amount: parseInt(props.selectedItem.amount),
              bestBeforeDate: props.selectedItem.bestBeforeDate.toString()
            });
          }
          else {
            props.data.push({
              id: uuid.v4(),
              item: props.selectedItem.item.toString(),
              amount: parseInt(props.selectedItem.amount),
            });
          }
          } else {
            let editedItem = props.data.find(row => row.id === props.selectedItem.id);
            editedItem.item = props.selectedItem.item.toString();
            editedItem.amount = parseInt(props.selectedItem.amount);
            if (props.table === 'inventory' ) {editedItem.bestBeforeDate = props.selectedItem.bestBeforeDate; }           
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
        {props.selectedItem.id !== '' && 
        <Button
        title='Delete Item'
        style={styles.button}
        color = "#ff0000"
        onPress={() => Alert.alert(
          "Item Deletion",
          "Are you sure you want to delete item " + props.selectedItem.item + " from the inventory?",
          [
            {text: "Cancel", style: 'cancel'},
            {text: "Delete Item", color: "#FF0000", onPress: () => {props.toggleModal(false); lodash.remove(props.data, item => item.id === props.selectedItem.id); props.dataUpdate(props.data);}}
          ]
        )}
        
        />
        }
        
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
      props.toggleModal(true) }} key={item.id}>
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.amount}</DataTable.Cell>
      <DataTable.Cell>{dayjs(item.bestBeforeDate).format('DD/MM/YYYY')}</DataTable.Cell>
    </DataTable.Row>)
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title sortDirection={displaySort('item')} onPress={() => props.chooseSort('item')}>Item</DataTable.Title>
        <DataTable.Title sortDirection={displaySort('amount')} onPress={() => props.chooseSort('amount')}>Amount</DataTable.Title>
        <DataTable.Title sortDirection={displaySort('bestBeforeDate')} onPress={() => props.chooseSort('bestBeforeDate')}>Best Before Date</DataTable.Title>
      </DataTable.Header>
      {displayData}
    </DataTable>
  )
}
const IdealInventory = (props) => {
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
      props.toggleModal(true) }} key={item.id}> 
      <DataTable.Cell>{item.item}</DataTable.Cell>
      <DataTable.Cell>{item.amount}</DataTable.Cell>
    </DataTable.Row>)
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title sortDirection={displaySort('item')} onPress={() => props.chooseSort('item')}>Item</DataTable.Title>
        <DataTable.Title sortDirection={displaySort('amount')} onPress={() => props.chooseSort('amount')}>Amount</DataTable.Title>
      </DataTable.Header>
      {displayData}
    </DataTable>
  )
}
const MainScreen = ({navigation}) => {
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
  const [selectedItem, updateSelectedItem] = useState(blankItem)
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
  const [filterTerm, changeFilterTerm] = useState('')
  function filterData(itemList, searchString) {
    if (searchString !== '') {
    let filteredResults =[];
    for (let item of itemList) {
      if (String(item.item).includes(searchString)) {filteredResults.push(item)}
    }
    return(filteredResults)
  }
  return(itemList)
  }
  getData().then((value) => updateData(value));
  return(
 <View style={styles.container}>
  <StatusBar style="auto" />
  <TextInput
    style={{ height: '10%' }}
    placeholder="Filter List by Item Name"
    onChangeText={value => changeFilterTerm(value)}
  />
  <Inventory data={filterData(data, filterTerm)} selectItem={updateSelectedItem} toggleModal={setModalVisible} sortDirection={sortDirection} sortedColumn={sortedColumn} chooseSort={chooseSort} />
  <Button
    title="Add Item"
    onPress={() => { updateSelectedItem(blankItem); setModalVisible(true);}}
  />
  <ItemInput table = 'inventory' selectedItem={selectedItem} editItem = {updateSelectedItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
  <View>
    <Button
    title = "Go to Shopping List"
    onPress = {() => navigation.navigate('Items that should be in Inventory')}/>
    </View>
</View>
  )
}
const Screen2 = () => {
//data and functions here
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
  const defaultIdealData = [
    {
      id: "3df5a568-8085-40a6-9e37-276cb6454282",
      item: "Eggs",
      amount: 3,
    },
    {
      id: "b3d27605-fa02-49dd-a4d6-6c5b678de76c",
      item: "Milk",
      amount: 2,
    },
  ]
  const blankItem = {
    id: "",
    item: "",
    amount: "",
    bestBeforeDate: new Date()
  };
  const [selectedItem, updateSelectedItem] = useState(blankItem)
  const [modalVisible, setModalVisible] = useState(false);
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
      const newLocal = jsonValue != null ? JSON.parse(jsonValue) : defaultIdealData;
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
//shopping list array

//fucntion for showing missing items

//components
getData().then((value) => updateData(value));
return(
<View style={styles.container}>
<Button
    title="Add Item"
    onPress={() => { updateSelectedItem(blankItem); setModalVisible(true);}}
  />
  <IdealInventory data={data} selectItem={updateSelectedItem} toggleModal={setModalVisible} sortDirection={sortDirection} sortedColumn={sortedColumn} chooseSort={chooseSort} />
  <ItemInput table = 'idealInventory' selectedItem={selectedItem} editItem = {updateSelectedItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
  {//table with just 2 rows, name and amount
  //add item to table button
  //button that creates a missing items list popup
  }
</View>
);
}
export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen
        name = "Home"
        component = {MainScreen}
        />
      <Stack.Screen
      name = "Items that should be in Inventory"
      component = {Screen2}/>
    </Stack.Navigator>
    </NavigationContainer>
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
