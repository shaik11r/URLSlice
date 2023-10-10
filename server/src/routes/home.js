
const passport=require('passport');
const isAuthenticated =require('../middleware/auth')
const routes=(server)=>{
    server.get('/home',isAuthenticated,(req,res)=>{
        res.send({
            message:"hi you are authenticated",
        })
    })
}
module.exports=routes