const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static'))

// Set EJS as the view engine
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('layout', { title: 'Home', mainContent: 'partials/home', footer: 'partials/home/footer' });
})

app.get('/contact', (req, res) => {
    res.render('layout', { title: 'Contact', mainContent: 'partials/contact', footer: 'partials/footer' });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})