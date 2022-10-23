import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { Input, Button, ListItem, Icon} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('database.db');

export default function MyPlacesScreen({navigation}) {

  const [place, setPlace] = useState('');
  const [places, setPlaces] = useState([]);

  //create table
   useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists places (id integer primary key not null, place text);');
    }, null, updateList);
  }, []);

  //insert place
  const savePlace = () => {
    db.transaction(tx => {
      tx.executeSql('insert into places (place) values (?);', [place]);    
    }, null, updateList
    )
    setPlace('');
    }
  // delete item from table
  const deleteItem = (id) => {
  Alert.alert("Do you want to remove the address?", "The address will be deletd permanently",
      [
        {
          text: "Cancel"
        },
        { text: "OK", onPress: () =>
          db.transaction(tx => {
            tx.executeSql('delete from places where id = ?;', [id]);
          }, null, updateList)
        }
      ]
    );
  };


  // update places
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from places;', [], (_, { rows }) => 
        setPlaces(rows._array)
      );
    }, null, null);
  };

  // render items
  const renderItem= ({ item }) => (
    <ListItem topDivider bottomDivider>
      <ListItem.Content>
        <View style={styles.list}>
          <View style={styles.places}>
            <ListItem.Title numberOfLines={1} onLongPress={() => deleteItem(item.id)}>{item.place}</ListItem.Title>
          </View>
            <ListItem onPress={() => navigation.navigate('Map', {place: item.place})}>
              <Text style={{color: 'grey'}}>show on map</Text>
              <Icon name="place" size={18} color='grey' />
            </ListItem>
        </View>
      </ListItem.Content>
    </ListItem>
  );
  
  return (
    <View style={styles.container}>
      <Input
        placeholder='Type in address'
        label='PLACEFINDER'
        onChangeText={place => setPlace(place)}
        value={place}
      />
      <View style={styles.button}>
        <Button raised icon={{name: 'save'}} onPress={savePlace} title='SAVE' />
      </View>
      <FlatList
        style={styles.renderedList}
        keyExtractor={item => item.id.toString()}
        data={places}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  renderedList: {
    width: '100%'
  },
  list:{
    flexDirection:'row',
    justifyContent: "space-evenly",
    width: 'auto'
  },
  places:{
    flex: 1,
    width: 300,
    padding: 2,
    justifyContent: 'center'
  },
  button: {
    width: '90%',
    backgroundColor: '#a9a9a9',
    margin: 2
  }
});
