const express = require('express')

const app = express()
const port = process.env.PORT || 3000
const exphbs  = require('express-handlebars')
const fs = require('fs')

// Handlebars Helpers
const hbs = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    currentYear: () => { return new Date().getFullYear() },
    screemIt: (text) => { return text.toUpperCase() }
  }
})

//Express Handlebars Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

// Express middlewares
app.use((req, res, next) => {
  const now = new Date().toString()

  const log = `${now}: ${req.method}: ${req.url}`
  fs.appendFileSync('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  })
  console.log(log)
  next()
})

// app.use((req, res, next) => {
//   res.render('maintenance', {
//     layout: false
//   })
// })

// ExMdw to serve static file
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    heading: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    heading: 'About Page'
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'bad request'
  })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})