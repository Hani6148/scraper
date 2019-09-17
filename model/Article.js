mongoose = require("mongoose")

Schema = mongoose.Schema 

ArticleSchema= new Schema({

    title:{
        type:String,
        required: true,

    },

    summary:{
        type:String,

    },
    saved: {
        type: Boolean,
        default:false
    },
    image:{
        type:String
    },
    link:{type:String,
    required:true},
    note:[
    {
        type:Schema.Types.ObjectId,
        ref:"Note"
    }
    ]
});

Article=mongoose.model("Article", ArticleSchema);

module.exports = Article;