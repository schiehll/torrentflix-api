export default `
  enum TorrentType {
    MOVIE
    SHOW
  }

  type Torrent {
    url: String!
    quality: String!
    seeds: Int
    peers: Int
    provider: String
  }

  type Season {
    number: String!
    episodes: [Episode]
  }

  type Episode {
    number: String
    title: String!
    overview: String
    date: Int
    torrents: [Torrent]
  }

  type SearchPayload {
    imdbID: ID!
    title: String!
    poster: String
    type: TorrentType!
    year: String
  }

  type ShowInfoPayload {
    title: String!
    poster: String
    synopsis: String
    year: String
    type: TorrentType!
    seasons: [Season]
  }

  type MovieInfoPayload {
    title: String!
    poster: String
    synopsis: String
    year: String
    type: TorrentType!
    torrents: [Torrent]
  }

  input SearchInput {
    title: String!
  }

  input TorrentInfoInput {
    imdbID: ID!
  }

  type Query {
    search (input: SearchInput!): SearchPayload!
    showInfo (input: TorrentInfoInput!): ShowInfoPayload!
    movieInfo (input: TorrentInfoInput!): MovieInfoPayload!
  }
`
