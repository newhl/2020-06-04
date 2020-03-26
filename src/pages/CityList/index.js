import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import axios from 'axios'
import './citylist.scss'

export default class CityList extends React.Component {
    componentDidMount() {
        this.getCitylit()
    }
    // 发Ajax 获取城市列表
    async getCitylit() {
        let res = await axios.get('http://192.168.1.101:8080/area/city', {
            params:{
                level:1
            }
        })
        let citylist = {}
        res.data.body.forEach(item => {
            let word = item.short.substring(0,1)
            if(citylist[word]){
                citylist[word].push(item)
            }else{
                citylist[word] = [item]
            }
        });
        console.log(citylist)
    }
    render() {
        return (
            <div className="citylist">
                <NavBar
                className="navbar"
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => { this.props.history.go(-1)}}
                >城市选择</NavBar>
                1111111111
            </div>
        )
    }
}