const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const ShortUrl = require(__dirname + "/models/shortUrl.js")  

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/urlDB",{useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.post("/shortUrl", function (req,res) {
    const shortUrl = new ShortUrl (
        {
            full : req.body.fullUrl
        }
    )
    shortUrl.save();
    res.redirect("/")
})

app.get("/:short", function (req,res) {
    ShortUrl.findOne({short : req.params.short}, function (err,result) {
        if (!err) {
            const sUrl = result;
            if (result) {
                result.click++;
                result.save();
                res.redirect(result.full);
            }
            else {
                res.sendStatus(404);
            }
        }
    })
})
app.get("/", function(req,res) {
    ShortUrl.find(function (err,result) {
        if (!err) {
            console.log(result);
            res.render("index", {urls: result});
        }
    })
})
app.listen(3000, function (req,res) {
    console.log("Server running at local port 3000");
})