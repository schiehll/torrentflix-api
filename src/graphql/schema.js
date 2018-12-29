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

  type Episode {
    id: ID!
    title: String!
    season: String!
    overview: String
    date: Int
    torrents: [Torrent]
  }

  type SearchPayload {
    imdbID: ID!
    title: String!
    poster: String
    type: TorrentType!
  }

  interface TorrentInfo {
    title: String!
    poster: String
    synopsis: String
    year: String
    type: TorrentType!
  }

  type ShowInfoPayload implements TorrentInfo {
    title: String!
    poster: String
    synopsis: String
    year: String
    type: TorrentType!
    episodes: [Episode]
  }

  type MovieInfoPayload implements TorrentInfo {
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
