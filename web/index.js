
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

const mysql = require('mysql');
var path = require("path");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
var session = require('express-session');

const crypto = require("crypto");
require('dotenv').config();

var cookieParser = require('cookie-parser');
app.use(cookieParser());


let port = 3000;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

//app.get('/', (req, res) => res.send('Hello World!'))


// add & configure middleware
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true,
        maxAge: 60000
    }
}));




var _session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// let retries = 5;
// while(retries){
//     try{
//         await createConnection();
//         break;
//     }catch (err){
//         console.log(err);
//         retries -=1;
//         console.log(`retries left: ${retries}`);
//         // wait 5 seconds
//         await new Promise(res => setTimeout(res,5000));
//     }
// }


const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,    //docker inspect dc337bc3f9c2 | grep Gateway
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,  
    db_port: process.env.MYSQL_db_port
});


// connect to MYSQL database
db.connect((err) => {
    if (err) {
        console.log(" error -> " +process.env.MYSQL_HOST);
        throw err;
    }
    console.log('Connected to MySQL database');

});
global.db = db;

// -------------------------------------------------


// ---   Calling Routes -------------------------------

app.get('/', function (req, res) {
   res.render('login');

});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/register', function (req, res) {

    if (!req.body.username && !req.body.password) {
        res.render('login');
    }
    else {
        //generte unique ID:
        c = crypto.randomBytes(16).toString("hex");


        this.salt = crypto.randomBytes(16).toString('hex'); 
  
        // Hashing user's salt and password with 1000 iterations, 
        
        this.hash = crypto.pbkdf2Sync(password, this.salt,  
        1000, 64, `sha512`).toString(`hex`); 



        var username = req.body.username;
        var email = req.body.email;
        var pass = req.body.password;
        var phone = req.body.phone;

        // SESSION 
        req.session.username = username;
        req.session.password = pass;


        var data = {
            "username": username,
            "password": pass,
            "email": email,
            "phone": phone,
            "unique_id": unique_id,
        }

        // DATABASE - INSERT NEW USER
        var query = db.query('INSERT INTO users SET ?', data, function (error, results, fields) {
            if (error) throw error;
            // Neat!
            res.redirect('/game_1');
        });
    }
});


/*
    Login to the game using creds:
*/

app.post('/login', function (req, res) {

    var password = req.body.password;
    var email = req.body.email;

    if (email && password) {

        db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
            if (results.length > 0) {

                // SESSION 
                req.session.username = results[0].username;
                req.session.unique_id = results[0].unique_id;

                //req.session.expiryDate
                req.session.views = 1;


                res.render('game_1', {
                    username: results[0].username,
                    unique_id: results[0].unique_id
                });
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }

});


app.get('/game_1', function (req, res) {
    if (req.session.email) {
        res.render('game_1');
    }
    else {
        res.redirect('login');
    }

});

//Receive 2 answers:
// how do you feel  1-10
// what feeling it is  
app.post('/game_1', function (req, res) {

    
    //console.log(req.body);

    db.query('SELECT * FROM users WHERE unique_id = ? ', [req.session.unique_id], function (error, results, fields) {
        if (results.length > 0) {

            var todayDate = new Date().toISOString().slice(0, 10);

            //generate game id per game attempt
            const game_unique_id = crypto.randomBytes(16).toString("hex");
            req.session.game_unique_id = game_unique_id;
            console.log(req.session);
            var data = {
                "game_attempt_id":game_unique_id,
                "unique_id": results[0].unique_id,
                "game_date": todayDate,
                "how_do_you_feel": req.body.answer_1,
                "what_feeling": req.body.answer_2,
            }

            var username_db = results[0].username;
            var uniqueid_db = results[0].unique_id;


            var query = db.query('INSERT INTO feeling_answers SET ?', data, function (error, results, fields) {
                if (error) throw error;
            });


            // GAME_2 
            res.render(
                'game_2',
                {
                    username: username_db,
                    unique_id: uniqueid_db
                },
                function (err, html) {
                    if (err) console.log(err);
                    res.status(200).send(html);
                });

        } else {
            res.send('something is wrong with the DB query');
        }
        res.end();
    });
});



app.get('/game_2', function (req, res) {
    res.render('game_2');
});


app.post('/game_2', function (req, res) {

    //  ---- ענה ----
    // 3 answers, 1 card
    // answers can be:
    // 1.  Answer with text
    // 2.  empty - null  

    console.log(req.body.answers);
    var answer_1 = req.body.answers[0];
    var answer_2 = req.body.answers[1];
    var answer_3 = req.body.answers[2];


    var card = req.body.card;
    var skipped_card = '0';
    console.log(card);
    console.log('session ' + req.session.unique_id);

    var todayDate = new Date().toISOString().slice(0, 10);

    var post = {
        username: req.session.username,
        game_attempt_id: req.session.game_unique_id,
        unique_id: req.session.unique_id,
        card: card,
        question_1_ma_osim: answer_1,
        question_2_ma_hoshvim: answer_2,
        question_3_ma_margishim: answer_3,
        card_skipped: skipped_card,
        game_date: todayDate,
    };

    var query = db.query('INSERT INTO cards_answers SET ?', post, function (error, results, fields) {
        if (error) throw error;
        // Neat!
    });
    console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

});


// skip the card -----  דלג לקלף הבא----



app.post('/game_2_card_skipped', function (req, res) {
    
    var card = req.body.card;
    var skipped_card = '1';
    console.log(card);
    console.log('session ' + req.session.unique_id);

    var todayDate = new Date().toISOString().slice(0, 10);

    var post = {
        username: req.session.username,
        game_attempt_id: req.session.game_unique_id,
        unique_id: req.session.unique_id,
        card: card,
        question_1_ma_osim: '--',
        question_2_ma_hoshvim: '--',
        question_3_ma_margishim: '--',
        card_skipped: skipped_card,
        game_date: todayDate,
    };

    var query = db.query('INSERT INTO cards_answers SET ?', post, function (error, results, fields) {
        if (error) throw error;
        // Neat!
    });


    // redirect to game_finished

    //console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
    
});

app.get('/game_finished', function (req, res) {
    res.render('game_finished');
});


app.post('/game_finished', function (req, res) {

    var answer_1 = req.body.answer_1;
    var answer_2 = req.body.answer_2;
    var answer_3 = req.body.answer_3;
    var answer_4 = req.body.answer_4;

    var post = {
        username: req.session.username,
        game_attempt_id: req.session.game_unique_id,
        unique_id: req.session.unique_id,
        how_do_you_feel: answer_1,
        what_feeling_it_is: answer_2,
        what_has_changed: answer_3,
        how_much_it_changed: answer_4
    };

    var query = db.query('INSERT INTO finished_game SET ?', post, function (error, results, fields) {
        if (error) throw error;
        // Neat!
    });

    res.render('game_finished_2');

});


app.post('/game_finished_3', function (req, res) {
    
    // to do:  date , hour -> save into DB
    var date = req.body.date;
    var hour = req.body.hour;

});




app.get('/logout', (req, res) => {
    // res.clearCookie(cookieName);
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

//var cats = require('./routes/cat_routes.js')(app);

//const product = require('./routes/product_route'); // Imports routes for the products
//app.use('/products', product);



app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});



