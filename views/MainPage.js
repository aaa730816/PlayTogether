import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import MCV from '../MCV';
import colors from '../Colors';
import CommonString from '../resource/CommonString';
import ConversitionUtil from './utils/ConversitonUtil';
import ChatView from "./message/ChatView";
import JPushModule from "jpush-react-native";
import JPushUtils from './utils/JPushUtils';

var pingPongIcon = require('../images/pingpong.png');
var chessIcon = require('../images/chess.png');
const sections = [
    {
        key: 1,
        title: '篮球',
        icon: 'ios-basketball',
        component: 'Sport',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'basketball'
    }, {
        key: 2,
        title: '足球',
        icon: 'ios-football',
        component: 'Sport',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'football'
    }, {
        key: 3,
        title: '乒乓球',
        icon: 'table-tennis',
        component: 'Sport',
        source: pingPongIcon,
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: true,
        type: 'table-tennis'
    }, {
        key: 4,
        title: '网球',
        icon: 'ios-tennisball',
        component: 'Sport',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'tennis'
    }, {
        key: 5,
        title: '棋牌',
        icon: 'chess-knight',
        component: 'Chess',
        source: chessIcon,
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: true,
        type: 'chess'
    }, {
        key: 6,
        title: '娱乐',
        icon: 'ios-film',
        component: 'Recreation',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'recreation'
    }, {
        key: 7,
        title: '电子竞技',
        icon: 'ios-game-controller-b',
        component: 'Game',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'game'
    }, {
        key: 8,
        title: '约饭',
        icon: 'ios-pizza',
        component: 'Meal',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'meal'
    }, {
        key: 9,
        title: '其他',
        icon: 'ios-more',
        component: 'Others',
        isFA: false,
        size: 50,
        tabName: CommonString.DateTabName,
        isLocal: false,
        type: 'other'
    }
];
const openNotificationEvent = 'openNotification';
export default class MainPage extends Component {
    didFocusListener;
    didBlurListener;
    static navigationOptions = {
        title: CommonString.MainPage,
        tabBarLabel: CommonString.DateTabName
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var _this = this;
        console.log('main componentDidMount')
        this.didFocusListener = this.props.navigation.addListener('didFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', _this.handleBack)
        })
        this.didBlurListener = this.props.navigation.addListener('didBlur', payload => {
            BackHandler.removeEventListener('hardwareBackPress', _this.handleBack)
        })
        AsyncStorage.getItem('user').then(value => {
            if (value != '' && value != undefined) {
                var user = JSON.parse(value);
                global.userId = user.userId
                global.userName = user.userName.length > 15 ? user.userName.slice(0, 15) + '...' : user.userName
                global.nickName = user.nickName
            }
            if (Platform.OS === 'android') {
                JPushModule.initPush()
                JPushModule.notifyJSDidLoad(resultCode => {
                    if (resultCode === 0) {
                    }
                })
            } else {
                JPushModule.setupPush()
            }
            JPushModule.addReceiveOpenNotificationListener(map => {
                console.log('Opening notification!')
                console.log('map.extra: ' + map.extras)
                let event = JSON.parse(map.extras);
                this.props.navigation.navigate('ChatView', {
                    event: event
                });
            })
            JPushUtils.setAlias();
            global.sockets = {};
            global.events = [];
            AsyncStorage.getItem('events').then(events => {
                if (events != undefined && events != '') {
                    events = JSON.parse(events);
                    global.events = events;
                    ConversitionUtil.openWsServer(events);
                }
            })
        })

    }

    componentWillUnmount() {
        for (let i in global.sockets) {
            sockets[i].close();
        }
        this.didBlurListener.remove();
        this.didFocusListener.remove();
        console.log('main componentWillUnmount')
        console.log('Deleting alias')
        JPushUtils.removeAlias();
        JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent)
        console.log('Will clear all notifications')
        JPushModule.clearAllNotifications()
    }

    handleBack = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    }

    render() {
        let boxs = sections.map((item, index) => {
            return (
                <TouchableOpacity key={item.key} style={MCV.touchBox} onPress={() => this.goToDateList(item)}>
                    <View style={MCV.boxContainer}>
                        {item.isFA ? <IconFA size={item.size} name={item.icon}></IconFA> : (item.isLocal ?
                            <Image style={MCV.iconStyle} source={item.source}></Image> :
                            <Icon size={item.size} name={item.icon}></Icon>)}
                        <Text>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={MCV.mainPageContainer}>
                    <StatusBar backgroundColor={colors.MaterialRed}/>
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
