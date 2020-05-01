import React, {useState,useEffect,createRef} from 'react'

import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    KeyboardAvoidingView, 
    FlatList,
    SafeAreaView } from 'react-native'

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import {MaterialIcons} from '@expo/vector-icons'

import db from '../../../db'
import {stringToArray} from '../../utils/stringToArray'

import Lojas from '../../componentes/lojas'




const search = ({navigation}) => {
    const [searchValue, setSearchValue] = useState()
    const [displayData, setDisplayData] = useState()

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        })();
        return
      }, []);


    async function _pickImage(){
        try {
          let file = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!file.cancelled) {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "image/jpeg");

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: file,
            redirect: 'follow'
            };

            fetch("http://3.16.40.249/identify", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                handleChange(result)
            })
            .catch(error => console.log('error', error));
          }
    
        } catch (E) {
          console.log(E);
        }
      };

    
    function handleChange(text){
        let new_display = []
        if(text){
            const re = /,/;
            let filtros = text.split(re).filter(tag => (tag !== ''))
    
            for(let loja=0; loja < db.length;loja++){
                for(let filtro=0; filtro < filtros.length; filtro++){
                    if(db[loja]['produtos'].includes(filtros[filtro].trim())){
                        const found = new_display.some(el => el.id === db[loja].id);
                        if(!found){
                            new_display.push(db[loja]);
                            break
                        }
                    }
                }
            }
            // console.log(filtros, new_display)
        }
        setSearchValue(text)
        setDisplayData(new_display)
    }


    return (

        <View style={styles.container}>
            <View style={styles.takePicture}>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={handleChange}
                    value={searchValue}
                    placeholder="Digite ou tire uma foto!"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {/* <Text>{searchValue}</Text> */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={_pickImage}
                >
                    <MaterialIcons  name="photo-camera" size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChange()}><Text>Limpar</Text></TouchableOpacity>
            </View>
            <SafeAreaView>
                <FlatList
                    data={displayData}
                    keyExtractor={item => String(item.id)}
                    renderItem={
                        ({item}) => (
                            <Lojas loja={item}/>
                        )
                    }
                
                
                />
            </SafeAreaView>
        </View>
        
    )
}

var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"white"
    },
    takePicture:{
        margin:3,
        padding:3,
        flexDirection:'row',
        alignItems: "center",
        justifyContent:"space-around",
        borderColor:"transparent",
        borderWidth:1,
        elevation:2,
        height:80

    },
    searchInput:{
        width:200, 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        margin: 2,
        paddingLeft: 0,
        borderColor:'transparent',
        borderBottomColor:'black'
     },
     button: {
        alignItems: "center",
        justifyContent:"center",
        borderWidth: 1,
        borderColor:"#ccc",
        borderRadius:25,
        padding: 10,
        height:50
      }
  });


export default search
