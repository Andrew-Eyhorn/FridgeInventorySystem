import { StatusBar } from 'expo-status-bar';
import React, { useState} from 'react';
import { StyleSheet, View,TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemInput from './ItemInput';
import Inventory from "./MainInventory"
const MainScreen = ({ navigation }) => {
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
        name: "Beans",
        amount: 1988,
        bestBeforeDate: "2020-01-15"
      },
      {
        id: "4880dc0f-3040-4573-8ced-8127b698a8fe",
        name: "Eggs",
        amount: 5,
        bestBeforeDate: "2021-07-29"
      },
      {
        id: "c9af5a25-d7ee-422a-b260-ce502a271c0f",
        name: "Milk",
        amount: 5,
        bestBeforeDate: "2021-05-21"
      },
    ]
    const [modalVisible, setModalVisible] = useState(false);
    const blankItem = {
      id: "",
      name: "",
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
        if (data.length > 0) return data
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
        let filteredResults = [];
        for (let item of itemList) {
          if (String(item.name).toLowerCase().includes(searchString.toLowerCase())) { filteredResults.push(item) }
        }
        return (filteredResults)
      }
      return (itemList)
    }
    getData().then((value) => updateData(value));
    return (
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
          onPress={() => { updateSelectedItem(blankItem); setModalVisible(true); }}
        />
        <ItemInput table='inventory' selectedItem={selectedItem} editItem={updateSelectedItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
        <View>
          <Button
            title="Go to Shopping List"
            onPress={() => navigation.navigate('Items that should be in Inventory', {inventoryData: data,})} />
        </View>
      </View>
    )
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
  
  export default MainScreen;

