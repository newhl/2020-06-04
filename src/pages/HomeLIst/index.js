import React from 'react'
import SearchHeader from '../../components/SearchHeader'
// import styles from './homelist.module.css'
import './homelist.scss'
import { getCurrentCity } from '../../utils/CurrentCity'
// 导入Filter
import Filter from './components/Filter'
export default class HomeList extends React.Component{
    state = {
        cityname:''
    }
    async componentDidMount() {
        let city = await getCurrentCity()
        this.setState({
            cityname:city.label
        })
    }
    render() {
        return( 
            <div className="houselist">
                <div className="search">
                    <i className="iconfont icon-back"></i>
                    <SearchHeader cityname={this.state.cityname}></SearchHeader>
                </div>
                {/* Filter筛选条件 组件 */}
                <Filter></Filter>
            </div>
        )
    }
}