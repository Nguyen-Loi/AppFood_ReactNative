import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Dimensions, Text } from 'react-native';
import firebase from '../../database/firebase';
import Loading from '../Loading';
import { ListItem, Avatar } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window');

const ManageCart = ({ navigation }) => {
    const [foodCart, setFoodCart] = useState([]);
    useEffect(() => {
        firebase.db.collection('invoice')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const foodCart = [];
                querySnapshot.docs.forEach(doc => {

                    const { createdAt, status, idUser, total, key } = doc.data();
                    foodCart.push({
                        id: doc.id,
                        createdAt,
                        status,
                        idUser,
                        total,
                        key
                    })
                });

                setFoodCart(foodCart);
            })
    }, [])
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', backgroundColor: 'orange', paddingHorizontal: 20, padding: 20, justifyContent: 'center' }}>
                <Text style={styles.tt}><FontAwesome name='shopping-cart' size={23} color='white' /> Quản lý người dùng</Text>
            </View>
            {
                foodCart.map(item => {
                    return (
                        <ListItem key={item.id} bottomDivider
                            onPress={() => navigation.navigate('ManageHistoryDetail', { key: item.key, userId: item.idUser })}>

                            <Avatar rounded style={styles.sAvatar} source={require('../../images/cart.png')} />
                            <ListItem.Content>
                                <ListItem.Title>{item.status}</ListItem.Title>
                                <ListItem.Subtitle style={{ paddingTop: 10, color: 'red' }}>đ{item.total}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    )
                })
            }
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },


    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        fontSize: 16,
        color: 'gray',
    },

    sAvatar: {
        width: 80,
        height: 80
    }
});


export default ManageCart;
