import WebTorrent from 'webtorrent'
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import networkAddress from 'network-address'
import isVideo from 'is-video'
import getSubtitle from './utils/getSubtitle'
import api from './api'

const app = express()
let server = null
let client = null

app.use(cors(), bodyParser.json(), api)
app.use(express.static(path.resolve(__dirname, '../subtitles')))

app.post('/start', (req, res) => {
  if (server) server.close()

  const torrentId = req.body.torrentId

  client = new WebTorrent()
  const torrent = client.add(torrentId)

  server = torrent.createServer()
  let port = 3001

  // Pick a free port automatically
  server.listen(0, () => {
    port = server.address().port
    torrent.once('ready', async () => {
      const biggestVideoFile = torrent.files
        .filter(file => isVideo(file.name))
        .sort((a, b) => b.length - a.length)[0]

      if (!biggestVideoFile) {
        res.json({ error: 'NO_VIDEO_FILE' })
      } else {
        try {
          const subtitle = await getSubtitle(biggestVideoFile)

          const index = torrent.files.findIndex(
            file => file.name === biggestVideoFile.name
          )
          const url = `http://${networkAddress()}:${port}/${index}/${
            torrent.infoHash
          }/${encodeURIComponent(torrent.files[index].name)}`

          res.json({ url, subtitle })
        } catch (error) {
          console.log('error', error)
          res.json({ error: error.message })
        }
      }
    })
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
