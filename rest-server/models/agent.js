// Agent Model Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

exports.schema = new Schema({
    host: {
        name: String, // host or instance name
        cpu: String, // CPU model
        cores: Number, // number of CPU cores
        memory: Number, // total host memory in GBs,
        os: String // host operating system name
    },
    company: { type: Types.ObjectId, ref: 'Company' },
    users: [{ type: Types.ObjectId, ref: 'User' }]
});

exports.model = mongoose.model('Agent', exports.schema);
