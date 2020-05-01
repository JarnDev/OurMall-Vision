import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { stringToArray } from '../utils/stringToArray';
import { FlatList } from 'react-native-gesture-handler';

function Lojas({ loja }) {
    return (
      <View style={styles.item}>

          <View style={styles.title}>
             <Text style={styles.textitle}>{loja.titulo}</Text>
          </View>
          
          <View style={styles.rightSeparator}>

            <View style={styles.description}>
                <Text numberOfLines={4} style={styles.descriptiontext}>{loja.description}</Text>
            </View>
            
            <FlatList
                    data={loja.produtos}
                    keyExtractor={item => String(item)}
                    renderItem={
                        ({item}) => (
                        <Text style={styles.tags}>{item}</Text>
                        )
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{flexGrow: 0, borderTopWidth:1, borderTopColor:'black'}}
                />

          </View>
      </View>
    );
  }

  var styles = StyleSheet.create({
      item: {
        backgroundColor: '#eee',
        marginVertical: 8,
        marginHorizontal: 16,
        height:100,
        flexDirection: 'row',
        elevation:3,
      },
      rightSeparator:{
        flexDirection:'column',
        flex:1
      },    
      title:{
        flex:.4,
        width:100,
        alignItems:"center",
        justifyContent:"center",
        borderRightColor:'blue',
        borderRightWidth:2,
        backgroundColor:'#000'
      },
      textitle: {
        fontSize: 20,
        color:'#fff'
      },
      description:{
        flex:1,
        padding:5,
        
        
      },
      descriptiontext:{
          fontSize:12,
          justifyContent:'center',
          alignItems:'center',
          paddingHorizontal:5

      },
      tags:{
          fontSize:10,
          margin:5,
          padding:3,
          backgroundColor:'purple',
          height:20,
          color:'#fff',
          flex:.1
      }
  });





export default Lojas
