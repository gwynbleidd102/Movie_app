import React from 'react'
import { Card, Flex, Typography, Tag, Space, Rate, Progress } from 'antd'
import { format } from 'date-fns'

import { GenresConsumer } from '../genres-context/genres-context'
import './movie-item.css'

import notFound from './no-image-found.jpg'

const trimDescription = (text, normalLength = 200) => {
  text = text.trim()
  if (text.length <= normalLength) {
    return text
  }
  let trimmedText = text.substring(0, normalLength)
  trimmedText = trimmedText.substring(0, trimmedText.lastIndexOf(' '))
  return `${trimmedText}...`
}

const MovieItemView = ({ movie, onRatingChange }) => {
  let releaseDate = new Date(movie.release_date)
  releaseDate = releaseDate instanceof Date && !isNaN(releaseDate) ? format(releaseDate, 'MMMM d, y') : 'n/a'
  const ratingColors = () => {
    if (movie.vote_average >= 7) {
      return '#66E900'
    } else if (movie.vote_average >= 5) {
      return '#E9D100'
    } else if (movie.vote_average >= 3) {
      return '#E97E00'
    } else {
      return '#E90000'
    }
  }

  const posterEndpoint = movie.poster_path
  const posterPath = 'https://image.tmdb.org/t/p/original'

  return (
    <GenresConsumer>
      {(genres) => {
        return (
          <React.Fragment>
            <img
              className="card-movie__poster"
              src={posterEndpoint ? posterPath + posterEndpoint : notFound}
              alt={movie.title}
            />
            <div className="card-movie__info">
              <Typography.Title className="card-movie__title">{movie.title}</Typography.Title>
              <Typography.Text className="card-movie__release-date" type="secondary">
                {releaseDate}
              </Typography.Text>
              <Space className="card-movie__genres" size={[0, 8]} wrap>
                {genres.map((genre) => {
                  if (movie.genre_ids.includes(genre.id)) {
                    return (
                      <Tag key={genre.id} className="card-movie__genre">
                        {genre.name}
                      </Tag>
                    )
                  }
                  return null
                })}
              </Space>
              <Typography.Paragraph className="card-movie__description">
                {trimDescription(movie.overview)}
              </Typography.Paragraph>
              <Rate
                className="card-movie__rate"
                allowHalf
                count={10}
                defaultValue={movie.rating}
                onChange={onRatingChange}
              ></Rate>
              <Progress
                className="card-movie__vote-average"
                type="circle"
                percent={movie.vote_average * 10}
                format={() => Math.round(movie.vote_average * 10) / 10}
                size={34}
                strokeColor={ratingColors()}
              />
            </div>
          </React.Fragment>
        )
      }}
    </GenresConsumer>
  )
}

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
