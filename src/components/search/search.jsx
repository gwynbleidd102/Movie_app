import React from 'react'
import { Input } from 'antd'

import './search.css'

const Search = (props) => {
  return (
    <section className="search">
      <Input.Search
        placeholder="Type to search..."
        onChange={props.onChange}
        suffix={false}
        defaultValue={props.value}
      />
    </section>
  )
}

export default Search
