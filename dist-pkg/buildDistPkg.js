const fs = require('fs');
const path = require('path');
const buildDir = path.resolve(__dirname, '..','build');
const distDir = path.resolve(__dirname, '..', 'dist-pkg', 'dist');

if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.renameSync(buildDir, distDir);
fs.unlinkSync(path.resolve(distDir, 'favicon.ico'));
fs.unlinkSync(path.resolve(distDir, 'manifest.json'));
fs.unlinkSync(path.resolve(distDir, 'index.html'));
fs.copyFileSync(path.resolve(__dirname, '..','LICENSE'), path.resolve(distDir, 'LICENSE'));
fs.copyFileSync(path.resolve(__dirname, '..','readme.md'), path.resolve(__dirname, 'readme.md'));
