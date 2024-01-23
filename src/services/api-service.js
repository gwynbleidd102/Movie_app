export default class ApiService {
  url = 'https://api.themoviedb.org'
  apiKey = 'bd60764de107367b21c4e6a1439fc831'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDYwNzY0ZGUxMDczNjdiMjFjNGU2YTE0MzlmYzgzMSIsInN1YiI6IjY1ODgwMDgwZTI5NWI0NzA1MzU4NjUzNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6CQMtQm4ilwQpbOoH4vGB-BIBKy3sS5um0WfHsdi498',
    },
  }

  getResource = async (url, page, searchText, payload, body) => {
    let fetchUrl = new URL(url, this.url)
    fetchUrl.searchParams.append('api_key', this.apiKey)
    if (page) {
      fetchUrl.searchParams.append('page', page)
    }

    fetchUrl.searchParams.append('language', 'en-US')

    if (searchText) {
      searchText = searchText.trim()
      fetchUrl.searchParams.append('query', searchText)
    }

    if (payload) {
      for (let key in payload) {
        fetchUrl.searchParams.append(key, payload[key])
      }
    }
    let res
    if (body) {
      res = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ ...body }),
      })
    } else {
      res = await fetch(fetchUrl)
    }

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`)
    }

    return await res.json()
  }

  createRatedList = (movieList, ratedList) => {
    let movies = movieList.results

    if (ratedList) {
      let ratedMovies = ratedList.results
      let resultList = movies.map((movie) => {
        let isRated = ratedMovies.some((ratedMovie) => {
          return ratedMovie.id === movie.id
        })
        if (isRated) {
          let ratedMovie = ratedMovies.find((ratedMovie) => {
            return ratedMovie.id === movie.id
          })

          movie.rating = ratedMovie.rating
        }

        return movie
      })
      movieList.results = resultList
    }

    return new Promise((resolve) => {
      resolve(movieList)
    })
  }

  createGuestSession = () => {
    return this.getResource(`${this.url}/3/authentication/guest_session/new`)
  }

  createGuestSessionAndSaveId = async () => {
    try {
      const { guest_session_id } = await this.createGuestSession()
      localStorage.setItem('guestSessionId', guest_session_id)
      // console.log('Guest session ID::', guest_session_id)
    } catch (error) {
      console.error('Error creating guest session:', error)
      throw error
    }
  }

  getMovies = async (text, page, guestKey) => {
    let urlParameter
    if (text) {
      urlParameter = '/3/search/movie'
    } else {
      urlParameter = '/3/movie/popular'
    }
    try {
      const movies = await this.getResource(urlParameter, page, text)
      let ratedMovies
      if (guestKey) {
        ratedMovies = await this.getRatedMovies(1, guestKey)
      }

      return this.createRatedList(movies, ratedMovies)
    } catch (error) {
      console.error('Ошибка при получении фильмов:', error)
      throw error
    }
  }

  setRating = async (movieId, rating, guestKey) => {
    const ratingUrl = `/3/movie/${movieId}/rating`
    const guestSessionKey = {
      guest_session_id: guestKey,
    }
    const body = { value: rating }

    try {
      const response = await this.getResource(ratingUrl, null, null, guestSessionKey, body)
      if (!response.success) {
        throw new Error('Оценка фильма не удалась')
      }
      return response
    } catch (error) {
      console.error('Ошибка при оценке фильма:', error)
      throw error
    }
  }

  getRatedMovies = async (page, guestKey) => {
    const url = `/3/guest_session/${guestKey}/rated/movies`
    const sortMovies = { sort_by: 'created_at.desc' }

    try {
      const response = await this.getResource(url, page, null, sortMovies)
      if (!response.results) {
        throw new Error('Не удалось получить оцененные фильмы')
      }
      return response
    } catch (error) {
      console.error('Ошибка при получении оцененных фильмов:', error)
      throw error
    }
  }

  getGenres = async () => {
    try {
      const response = await this.getResource('/3/genre/movie/list')
      if (!response.genres) {
        throw new Error('Не удалось получить жанры фильмов')
      }
      return response
    } catch (error) {
      console.error('Ошибка при получении жанров фильмов:', error)
      throw error
    }
  }
}
