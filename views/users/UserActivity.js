import React, {Component} from 'react';
import {BackHandler, FlatList, Text, TouchableOpacity, View, Alert} from 'react-native';
import MCV from '../../MCV';
import CommonString from "../../resource/CommonString";
import CommonHeader from "../common/CommonHeader";
import dateType from '../utils/DateType';
const pageOperation={
    join:'join',
    create:'create'
}
export default class UserActivity extends Component{
    static navigationOptions =({navigation})=>({
        title: navigation.state.params.type==pageOperation.join?CommonString.joinActivities:CommonString.createActivities,
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
        this.backAndroid=this.onBackAndroid.bind(this)
    }

    componentDidMount() {
        this._doLoadDatas()
        BackHandler.addEventListener('hardwareBackPress', this.backAndroid)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAndroid)
    }
    _goToDate=(i)=>{
        let item={
            component:dateType[i.type].component,
            title:dateType[i.type].title
        }
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('Activity',{
            item:item,
            oid:i.id,
            operation:params.type==pageOperation.create?'update':pageOperation.join
        })
    }
    onBackAndroid = () => {
        this.props.navigation.pop();
        return true;
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
        fetch(global.userModuleUrl+'my'+params.type+'?userId='+global.userId,{
            method:'GET'
        }).then(response=>response.json())
            .then(responseJson=>{
                this.setState({data:responseJson, refreshing:false})
            })
    }
    _doLongPressDate=(item)=>{
        let operation=this.props.navigation.state.params.type==pageOperation.join?'quit':'cancel';
        fetch(global.activityModuleUrl+operation+'?activityId='+item.id+'&userId='+global.userId,{
            method:'GET'
        }).then(response=>response.json())
            .then(responseJson=>{
                if(responseJson.success) {
                    this.setState(previous => {
                        let index = previous.data.indexOf(item);
                        if (index > -1)
                            previous.data.slice(index, 1);
                        return previous;
                    }, function () {
                        Alert.alert(
                            '',
                            this.props.navigation.state.params.type == pageOperation.join ? '退出成功' : '取消成功',
                            [
                                {text:'确认',type:'cancel'}
                            ]
                        )
                    })
                }
            })
    }
    _longPressDate=(item)=>{
        Alert.alert(
            '',
            this.props.navigation.state.params.type == pageOperation.join ? '退出活动?' : '取消活动?',
            [
                {text:'确认',onPress:()=>this._doLongPressDate(item)},
                {text:'取消',type:'cancel'}
            ]

        )
    }
    onRenderItem = ({item}) => {
        return (
                <TouchableOpacity onPress={()=>this._goToDate(item)} onLongPress={()=>this._longPressDate(item)}>
                <View style={[MCV.dateContainer,{height:150}]}>
                    <View style={MCV.dateFirstRow}><Text style={MCV.dateTitle}>{item.title+(item.numOfPeople==0?'(已满)':'')}</Text></View>
                    <Text style={MCV.dateTime}>时间:{new Date(item.startTime).toLocaleDateString()+' '+new Date(item.startTime).toLocaleTimeString()}</Text>
                    <Text style={MCV.dateSite}>已参与人数:{item.participant.length}</Text>
                    <Text style={MCV.dateSite}>费用:{item.cost}</Text>
                    {item.location.address==''?<Text style={MCV.dateSite}>游戏:{item.game}</Text>:<Text style={MCV.dateSite}>地点:{item.location.address}</Text>}
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