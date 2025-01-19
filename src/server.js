const fs = require('fs');
const path = require('path');

// src ディレクトリの中身を表示
const srcPath = path.resolve(__dirname);
fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('Error reading src directory:', err);
    } else {
        console.log('src directory structure:');
        files.forEach(file => console.log(file.name));
    }
});