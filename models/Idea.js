const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    data:{
        type:Date,
        default:Date.now
    },
    user:{
        type: String,
        required: true
    },
});

mongoose.model('ideas', IdeaSchema);