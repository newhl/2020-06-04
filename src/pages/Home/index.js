import React from 'react';
import { TabBar } from 'antd-mobile';
import { Route } from 'react-router-dom'
import './home.css'
// 导入组件
import News from '../News'
import HomeList from '../HomeLIst'
import Profile from '../Profile'
import Index from '../Index'

//1 抽象TabBar菜单的数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/houselist'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]



export default class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '/home/index',
      hidden: false,
      fullScreen: false,
    };
  }
  // 循环生产4个TabBar
  renderItems() {
    return tabItems.map( (item) => {
        return <TabBar.Item
        title={item.title} // title 文字， icon图标， onPress点击
        key="Life"
        icon={ <i className={ `iconfont ${item.icon}`}></i>  }
        selectedIcon={ <i className={ `iconfont ${item.icon}`}></i> }
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          });
          this.props.history.push(item.path)
        }}
      >
      </TabBar.Item>
    })
  }

  render() {
    return <div className="home">
        {/* 展示内容 */}
        <Route path="/home/index" component={Index}></Route>
        <Route path="/home/houselist" component={HomeList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* TabBar 部分*/}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          noRenderContent={true}
        >
        {this.renderItems()}
        </TabBar>
      </div>
  }
}