const fs = require('fs');
const path = require('path');
const distDir = path.resolve(__dirname, '..', 'dist-pkg', 'dist');
fs.unlinkSync(path.resolve(distDir, 'favicon.ico'));
fs.unlinkSync(path.resolve(distDir, 'manifest.json'));
fs.copyFileSync(path.resolve(__dirname, '..','LICENSE'), path.resolve(distDir, 'LICENSE'));
fs.copyFileSync(path.resolve(__dirname, '..','readme.md'), path.resolve(__dirname, 'readme.md'));
