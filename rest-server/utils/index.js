
// middleware to check if request is authenticated using passport
exports.ensureAuthenticated = function (req, res, next) {
    req.isAuthenticated() ? next() : res.status(403).send('Request Not Authenticated');
};

// common read-response from mongoose.
exports.sendDbResponse = function (req, res) {
    return function (err, data) {
        if (err) return res.send(err);
        else res.send(data); 
    };
};
