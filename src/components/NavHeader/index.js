import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import './navheader.scss'
// 导入protyps
import PropTypes from 'prop-types'
// react 里面如果 组件是直接路由跳转显示的  那么history有
// 如果 组件是其他地方封装的导入的 history路由就没有了
// 如果非要用可以使用react-router-dom de withRouter组件
class NavHeader extends React.Component{
    render() {
        return (
            <NavBar
            className="navbar"
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => { this.props.history.go(-1)}}
            >
            {/* this.props.children 获取组件标签之间的内容 */}
            {this.props.children}
            </NavBar>
        )
    }
}
// 在导出组件之前，验证一些传来的数据是否正确
// react规定的验证写法 专门验证props
NavHeader.propTypes={
    // 名字：验证规则
    children:PropTypes.string.isRequired
}
// withRouter包裹组件又可以使用history
export default withRouter(NavHeader)