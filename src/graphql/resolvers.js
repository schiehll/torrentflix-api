import fetch from 'node-fetch'

const OMDB_API_URL = `https://www.omdbapi.com?apikey=${
  process.env.OMDB_API_KEY
}&t=`

const POPCORN_API_URL = process.env.POPCORN_API_URL

export default {
  Query: {
    search: async (_, { input: { title } }) => {
      try {
        const data = await fetch(
          `${OMDB_API_URL}/${encodeURIComponent(title.trim())}`
        ).then(res => res.json())

        if (data.Error) {
          throw new Error(data.Error)
        }

        return {
          imdbID: data.imdbID,
          title: data.Title,
          poster: data.Poster,
          type: data.Type === 'movie' ? 'MOVIE' : 'SHOW'
        }
      } catch (error) {
        const err = error.message || error
        console.error(err)
        throw new Error(err)
      }
    },

    showInfo: async (_, { input: { imdbID } }) => {
      try {
        const data = await fetch(`${POPCORN_API_URL}/show/${imdbID}`).then(
          res => res.json()
        )

        if (!data) {
          throw new Error('TORRENT_NOT_FOUND')
        }

        const seasons = data.episodes.reduce((seasons, episode) => {
          return {
            ...seasons,
            [episode.season]: (seasons[episode.season] || []).concat(episode)
          }
        }, {})

        return {
          title: data.title,
          synopsis: data.synopsis,
          year: data.year,
          poster: data.images.banner,
          seasons: Object.keys(seasons).map(season => {
            const episodes = seasons[season]

            return {
              number: season,
              episodes: episodes.map(episode => ({
                number: episode.episode,
                title: episode.title,
                overview: episode.overview,
                date: episode.first_aired,
                torrents: Object.keys(episode.torrents)
                  .map(key => {
                    const torrent = episode.torrents[key]

                    return {
                      url: torrent.url,
                      seeds: torrent.seeds,
                      peers: torrent.peers,
                      provider: torrent.provider,
                      quality: key === '0' ? 'SD' : key
                    }
                  })
                  .filter(torrent => torrent.url !== null)
              }))
            }
          }),
          type: 'SHOW'
        }
      } catch (error) {
        const err = error.message || error
        console.error(err)
        throw new Error(err)
      }
    },

    movieInfo: async (_, { input: { imdbID } }) => {
      try {
        const data = await fetch(`${POPCORN_API_URL}/movie/${imdbID}`).then(
          res => res.json()
        )

        if (!data) {
          throw new Error('TORRENT_NOT_FOUND')
        }

        const enTorrents = data.torrents.en ? data.torrents.en : null

        return {
          title: data.title,
          synopsis: data.synopsis,
          year: data.year,
          poster: data.images.banner,
          torrents: (enTorrents
            ? Object.keys(enTorrents).map(key => {
                const torrent = enTorrents[key]

                return {
                  url: torrent.url,
                  seeds: torrent.seed,
                  peers: torrent.peer,
                  provider: torrent.provider,
                  quality: key === '0' ? 'SD' : key
                }
              })
            : []
          ).filter(torrent => torrent.url !== null),
          type: 'MOVIE'
        }
      } catch (error) {
        const err = error.message || error
        console.error(err)
        throw new Error(err)
      }
    }
  }
}
