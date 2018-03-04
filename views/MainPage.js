import React, { Component } from 'react';
import {
    View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCV from '../MCV';
import colors from '../Colors';
import CommonString from '../resource/CommonString';
var pingPongIcon = require('../images/pingpong.png');
var chessIcon = require('../images/chess.png');
const sections = [
    {
        key: 1,
        title: '篮球',
        icon: 'ios-basketball',
        component: 'Sport',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 2,
        title: '足球',
        icon: 'ios-football',
        component: 'Sport',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 3,
        title: '乒乓球',
        icon: 'table-tennis',
        component: 'Sport',
        source: pingPongIcon,
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: true
    }, {
        key: 4,
        title: '网球',
        icon: 'ios-tennisball',
        component: 'Sport',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 5,
        title: '棋牌',
        icon: 'chess-knight',
        component: 'Chess',
        source: chessIcon,
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: true
    }, {
        key: 6,
        title: '娱乐',
        icon: 'ios-film',
        component: 'Recreation',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 7,
        title: '电子竞技',
        icon: 'ios-game-controller-b',
        component: 'Game',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 8,
        title: '约饭',
        icon: 'ios-pizza',
        component: 'Meal',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }, {
        key: 9,
        title: '其他',
        icon: 'ios-more',
        component: 'Others',
        isFA: false,
        size:50,
        tabName:CommonString.DateTabName,
        isLocal: false
    }
]
export default class MainPage extends Component {
    static navigationOptions = {
        title: '首页',
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: CommonString.DateTabName
    }
    render() {
        let boxs = sections.map((item, index) => {
            return (
                <TouchableOpacity key={item.key} style={MCV.touchBox} onPress={() => this.goToDateList(item)}>
                    <View style={MCV.boxContainer}>
                        {item.isFA ? <IconFA size={item.size} name={item.icon}></IconFA> : (item.isLocal ? <Image style={MCV.iconStyle} source={item.source}></Image> : <Icon size={item.size} name={item.icon}></Icon>)}
                        <Text>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={MCV.mainPageContainer}>
                    <StatusBar backgroundColor={colors.MaterialRed} />
                    {boxs}
                </View>
            </ScrollView>
        )
    }
    goToDateList = (item) => {
        this.props.navigation.navigate('DateList', {
            item: item
        })
    }
}
