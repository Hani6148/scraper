axios = require ("axios")
express=require("express")
mongoose = require("mongoose")
cheerio=require("cheerio")

db=require("./model")

PORT=3002
app=express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoUri= process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect("mongodb://localhost/mongoHeadlines",{ useNewUrlParser: true })
mongoose.set('useFindAndModify', false);

//routes

app.get("/scrape",function(req,res){
    axios.get("https://www.news.com.au/sport").then(function(response){
        var $ = cheerio.load(response.data)
        console.log($)
        $(".story-block").each(function(i,element){
            result={};

            result.title= $(this).children("h4").text()
            result.link= $(this).children("a").attr("href")
            result.summary=$(this).children("p").text()
            db.Article.create(result).then(function(dbDoc){
                console.log(dbDoc)
                
            }).catch(function(err){
                console.log(err)
            })
        })

       
      
    })
})
app.get("/getit",function(req,res){
    db.Article.find({}).then(function(dbArticle){
        res.json(dbArticle)
    })
})
app.post("/add-note/:artid",function(req,res){
    console.log("just got it")
    db.Note.create(req.body).then(function(note){
        return db.Article.findOneAndUpdate({_id:req.params.artid},{$push: { note: note._id }},{ new: true }).populate("note")
    }).then(function(data){
  res.json(data.note)
    })
})

app.get("/get-notes/:artId",function(req,res){
    db.Article.findOne({ _id: req.params.artId })
   
    .populate("note")
    .then(function(dbArticle) {
     
      res.json(dbArticle.note);
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  