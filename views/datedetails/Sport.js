import React, { Component } from 'react';
import { View, Image, Text, TextInput, ScrollView, CheckBox, DatePickerAndroid, TouchableOpacity, Picker } from 'react-native';
import MCV from '../../MCV';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import CommonString from '../../resource/CommonString';
export default class Sport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needBringEquipmentChecked: false,
            startTime: new Date().toLocaleDateString(),
            hourPickerItems:[]
        }
    }
    componentDidMount() {
        var hourPickerItems = [];
        for (let i = 0; i <= 23; i++) {
            hourPickerItems.push((<Picker.Item label={i} value={i} />))
        }
        this.setState({
            hourPickerItems:hourPickerItems
        })
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.item.title,
        headerStyle: MCV.headerStyle,
        headerRight: (<View></View>),
        headerTintColor: 'white',
        headerTitleStyle: MCV.headerTitleStyle,
        tabBarLabel: navigation.state.params.item.tabName
    })
    handleClick = () => {
        this.setState((state) => {
            return {
                needBringEquipmentChecked: state.needBringEquipmentChecked ? false : true
            }
        })
    }
    async openDatePicker() {
        const { action, year, month, day } = await DatePickerAndroid.open({
            date: new Date()
        })
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                startTime: new Date(year, month, day).toLocaleDateString()
            })
        }
    }
    render() {
        let { params } = this.props.navigation.state;
        let item = params.item;
        return (
            <View style={MCV.dateDetailContainer}>
                <View>
                    {item.isFA ? <IconFA size={item.size} name={item.icon}></IconFA> : (item.isLocal ? <Image style={[MCV.iconStyle, { marginVertical: 5 }]} source={item.source}></Image> : <Icon size={item.size} name={item.icon}></Icon>)}
                </View>
                <View style={MCV.dateDetailView}>
                    <ScrollView>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.title + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.startTime + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}>
                                <TouchableOpacity onPress={() => this.openDatePicker()}>
                                    <TextInput style={MCV.dateTextStyle} editable={false} underlineColorAndroid='#bdbdbd'>{this.state.startTime}</TextInput>
                                </TouchableOpacity>
                                <Picker>
                                    {this.state.hourPickerItems}
                                </Picker>
                            </View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.location + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.cost + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.numOfPeople + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} keyboardType='numeric' underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.needBringEquipment + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><CheckBox style={{ alignSelf: 'flex-end' }} onValueChange={this.handleClick} value={this.state.needBringEquipmentChecked}></CheckBox></View>
                        </View>
                        <View style={MCV.sportInputView}>
                            <View style={MCV.labelStyle}><Text>{CommonString.description + CommonString.semicolon}</Text></View>
                            <View style={MCV.textInputView}><TextInput style={MCV.textInputStyle} underlineColorAndroid='#bdbdbd'></TextInput></View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}