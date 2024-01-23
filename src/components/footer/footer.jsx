import React from 'react'
import { Pagination } from 'antd'

import './footer.css'

const Footer = (props) => {
  if (props.tab === 'rated') {
    return null
  }

  return (
    <footer className="footer">
      <Pagination
        className="footer__pagination"
        pageSize={20}
        current={props.page}
        defaultCurrent={1}
        // total={props.totalMovies}
        showSizeChanger={false}
        onChange={props.onChangePage}
        total={props.totalPages}
        // hideOnSinglePage={true}
      ></Pagination>
    </footer>
  )
}

export default Footer
