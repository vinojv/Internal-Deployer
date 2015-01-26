// User Model Schema
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var Types = Schema.Types;

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    company: { type: Types.ObjectId, ref: 'Company' }, // company that the user belongs to
    agents: [{ type: Types.ObjectId, ref: 'Agent' }] // agents that the user has access to
});

// Execute before each user.save() call
UserSchema.pre('save', function(done) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return done();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return done(err);

        bcrypt.hash(
            user.password, 
            salt, 
            null, 
            function(err, hash) {
                if (err) return done(err);
                user.password = hash;
                done();
            }
        );
    });
});

// Verify hashed password
UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

exports.schema = UserSchema;
exports.model = mongoose.model('User', exports.schema);
