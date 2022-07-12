//Shopping List Screen. A screen that displays 

import React, { useState} from 'react';
import { StyleSheet, Text, View, Alert, Modal, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemInput from "./ItemInput"
import IdealInventory from './IdealInventory';
const ShoppingListScreen = ({route}) => {
  //data and functions here
  const [sortDirection, changeSortDirection] = useState('asc')
  const [sortedColumn, changeSortedColumn] = useState('bestBeforeDate')
  const {inventoryData} = route.params;
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
      name: "Eggs",
      amount: 3,
    },
    {
      id: "b3d27605-fa02-49dd-a4d6-6c5b678de76c",
      name: "Milk",
      amount: 2,
    },
  ]
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
      // saving error
    }
  }
  const getData = async () => {
    try {
      if (data.length > 0) return data
      const jsonValue = await AsyncStorage.getItem('idealInventory')
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
    return missingItems
  }
  let [missingItems, updateMissingItems] = useState([]);
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
      <ItemInput table='idealInventory' selectedItem={selectedItem} editItem={updateSelectedItem} action='add' visibility={modalVisible} dataUpdate={dataUpdate} toggleModal={setModalVisible} data={data} />
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
    <Text>{JSON.stringify(missingItems, null, 4)}</Text>
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