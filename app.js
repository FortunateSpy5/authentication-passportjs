const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = 3000,
    mongoose = require('mongoose')


// MONGOOSE CONNECT
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to database!'))
    .catch(error => console.log(error.message));

// BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));

// SET EJS AS DEFAULT
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home');
})


app.listen(port, () => console.log(`Authentication app listening on port ${port}!`))