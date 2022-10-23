import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, useState } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function MyPlacesScreen({ route, navigation }) {

    const{ data } = route.params;
    const [place, setPlace] = useState('');
    const [places, setPlaces] = useState([]);

    useEffect(() => {  
        db.transaction(tx => {    
          tx.executeSql('create table if not exists (id integer primary key not null, place text);');  
        }, null, updateList);
      }, []);
    
      // Save product
      const savePlace = () => {
        db.transaction(tx => {
          tx.executeSql('insert into places (place) values (?, ?);', [place]);    
        }, null, updateList
      )
      setPlace('');
      
    }
    const updateList = () => {
        db.transaction(tx => {
          tx.executeSql('select * from places;', [], (_, { rows }) =>
            setProducts(rows._array)
          ); 
        });
      }
      const deleteItem = (id) => {
        db.transaction(
          tx => {
            tx.executeSql(`delete from products where id = ?;`, [id]);
          }, null, updateList
        )    
      }
      const renderItem = ({item}) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.place}</ListItem.Title>
              <ListItem.Subtitle>"test"</ListItem.Subtitle>
          </ListItem.Content>
          <Icon type='material' name='delete' color='red' onPress={ () => deleteItem(item.id)} />
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
        <Text style={styles.text}>My Places</Text>
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
    <Button style={styles.button}onPress={() => navigation.navigate('Map', {data: data})} title="Map"/>  
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
    text : {
      fontSize: 20,
    }
  });