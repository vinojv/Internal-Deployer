// Monitor Model Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

exports.schema = new Schema({
    processes: [{ type: Types.ObjectId, ref: 'Process' }], // process PIDs monitored
    agent: { type: Types.ObjectId, ref: 'Agent' } // parent agent
});

exports.model = mongoose.model('Monitor', exports.schema);
