const fs = require('fs');
const path = require('path');
const {version} = require('../package.json');
const buildDir = path.resolve(__dirname, '..','build');
const distDir = path.resolve(__dirname, '..', 'dist', 'archival-IIIF-viewer-' + version + '-dist');

if (fs.existsSync(distDir)) {
    fs.rmdirSync(distDir, { recursive: true });
}
fs.renameSync(buildDir, distDir);
fs.unlinkSync(path.resolve(distDir, 'favicon.ico'));
fs.unlinkSync(path.resolve(distDir, 'manifest.json'));
fs.copyFileSync(path.resolve(__dirname, '..','LICENSE'), path.resolve(distDir, 'LICENSE'));
