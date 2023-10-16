const mongoose=require('mongoose');
const {v4:uuidv4}=require('uuid')
const domainSchema=new mongoose.Schema({
    banned:{
        type:Boolean,
        default:false,
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    address:{
        type:String,
        unique:true,
        required:true,
    },
    homepage:String,
    uuid:{
        type:String,
        default:generateUUID,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
})
function generateUUID(){
    return uuidv4();
}
const Domain=mongoose.model('Domain',domainSchema);
module.exports=Domain;