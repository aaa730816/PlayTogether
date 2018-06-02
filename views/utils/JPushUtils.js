import JPushModule from "jpush-react-native";
export default class JPushUtils{
    static setAlias=()=>{
        JPushModule.setAlias((global.userId==undefined||global.userId=='')?'all':(global.userId).toString().trim(), map => {
            if (map.errorCode === 0) {
                console.log('set alias succeed '+(global.userId).toString())
            } else {
                console.log('set alias failed, errorCode: ' + map.errorCode)
            }
        })
    }

    static removeAlias=()=>{
        JPushModule.deleteAlias(map => {
            if (map.errorCode === 0) {
                console.log('delete alias succeed')
            } else {
                console.log('delete alias failed, errorCode: ' + map.errorCode)
            }
        })
    }
}