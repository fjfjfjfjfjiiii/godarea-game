const fs = require('fs');
const path = require('path');

// /opt/render/project の構造をログに出力
const projectPath = '/opt/render/project/';
fs.readdir(projectPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('Error reading project directory:', err);
    } else {
        console.log('Project directory structure:');
        files.forEach(file => console.log(file.name));
    }
});