const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = process.env.PORT = 8000;

var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



app.set("view engine", "ejs");
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post('/reqEquips', function(req, res){
    var resData = equips;
    res.json(resData);
});
app.post('/reqNotices', function(req, res){
    var resData = notices;
    res.json(resData);
});

app.get('/makeDraft', function(req, res){
    res.render("draft-elec", req.query);
});



var equips = {
   list: []
};
fs.exists('data/equips.json', function(exists) {
    if (exists) {
        fs.readFile('data/equips.json', function (err, data) {
            if (err)
                console.log(err);
            else {
                equips = JSON.parse(data);
                console.log("equips.json loaded :", equips);
            }
        });
    }
    else {
        console.log("ERROR::file not exists at 'data/equips.json'");
    }
});

var notices = {
    list: []
};
fs.exists('data/notices.json', function(exists) {
    if (exists) {
        fs.readFile('data/notices.json', function (err, data) {
            if (err)
                console.log(err);
            else {
               notices = JSON.parse(data);
                console.log("notices.json loaded :", notices);
            }
        });
    }
    else {
        console.log("ERROR::file not exists at 'data/notices.json'");
    }
});

app.listen(PORT, () => {
    console.log('Server is running at port :', PORT);
  });
  