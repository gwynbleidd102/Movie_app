import React from 'react'
import { Card, Flex } from 'antd'

import MovieItemView from '../movie-item-view'
import './movie-item.css'

const MovieItem = ({ movie, onRatingChange }) => {
  return (
    <Card className="card-movie">
      <Flex className="card-movie__flex">
        <MovieItemView movie={movie} onRatingChange={onRatingChange} />
      </Flex>
    </Card>
  )
}

export default MovieItem
