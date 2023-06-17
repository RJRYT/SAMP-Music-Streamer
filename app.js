/**
 * Importing required packages
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const fs = require("fs");
const ejsMate = require('ejs-mate');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const AuthCode = process.env.AUTH || 'none';
/**
 * Express server setup
 */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/music', express.static(__dirname + '/music'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
/**
 * Main router
 */
app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "index.html"));
});
/**
 * Music list routers
 */
app.get("/list", (req, res) => {
    return res.render("list", { files: listAudioFiles("music/"), type: 'audio', admin: false });
});
app.get("/list/:auth", (req, res) => {
    let auth = req.params.auth;
    if (!auth) return res.status(400).send("Not authorised");
    if (auth != AuthCode) return res.status(400).send("Not authorised");
    return res.render("list", { files: listAudioFiles("music/"), type: 'audio', admin: true, code: AuthCode });
});
app.get("/music", (req, res) => {
    return res.render("musiclist", { files: listAudioFiles("music/") });
});
app.get("/delete", (req, res) => {
    return res.send('<p>To delete a audio u need auth code and file name<br>You can use auth code by params<br>That is "domain.com/delete/authcode/filename.txt" <a href="./delete/authcode/filename.txt">Demo</a><br>Audio name can get from <a href="../list">here</a></p>')
});
app.get("/delete/:auth/:file", (req, res) => {
    let auth = req.params.auth;
    let filename = req.params.file;
    if (!auth) return res.status(400).send("Not authorised");
    if (auth != AuthCode) return res.status(400).send("Not authorised");
    if (!filename) return res.status(400).send("No file given");
    let filepath = "./music/" + filename;
    fs.unlink(filepath, function (err) {
        if (err) return res.status(400).send("An Error occoured. Its because of trying to delete non exist file");
        else {
            return res.send(`<p>The file <b>${filename}</b> has deleted sucessfully</p> <a href="/list">Goto list</a>`);
        }
    });
});
/**
 * Music rename routers
 */
app.get("/rename", (req, res) => {
    return res.send('<p>To rename a audio u need auth code<br>You can use auth code by params<br>That is "domain.com/rename/authcode" <a href="../rename/authcode">Demo</a></p>')
});
app.get("/rename/:auth", (req, res) => {
    let auth = req.params.auth;
    if (!auth) return res.status(400).send("Not authorised");
    if (auth != AuthCode) return res.status(400).send("Not authorised");
    return res.render('rename', { files: listAudioFiles("music/") });
});
app.post("/api/rename", (req, res) => {
    let auth = req.body.auth;
    let file = req.body.file;
    let newname = req.body.newname;
    if (!auth) return res.status(400).send("Not authorised");
    if (auth != AuthCode) return res.status(400).send("Not authorised");
    if (!file) return res.status(400).send("No file selected");
    if (!newname) return res.status(400).send("No new name given");
    let filepath = "./music/" + file;
    if (fs.existsSync("./music/" + newname)) return res.status(400).send("This file name is already exist");
    if (newname.indexOf('/') !== -1) {
        return res.status(400).send("Invalid new name");
    }
    if (newname.indexOf('.mp3') == -1) {
        newname = newname+".mp3"
    }
    fs.rename(filepath, "./music/" + newname, function (err) {
        if (err) return res.status(400).send("An Error occoured. Its because of trying to rename non exist file");
        else {
            return res.send(`<p>The file <b>${file}</b> has renamed sucessfully to <b>${newname}</b></p> <a href="/list">Goto list</a> | <a href="../../music/${newname}">view file</a>`);
        }
    });
})
/**
 * File upload main router
 */
app.post("/upload", (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }
    const file = req.files.myFile;
    let path = __dirname + "/music/" + file.name;

    if(file.mimetype != 'audio/mpeg'){
        return res.status(400).send("Invalid file type. Only allowed .mp3 files");
    }

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ "status": "failed", "Error": "Failed to write the uploaded file to server" });
        } else {
            var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
            var fSize = file.size; i = 0; while (fSize > 900) { fSize /= 1024; i++; }
            const fsize = (Math.round(fSize * 100) / 100) + ' ' + fSExt[i];
            return res.render("info", { name: file.name, size: fsize});
        }
    });
});
/**
 * listAudioFiles is used to list audio files in a array format.
 * Eg: listAudioFiles('Path/To/Folder');
 * @param {String} dir 
 * @returns list of files as array
 */
function listAudioFiles(dir) {
    const audioFileExtensions = /\.(mp3|wav|ogg)$/i;
    let results = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(listAudioFiles(file));
        } else if (audioFileExtensions.test(file)) {
            results.push(file);
        }
    });
    return results;
}
/**
 * Listening to given port 
 */
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}/`));

