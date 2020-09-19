const
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    port = 3000,
    passport = require('passport'),
    bodyParser = require('body-parser'),
    User = require('./models/user'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');


// MONGOOSE CONNECT
mongoose.connect('mongodb://localhost:27017/auth_app', {
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

// PASSPORT
app.use(require('express-session')({
    secret: 'To be or not to be that is the question',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// ===============================================================
// ROUTES
// ===============================================================

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret');
});

// Auth Routes

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', (req, res) => {
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err.message);
            return res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secret');
            });
        }
    });
});

//login

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {});

//logout

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Logged in?

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.listen(port, () => console.log(`Authentication app listening on port ${port}!`));