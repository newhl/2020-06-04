import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile';
import { getCurrentCity } from '../../utils/CurrentCity'
// 列表插件react-virtualized
import { List,AutoSizer } from 'react-virtualized';
import axios from 'axios'
import './citylist.scss'




export default class CityList extends React.Component {
    state = {
        cityList:{},
        cityIndex:[],
        activeIndex:0,
        city_has_house:['北京','上海','广州','深圳']
    }
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
        let {cityList, cityIndex} = this.formtCity(res.data.body) // citylist 是对象 cityIndex 是数组
        // 获取热门城市
        let resHotCity = await axios.get('http://192.168.1.101:8080/area/hot')
        // 将热门城市添加到citylist 对象中
        cityList['hot'] = resHotCity.data.body
        // 给cityIndex中添加 hot
        cityIndex.unshift('hot')
        // 获取定位城市（提取一个公共的方法）
        let dwei = await getCurrentCity()
        // 给cityIndx数组前面添加#
        cityIndex.unshift('#')
        // 给城市对象citylist添加城市
        cityList['#'] = [dwei]
        this.setState({
            cityIndex:cityIndex,
            cityList:cityList
        })
        // console.log(this.state.cityList)
    }
    
    formtCity (list) {
        let cityList = {}
        list.forEach(item => {
            let word = item.short.substr(0,1)
            if(cityList[word]){
                cityList[word].push(item)
            }else{
                cityList[word] = [item]
            }
        });
        let cityIndex = Object.keys(cityList).sort()
        return {
            cityList,
            cityIndex
        }
    }

    // 渲染列表( 注意这个函数的this指向问题 )
    rowRenderer = ({
        key,         
        index,      
        isScrolling, // 是否滚动
        isVisible,   
        style      
      }) => {
        let word = this.state.cityIndex[index]
        let city = this.state.cityList[word]
        return (
          <div
            key={key}
            style={style}
            className="city"
          >
          <div className="title">{this.formatWord(word)}</div>
          {city.map( (item) => {
          return <div 
                className="name"
                key={item.value}
                onClick={ () => {
                    if( this.state.city_has_house.indexOf(item.label) !== -1 ) { // 找不到不是北上广深
                        this.props.history.push('/home/index') // 跳转到首页
                        // 修改localStorage的定位城市
                        localStorage.setItem('city',JSON.stringify(item))
                    }else {
                        Toast.info('该城市暂无房源!!!', 1);
                    }
                }}
                >
              {item.label}
              </div>
          })}
          </div>
        )
    }

    formatWord(word) {
        if( word == '#'){
            return '定位城市'
        }else if( word == 'hot'){
            return '热门城市'
        }else {
            return word.toUpperCase()
        }
    }
    // 计算高度返回 // 用到this 如果出现问题首先考虑 this问题
    getHight = ({index}) =>{
        let zimu = this.state.cityIndex[index]
        let citys = this.state.cityList[zimu]
        return 36+50*citys.length;
    }
    // 渲染右侧字母
    renderZimu =() => {
        return this.state.cityIndex.map( (item,index) => {
            return <li className= { `index-item ${this.state.activeIndex == index ? 'active' : ''}`}
            key = { item }
            onClick={ () => {
                // 让列表滚动到对象的单词位置
                // console.log(this.listRef.current) List组件
                this.listRef.current.scrollToRow(index) // 滚动到对应的索引
            }}>
                {item == 'hot' ? '热' : item.toUpperCase()}
            </li>
        })
    }
    //滑动改变右侧字母的 颜色 axtiveIndex
    rowsRender = ({startIndex, stopIndex}) => {
        // console.log(startIndex,stopIndex) // startIndex 滚动到那个div的索引
        if( this.state.activeIndex != startIndex) { // 优化一下而已
            this.setState({
                activeIndex:startIndex
            })
        }
    }
    // 创建其他变量
    listRef = React.createRef() // 先创建ref对象 2. 把他给到你要获取的元素
    render() {
        return (
            <div className="citylist">
                <NavBar
                className="navbar"
                mode="light"
                icon={<Icon type="left" />}
                onLeftClick={() => { this.props.history.go(-1)}}
                >城市选择</NavBar>
                {/* 列表 */}
                <AutoSizer> 
                    {({height,width}) => {
                      return <List
                        ref={this.listRef}
                        width={width}
                        height={height}
                        rowCount={this.state.cityIndex.length}
                        rowHeight={this.getHight}
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.rowsRender} // 出发一个函数 当这一行div滚动到顶部时出触发
                        scrollToAlignment='start'
                     />
                    }}
                </AutoSizer>
                {/* 右侧字母 */}
                <ul className="city-index">
                    {this.renderZimu()}
                </ul>
            </div>
        )
    }
}