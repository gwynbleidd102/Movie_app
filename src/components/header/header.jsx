import React from 'react'
import { Menu, Flex } from 'antd'
import './header.css'

const items = [
  {
    label: 'Search',
    key: 'search',
  },
  {
    label: 'Rated',
    key: 'rated',
  },
]

const Header = ({ onMenuChange }) => {
  return (
    <header className="header">
      <Flex justify="center">
        <Menu mode="horizontal" defaultSelectedKeys={['search']} items={items} onClick={onMenuChange} />
      </Flex>
    </header>
  )
}

export default Header
