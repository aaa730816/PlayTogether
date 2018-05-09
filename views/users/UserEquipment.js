import React, {Component} from 'react';
import {FlatList, Text, TouchableOpacity, View, Alert} from 'react-native';
import MCV from '../../MCV';
import CommonString from "../../resource/CommonString";
import CommonHeader from "../common/CommonHeader";
import dateType from '../utils/DateType';
import moment from 'moment';
import costUnit from "../utils/CostUnit";
import ConversitionUtil from "../utils/ConversitonUtil";
const pageOperation={
    rent:'rent',
    create:'create'
}
export default class UserActivity extends Component{
    static navigationOptions =({navigation})=>({
        title: navigation.state.params.type==pageOperation.rent?CommonString.rentEquipment:CommonString.createEquipment,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        headerRight:(<View/>)
    })
    constructor(props){
        super(props);
        this.state={
            data:[],
            refreshing:true
        }
    }

    componentDidMount() {
        this._doLoadDatas()
    }

    componentWillUnmount() {
    }
    _goToDate=(i)=>{
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('Equipment',{
            item:i,
            oid:i.id,
            operation:params.type==pageOperation.create?'update':'view'
        })
    }
    onKeyExtractor = (item, index) => item.id
    separator = () => {
        return (<View style={MCV.separator}></View>);
    }
    _onRefresh = () => {
        this.setState(previous => {
            previous.data = [];
            previous.refreshing = true;
            return previous;
        }, () => this._doLoadDatas(this))
    }
    _doLoadDatas=()=>{
        let {params}=this.props.navigation.state;
        fetch(global.userModuleUrl+'myEquipment'+params.type+'?userId='+global.userId,{
            method:'GET'
        }).then(response=>response.json())
            .then(responseJson=>{
                this.setState({data:responseJson, refreshing:false})
            })
    }
    _doLongPressEquipment=(item)=>{
        let operation=this.props.navigation.state.params.type==pageOperation.rent?'quit':'cancel';
        fetch(global.equipmentModuleUrl+operation+'?equipmentId='+item.id,{
            method:'GET'
        }).then(response=>response.json())
            .then(responseJson=>{
                if(responseJson.success) {
                    this.setState(previous => {
                        let index = previous.data.indexOf(item);
                        if (index > -1)
                            previous.data.splice(index, 1);
                        return previous;
                    }, function () {
                        ConversitionUtil.quitConversition(item.id, 'equipment');
                        Alert.alert(
                            '',
                            '取消成功',
                            [
                                {text:'确认',type:'cancel'}
                            ]
                        )
                    })
                }
            })
    }
    _longPressEquipment=(item)=>{
        Alert.alert(
            '',
            this.props.navigation.state.params.type == pageOperation.rent ? '不需要租借此器材了?' : '不出租此器材了?',
            [
                {text:'确认',onPress:()=>this._doLongPressEquipment(item)},
                {text:'取消',type:'cancel'}
            ]

        )
    }
    onRenderItem = ({item}) => {
        return (
                <TouchableOpacity onPress={()=>this._goToDate(item)} onLongPress={()=>this._longPressEquipment(item)}>
                    <View style={[MCV.dateContainer, {height: 150}]}>
                        <View style={MCV.dateFirstRow}><Text style={MCV.dateTitle}>{item.title}</Text>
                            <Text style={MCV.dateDistance}>{item.distance / 1000 + 'km'}</Text></View>
                        <Text style={MCV.dateSite}>数量:{item.num}</Text>
                        <Text style={MCV.dateSite}>费用:{item.cost + '/' + costUnit[item.unit]} </Text>
                        <Text style={MCV.dateSite}>押金:{item.guarantee}</Text>
                        <Text style={MCV.dateSite}>地点:{item.address}</Text>
                    </View>
                </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={MCV.dateListContainer}>
                <FlatList ItemSeparatorComponent={this.separator} data={this.state.data} renderItem={this.onRenderItem}
                          onRefresh={() => this._onRefresh()}
                          refreshing={this.state.refreshing}
                          keyExtractor={this.onKeyExtractor}/>
            </View>
        )
    }
}