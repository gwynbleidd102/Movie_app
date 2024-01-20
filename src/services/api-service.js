export default class ApiService {
  url = 'https://api.themoviedb.org'
  apiKey = 'bd60764de107367b21c4e6a1439fc831'

  getResource = async (url, page, searchText, payload, body) => {
    try {
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
        throw new Error(`Request failed with status ${res.status}`)
      }

      return await res.json()
    } catch (error) {
      console.error('API Error:', error.message)
      throw error
    }
  }

  createRatedList = (movieList, ratedList) => {
    let movies = movieList.results

    if (ratedList) {
      let ratedMovies = ratedList.results
      let resultList = movies.map((movie) => {
        let isRated = ratedMovies.some((ratedMovie) => ratedMovie.id === movie.id)

        if (isRated) {
          let ratedMovie = ratedMovies.find((ratedMovie) => ratedMovie.id === movie.id)
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

  getMovies = async (text, page, guestKey) => {
    let urlParameter

    if (text) {
      urlParameter = '/3/search/movie'
    } else {
      urlParameter = '/3/movie/popular'
    }

    const movies = await this.getResource(urlParameter, page, text)
    let ratedMovies

    if (guestKey) {
      ratedMovies = await this.getRatedMovies(1, guestKey)
    }

    return this.createRatedList(movies, ratedMovies)
  }

  setRating = (movieId, rating, guestKey) => {
    const ratingUrl = `/3/movie/${movieId}/rating`

    const guestSessionKey = {
      guest_session_id: guestKey,
    }

    const body = { value: rating }

    return this.getResource(ratingUrl, null, null, guestSessionKey, body)
  }

  getRatedMovies = (page, guestKey) => {
    const url = `/3/guest_session/${guestKey}/rated/movies`
    const sortMovies = { sort_by: 'created_at.desc' }
    return this.getResource(url, page, null, sortMovies)
  }

  getGenres = () => {
    return this.getResource('/3/genre/movie/list')
  }
}
