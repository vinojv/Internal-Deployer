// Process Model Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

exports.schema = new Schema({
    pid: { type: Number, required: true }, // process's PID
    user: { type: Types.ObjectId, ref: 'User' }, // user that forked this process
    agent: { type: Types.ObjectId, ref: 'Agent' } // agent that the process belongs to
});

exports.model = mongoose.model('Process', exports.schema);
