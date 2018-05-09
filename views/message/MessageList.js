import React, {Component} from 'react';
import {View, FlatList, Text, TouchableOpacity, AsyncStorage, DeviceEventEmitter, AppState} from 'react-native';
import MCV from '../../MCV';
import ConversitonUtil from "../utils/ConversitonUtil";

var eventType = {
    'activity': '活动',
    'equipment': '器材'
}
export default class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }

    componentDidMount() {
        if (global.userId != '' && global.userId != undefined) {
            this.setState({data: global.events})
        }
        console.log(AppState.currentState);
        this.receiveEventEmitter = DeviceEventEmitter.addListener('ReceiveEvent', this._receiveNewEvent);
        this.incrementUnreadEmitter = DeviceEventEmitter.addListener('FreshUnread', this._freshUnread);
    }

    componentWillUnmount() {
        this.receiveEventEmitter.remove();
        this.incrementUnreadEmitter.remove();
    }

    _receiveNewEvent = (events) => {
        this.setState(previous => {
            previous.data = global.events.concat();
            return previous;
        })
    }
    _freshUnread = () => {
        var events = global.events.concat();
        this.setState({data: events})
    }

    onKeyExtractor = (item, index) => item.id + (item.type == 'activity' ? 'A' : 'E')
    separator = () => {
        return (<View style={MCV.separator}></View>);
    }
    onRenderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => this._openMessage(item)}>
                <View style={[MCV.dateContainer, {height: 80}]}>
                    <Text style={[MCV.messageTitle]}>{'[' + eventType[item.type] + ']' + ' ' + item.title}</Text>
                    <Text
                        style={MCV.dateTime}>{item.unread} 条新消息</Text>
                </View>
            </TouchableOpacity>
        )
    }
    _openMessage = (item) => {
        ConversitonUtil._clearUnread(item.id, item.type);
        this._freshUnread();
        this.props.navigation.navigate('ChatView', {
            event: item
        })

    }

    render() {
        return (
            <View style={MCV.dateListContainer}>
                <FlatList ItemSeparatorComponent={this.separator} data={this.state.data} renderItem={this.onRenderItem}
                    // onRefresh={() => this._onRefresh()}
                    // refreshing={this.state.refreshing}
                    // onEndReached={() => this._onEndReach()}
                    // onEndReachedThreshold={0.1}
                          keyExtractor={this.onKeyExtractor}
                />
            </View>
        );
    }
}