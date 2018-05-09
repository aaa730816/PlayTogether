import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../Colors';
let totalHeight = Dimensions.get('window').height;
let totalWidth = Dimensions.get('window').width;
let UserStyles = StyleSheet.create({
    userHeaderView: {
        width: totalWidth,
        height: totalHeight / 5,
        backgroundColor: colors.MaterialRed,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userHeaderLogo: {
        width: (totalHeight / 5)*2/3,
        height: (totalHeight / 5)*2/3,
        borderRadius: ((totalHeight / 5)*2/3)/2
    },
    loginContainer: {
        flex: 1,
        width: totalWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginInputContainer: {
        width: (totalWidth * 2) / 3,
        height:200,
        justifyContent:'space-around',
        marginTop:totalHeight / 8
    },
    userNameView: {
        flexDirection: 'row',
        height: 40,
        borderRadius: 5,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        elevation:0.5
    },
    inputTextStyle: {
        flex: 1,
        height: 40,
        fontSize:12,
        textAlign:'center'
    },
    iconStyle: {
        padding: 5,
        backgroundColor: '#e0e0e0',
        width:40,
        height:40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userProfileContainer:{
        flex:1,
        justifyContent:'flex-start'
    },
    userProfileCard:{
        width:totalWidth,
        height:totalHeight/8,
        // borderTopWidth:1,
        // borderBottomWidth:1,
        // borderColor:'#9e9e9e',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:10,
        paddingLeft:20,
        elevation:1,
        paddingRight:20,
        backgroundColor:'white',
        elevation:0.5
    },
    modalContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:60,
        marginRight:60,
    },
    subView:{
        marginLeft:60,
        marginRight:60,
        width:totalWidth*2/3,
        height:(totalWidth*2/3)/2,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignSelf:'center',
        elevation:2
    }
})
export { UserStyles as default }