import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function MyPlacesScreen({ navigation }) {

    const [place, setPlace] = useState('');
    const [places, setPlaces] = useState([]);

    useEffect(() => {  
        db.transaction(tx => {    
          tx.executeSql('create table if not exists db (id integer primary key not null, place text);');  
        }, null, updateList);
      }, []);
    
      // Save place
      const savePlace = () => {
        db.transaction(tx => {
          tx.executeSql('insert into db (place) values (?, ?);', [place]);    
        }, null, updateList
      )
      setPlace('');
      
    }
    const updateList = () => {
        db.transaction(tx => {
          tx.executeSql('select * from db;', [], (_, { rows }) =>
            setProducts(rows._array)
          ); 
        });
      }
      const deleteItem = (id) => {
        db.transaction(
          tx => {
            tx.executeSql(`delete from db where id = ?;`, [id]);
          }, null, updateList
        )    
      }
      const renderItem = ({item}) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>numberOfLines={1} onLongPress={() => deleteItem(item.id)}{item.place}</ListItem.Title>
          </ListItem.Content>
          <ListItem onPress={() => navigation.navigate('Map', {place: item.place})}>
              <Text style={{color: 'grey'}}>Show on map</Text>
              <Icon name="place" size={18} color='grey' />
            </ListItem>
        </ListItem>
      )
    
      const listSeparator = () => {
        return (
          <View 
            style={{
              height: 5,
              width: '80%',
              backgroundColor: '#fff',
              marginLeft: '10%'
            }} 
          />
        );
      }; 
    
     
   return (  
    <View style={styles.container}>
        
        <Input   
        placeholder='Type in address' 
        label='PLACEFINDER'  
        onChangeText={(place) => setPlace(place)}
        value={place}
        />
        <Button raised icon={{name: 'save'}} 
        onPress={savePlace}
        title="SAVE" 
        
      />
    
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
    image : {
      width: 250,
      height: 100,
      marginTop: 10,
      marginBottom: 10
      
    },
    input : {
      width:200, 
      borderColor: 'gray', 
      borderWidth: 1,
      fontSize: 20,
    },
    button : {
      borderColor: 'gray',
      width: 200,
    }
  });