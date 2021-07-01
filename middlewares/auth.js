 module.exports = function(req,res,next){
    if(req.session.username == undefined){
        
        res.redirect('/user/login');
    } else {
        next();
    }
 }