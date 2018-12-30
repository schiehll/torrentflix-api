import WebTorrent from 'webtorrent'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import networkAddress from 'network-address'
import isVideo from 'is-video'
import api from './api'

const app = express()
let server = null
let client = null

app.use(cors(), bodyParser.json(), api)

app.post('/start', (req, res) => {
  const torrentId = req.body.torrentId

  client = new WebTorrent()
  const torrent = client.add(torrentId)

  server = torrent.createServer()
  let port = 3001

  function onReady() {
    const biggestVideoFile = torrent.files
      .filter(file => isVideo(file.name))
      .sort((a, b) => b.length - a.length)[0]

    if (!biggestVideoFile) {
      res.json({ error: 'NO_VIDEO_FILE' })
    } else {
      const index = torrent.files.findIndex(
        file => file.name === biggestVideoFile.name
      )
      const url = `http://${networkAddress()}:${port}/${index}/${
        torrent.infoHash
      }/${encodeURIComponent(torrent.files[index].name)}`

      res.json({ url })
    }
  }

  function initServer() {
    if (torrent.ready) {
      onReady()
    } else {
      torrent.once('ready', onReady)
    }
  }

  server
    .listen(3001, () => {
      port = server.address().port
      initServer()
    })
    .on('error', err => {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        // If port is taken, pick a free one automatically
        server.listen(0, () => {
          port = server.address().port
          initServer()
        })
      }
    })
})

app.get('/finish', (req, res) => {
  if (server) server.close()
  if (client) client.destroy()

  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log(`Server is up in port ${3000}`)
})
