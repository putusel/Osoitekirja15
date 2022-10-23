import { React} from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Dimensions } from 'react-native';
import MapView, { Marker } from'react-native-maps';
import * as Location from'expo-location';

export default function MapScreen({ navigation }) {
  
  const [location, setLocation] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.0322, longitudeDelta: 0.0221 }); // State where location is saved  
  const [search, setSearch] = useState('');
  const apikey = '9CZ5yt0C4TcCgBMqY6HffGPrdansAJrG';
  const url = 'http://www.mapquestapi.com/geocoding/v1/address?'
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to get location')
          return;
        }

        let position = await Location.getCurrentPositionAsync({});
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221
        }
        
        setLocation(location);
      })();
    }, []);

      const getLocation = async () => {
      const response = await fetch(`${url}key=${apikey}&location=${search}`); 
      const data = await response.json();

      let location = {
        latitude: data.results[0].locations[0].latLng.lat,
        longitude: data.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      }
        setLocation(location)
      }
      
  return (
    <View style={styles.container}>
      <MapView  
        style={styles.map}   
        region={location}>
        <Marker
          coordinate={location}
          title={search} />
      </MapView>
      <View>
        <TextInput 
          placeholder="enter a location" 
          style={styles.input} 
          onChangeText={search => setSearch(search)}/>
        <View 
          style={{ width:Dimensions.get("window").width * 1.0, flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
         <Button 
          onPress={getLocation} 
          title="Show">
        </Button>
        </View>
      </View>
      <StatusBar style="auto" />
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
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  input: {
    borderWidth: 1,
    height: 40,
    justifyContent: 'center'
  }
});