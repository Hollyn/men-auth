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
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'],
        default: 'user'
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

module.exports.findByEmail = (email, callback) => {
    const query = {email: email}
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

module.exports.findAll = (callback) => {
    User.find({}, callback)
}

module.exports.update = (email, update, callback) => {
    const query = {email: email}
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err
        bcrypt.hash(update.password, salt, (err, hash) => {
            if (err) throw err
            update.password = hash
            User.findOneAndUpdate(query, update, callback)
        })
    })
}

module.exports.delete = (email, callback) => {
    const query = {email: email}
    User.findOneAndRemove(query, callback)
}