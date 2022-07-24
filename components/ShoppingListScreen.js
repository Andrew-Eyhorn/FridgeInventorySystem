/*
Shopping list screen that appears when the go to shopping list screen button is pressed on the main screen. 
Takes in route which gives this screen access to the main inventory data, needed for the generate missing items function. 
Exports the shopping list screen.
*/

import React, { useState} from 'react';
import { StyleSheet, Text, View, Alert, Modal, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemInput from "./ItemInput"
import IdealInventory from './IdealInventory';
const ShoppingListScreen = ({route}) => {
  const [sortDirection, changeSortDirection] = useState('asc')
  const [sortedColumn, changeSortedColumn] = useState('name')
  const {inventoryData} = route.params;
  //this function solves the issue of the table not updating on item deletion, by updating the table twice.
  function updateSort() {
    if (sortDirection === 'asc') {
      changeSortDirection('desc')
      changeSortDirection('asc')
    } else {
      changeSortDirection('asc')
      changeSortDirection('desc')
    }
  }
  //toggles between asending and descending sort order, but defaults to ascending if a new column is selected.
  //takes in the selected column as input
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
   //this data is simply here for testing purposes, the actual solution wouldn't have this default data
  const defaultIdealData = [
    {
      id: "3df5a568-8085-40a6-9e37-276cb6454282",
      name: "Eggs",
      amount: 3,
    },
    {
      id: "b3d27605-fa02-49dd-a4d6-6c5b678de76c",
      name: "Milk",
      amount: 2,
    },
  ]
  //this is used for adding a new item
  const blankItem = {
    id: "",
    name: "",
    amount: "",
    bestBeforeDate: new Date()
  };
  const [selectedItem, updateSelectedItem] = useState(blankItem)
  const [modalVisible, setModalVisible] = useState(false);
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('idealInventory', jsonValue)
    } catch (e) {
      alert("error saving ideal inventory data")
    }
  }
  const getData = async () => {
    try {
      if (data.length > 0) return data
      const jsonValue = await AsyncStorage.getItem('idealInventory')
      const newLocal = jsonValue != null ? JSON.parse(jsonValue) : defaultIdealData;
      return newLocal;
    } catch (e) {
      alert("error loading ideal inventory data")
    }
  }
  const [data, updateData] = useState([])
  function dataUpdate(dataToBeUpdated) {
    updateData(dataToBeUpdated)
    storeData(dataToBeUpdated)
  }
 const [displayedList, updateDisplay] = useState("") 
 const [missingItems, updateMissingItems] = useState([]);
  //fucntion for showing missing items
  function findMissingItems(neededItems, itemList) {
    let missingItems = [];
    for (let neededItem of neededItems) {
      let itemFound = false
      for (let item of itemList) {
        if (neededItem.name === item.name && neededItem.amount > item.amount) {
          missingItems.push({
            name: neededItem.name,
            amount: neededItem.amount - item.amount
          })
          itemFound = true;
          break;
        } else if (neededItem.name === item.name) { itemFound = true; break; }
      }
      if (!itemFound) {
        missingItems.push({
        name: neededItem.name,
        amount: neededItem.amount
      });
    }
    }
    let listDisplay = ""
    for (let item of missingItems) {
       listDisplay += (item.amount + " " + item.name +"\n")
     };
     updateDisplay(listDisplay)
    return missingItems
  }
  const [shoppingListModalShown, toggleShoppingListModal] = useState(false)
  //components
  getData().then((value) => updateData(value));
  return (
    <View style={styles.container}>
      <Button
        title="Add Item"
        onPress={() => { updateSelectedItem(blankItem); setModalVisible(true); }}
      />
       <Button
        title="Generate Missing Items"
        onPress={() => {updateMissingItems(findMissingItems(data, inventoryData)); toggleShoppingListModal(true);}}
      />
      <IdealInventory data={data} selectItem={updateSelectedItem} toggleModal={setModalVisible} sortDirection={sortDirection} sortedColumn={sortedColumn} chooseSort={chooseSort} />
      <ItemInput table='idealInventory' selectedItem={selectedItem} editItem={updateSelectedItem} visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} chooseSort={updateSort}/>
      <Modal
    animationType="slide"
    transparent={true}
    visible={shoppingListModalShown}
    onRequestClose={() => {
      Alert.alert("Modal has been closed.");
      toggleShoppingListModal(!shoppingListModalShown);
    }}>
      <View style={styles.modal}>
  <ScrollView>
    <Text> {displayedList}</Text>
  </ScrollView>
  <Button
        title="Close"
        onPress={() => {toggleShoppingListModal(false)}}
      />
</View>
  </Modal>
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
  
export default ShoppingListScreen