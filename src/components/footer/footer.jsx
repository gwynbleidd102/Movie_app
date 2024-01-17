import React from 'react'
import { Pagination } from 'antd'

import './footer.css'

const Footer = (props) => {
  return (
    <footer className="footer">
      <Pagination
        className="footer__pagination"
        pageSize={10}
        current={props.page}
        defaultCurrent={1}
        total={props.totalMovies}
        showSizeChanger={false}
        onChange={props.onChangePage}
      ></Pagination>
    </footer>
  )
}

export default Footer
