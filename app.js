//dependencies
const { ifError } = require('assert');
const { error } = require('console');
const express = require('express');
const app = express();
const fs = require("fs");
const multer = require('multer');
const {createWorker} = require('tesseract.js');


//storage
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "./uploads")
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage}).single("avatar");
app.set("view engine", "ejs");

//routes
//link to the button on the search bar of the website
app.get('/', (req,res)=> {
    res.render('index');
});

app.post('/upload', (req,res)=> {
    upload(req,res,err => {
        fs.readFile(`./uploads/${req.file.originalname}`,(err, data) => {
            if(err) return console.log('This is your Error',err);

            (async () => {
                const worker = await createWorker('eng');
                const ret = await worker.recognize(data);
                //console.log(ret.data.text);
                res.send(ret.data.text);
                await worker.terminate();
              })();
              
        });
    });
});

//start up the server
const PORT = 5000 || process.env.PORT;
app.listen(PORT,()=> console.log(`Running on Port ${PORT}`));