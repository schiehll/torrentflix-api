# torrentflix-api

> This is the backend for [torrentflix](https://github.com/schiehll/torrentflix)

# What's it

It gives you a GraphQL API to search for movies and shows as well as getting torrent files for a given IMDbID.

It also have an endpoint that gives you an url to cast a torrent and it respective subtitle.

# How to use it

Once you clone this repo and install it's dependencies, create a `.env` file with the `OMDB_API_KEY` (you can get your key [here](http://www.omdbapi.com/apikey.aspx)) and the `POPCORN_API_URL` (you can use the one in the `.envexample`).

Then run `yarn start` and you should be good to go.

# Limitations

You will only be able to run the [frontend](https://github.com/schiehll/torrentflix) in the same machine where the server is running. If you want to cast from your phone or other machines, you will need to use something like [ngrok](https://ngrok.com/).
