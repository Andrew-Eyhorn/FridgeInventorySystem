import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text , View, Alert } from 'react-native';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import { Button } from 'react-native-web';
import dayjs from 'dayjs'

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
  const data = [
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
  ]
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
     <Button 
      title = "Add Item"
      onPress = {Alert.alert('egg')}
     >
     </Button> 
      <div className="main">
        <DataTableExtensions
          columns={columns}
          data={data}
          print={false}
          export={false}
        >
          <DataTable
            // columns={columns}
            // data={data}
            noHeader
            // defaultSortField="id"
            // defaultSortAsc={false}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
        </div>
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
});
