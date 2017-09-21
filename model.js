const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// CREATE THE SCHEMA
const macroSchema = new Schema({
    date: String,
    protein: Number,
    calories: Number
})

// THE SCHEMA IS USELESS SO FAR, WE NEED TO CREATE A MODEL USING IT
const Macro = mongoose.model('Macro', macroSchema);

// MAKE THIS AVAILABLE TO OUR USERS IN NODE APPS
module.exports = Macro;