const express =  require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport Config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 5000;

//DB Config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: true}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));