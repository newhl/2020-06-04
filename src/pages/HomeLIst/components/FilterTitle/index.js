import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle({titleSelectedStatus,onTitleClick}) {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        // true或者false 控制是否高亮
        let isSelected = titleSelectedStatus[item.type]
        return (
          // 点击标题 调用父亲函数 触底type单词 点击谁 谁高亮
        <Flex.Item key={item.type} onClick={() => {
          onTitleClick(item.type)
        }}>
          {/* 选中类名： selected */}
          <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
          <span>{item.title}</span>
            <i className="iconfont icon-arrow" />
          </span>
        </Flex.Item>)
      })}
    </Flex>
  )
}
