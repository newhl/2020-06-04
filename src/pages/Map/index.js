import React from 'react'
import axios from 'axios'
import NavHeader from '../../components/NavHeader'
import { Toast } from 'antd-mobile';
import './index.scss'
import styles from './map.module.css'
// 导入定位城市
import { getCurrentCity } from '../../utils/CurrentCity'
import { is } from '@babel/types'
let BMap = window.BMap
export default class Map extends React.Component{
    state = {
        houselist:[],
        isshow:false // 默认不显示
    }
    componentDidMount() {
        this.initMap()
    }
    // 初始化地图
    async initMap() {
        // 1.先获取定位城市 找到经纬度
        // 2.需要经纬度 拿到的是北京
        let city = await getCurrentCity()
        // console.log('city', city)
        // 创建地图解析器
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(city.label, (point) => {
            if (point) {
                // 
                this.map = new BMap.Map("container");
                this.map.centerAndZoom(point, 11); //point 需要的经纬度  11 显示的级别
                // map.addOverlay(new BMap.Marker(point));
                // 2 在地图上显示 比例尺 和 放大缩小 控件
                this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                this.map.addControl(new BMap.NavigationControl()) //  放大缩小
                // map.addControl(new BMap.Over)
                // 3. 发送Ajax 获得数据
                // 文字覆盖物 画一个简单覆盖物
                this.renderOverlays(city.value, 'cycle')

            }else{
                alert("您选择地址没有解析到结果!");
            }
        }, city.label);
        
        // let point = new BMap.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15);
    }
    // 渲染覆盖物
    async renderOverlays(id, type) {
        Toast.loading('正在加载',0)
        let fgwRes = await axios.get('http://192.168.1.101:8080/area/map?id=' + id)
        Toast.hide()
        // console.log('房源覆盖物', fgwRes)
        fgwRes.data.body.map( item => {
            // 解构出来
            let { coord:{ longitude, latitude },count,label:arealabel, value }  = item
            let areapoint = new BMap.Point(longitude, latitude); // 设置经纬度坐标点
            var opts = {
            position : areapoint,    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(-35, -35)    //设置文本偏移量 盒子的位置
            }
            var label = new BMap.Label("", opts);  // 创建文本标注对象
            // 1.直接写写一个div 盒子样式 直接写在里面也是对的
            // 2.  也可以调用label.setContent方法
            if(type == 'cycle') {
                label.setContent(`
                <div class="${styles.bubble}">
                <p class="${styles.name}">${arealabel}</p>
                <p>${count}套</p>
                </div>`)
            }else if( type == 'rect') {
                label.setContent(`
                <div class="${styles.rect}">
                    <span class="${styles.housename}">${arealabel}</span>
                    <span class="${styles.housenum}">${count}套</span>
                    <i class="${styles.arrow}"></i>
                </div>`)
            }

            // 覆盖物最外层的样式
            label.setStyle({
                cursor: 'pointer',
                border:'0',
                padding:'0'
            });
            //  添加点击时间
            // label.id = value
            label.addEventListener('click', e => {
                // e 是事件对象 value每一个覆盖物的id
                // console.log('点击数了', value)
                // 点击时需要判断 获得当前地图的级别判断是 
                // 11 调转到 13  13跳转到15  15调转到当前小区
                let zoom = this.map.getZoom()
                if( zoom === 11) {
                    setTimeout(() => {
                        this.map.clearOverlays();
                    }, 1);
                    // 点击放到地图到该区域中间
                    this.map.centerAndZoom(areapoint, 13);
                    this.renderOverlays(value,'cycle')
                }else if( zoom == 13) {
                    setTimeout(() => {
                        this.map.clearOverlays();
                    }, 1);
                    // 点击放到地图到该区域中间
                    this.map.centerAndZoom(areapoint, 15);
                    this.renderOverlays(value,'rect')
                }else if( zoom ==15 ) {
                    // 移动地图到中心
                    // 移动目标中心的位置 (手机屏幕高度 - 房子列表的高度)/2 ------->中心的Y的位置; 手机屏幕宽度/2 ---->中心点x的坐标
                    let senterY = ( window.innerHeight - 330 )/2;
                    let senterX = window.innerWidth/2;
                    // 点击的那个点的位置
                    let clickX = e.changedTouches[0].clientX
                    let clickY = e.changedTouches[0].clientY
                    // 算出要移动的距离 移动地图
                    let x = senterX - clickX;
                    let y = senterY - clickX;
                    this.map.panBy(x,y)
                    this.gethouselist(value)
                }
                // 清楚原来的覆盖物
               
            })
            this.map.addOverlay(label); // 添加覆盖物到地图
            })
    }
    //获取小区房子列表数据
    async gethouselist(id) {
        Toast.loading('正在加载',0)
        let reshouse = await axios.get('http://192.168.1.101:8080/houses?cityId=' + id)
        Toast.hide()
        this.setState({
            houselist:reshouse.data.body.list,
            isshow:true
        })
    }
    // 渲染房子列表
    renderHouselist() {
        return this.state.houselist.map( item => {
            return <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img className={styles.img} src={`http://192.168.1.101:8080${item.houseImg}`} alt="" />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {/* ['近地铁', '随时看房'] */}
                        {/* 循环生成标签 */}
                        {item.tags.map( (item,index) => {
                            let indexclass = styles['tag' + (index + 1)]
                           return <span className={[styles.tag,indexclass].join(' ')} key={item}>
                            {item}
                            </span>
                        })}
                        
                    </div>
                    <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
                    </div>
                </div>
            </div>
        })
    }
    render() {
        return <div className={styles.map}>
            {/* 顶部导航栏 */}
            {/* react 数据传递 1.props传， 2 在标签之前传 */}
            <NavHeader>
                地图找房
            </NavHeader>
            <div id="container"></div>
            {/* 房子样式 */}
            <div className={[styles.houseList, this.state.isshow ? styles.show : '' ].join(' ')}>
            <div className={styles.titleWrap}>
                <h1 className={styles.listTitle}>房屋列表</h1>
                <a className={styles.titleMore} href="/house/list">
                    更多房源
                </a>
            </div>
            <div className={styles.houseItems}>
                {/* 每一个房子 */}
                {this.renderHouselist()}
                </div>
            </div>
        </div>
    }
}