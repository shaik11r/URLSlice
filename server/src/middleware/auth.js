const passport=require('passport')

module.exports=function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    //this is handled buy passport only if it is true then we will get to login
    return next();
  }
  res.redirect("/auth/google");
  //redirect to google if not authenticated
}