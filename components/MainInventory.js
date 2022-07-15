/*
Component that displays the inventory data in a table. Takes in the follwing props:
-data - the data that is being displayed
-sortdirections - to know which direction the displayed data should be sorted
-sortedColumn - to know by what property the data is being sorted
-selectItem() - allows double clicking to select an item
-toggle mdoal, - give this compoenent access to showing the item input component. 
-chooseSort - allows the table to change the sortedColumn
Exports a table with 3 columns, sorted by one of the 3 columns. 
*/
import React from 'react';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs'
const lodash = require("lodash");
const Inventory = (props) => {
    function sortData(column) {
      if (column === 'name') {
        return lodash.orderBy(props.data, [item => item.name.toLowerCase()], props.sortDirection)
      } else {
        return lodash.orderBy(props.data, column, props.sortDirection)
      }
    }
    function displaySort(column) {
      if (column === props.sortedColumn) {
        if (props.sortDirection === 'asc') {
          return 'ascending'
        } else { return 'descending' }
      } else { return null }
    }
    const sortedData = sortData(props.sortedColumn)
    const displayData = sortedData.map((item) =>
      <DataTable.Row onPress={() => {
        props.selectItem(item);
        props.toggleModal(true)
      }} key={item.id}>
        <DataTable.Cell>{item.name}</DataTable.Cell>
        <DataTable.Cell>{item.amount}</DataTable.Cell>
        <DataTable.Cell>{dayjs(item.bestBeforeDate).format('DD/MM/YYYY')}</DataTable.Cell>
      </DataTable.Row>)
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title sortDirection={displaySort('name')} onPress={() => props.chooseSort('name')}>Item</DataTable.Title>
          <DataTable.Title sortDirection={displaySort('amount')} onPress={() => props.chooseSort('amount')}>Amount</DataTable.Title>
          <DataTable.Title sortDirection={displaySort('bestBeforeDate')} onPress={() => props.chooseSort('bestBeforeDate')}>Best Before Date</DataTable.Title>
        </DataTable.Header>
        {displayData}
      </DataTable>
    )
  }
export default Inventory