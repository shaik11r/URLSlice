const mongoose=require('mongoose');
const hostSchema=new mongoose.Schema({
    address:{
        type:String,
        unique:true,
        required:true,
    },
    banned:{
        type:Boolean,
        default:false,
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
});
const Host=mongoose.model('Host',hostSchema);
module.exports=Host