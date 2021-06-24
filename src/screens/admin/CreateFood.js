import { size } from "lodash";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, TextInput, View, Image, Button,  Keyboard } from "react-native";
import { Input, Avatar } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from '../../database/firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const CreateFood = ({ navigation }) => {
  const [state, setState] = useState({
    name: '',
    linkImage: '',
    price: '',
    amount: '',
    description: '',
   
  })
  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value })
  }
  const saveNewFood = async () => {
    if (state.name === '' || state.linkImage === '' || state.price === ''
      || state.sold === '' || state.description === '') {
      alert('Bạn không được để trống!');
    }
    else {
      try {
        await firebase.db.collection('foods').add({
          name: state.name,
          linkImage: state.linkImage,
          price: state.price,
          sold: 0,
          description: state.description,
          view: 0,
          amount: state.amount,
          createdAt: new Date().toLocaleDateString()
        })
        navigation.navigate('FoodAdmin');
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <KeyboardAwareScrollView   style={styles.container}>
      <ScrollView style={{marginBottom: 140}}>
          <View style={styles.body2}>
          <Input label="Tên món ăn" placeholder='Tên món ăn'  autoCorrect={false}  leftIcon={{ type: 'material', name: 'forum', }} onChangeText={(value) => handleChangeText('name', value)} />
          <Input label="Hình ảnh món ăn" placeholder='Đường dẫn'  autoCorrect={false}  leftIcon={{ type: 'material', name: 'polymer', }} onChangeText={(value) => handleChangeText('linkImage', value)} />
          <Input keyboardType='number-pad' label="Giá món ăn" placeholder='0'  autoCorrect={false}  leftIcon={{ type: 'material', name: 'euro', }} onChangeText={(value) => handleChangeText('price', value)} />
          <Input keyboardType='number-pad' label="Số lượng" placeholder='0'  autoCorrect={false}  leftIcon={{ type: 'material', name: 'dock', }} onChangeText={(value) => handleChangeText('amount', value)} />
           <Input  multiline numberOfLines={8}  label="Mô tả" maxLength={500} autoCorrect={false} placeholder='Mô tả' leftIcon={{ type: 'material', name: 'description', }} onChangeText={(value) => handleChangeText('description', value)} />
          </View>
          {/* Handle Button */}
          
          {/* Handle button register */}


    </ScrollView>
    <View style={styles.sButton}>
    <Button color='red' title='Thêm món ăn' onPress={() => saveNewFood()} />
  </View>
  </KeyboardAwareScrollView>
  )
};

const styles = StyleSheet.create({
  sT1: {
    color: 'white',
    fontSize: 17
  },
  sT2: {
    color: 'green',
    fontSize: 17,
    fontWeight: 'bold'
  },
  sButton: {
    backgroundColor: '#66FF66',
    fontSize: 20,
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20
  },
  container: {
    flex: 1,
    padding: 20
    
  },
  body2: {
    marginTop: 10,

  },
  image: {
    flex: 1,
    resizeMode: "cover",

    padding: 30,

  },
  imageIcon: {
    width: 180,
    height: 80,
    marginTop: 10
  },
  textIn: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    height: 40,
    color: 'black',
    fontSize: 20,
    marginTop: 5
  },
  textIn2: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
   
  }
});

export default CreateFood;