//User ->{domain,ip} links ->vists
const mongoose=require('mongoose');

const visitSchema=new mongoose.Schema({
    countries:{
        type:Object,
        default:{}
    },
    city:{
        type:Object,
        default:{}
    },
    created_at:{
        type:Date,
        required:true,
        default:Date.now,
    },
    updated_at:{
        type:Date,
        default:Date.now,
    },
    link_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Link',
        required:true,
    },
    referrers:{
        type:Object,
        default:{}
    },
    total:{
        type:Number,
        required:true,
        default:0
    },
    browser_chrome:{
        type:Number,
        required:true,
        default:0,
    },
    browser_edge:{
        type:Number,
        required:true,
        default:0,
    },
    browser_firefox:{
        type:Number,
        required:true,
        default:0,
    },
    browser_ie:{
        type:Number,
        requiired:true,
        default:0
    },
    browser_opera:{
        type:Number,
        required:true,
        default:0
    },
    browser_other:{
        type:Number,
        required:true,
        default:0,
    },
    browser_safari:{
        type:Number,
        required:true,
        default:0,
    },
    os_andriod:{
        type:Number,
        required:true,
        default:0,
    },
    os_ios:{
        type:Number,
        required:true,
        default:0,
    },
    os_linux:{
        type:Number,
        required:true,
        default:0,
    },
    os_macos:{
        type:Number,
        required:true,
        default:0,
    },
    os_windows:{
        type:Number,
        required:true,
        default:0,
    },
    os_others:{
        type:Number,
        required:true,
        default:0,
    },

})
const Visit=mongoose.model('Visit',visitSchema);
module.exports=Visit;