const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;


const uploadDir = path.join(__dirname, 'src');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/');
    },
    filename: (req, file, cb) => {
        const username = req.body.name || 'unknown';
        const fileExtension = path.extname(file.originalname);
        const filename = `profile-${username}${fileExtension}`;
        const filepath = path.join(uploadDir, filename);


        if (fs.existsSync(filepath)) {
            cb(new Error('Username already exists'));
        } else {
            cb(null, filename);
        }
    }
});
const upload = multer({ storage: storage }).single('image');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/upload', (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            res.status(500).json({ message: 'Multer error occurred when uploading.' });
        } else if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.json({ message: 'File uploaded successfully', file: req.file });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
