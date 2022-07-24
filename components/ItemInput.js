/*
Code for generating a modal that allows the user to input or edit item information for either the main or ideal inventory. 
Inputs: props: 
selectedItem(will be blank if not editing, otherwise has the data fo the item being edited), 
editItem function,
visiblity - to determine whether the modal is shown or hidden, 
table - to know which inventory is being edited
data - the daata thats being edited
dataupdate - to update the edited daata so the table is displayed.
toggleModal - function for toggling the modal
Output: 
Modal that can add, edit or delte items to the inventories.
*/

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Modal, TextInput, Button} from 'react-native';
import uuid from 'react-native-uuid';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs'
const lodash = require("lodash");
const ItemInput = (props) => {
  useEffect(() => {
    validation()
  }, [props.selectedItem])
  //onTextChanged function serves as validation for the item amount, by making sure any non-numerical characters are removed. 
  //Function takes in the text in the item amount field. Doesn't need to return anything because it updates the data which is a state.s
  function onTextChanged(text) {
    props.editItem((prevstate) => ({
      ...prevstate,
      amount: text.replace(/[^0-9]/g, '')
    }
    ))
  }
  const [validInput, validateInput] = useState(false)
  //This function makes sure the inputs aren't balnk. IF they are blank, then the user shouldn't be able to submit the item adding/editing.
  function validation() {
    let isValid = false;
    if (props.selectedItem.name.trim() !== '' && props.selectedItem.amount.toString().trim() !== '') {
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
      props.toggleModal(false);
    }}
  >
    <View style={styles.modal}>
      <Text>Enter Info</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter Name of Item"
        maxLength = {50}
        onChangeText={newText => props.editItem((prevstate) => ({
          ...prevstate,
          name: newText
        }
        ))}
        value={props.selectedItem.name}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter Amount of this Item"
        keyboardType='numeric'
        maxLength = {15}
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
      />}
      <Button
        title='Confirm'
        onPress={() => {
          props.toggleModal(false);
          if (props.selectedItem.id === '') {
            if (props.table === 'inventory') {
              props.data.push({
                id: uuid.v4(),
                name: props.selectedItem.name.toString(),
                amount: parseInt(props.selectedItem.amount),
                bestBeforeDate: props.selectedItem.bestBeforeDate.toString()
              });
            }
            else {
              props.data.push({
                id: uuid.v4(),
                name: props.selectedItem.name.toString(),
                amount: parseInt(props.selectedItem.amount),
              });
            }
          } else {
            let editedItem = props.data.find(row => row.id === props.selectedItem.id);
            editedItem.name = props.selectedItem.name.toString();
            editedItem.amount = parseInt(props.selectedItem.amount);
            if (props.table === 'inventory') { editedItem.bestBeforeDate = props.selectedItem.bestBeforeDate; }
          }
          props.dataUpdate(props.data);
          props.chooseSort(); 
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
          color="#ff0000"
          onPress={() => Alert.alert(
            "Item Deletion",
            "Are you sure you want to delete item " + props.selectedItem.name + " from the inventory?",
            [
              { text: "Cancel", style: 'cancel' },
              { text: "Delete Item", color: "#FF0000", onPress: () => { props.toggleModal(false); lodash.remove(props.data, item => item.id === props.selectedItem.id); props.dataUpdate(props.data); props.chooseSort(); }}
            ]
          )}

        />
      }

    </View>
  </Modal>)
}

const styles = StyleSheet.create({
    modal: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      height: '100%',
      width: '100%'
    },
    textInput: {
      height: '5%',
      borderWidth: 1,
      margin: 3,
      padding: 3,
    }
  });

  export default ItemInput;