let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
let userSchema = mongoose.Schema(
        {
                username     : String,
                email        : String,
                hash         : String,
                salt         : String,
                firstname    : String,
                lastname     : String,
                inventory    : [{
                        date            : {type: Date, default : Date.now },
                        year            : Number,
                        certification   : String,
                        price           : Number,
                        denomination    : String,
                        grade           : String,
                        comments        : {type: String, default : ''},
                }],
                soldcoins   : [{
                    date            : {type: Date, default : Date.now },
                    year            : Number,
                    certification   : String,
                    price           : Number,
                    denomination    : String,
                    grade           : String,
                    comments        : {type: String, default : ''},
                }],
                regrade :[{
                    date            : {type: Date, default : Date.now },
                    year            : Number,
                    certification   : String,
                    price           : Number,
                    denomination    : String,
                    grade           : String,
                    comments        : {type: String, default : ''},
                }]
        }
);

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);