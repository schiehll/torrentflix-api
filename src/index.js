const WebTorrent = require("webtorrent");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const networkAddress = require("network-address");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.get("/torrent", (req, res) => {
  const torrentId =
    "magnet:?xt=urn:btih:4bac3b4d4d4ac463ca50d427973e84db0b91be26&dn=Brooklyn.Nine-Nine.S05E01.PROPER.720p.HDTV.x264-BATV%5Beztv%5D.mkv%5Beztv%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A80&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969"; //req.body.torrentId;

  const client = new WebTorrent();
  const torrent = client.add(torrentId);

  const server = torrent.createServer();

  function initServer(port) {
    torrent.once("ready", () => {
      const index = 0;
      const url = `http://${networkAddress()}:${port}/${index}/${
        torrent.infoHash
      }/${encodeURIComponent(torrent.files[index].name)}`;

      res.send(JSON.stringify({ url }));
    });
  }

  server
    .listen(3001, () => {
      initServer(server.address().port);
    })
    .on("error", err => {
      if (err.code === "EADDRINUSE" || err.code === "EACCES") {
        // If port is taken, pick one a free one automatically
        return server.listen(0, () => {
          initServer(server.address().port);
        });
      }
    });
});

app.listen(3000, () => {
  console.log(`Server is up in port ${3000}`);
});
