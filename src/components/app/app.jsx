import React from 'react'
import { Spin, Alert } from 'antd'
import { debounce } from 'lodash'

import ApiService from '../../services/api-service'
import { GenresProvider } from '../genres-context/genres-context'
import Header from '../header'
import Search from '../search'
import MoviesList from '../movies-list'
import Footer from '../footer'

import './app.css'

export default class App extends React.Component {
  api = new ApiService()

  state = {
    movies: [],
    genresList: [],
    totalMovies: null,
    totalRatedMovies: null,
    page: 1,
    tab: 'search',
    loading: true,
    error: false,
    searchText: '',
    guestKey: null,
    genres: [],
  }

  onSearch = (elem) => {
    this.setState({ searchText: elem.target.value, page: 1 })
    this.downloadMovies(elem.target.value)
  }

  getGuestSessionKey = () => {
    this.setState({ loading: true })
    this.api
      .createGuestSession()
      .then((data) => {
        this.setState({ loading: false, guestKey: data.guest_session_id })
      })
      .catch((err) => {
        this.setState({ loading: false, error: err })
      })
  }

  downloadMovies = (query = '', page = 1) => {
    this.setState({ loading: true })
    this.api
      .getMovies(query, page, this.state.guestKey)
      .then((response) => {
        this.setState({
          movies: response.results,
          totalMovies: response.total_results,
          page: response.page,
          loading: false,
        })
      })
      .catch(this.onError)
  }

  downloadRatedMovies = (page = 1) => {
    this.setState({ loading: true })
    this.api
      .getRatedMovies(page, this.state.guestKey)
      .then((response) => {
        this.setState({
          movies: response.results,
          totalMovies: response.total_results,
          page: response.page,
          loading: false,
          error: false,
        })
      })
      .catch((err) => {
        this.setState({ error: err, loading: false })
      })
  }

  getGenres = () => {
    this.api
      .getGenres()
      .then((data) => this.setState({ genres: data.genres }))
      .catch((err) => this.setState({ error: err }))
  }

  componentDidMount() {
    this.getGuestSessionKey()
    this.getGenres()
    this.downloadMovies()
  }

  debouncedOnSearch = debounce((elem) => this.onSearch(elem), 1000)

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  onChangePage = (page) => {
    this.setState({ page: page })
    this.downloadMovies(this.state.searchText, page)
  }

  onRatingChange = (id, rating) => {
    this.setState(({ movies }) => {
      const index = movies.findIndex((item) => item.id === id)
      const updatedMovie = { ...movies[index], rating: rating }
      return {
        movies: [...movies.slice(0, index), updatedMovie, ...movies.slice(index + 1)],
      }
    })
    this.api.setRating(id, rating, this.state.guestKey).then((response) => {
      if (!response.success) {
        this.setState({ error: true })
      }
    })
  }

  onTabChange = (tabItem) => {
    this.setState({ tab: tabItem.key })
    tabItem.key === 'search' ? this.downloadMovies(this.state.searchText, this.state.page) : null
    tabItem.key === 'rated' ? this.downloadRatedMovies() : null
  }

  render() {
    const spinner = this.state.loading ? <Spin /> : null
    const content = !(this.state.loading || this.state.error) ? (
      <GenresProvider value={this.state.genres}>
        <MoviesList movies={this.state.movies} onRatingChange={this.onRatingChange} />
      </GenresProvider>
    ) : null
    const errorMessage = this.state.error ? (
      <Alert message="Ошибка" description="Ошибка загрузки, попробуйте позже" type="error" showIcon />
    ) : null

    const noMoviesMsg =
      this.state.movies.length === 0 && !(this.state.error || this.state.loading) ? (
        <Alert
          message="Не найдено"
          description="По вашему запросу ничего не найдено, проверьте корректность введённых данных"
          type="error"
        ></Alert>
      ) : null

    const searchInput =
      this.state.tab === 'search' ? <Search onChange={this.debouncedOnSearch} value={this.state.searchText} /> : null

    return (
      <div className="container">
        <Header onMenuChange={this.onTabChange} />
        <main>
          {searchInput}
          {errorMessage}
          {spinner}
          {content}
          {noMoviesMsg}
        </main>
        <Footer totalMovies={this.state.totalMovies} page={this.state.page} onChangePage={this.onChangePage} />
      </div>
    )
  }
}
