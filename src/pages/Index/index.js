import React from 'react';
import { Carousel, Flex, Grid  } from 'antd-mobile';
import axios from 'axios'
import './index.css'
import './index.scss'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

const nav = [
    {
       id:0,
       img:Nav1,
       title: '整租',
       path:'/home/homelist'
    },
    {
        id:1,
        img:Nav2,
        title: '合租',
        path:'/home/homelist'
     },
     {
        id:2,
        img:Nav3,
        title: '找房',
        path:'/home/homelist'
     },
     {
        id:3,
        img:Nav4,
        title: '去出租',
        path:'/home/homelist'
     }
]

export default class Index extends React.Component{
    state = {
        swiper: [],
        imgHeight: 176,
        isplay: false,
        groups:[],
        news:[]
    }
    // 第一次挂载 componentDidMount 页面打开经常用来发送Ajax
    componentDidMount() {
        this.getswiper()
        this.getGroups()
        this.getNews()
    }
    // 发 Ajax 获得轮播图数据
    async getswiper() {
        let data = await axios.get('http://192.168.1.101:8080/home/swiper')
        // this.setState是异步的 有一点点延时
        this.setState({
            swiper:data.data.body
        },() => {
            this.setState({
                isplay:true
            })
        })
    }
    // 发Ajax 获取租房小组信息
    async getGroups() {
        let res = await axios.get('http://192.168.1.101:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
            groups:res.data.body
        })
    }
    // 发Ajax 获得咨询信息
    async getNews() {
        let res = await axios.get('http://192.168.1.101:8080/home/news', {
                  params:{
                      area:'AREA%7C88cff55c-aaa4-e2e0'
                  }
        })
        this.setState({
            news:res.data.body
        })
    }
    // 渲染轮播图  渲染Html最好不要换行 最好紧挨着 如果非要换行 就先写（）里面在换行
    renderSwiper() {
        return this.state.swiper.map(val => (
            <a
            key={val.id}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
            <img
                src={`http://192.168.1.101:8080${val.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
                }}
            />
            </a>
        ))
    }
    // 渲染Nav
    renderNavs() {
        return nav.map( (val) => {
           return <Flex.Item key={val.id} onClick={ () => {this.props.history.push(val.path)}}>
            <img src={val.img} alt=""/>
            <h3>{val.title}</h3>
            </Flex.Item>
        })
    }
    // 渲染最新资讯
    renderNews() {
        return this.state.news.map( (val) => {
            return <div className="new-item" key={val.id}>
            <img src={'http://192.168.1.101:8080' + val.imgSrc}/>
            <div className="item-right">
                <h3>{val.title}</h3>
                <p>
                <span>{val.from}</span>
                <span>{val.date}</span>
                </p>
            </div>
            </div>
        })
    }
    render() {
        return(
        <div className="index">
            {/* 顶部导航 */}
            <Flex className='searchBox'>
                <Flex className='searchLeft'>
                    <div
                    className='location'
                    onClick={ () => { this.props.history.push('/citylist')}}
                    >
                    <span>上海</span>
                    <i className="iconfont icon-arrow" />
                    </div>
                    <div
                    className='searchForm'
                    onClick={ () => { this.props.history.push('/search')}}
                    >
                        <i className="iconfont icon-seach" />
                        <span>请输入小区或地址</span>
                    </div>
                </Flex>
                <i className="iconfont icon-map" onClick={ () => { this.props.history.push('/map')}} />
            </Flex>
            {/* 轮播图 */}
            <Carousel
            autoplay={this.state.isplay}
            infinite
            >
            {this.renderSwiper()}
            </Carousel>
            {/* Nav布局 */}
            <Flex className="nav">
            {this.renderNavs()}
            </Flex>
            {/* 租房小组 */}
            <div className="groups">
            <div className="groups-title" >
                <h3>租房小组</h3>
                <span>更多</span>
            </div>

            {/* 
                rendeItem 属性：用来 自定义 每一个单元格中的结构
            */}
            <Grid data={this.state.groups}
            hasLine={false}
            square={false}
            activeStyle={false}
            columnNum={2}
            renderItem={ (item, index) => {
                return <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://192.168.1.101:8080${item.imgSrc}`} alt="" />
              </Flex>
            }}
            />
            </div>
            {/* 咨询 */}
            <div className="news">
                <div className="news-title">
                    最新咨询
                </div>
                <div className="news-content">
                    {this.renderNews()}
                </div>
            </div>
        </div>
        )
    }
}