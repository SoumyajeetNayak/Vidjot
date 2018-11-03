const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated,(req, res)=>{
    Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas=>{
        res.render('ideas/index', {ideas:ideas});
    })
   
});

router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/users/ideas');
        }else{
            res.render('ideas/edit', {
                idea: idea
            });
        }
        
    });
   
});


router.get('/add',ensureAuthenticated, (req, res)=>{
    const title = 'Add Idea';
    res.render('ideas/add',{title:title});
});

router.post('/', ensureAuthenticated, (req, res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Title is missing'});
    }
    if(!req.body.details){
        errors.push({text: 'Details is missing'});
    }

    if(errors.length > 0){
        
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newIdea = {
            title : req.body.title,
            details: req.body.details,
            user: req.user.id
        }
       new Idea(newIdea)
       .save()
       .then(idea => {
           req.flash('success_msg', 'Video idea added successfully');
           res.redirect('/ideas');
        });
       

    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({_id : req.params.id})
    .then(idea=>{
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated successfully');
            res.redirect('/ideas');
        })
    })
});

router.delete('/:id',ensureAuthenticated, (req, res)=>{
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video Idea Removed Successfully');
        res.redirect('/ideas');
    });
});

module.exports = router;
