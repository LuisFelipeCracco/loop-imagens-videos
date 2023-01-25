const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');

//
const multer = require('multer');
const upload = multer({ dest: 'public/images/' });
//

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

function getMediaItems() {
    return fs.readdirSync(__dirname + '/public/images');
}

app.get('/', (req, res) => {
    const mediaItems = getMediaItems();
    res.render('index', { mediaItems });
});

app.use(express.static('public'));

//upload de imagens e videos, tratar para soemente receber img e video
app.get('/upload', (req, res) => {
    res.render('upload');
});


//
/*
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    fs.rename(file.path, 'public/images/' + file.originalname, function (err) {
        if (err) throw err;
        res.redirect('/upload');
    });
});
*/
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.render('upload', { error: 'Por favor, selecione um arquivo para enviar.' });
        return;
    }
    fs.rename(file.path, 'public/images/' + file.originalname, function (err) {
        if (err) throw err;
        res.redirect('/upload');
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////
app.get('/delete', (req, res) => {
    fs.readdir('public/images/', (err, files) => {
        if (err) throw err;
        res.render('delete', { files });
    });
});



app.post('/delete', upload.none(), (req, res) => {
    const file = req.body.file;
    fs.unlink(`public/images/${file}`, (err) => {
        if (err) throw err;
        res.redirect('/delete');
    });
}); 
////////////////////////////////////////////////////////////////////////////////////////////////
/* fs.watch('public/images/', (eventType, filename) => {
    if (eventType === 'change') {
        fs.readdir('public/images/', (err, files) => {
    if (err) throw err;
        // atualizar a página com os novos arquivos
        });
    }
}); */

app.listen(3000, () => {
    console.log('Server on na porta 3000');
});
