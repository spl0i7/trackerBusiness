let mongoose = require('mongoose');
let bcrypt   = require('bcrypt');
let passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
let userSchema = mongoose.Schema(
        {
                username     : String,
                email        : String,
                hash         : String,
                salt         : String,
                inventory    : [{
                        year            : Number,
                        certification   : String,
                        price           : Number,
                        denomination    : String,
                        grade           : String,
                        comments        : {type: String, default : ''}
                }]
        }
);

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);