const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split('Bearer ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.auth = decode
        return next();
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            msg: 'Auth Fail'
        })
    }
}