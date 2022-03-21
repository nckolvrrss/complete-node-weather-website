const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const path = require('path')
const express = require('express')
const hbs = require('hbs')

// Define paths for Express config
const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Nikoli Antonovich',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Nikoli Antonivich',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text',
    title: 'Help',
    name: 'Nikoli Antonovich',
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address term.',
    })
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error })
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error })
        }
        res.send({
          location: location,
          forecast: forecastData,
          address: req.query.address,
        })
      })
    },
  )
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term.',
    })
  }

  console.log(req.query.search)
  res.send({
    products: [],
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '  404',
    name: 'Nikoli Antonovich',
    notFoundMessage: 'Help article could not be found',
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Nikoli Antonovich',
    notFoundMessage: "We're on a road to nowhere. Page not found.",
  })
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
