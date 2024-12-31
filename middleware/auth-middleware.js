const jwt = require('jsonwebtoken');


const isAuth= async (req, res, next) => {
    try{
        const AuthHeader = req.headers['authorization'];
        console.log(AuthHeader);
        
        const token = AuthHeader && AuthHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Not authenticated!'})
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decoded);

        req.userInfo=decoded;
        next();
        

    }
    catch(error){
        res.status(401).json({message: 'Not authenticated!'})
    }
}

module.exports=isAuth;