import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});



app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: false
  })
);



app.use('/login', (req, res, next) => {
    // if (!req.session.user) {
    //     // return res.redirect('/login');
    //     next();
    // }
    // if(req.session.user.role=='user'){
    //     return res.redirect('/protected');
    // }
    // if(req.session.user.role=='admin'){
    //     return res.redirect('/admin');
    // }
    // next();
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
          return res.redirect('/admin');
        } else if (req.session.user.role === 'user') {
          return res.redirect('/protected');
        }
      }
      next();
});

app.use('/register', (req, res, next) => {
    // if (!req.session.user) {
    //     // return res.redirect('/register');
    //     next();
    // }
    if(req.session.user){
        if(req.session.user.role=='user'){
            return res.redirect('/protected');
        }
        if(req.session.user.role=='admin'){
            return res.redirect('/admin');
        }
    }
    next();
});

app.use('/protected', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    // if(req.session.user){
    //     if(req.session.user.role=='admin'){
    //         re
    //     }
    // }
    next();
});

app.use('/admin', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if(req.session.user){
        if(req.session.user.role=='user'){
            return res.redirect('/error');
        }
    }
    // if(req.session.user.role=='admin'){
    //     // return res.redirect('/admin');
    //     next();
    // }
    next();
});

app.use('/logout', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
});

app.use((req, res, next) => {
    let curr_timestamp = new Date().toUTCString();
    let req_method = req.method;
    let req_route = req.originalUrl;
    let usercheck;
    if(req.session.user){
        usercheck = "(Authenticated User)";
    }else{
        usercheck = "(Non-Authenticated User)";
    }
    console.log(curr_timestamp + ": " + req_method + " / " + req_route + usercheck);
    next();
})

// app.use('/', (req, res, next) => {
//     if (req.session.user) {
//         if(req.session.user.role=='user'){
//             return res.redirect('/protected');
//         }
//         if(req.session.user.role=='admin'){
//             return res.redirect('/admin');
//         }    
//     }
//     else{
//         console.log(req.url)
//         return res.redirect('/login');
//     }
//     next();
// });

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
