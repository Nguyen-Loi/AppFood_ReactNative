
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TextInput, View, Image, Button,  Keyboard } from "react-native";
import { Input, Avatar } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../../database/firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
  }),
});
const CreateFood = ({ navigation }) => {
  //Token
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  //State data
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
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
    };
}, []);
  const saveNewFood = async (name, price) => {
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
        await schedulePushNotification('🎉 Đã có món ăn mới' , name+'\nGiá ưu đãi: '+price);
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
    <Button color='red' title='Thêm món ăn' onPress={() => saveNewFood(state.name, state.price)} />
  </View>
  </KeyboardAwareScrollView>
  )
};
async function schedulePushNotification(name, price) {
  await Notifications.scheduleNotificationAsync({
      content: {
          title: name,
          body: price,
          data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
  });
}
//Handle token
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }
      if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
  } else {
      alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
      });
  }

  return token;
}
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