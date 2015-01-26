// Company Model Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

exports.schema = new Schema({
    name: { type: String, unique: true, required: true },
    users: [{ type: Types.ObjectId, ref: 'User' }], // users belonging to the company
    agents: [{ type: Types.ObjectId, ref: 'Agent' }] // agents deployed by the company (one per host)
});

exports.model = mongoose.model('Company', exports.schema);
