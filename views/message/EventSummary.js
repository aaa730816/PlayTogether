import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import moment from 'moment';
import MCV from '../../MCV';
import CommonString from "../../resource/CommonString";
import DateType from '../utils/DateType';
import EquipmentType from '../equipment/EquipmentType';

export default class EventSummary extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.event.title,
        headerRight: (<View/>),
        // tabBarLabel: CommonString.message,
        tabBarVisible: false
    })
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            startTime: new Date(),
            address: '',
            type: '',
            game: '',
            eventType: props.navigation.state.params.event.type,
            member: []
        }
    }

    componentDidMount() {
        let {event} = this.props.navigation.state.params;
        fetch(global.messageModuleUrl + 'eventSummary?eventId=' + event.id + '&type=' + event.type, {
            method: 'GET'
        }).then(response => response.json())
            .then(responseJson => {
                let summary = responseJson[event.type];
                this.setState({
                    title: summary.title,
                    startTime: moment(summary.startTime).toDate(),
                    address: summary.type!='game'?summary.location.address:'',
                    type: event.type=='activity'?DateType[summary.type].title:(summary.type=='other'?summary.otherType:EquipmentType[summary.type]),
                    game: summary.game,
                    member:responseJson.member
                })
            })
    }

    onRenderItem = ({item}) => {
        return (<View style={[MCV.sportInputView,{justifyContent:'flex-start',paddingHorizontal: 10,}]}>
            <View
                style={[MCV.labelStyle]}><Text>{item.nickName}</Text></View>
        </View>)
    }
    onKeyExtractor = (item, index) => item.userOid
    render() {
        return (
            <View style={[MCV.eventSummaryContainer]}>
                <View style={MCV.eventSummary}>
                    <View style={MCV.eventTitleStyle}>
                        <View
                            style={[MCV.labelStyle,{width:200}]}><Text
                            style={{fontSize:20,fontWeight: 'bold'}}>{this.state.eventType == 'activity' ? CommonString.activitySummary : CommonString.equipmentSummary}</Text></View>
                    </View>
                    <View style={MCV.sportInputView}>
                        <View
                            style={MCV.labelStyle}><Text>{CommonString.title + CommonString.semicolon}</Text></View>
                        <View style={[MCV.textInputView]}><Text
                            style={[MCV.textInputStyle]}>{this.state.title}</Text></View>
                    </View>
                    <View
                        style={[MCV.sportInputView, , {display: this.state.eventType == 'equipment' ? 'none' : 'flex'}]}>
                        <View
                            style={MCV.labelStyle}><Text>{CommonString.startTime + CommonString.semicolon}</Text></View>
                        <View style={MCV.textInputView}><Text
                            style={MCV.textInputStyle}>{this.state.startTime.toLocaleDateString() + '' +
                        ' ' + this.state.startTime.toLocaleTimeString()}</Text></View>
                    </View>
                    <View style={[MCV.sportInputView, {display: this.state.type == DateType['game'].title ? 'none' : 'flex'}]}>
                        <View
                            style={MCV.labelStyle}><Text>{CommonString.location + CommonString.semicolon}</Text></View>
                        <View style={MCV.textInputView}><Text
                            style={MCV.textInputStyle}>{this.state.address}</Text></View>
                    </View>
                    <View style={[MCV.sportInputView]}>
                        <View
                            style={MCV.labelStyle}><Text>{(this.state.eventType == 'activity' ? CommonString.activityType : CommonString.equipmentType) + CommonString.semicolon}</Text></View>
                        <View style={MCV.textInputView}><Text
                            style={MCV.textInputStyle}>{this.state.type == DateType['game'].title ? this.state.game : this.state.type}</Text></View>
                    </View>
                </View>
                <View style={MCV.memberListView}>
                    <View style={MCV.eventTitleStyle}>
                        <View
                            style={[MCV.labelStyle,{width:200}]}><Text style={{fontSize:20,fontWeight: 'bold'}}>{'成员'}</Text></View>
                    </View>
                    <View style={MCV.memberList}>
                    <FlatList data={this.state.member} renderItem={this.onRenderItem} keyExtractor={this.onKeyExtractor}/>
                    </View></View>
            </View>
        )
    }
}