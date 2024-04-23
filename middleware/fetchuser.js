const jwt = require('jsonwebtoken');
const JWT_SECRET = 'usman&boy@28';

const fetchuser = (req, res, next)=>{

    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please provide a valid authentication token"})
    };
    
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({error: "Please provide a valid authentication token"})
    }
};

module.exports = fetchuser;