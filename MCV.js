import React from 'react';
import {StyleSheet, Dimensions,StatusBar} from 'react-native';
import colors from './Colors';

let totalHeight = Dimensions.get('window').height;
let totalWidth = Dimensions.get('window').width;
let statusBarHeight = StatusBar.currentHeight;
let MCV = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.MaterialRed,
        height: totalHeight / 13
    },
    headerTitleStyle: {
        alignSelf: 'center'
    },
    tabStyle: {
        height: totalHeight / 13,
        backgroundColor: 'white',
        borderColor: 'black'
    },
    userHeaderStyle: {
        backgroundColor: colors.MaterialRed,
        height: totalHeight / 4,
        elevation: 0
    },
    userTabStyle: {
        backgroundColor: colors.MaterialRed
    },
    userTabLabelStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    tabLabelStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    mainPageContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: 'white'
    },
    touchBox: {
        width: totalWidth / 3 - 0.33334,
        height: totalWidth / 3,
        backgroundColor: '#fff'
    },
    boxContainer: {
        width: totalWidth / 3,
        height: totalWidth / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconStyle: {
        width: 50,
        height: 50
    },
    dateListContainer: {
        flex: 1,
        width: totalWidth
    },
    dateContainer: {
        flex: 1,
        height: 120,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        marginBottom:10,
        elevation:1
        // borderTopColor:'#bdbdbd',
        // borderTopWidth:0.5,
        // borderBottomColor:'#bdbdbd',
        // borderBottomWidth:0.5
    },
    dateFirstRow: {
        marginHorizontal: 12,
        flexDirection: 'row',
        width: totalWidth - 24,
        justifyContent: 'space-around'
    },
    dateTitle: {
        fontSize: totalWidth / 23,
        flex: 1,
        fontWeight: 'bold',
        color:'#424242'
    },
    dateDistance: {
        width: totalWidth / 6,
        textAlign: 'center',
        fontSize: totalWidth / 30
    },
    dateTime: {
        fontSize: totalWidth / 30,
        marginHorizontal: 12
    },
    messageTitle: {
        fontSize: totalWidth / 25,
        marginHorizontal: 12,
        fontWeight: 'bold'
    },
    dateSite: {
        fontSize: totalWidth / 30,
        marginHorizontal: 12
    },
    separator: {
        width: totalWidth,
        height: 1,
        backgroundColor: '#e0e0e0'
    },
    dateDetailContainer: {
        flex: 1,
        width: totalWidth,
        height: totalHeight * 11 / 13-statusBarHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateDetailView: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: totalWidth - 40,
        height: totalHeight - 50 - (totalHeight * 2) / 13 - 35,
        elevation: 25,
        backgroundColor: 'white',
        alignItems: 'flex-end'
    },
    sportInputView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        width: totalWidth - 40 - 40,
        alignItems: 'center'
    },
    gamePicker: {
        height: 40,
        width: (totalWidth / 30) * 10,
        justifyContent: 'center'
    },
    textInputView: {
        justifyContent:'center',
        alignItems:'center',
        height: 40,
        width: (totalWidth - 40) * 0.6
    },
    textInputStyle: {
        // height: 20,
        textAlign: 'center',
        width: (totalWidth - 40) * 0.6
    },
    labelStyle: {
        height: 40,
        width: 80,
        justifyContent:'center'
    },
    textAreaView: {
        width: totalWidth - 40 - 40 - 20,
        height: 150,
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#bdbdbd'
    },
    textArea: {
        marginTop: 0,
        // height:150,
        width: totalWidth - 40 - 40 - 20,
    },
    locationSearchView: {
        backgroundColor: 'white',
        height: 100,
        width: totalWidth - 10,
        position: 'absolute',
        top: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 30
    },
    locationSearchField: {
        height: 50,
        width: totalWidth - 10,
    },
    mapViewStyle: {
        width: totalWidth,
        flex:1
    },
    locationSearchContainer: {
        flex: 1,
        width: totalWidth,
        backgroundColor: 'white'
    },
    locationSearchTextField: {
        width: totalWidth,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#bdbdbd',
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationListView: {
        flex: 1,
        width: totalWidth,
        marginTop: 5
    },
    locationSearchItem: {
        width: totalWidth,
        height: 50,
        justifyContent: 'center'
    },
    doLocationSearchBtn: {
        borderLeftWidth: 1,
        borderLeftColor: '#bdbdbd',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    equipmentPickerView: {
        // flex: 1,
        flexDirection: 'row',
        width: totalWidth,
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    equipmentPicker: {
        width: totalWidth / 3,
        // backgroundColor:'white',
        height: 50,
        justifyContent:'center',
        fontSize:totalWidth/20
        // alignItems:'center'
    },
    activityPicker:{
        width: totalWidth / 2,
        // backgroundColor:'white',
        height: 50,
        justifyContent:'center',
        fontSize:totalWidth/20
    },
    messageContainer: {
        width: totalWidth - 20,
        padding: 10
    },
    messageTimeStyle: {
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#eeeeee'
    },
    messageContent: {
        borderRadius: 5,
        width: totalWidth / 2,
        marginTop: 10
    },
    messageInputContainer: {
        width: totalWidth,
        height: totalHeight / 15,
        flexDirection: 'row',
        // paddingBottom:100
    },
    messageTextStyle: {
        flex: 1,
        height: totalHeight / 15,
        backgroundColor: 'white'
    },
    messageSendStyle: {
        width: totalWidth / 5,
        height: totalHeight / 15,
        backgroundColor: '#42bd41',
        justifyContent: 'center',
        alignItems: 'center'
    },
    historyMessageStyle: {
        flex: 1,
    },
    eventSummaryContainer: {
        flex: 1,
        width: totalWidth,
        height: totalHeight * 10.55 / 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    eventSummary: {
        paddingHorizontal: 20,
        marginVertical: 10,
        width: totalWidth - 40,
        height: (totalHeight - 50 - (totalHeight * 2) / 13 - 50)/2,
        justifyContent:'space-around',
        elevation: 25,
        backgroundColor: 'white'
    },
    memberListView: {
        paddingHorizontal: 20,
        marginVertical: 10,
        width: totalWidth - 40,
        height: (totalHeight - 50 - (totalHeight * 2) / 13 - 50)/2,
        elevation: 25,
        justifyContent:'space-around',
        backgroundColor: 'white'
    },
    eventTitleStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop:10,
        // marginBottom:10,
        width: totalWidth - 40 - 40,
    },
    memberList:{
        paddingTop:10,
        height:(totalHeight - 50 - (totalHeight * 2) / 13 - 50)/2-20,
        width: totalWidth - 40,
    },
    dateSearchBtn:{
        fontSize:totalWidth/26,
        color:'black'
    },
    eventSwiperStyle:{
        width:totalWidth,
        height:150,
        position:'absolute',
        bottom:5
    },
    swiperEventContainer:{
        width:totalWidth-10,
        marginHorizontal:5,
        height: 150,
        backgroundColor: '#fff',
        marginBottom:10,
        elevation:1
    },
    swiperEventFirstRow:{
        marginHorizontal: 12,
        flexDirection: 'row',
        width: totalWidth-20 - 24,
        justifyContent: 'space-around'
    },
    swiperContent:{
        marginHorizontal:10,
        justifyContent: 'space-around',
        height: 150
    }
})
export {MCV as default}