import React, {Component} from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    DeviceEventEmitter, StatusBar
} from 'react-native';
import CommonString from '../../resource/CommonString';
import MCV from "../../MCV";
import ConversitonUtil from "../utils/ConversitonUtil";
import IconFA from 'react-native-vector-icons/FontAwesome';
import colors from "../../Colors";
export default class ChatView extends Component {
    _flatlist;
    scrollToEndTimeTask;
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.event.title,
        headerRight: (<TouchableOpacity onPress={()=>navigation.state.params.goToDetail()}><View style={{paddingRight: 20,}}><IconFA name='info-circle' size={25} color='white'/></View></TouchableOpacity>),
        // tabBarLabel: CommonString.message,
        tabBarVisible: false
    })

    constructor(props) {
        super(props);
        this.state = {
            keyBoardHeight: 0,
            refreshing: false,
            message: '',
            data: [],
            totalPages: 0,
            messageCriteria: {
                eventId: props.navigation.state.params.event.id,
                type: props.navigation.state.params.event.type,
                page: 0,
                size: 20
            }
        }
    }

    componentDidMount() {
        this._doLoadDatas(()=>{
            if (this.state.data.length > 0) {
                this.scrollToEndTimeTask = setTimeout(() => this._flatlist.scrollToEnd(), 500)
            }
        });
        this.receiveMessageListener = DeviceEventEmitter.addListener('ReceiveMessage', this._receiveMessage)
        this.props.navigation.setParams({goToDetail: this._goToDetail});
    }
    _goToDetail=()=>{
        let {event} = this.props.navigation.state.params;
        this.props.navigation.navigate('EventSummary',{
            event:event
        })
    }
    componentWillUnmount() {
        if (this.scrollToEndTimeTask != undefined) {
            clearTimeout(this.scrollToEndTimeTask)
        }
        this.receiveMessageListener.remove();
        this.setState = (state,callback)=>{
            return;
        };
    }

    _receiveMessage = (event, msg) => {
        if (event.id == this.state.messageCriteria.eventId && event.type == this.state.messageCriteria.type) {
            this.setState(previous => {
                previous.data = previous.data.concat([msg]);
                return previous;
            }, function () {
                ConversitonUtil._clearUnread(event.id, event.type);
                DeviceEventEmitter.emit('FreshUnread');
                this.scrollToEndTimeTask = setTimeout(() => this._flatlist.scrollToEnd(), 500)
            })
        }
    }
    _formatDate = (date) => {
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    }
    _onRefresh = () => {
        if (!(this.state.totalPages != 0 && this.state.messageCriteria.page == this.state.totalPages - 1)) {
            if (this.state.totalPages != 0) {
                this.setState(previous => {
                    previous.messageCriteria.page += 1;
                    previous.refreshing = true;
                    return previous;
                }, () => this._doLoadDatas())
            }
        }
    }

    _doLoadDatas = (callback) => {
        var _this = this;
        fetch(global.messageModuleUrl + 'get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(_this.state.messageCriteria)
        }).then(response => response.json())
            .then(responseJson => {
                this.setState(previous => {
                    previous.totalPages = responseJson.totalPages;
                    previous.data = responseJson.content.concat(previous.data);
                    previous.refreshing = false;
                    return previous;
                },callback)
            })
    }
    onRenderItem = ({item}) => {
        let time = new Date(item.createTime);
        return (
            <View style={MCV.messageContainer}>
                <Text style={MCV.messageTimeStyle}>{this._formatDate(time)}</Text>
                <View style={{
                    alignSelf: item.sender == global.userId ? 'flex-end' : 'flex-start'
                }}><Text>{item.senderNickName}</Text></View>
                <View style={[MCV.messageContent, {
                    alignSelf: item.sender == global.userId ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender == global.userId ? '#72d572' : 'white'
                }]}>
                    <Text style={{padding: 5}}>{item.message}</Text>
                </View>
            </View>
        )
    }
    onKeyExtractor = (item, index) => typeof item.id === 'object' ? item.id.counter : item.id
    _sendMessage = () => {
        var msg={
            'sender': global.userId, 'message': this.state.message,
            'eventId': this.state.messageCriteria.eventId, 'type': this.state.messageCriteria.type
        };
        global.sockets[this.state.messageCriteria.eventId + this.state.messageCriteria.type]
            .send(JSON.stringify(msg));
        this.setState(previous => {
            previous.message = '';
            return previous;
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor={colors.MaterialRed}/>
                <FlatList style={MCV.historyMessageStyle} ref={(flatlist) => this._flatlist = flatlist}
                          data={this.state.data}
                          renderItem={this.onRenderItem}
                          onRefresh={() => this._onRefresh()}
                          refreshing={this.state.refreshing}
                          keyExtractor={this.onKeyExtractor}/>
                <View style={[MCV.messageInputContainer, {paddingBottom: 0}]}>
                    <View style={[MCV.messageTextStyle, {borderLeftWidth: 1, borderLeftColor: '#e0e0e0'}]}>
                        <TextInput style={MCV.messageTextStyle} value={this.state.message}
                                   onChangeText={text => this.setState({message: text})}
                                   underlineColorAndroid={'transparent'}/>
                    </View>
                    <TouchableOpacity onPress={() => this._sendMessage()}>
                        <View style={MCV.messageSendStyle}><Text style={{color: 'white'}}>发送</Text></View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}