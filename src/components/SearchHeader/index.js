import React from 'react'
import { Flex } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// 封装搜索顶部导航栏
// 1.--函数组件 props应该 在函数接受SearchHeader(props)
// class 组件 组件可以直接 this.props
// 2.封装的要使用 需要withRouter
// 3.验证数据是否正确
function SearchHeader({history, cityname}) {
    // let { history } = props
    return (
        <Flex className='searchBox'>
            <Flex className='searchLeft'>
                <div
                className='location'
                onClick={ () => {history.push('/citylist')}}
                >
                <span>{cityname}</span>
                <i className="iconfont icon-arrow" />
                </div>
                <div
                className='searchForm'
                onClick={ () => {history.push('/search')}}
                >
                    <i className="iconfont icon-seach" />
                    <span>请输入小区或地址</span>
                </div>
            </Flex>
            <i className="iconfont icon-map" onClick={ () => {history.push('/map')}} />
        </Flex>
    )
}
SearchHeader.propTypes={
    cityname:PropTypes.string.isRequired
}
export default withRouter(SearchHeader)









// export default class SearchHeader extends React.Component{
//     render() {
//         return (
//             <div className="searchheader"></div>
//         )
//     }
// }