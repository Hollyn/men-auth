let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')

let userSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

let User = module.exports = mongoose.model('User', userSchema)

module.exports.findById = (id, callback) =>{
    User.find({_id: id}, callback)
}

module.exports.findByUsername = (username, callback) => {
    const query = {username: username}
    User.findOne(query, callback)
}

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save(newUser, callback)
        })
    })
}

module.exports.comparePassword = (candidate, hash, callback) => {
    bcrypt.compare(candidate, hash, (err, is_match) => {
        if (err) throw err
        callback(null, is_match)
    })
}