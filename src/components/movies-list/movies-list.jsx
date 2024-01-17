import React from 'react'
import { Col, Row } from 'antd'

import MovieItem from '../movie-item'
import './movies-list.css'

const MoviesList = ({ movies, onRatingChange }) => {
  return (
    <section className="movies">
      <Row className="movies__list">
        {movies.map((movie) => {
          return (
            <Col className="movies__item" span={12} key={movie.id}>
              <MovieItem
                movie={movie}
                onRatingChange={(rating) => {
                  onRatingChange(movie.id, rating)
                }}
              />
            </Col>
          )
        })}
      </Row>
    </section>
  )
}

export default MoviesList
