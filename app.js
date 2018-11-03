const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');


const app = express();

const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

mongoose.Promise = global.Promise;


//Connect to MongoDB
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() =>{
    console.log('mongoDbConnected');
}).catch(error => console.log(error));




app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null ;
    next();
});


const PORT = process.env.PORT || 5000;

//Index Route
app.get('/', (req, res)=>{
    const title = 'Welcome';
    res.render('index',{title:title});
});

app.get('/about', (req, res)=>{
    const title = 'About';
    res.render('about',{title:title});
});

app.use('/ideas', ideas);
app.use('/users', users)





























app.listen(PORT, ()=>{
    console.log(`Server Started on Port ${PORT}`);
})