import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

const province = [
  {
    label: '北京',
    value: '01',
    children: [
      {
        label: '东城区',
        value: '01-1'
      },
      {
        label: '西城区',
        value: '01-2'
      },
      {
        label: '崇文区',
        value: '01-3'
      },
      {
        label: '宣武区',
        value: '01-4'
      }
    ]
  },
  {
    label: '浙江',
    value: '02',
    children: [
      {
        label: '杭州',
        value: '02-1',
        children: [
          {
            label: '西湖区',
            value: '02-1-1'
          },
          {
            label: '上城区',
            value: '02-1-2'
          },
          {
            label: '江干区',
            value: '02-1-3'
          },
          {
            label: '下城区',
            value: '02-1-4'
          }
        ]
      },
      {
        label: '宁波',
        value: '02-2',
        children: [
          {
            label: 'xx区',
            value: '02-2-1'
          },
          {
            label: 'yy区',
            value: '02-2-2'
          }
        ]
      },
      {
        label: '温州',
        value: '02-3'
      },
      {
        label: '嘉兴',
        value: '02-4'
      },
      {
        label: '湖州',
        value: '02-5'
      },
      {
        label: '绍兴',
        value: '02-6'
      }
    ]
  }
]

export default class FilterPicker extends Component {
  // 不管怎么点击，都需要这个组件重新创建 执行 constructor
  state = {
    val:this.props.morenValue
  }
  render() {
    // 接受父组件传来的 onCanCel,onSave 点击 取消 确定 按钮
    let { onCanCel,onSave,data,col,type } = this.props
    return (
      <>
        {/* 选择器组件： value 默认选中的值 但是默认值不应该一直是null 当选中之后再打开 就是上一次选中*/}
        <PickerView data={data} value={this.state.val} cols={col} onChange={ (val)=> {
            // console.log(val)
            this.setState({
                val:val
            })
        }}/>

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCanCel} onSave={ () => {
          // 穿选中的Filter 最好再传点击的area mode price
          onSave(type,this.state.val)
        }}/>
      </>
    )
  }
}
