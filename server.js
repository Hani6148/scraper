axios = require ("axios")
express=require("express")
mongoose = require("mongoose")
cheerio=require("cheerio")

db=require("./model")

var PORT = process.env.PORT || 3002;
app=express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoUri= process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(mongoUri,{ useNewUrlParser: true })
mongoose.set('useFindAndModify', false);

//routes

app.get("/scrape",function(req,res){
    axios.get("https://www.news.com.au/sport").then(function(response){
        res.json("ok")
        var $ = cheerio.load(response.data)
        console.log($)
        $(".story-block").each(function(i,element){
            result={};
            
            result.title= $(this).children("h4").text()
            result.link= $(this).children("a").attr("href")
            result.summary=$(this).children("p").text()
            result.image=$(this).children("a").children("img").attr("src")
            
            if(result.title){
            db.Article.update({title:result.title},{$set:result},{upsert:true,setDefaultsOnInsert: true}).then(function(dbDoc){
               console.log(dbDoc)
                
            }).catch(function(err){
                console.log(err)
            })}
        })

        
       
      
    })
})
app.get("/getit",function(req,res){
    db.Article.find({saved:false}).then(function(dbArticle){
        res.json(dbArticle)
    })
})
app.get("/getsaved",function(req,res){
    db.Article.find({saved:true}).then(function(dbArticle){
        res.json(dbArticle)
    })
})

app.post("/add-note/:artid",function(req,res){
    console.log("just got it")
    db.Note.create(req.body).then(function(note){
        return db.Article.findOneAndUpdate({_id:req.params.artid},{$push: { note: note._id }},{ new: true }).populate("note")
    }).then(function(data){
        
  res.json(data)
    })
})

app.get("/get-notes/:artId",function(req,res){
    db.Article.findOne({ _id: req.params.artId })
   
    .populate("note")
    .then(function(dbArticle) {
     
      res.json(dbArticle);
    })
})


  
app.post("/save-article/:artId", function (req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.artId }, { saved: true })
        // Execute the above query
        .then(function (data) {
        

                res.json(data);
            
        }).catch(function(err){
            console.log(err)

        });
});

app.post("/unsave-article/:artId", function (req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.artId }, { saved: false })
        // Execute the above query
        .then(function (data) {
        

                res.json(data);
            
        }).catch(function(err){
            console.log(err)

        });
});

app.delete("/delete-note/:noteid/:artid",function(req,res){
   artId=req.params.artid
   noteId=req.params.noteid
    db.Note.remove({_id:noteId}).then(function(data){
        db.Article.findOne({ _id: artId })
   
        .populate("note")
        .then(function(dbArticle) {
         
          res.json(dbArticle);
        })
    })
})



app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });