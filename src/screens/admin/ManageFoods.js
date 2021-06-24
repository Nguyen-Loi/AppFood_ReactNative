import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, Button } from 'react-native';
import firebase from '../../database/firebase';
import { Input, Avatar, Card } from 'react-native-elements';
import Loading from '../Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ManageFoods = (props) => {
    const initialState = {
        id: '',
        name: '',
        linkImage: '',
        price: '',
        amount: '',
        description: ''

    }
    const [food, setFood] = useState();
    const [loading, setLoading] = useState(true)


    const getFoodById = async (id) => {
        const dbRef = firebase.db.collection('foods').doc(id);
        const doc = await dbRef.get();
        const food = doc.data();

        setFood({
            ...food,
            id: doc.id
        })
        setLoading(false);
    }
    useEffect(() => {
        getFoodById(props.route.params.foodId);
    }, [])
    const handleChangeText = (name, value) => {
        setFood({ ...food, [name]: value })
    }
    const deleteFood = async () => {
        const dbRef = firebase.db.collection('foods').doc(props.route.params.foodId);
        await dbRef.delete();
        props.navigation.navigate('FoodAdmin');
    }
    const openConfirmationAlert = () => {
        Alert.alert('Remove this food?', 'Are you sure? ', [
            { text: 'Yes', onPress: () => deleteFood() },
            { text: 'No', onPress: () => console.log(false) },
        ])
    }
    const updateFood = async () => {
        const dbRef = firebase.db.collection('foods').doc(props.route.params.foodId);
        await dbRef.set({
            name: food.name,
            linkImage: food.linkImage,
            price: food.price,
            sold: food.sold,
            description: food.description,
            view: food.view,
            amount: food.amount,
            createdAt: food.createdAt
        })
        setFood(initialState);
        props.navigation.navigate('FoodAdmin');
    }

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Title */}
                <View style={styles.header}>
                    <Avatar rounded style={styles.sImage} source={{ uri: (food.linkImage) }} />
                </View>
                {/* body */}
                <View style={styles.body}>
                    <Card>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Ngày tạo: {food.createdAt}</Text>
                            <Text style={{ marginLeft: 64 }}>Đã bán: {food.sold}</Text>
                        </View>
                        <Text style={{ textAlign: 'right' }}>Lượt xem: {food.view}</Text>
                    </Card>
                    <View style={{ marginTop: 20 }}>
                        <Input label="Tên món ăn" placeholder='Tên món ăn' value={food.name} autoCorrect={false} leftIcon={{ type: 'material', name: 'forum', }} onChangeText={(value) => handleChangeText('name', value)} />
                        <Input label="Hình ảnh món ăn" placeholder='Đường dẫn' value={food.linkImage} autoCorrect={false} leftIcon={{ type: 'material', name: 'polymer', }} onChangeText={(value) => handleChangeText('linkImage', value)} />
                        <Input keyboardType='number-pad' label="Giá món ăn" placeholder='0' value={food.price} autoCorrect={false} leftIcon={{ type: 'material', name: 'euro', }} onChangeText={(value) => handleChangeText('price', value)} />
                        <Input keyboardType='number-pad' label="Số lượng" placeholder='0' value={food.amount} autoCorrect={false} leftIcon={{ type: 'material', name: 'dock', }} onChangeText={(value) => handleChangeText('amount', value)} />
                        <Input multiline numberOfLines={8} label="Mô tả" maxLength={500} value={food.description} autoCorrect={false} placeholder='Mô tả' leftIcon={{ type: 'material', name: 'description', }} onChangeText={(value) => handleChangeText('description', value)} />
                    </View>
                </View>
                {/* footer */}
                <View style={styles.footer}>

                </View>

            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 70 }}>
                <View style={styles.vUpdate}>
                    <Button color='white' title='Update food' onPress={() => updateFood()} />
                </View>
                <View style={styles.vDetele}>
                    <Button color='white' title='Delete food' onPress={() => openConfirmationAlert()} />
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flex: 3,
        alignItems: 'center'
    },
    body: {
        flex: 5,
        marginTop: 30
    },
    footer: {
        flex: 0.2
    },
    sImage: {
        resizeMode: 'stretch',
        width: 230,
        height: 140
    },
    vUpdate: {
        backgroundColor: 'green',
        borderRadius: 20
    },
    vDetele: {
        backgroundColor: 'red',
        borderRadius: 20
    }
})
export default ManageFoods;


