import React, { Component } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MCV from '../MCV';
export default class DateList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: CommonString.DateListTitle,
        headerStyle: MCV.headerStyle,
        headerTintColor: 'white',
        headerRight: (<TouchableOpacity onPress={() => navigation.state.params.addPress()}><View><Icon name={'md-add'} size={25} style={{ color: 'white', marginRight: 20 }}></Icon></View></TouchableOpacity>),
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: navigation.state.params.item.tabName
    })
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        this.setState((state) => {
            return {
                data: [
                    {
                        oid: '1',
                        title: '1',
                        time: '11:11',
                        site: 'test',
                        distance: '100m'
                    }, {
                        oid: '2',
                        title: '2',
                        time: '11:11',
                        site: 'test',
                        distance: '100m'
                    }, {
                        oid: '3',
                        title: '3',
                        time: '11:11',
                        site: 'test',
                        distance: '100m'
                    }, {
                        oid: '4',
                        title: '4',
                        time: '11:11',
                        site: 'test',
                        distance: '100m'
                    }, {
                        oid: '5',
                        title: '5',
                        time: '11:11',
                        site: 'test',
                        distance: '100m'
                    },
                ]
            }
        })
        this.props.navigation.setParams({ addPress: this.createDate })
    }
    createDate = () => {
        let { params } = this.props.navigation.state;
        this.props.navigation.navigate(params.item.component, {
            operation: 'new',
            item:params.item
        })
    }
    onRenderItem = ({ item }) => {
        return (
            <View style={MCV.dateContainer}>
                <View style={MCV.dateFirstRow}><Text style={MCV.dateTitle}>{item.title}</Text><Text style={MCV.dateDistance}>{item.distance}</Text></View>
                <Text style={MCV.dateTime}>时间:{item.time}</Text>
                <Text style={MCV.dateSite}>描述:{item.site}</Text>
            </View>
        )
    }
    onKeyExtractor = (item, index) => item.oid
    separator = () => {
        return (<View style={MCV.separator}></View>);
    }
    render() {
        return (
            <View style={MCV.dateListContainer}>
                <FlatList ItemSeparatorComponent={this.separator} data={this.state.data} renderItem={this.onRenderItem} keyExtractor={this.onKeyExtractor} />
            </View>
        )
    }
}