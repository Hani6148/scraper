mongoose=require("mongoose")



NoteSchema= new mongoose.Schema({

    

    notebody:String
        

    
})

Note=mongoose.model("Note",NoteSchema)

module.exports=Note;