import React, {Component} from 'react';
import {View, Text} from 'react-native';
import MCV from '../../MCV';

export default class CommonHeader extends Component {
    render() {
        return (
            <View style={[MCV.headerStyle,{justifyContent:'center',alignItems:'center'}]}>
                <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>{this.props.title}</Text>
            </View>
        )
    }
}