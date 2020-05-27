var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database')
let User = require('../models/user')

module.exports = (passport) => {

    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload)
        User.findById(jwt_payload.data._id, (err, user) => {
            if (err) return done(err, false)

            if (user) return done(null, user)
            else return done(null, false)
        })
    }))
    
} 