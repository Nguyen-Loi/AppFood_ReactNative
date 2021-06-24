import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, SafeAreaView, ScrollView, LogBox, Dimensions } from 'react-native';
import { Divider, Card, ListItem, Avatar } from 'react-native-elements';
import firebase from '../../database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');
const Home = (props) => {
    var i = 0;
    const [food, setFood] = useState([]);
    const [dataHead, setDataHead] = useState([]);
    const [dateFood, setDateFood] = useState([]);
    const [viewFood, setViewFood] = useState([]);
    const [soldFood, setSoldFood] = useState([]);
    const [fQuery, setfQuery] = useState()
    const _searchItem = () => {
        props.navigation.navigate('List');
    }
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        firebase.db.collection('foods')
        .onSnapshot(querySnapshot => {
            const food = [];
            querySnapshot.docs.forEach(doc => {

                const { name, linkImage, price, sold,  view, amount, createdAt } = doc.data();
                food.push({
                    id: doc.id,
                    name,
                    linkImage,
                    price,
                    sold,
                    view,
                    amount,
                    createdAt
                })
            });
            let getSoldFood = food.sort(function (x, y) {
                return y.sold - x.sold;
            })
            //get data form firebase
            setFood(food);
            console.log(food);
            //sort by date
            let dateFood = food.filter(item => {
                return item.view > 10;
            })
            setDateFood(dateFood);
            //Sort by sold
            var arrHead = [];
            var arrSold = [];
            var arrView = [];
            var count = 0;
            for (let i = 0; i < getSoldFood.length; i++) {
                count++;
                if (count < 7) {
                    arrHead.push(getSoldFood[i]);
                }
                if (count % 2 == 0 && count < 21 && count >= 7) {
                    arrSold.push(getSoldFood[i]);
                }
                else if (count % 2 != 0 && count < 21 && count >= 7) {
                    arrView.push(getSoldFood[i]);
                }
            }
            setDataHead(arrHead);
            setSoldFood(arrSold);
            //Handle view
            setViewFood(arrView);
        })
    }, [])


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => _searchItem()}>
                <View style={styles.header}>

                    <TextInput
                        placeholder="Bạn muốn tìm gì..."
                        placeholderTextColor="gray"
                        value={fQuery}
                        style={styles.input}
                    />

                    <FontAwesome style={{ paddingHorizontal: 10 }} name='search' size={24} color='black' />

                </View>
            </TouchableOpacity>
            {/* body here */}

            <ScrollView>
                <View style={{ height: 170,   backgroundColor: '#FFFFCC' }}>
                    <Swiper showsButtons={true} 
                    autoplay={true}
                    showsPagination={false}
                    style={{ backgroundColor: '#FFFFCC' }}
                    >
                        {
                            dataHead.map(item => {
                                return (
                                    <ListItem key={item.id} bottomDivider
                                    onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                        <Avatar style={{ width: '100%', height: 190}}  source={{ uri: (item.linkImage) }} />  
                                    </ListItem>
                                )
                            })
                        }
                    </Swiper>
                </View>
                <Text style={styles.fText}>Gợi ý hôm nay</Text>


                        <SafeAreaView >
                            <FlatList showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                // keyExtractor={food => food.id}
                                data={dateFood}
                                renderItem={({ item }) => {
                                    return (
                                        <View>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                                <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 130, height: 140, marginLeft: 20, resizeMode: 'stretch' }} />
                                                <Text style={{ textAlign: 'center',  fontSize: 18, fontWeight: 'bold', marginRight: 30, marginTop: 6 }}>{item.name}</Text>
                                                <Text style={{ textAlign: 'center', marginLeft: 10,marginRight: 60, color: 'red'}}>đ{item.price}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}

                            />
                        </SafeAreaView>

                <Text style={styles.fText}>Các món ăn nổi bật</Text>
                {/* Product hot */}

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {/* 5 product hot */}
                    <View style={{ flex: 1, }}>
                        <SafeAreaView  >
                            <FlatList
                                // keyExtractor={food => food.id}
                                data={viewFood}
                                renderItem={({ item }) => {

                                    return (

                                        <View style={styles.item}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                                <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 165, height: 180, marginLeft: 0, resizeMode: 'stretch' }} />
                                                <Divider style={{ backgroundColor: 'white' }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>đ{item.price}</Text>
                                                    <Text style={{ marginLeft: 60, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    )
                                }}

                            />
                        </SafeAreaView>
                    </View>
                    {/* 5 product hot after */}
                    <View style={{ flex: 1 }}>
                        <SafeAreaView >
                            <FlatList
                                // keyExtractor={food => food.id}
                                data={soldFood}
                                renderItem={({ item }) => {

                                    return (
                                        <View style={styles.item}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                                <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 165, height: 180, marginLeft: 0, resizeMode: 'stretch' }} />
                                                <Divider style={{ backgroundColor: 'white' }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>đ{item.price}</Text>
                                                    <Text style={{ marginLeft: 60, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}

                            />
                        </SafeAreaView>
                    </View>
                </View>

            </ScrollView>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFCC'
    },
    tinyLogo: {
        width: 377,
        height: 120,
    },
    fText: {
        color: '#EE0000',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 40,
        marginBottom: 15,
        marginLeft: 8

    },
    item: {
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#FFFF66'
    },
    input: {
        height: 45,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
    },
    header: {
        height: 70,
        width: '100%',
        backgroundColor: '#ff5b77',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    wrapper: {
        width: 40,
        height: 40
    },
   
});
export default Home;