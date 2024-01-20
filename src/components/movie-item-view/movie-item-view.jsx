import React from 'react'
import { Typography, Tag, Space, Rate, Progress } from 'antd'
import { format } from 'date-fns'

import { trimDescription } from '../../utilities/trimDescription'
import { GenresConsumer } from '../../context/genres-context/genres-context'
import notFound from '../../assets/no-image-found.jpg'
import './movie-item-view.css'

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

export default MovieItemView
