import React, {useState,useEffect,createRef} from 'react'
import ToastNotification from 'react-native-toast-notification'

import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    KeyboardAvoidingView, 
    FlatList,
    Dimensions,
    SafeAreaView } from 'react-native'

import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import {MaterialIcons} from '@expo/vector-icons'

import db from '../../../db'
import {stringToArray} from '../../utils/stringToArray'

import Lojas from '../../componentes/lojas'




const search = ({navigation}) => {
    const [searchValue, setSearchValue] = useState()
    const [displayData, setDisplayData] = useState(db)
    const [ showToast, setShowToast] = useState(false)
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
                handleChange(result,true)
            })
            .catch(error => console.log('error', error));
          }
    
        } catch (E) {
          console.log(E);
        }
      };

    
    function handleChange(text, ML=false){
        let new_display = []

        if(text !== ''){
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
            setDisplayData(new_display)
        }else{
            setDisplayData(db)
        }
        setSearchValue(text)
        if(new_display.length===0 && ML) {
            setShowToast(true)
        }
    }

    return (

        <>
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
                    // onPress={toast}
                >
                    <MaterialIcons  name="photo-camera" size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChange()}><Text>Limpar</Text></TouchableOpacity>
            </View>
            <>
            { displayData.length!==0?
                (
                    <SafeAreaView style={{flex:1}}>
                        <FlatList
                            data={displayData}
                            keyExtractor={item => String(item.id)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={
                                ({item}) => (
                                    <Lojas loja={item}/>
                                )
                            }
                            // style={{height:Dimensions.get('window').height-100}}
                        
                        />
                    </SafeAreaView>
                )    
                    :
                (
                    <View style={styles.alt}><Text style={styles.altText}>Item não consta no catálogo de nossas lojas!</Text></View>
                )
        
            }
            
            </>
        </View>
        
        { showToast?
            (
            <ToastNotification
                textStyle={{ color: 'white' }}
                style={{ backgroundColor: 'red' , padding:10}}
                text="Item não consta no catálogo de nossas lojas :("
                duration={2000}
                onHide={() => setShowToast(false)}
                positionValue={300}
            />
            )
            :
            null 
        }
        </>
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
      },
      alt:{
          flex:1,
          justifyContent:"center",
          alignItems:"center",
          

      },
      altText:{
          color:'rgba(255,0,0,.5)'
      }
  });


export default search
