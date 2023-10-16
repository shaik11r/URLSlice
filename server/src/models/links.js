const mongoose=require('mongoose');
const {v4:uuidv4}=require('uuid')
const linkSchema=new mongoose.Schema({
    address:{
        type:String,
        required:true,
    },
    description:String,
    banned:{
        type:Boolean,
        default:false,
        required:true,
    },
    domain_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Domain',
    },
    expire_in:Date,
    target:{
        type:String,
        required:true,
        maxlength:2040,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        onDelete:'CASCADE'
    },
    visit_count:{
        type:Number,
        default:0,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    uuid:{
        type:String,
        default:generateUUID,
    }
});

function generateUUID(){
    return uuidv4();//generating uuid 
}

const Link=mongoose.model('Link',linkSchema)
module.exports=Link