import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import zlib from 'zlib'
import srt2vtt from 'srt-to-vtt'
import getFileChecksumAndSize from './checksum'

const getSubtitle = async (file, lang = 'pt-br') => {
  try {
    const { checksum, size } = await getFileChecksumAndSize(file)

    const subtitles = await fetch(
      `https://rest.opensubtitles.org/search/moviehash-${checksum}/moviebytesize-${size}/sublanguageid-${lang}`,
      {
        headers: {
          'User-Agent': 'TemporaryUserAgent',
          'Content-Type': 'application/json'
        }
      }
    ).then(res => res.json())

    const subtitle = subtitles.sort((a, b) => b.score - a.score)[0]
    const filePath = path.resolve(
      __dirname,
      `../../subtitles/${subtitle.SubFileName}`
    )

    const res = await fetch(subtitle.SubDownloadLink)
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(`${filePath}.vtt`)

      res.body
        .pipe(zlib.createGunzip())
        .pipe(srt2vtt())
        .pipe(writeStream)

      writeStream
        .on('finish', () => {
          resolve()
        })
        .on('error', error => {
          reject(error)
        })
    })

    return `${subtitle.SubFileName}.vtt`
  } catch (error) {
    console.log('error', error)
    return ''
  }
}

export default getSubtitle
