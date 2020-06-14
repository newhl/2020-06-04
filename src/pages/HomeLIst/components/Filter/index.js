import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import instance from '../../../../utils/api'
import { getCurrentCity } from '../../../../utils/CurrentCity'
// 标题高亮 false没选中
const titleSelectedStatus = {
  area:false,
  mode:false,
  price:false,
  more:false
}
// 默认选中的值
const selectedValues = {
  area:["area", null],
  mode:['null'],
  price:["null"],
  more:[]
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus:titleSelectedStatus,
    openType:'', // 控制显示隐藏的 
    filtersData:{}, // 区域, 方式, 租金, 筛选的数据 全部都有
    selectedValues:selectedValues // 默认值
  }
  componentDidMount() {
    this.getfiltersData()
  }
  async getfiltersData() {
    let city = await getCurrentCity()
    let res = await instance.get('http://192.168.1.101:8080/houses/condition?id=' + city.value)
    console.log('筛选的数据',res.data.body)
    this.setState({
      filtersData:res.data.body
    })
  }
  // 标题点击 调用的父函数
  onTitleClick = (type) => {
    // console.log('类型', type)
    let { titleSelectedStatus, selectedValues } = this.state
    // 点击谁谁就高亮
    // 有选中值的也要高亮 四个都要判断 有选中值的那个也要高亮
    let newtitleSelectedStatus = {...titleSelectedStatus}; // 新的
    for( let key in newtitleSelectedStatus ) {
      // selectedValues[key]    // 如果对应有值 这个标题应该选中 true
      if( key == type ) {   // 如果当前的是点击的那个 必须高亮 就不用判断有值了
        newtitleSelectedStatus[key] = true
        continue; // 跳出这次循环 继续下一次
      }
      let selectedVal = selectedValues[key]
      if( key == 'area' && (selectedVal !== 2 || selectedVal[0] !== 'area')) {
        // area选中
        newtitleSelectedStatus[key] = true
      }else if( key == 'mode' && selectedVal[0] !== 'null'){
        newtitleSelectedStatus[key] = true
      }else if( key == 'price' && selectedVal[0] !== 'null') {
        newtitleSelectedStatus[key] = true
      }else if( key == 'more' && selectedVal.length != 0) {
        // more 要选中
      }else {
        newtitleSelectedStatus[key] = false // 没有值不选中
      }
    }

    this.setState({
        titleSelectedStatus:newtitleSelectedStatus,
        openType:type // 点击area 就是area
    })
  }
  // 判断是否显示FilterPicker
  renderPicker = () => {
    let { 
      openType,
      filtersData:{area,subway,rentType,price},
      selectedValues
    } = this.state
    if( openType == 'area' || openType == 'mode' || openType == 'price') {
      // 选出 当前 区域 方式 租金 对应的数据 传进去显示
      let data = null;
      let col = 3;
      switch( openType ) {
        case 'area':
          data=[area,subway]
          col = 3
          break;
        case 'mode':
          data = rentType
          col = 1
          break;
        case 'price':
          data = price
          col = 1
          break;
      }
      let morenValue = selectedValues[openType]
      // key 值不同 再React内部认为这个组件是不同的组件 会一直重新打开
      return <FilterPicker key={openType} morenValue={morenValue}  type={ openType } col={col} data={data} onCanCel={this.onCancel} onSave={this.onSave}/>
    }else {
      return null // 不显示
    }
  }
  // 渲染遮罩层
  renderMask() {
    let { openType } = this.state
    if( openType == 'area' || openType == 'mode' || openType == 'price') {
      return <div className={styles.mask} onClick={ () => {
        this.setState({
          openType:""
        })
      }}/>
    }else {
      return null // 不显示
    }
  }
  // 点击 取消 关闭遮罩层和FilterPicker
  onCancel = () => {
    // 设置openType为空
    this.setState({
      openType:""
    })
  }
  // 点击 确定 关闭
  onSave = (type,val) => {
    // 接受点击确定之后的选中值 val
    console.log(val)
    console.log('xuan',type)
    // 修改默认值变成选中 下次打开就是选中的默认值
    this.setState({
      selectedValues:{
        ...this.state.selectedValues,
        [type]:val
      },
      openType:""
    })
  }
  // 是否显示 FilterMore 组件
  renderFilterMore(){
    let { 
      openType,
      filtersData:{characteristic,floor,rentType,roomType}
     } = this.state
    if( openType != 'more') {
      return null
    }
    let data = {
      characteristic,
      floor,
      rentType,
      roomType
    } 
    return <FilterMore data={data}/>
  }
  // 渲染部分
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        { this.renderMask() }

        <div className={styles.content}>
          {/* 标题栏  区域 方式 租金 筛选*/}
          <FilterTitle
          onTitleClick={this.onTitleClick}
          titleSelectedStatus={this.state.titleSelectedStatus}/>

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          { this.renderPicker() }

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
