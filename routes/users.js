const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/Users');
const User = mongoose.model('users');

router.get('/login', (req, res)=>{
    res.render('users/login');
});

router.get('/register', (req, res)=>{
    res.render('users/register');
});

router.post('/register', (req, res) => {
    let errors = [];
   
    if(req.body.password != req.body.password2){
        errors.push({text:"failed to authenticate the user"});
    }
    if(req.body.password.length < 4){
        errors.push({text:"Password must be at least 4 chars"});
    }
    if(errors.length > 0){
        res.render('users/register', {errors: errors, name: req.body.name, email: req.body.email});
        
    }else{

        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg', 'Email already regsitered');
                res.redirect('/users/register');
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered');
                            res.redirect('login');
                        })
                        .catch(err => console.log(err))
                    });
                });
            }
        });  
    }

});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success_msg', 'Your are logged out');
    res.redirect('/users/login');
})


module.exports = router;


























