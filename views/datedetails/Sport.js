import React, { Component } from 'react';
import { View, Image } from 'react-native';
import MCV from '../../MCV';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
export default class Sport extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.item.title,
        headerStyle: MCV.headerStyle,
        headerRight: (<View></View>),
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: navigation.state.params.item.tabName
    })
    render() {
        let { params } = this.props.navigation.state;
        let item = params.item;
        return (
            <View style={MCV.dateDetailContainer}>
                <View>
                {item.isFA ? <IconFA size={item.size} name={item.icon}></IconFA> : (item.isLocal ? <Image style={[MCV.iconStyle,{marginVertical:5}]} source={item.source}></Image> : <Icon size={item.size} name={item.icon}></Icon>)}
                </View>
                <View style={MCV.dateDetailView}>

                </View>
            </View>
        )
    }
}