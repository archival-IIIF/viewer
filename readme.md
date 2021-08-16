# Archival IIIF viewer

This software is an open-source and web-based viewer for [IIIF](https://iiif.io/). It is focused on tree views but also works with single manifests.

The viewer was developed for the Archival IIIF Server, but also works with any other IIIF server.

## Demo

https://iiif.sozialarchiv.ch

## Features

* [IIIF Image API 2 & 3](https://iiif.io/api/image/3.0/)
* [IIIF Presentation API 2 & 3](https://iiif.io/api/presentation/3.0/)
* [IIIF Authentication API](https://iiif.io/api/auth/1.0/)
* [IIIF Search API](https://iiif.io/api/search/1.0/)
* [Image](https://iiif.sozialarchiv.ch/?manifest=https://iiif.sozialarchiv.ch/iiif/manifest/Images--Amsterdam_-_Boat_-_0635.jpg), [audio](https://iiif.sozialarchiv.ch/?manifest=https://iiif.sozialarchiv.ch/iiif/manifest/Audio__&__Video--Audio--378_Amsterdam.ogg), [video](https://iiif.sozialarchiv.ch/?manifest=https://iiif.sozialarchiv.ch/iiif/manifest/Audio__&__Video--Video--Amsterdam_krijgt_nieuwe_sleepboten-519265.ogv), [pdf](https://iiif.sozialarchiv.ch/?manifest=https://iiif.sozialarchiv.ch/iiif/manifest/Info--Test.pdf) and [plain text](https://iiif.sozialarchiv.ch/?manifest=https://iiif.sozialarchiv.ch/iiif/manifest/Info--Short__information.txt) support
* Audio and video transcripts

## Download

https://github.com/archival-IIIF/viewer/releases

## Usage

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="path-to-viewer/archival-IIIF-viewer.min.css?v=x.y.z">
    </head>
    <body>
    
        <div id="root"></div>
    
        <script type="text/javascript" src="path-to-viewer/archival-IIIF-viewer.min.js?v=x.y.z"></script>
        <script type="text/javascript">
            new ArchivalIIIFViewer({id: 'root'});
        </script>
    </body>
</html>
```

### Options

<table>
    <thead>
        <tr>
            <th>key</th>
            <th>Description</th>
            <th>Example</th>
            <th>Mandatory</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>id</td>
            <td>Id of the element to append the viewer's container element to.</td>
            <td><code>'root'</code></td>
            <td>Yes</td>
            <td></td>
        </tr>
        <tr>
            <td>language</td>
            <td>Default interface language</td>
            <td><code>'en'</code></td>
            <td>No</td>
            <td></td>
        </tr>
        <tr>
            <td>manifest</td>
            <td>Initial manifest url</td>
            <td><code>'https://iiif.sozialarchiv.ch/iiif/collection/demo'</code></td>
            <td>No</td>
            <td></td>
        </tr>
        <tr>
            <td>disableSharing</td>
            <td>Disable share tab</td>
            <td><code>true</code></td>
            <td>No</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <td>disableDownload</td>
            <td>Disable download tab</td>
            <td><code>true</code></td>
            <td>No</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <td>lazyTree</td>
            <td>Make tree view lazy</td>
            <td><code>true</code></td>
            <td>No</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <td>allowedOrigins</td>
            <td>Indicates whether a manifest can be shown from the given origin.</td>
            <td>
                <code>'https://iiif.sozialarchiv.ch/'</code> or 
                <code>['https://iiif.sozialarchiv.ch', 'https://example.com']</code>
            </td>
            <td>No</td>
            <td><code>*</code></td>
        </tr>
        <tr>
            <td>externalSearchUrl</td>
            <td>External search URL</td>
            <td>
                <code>https://iiif-search.sozialarchiv.ch</code> 
            </td>
            <td>No</td>
            <td></td>
        </tr>
        <tr>
            <td>hideUnbranchedTrees</td>
            <td>Hide tree view if tree is unbranched</td>
            <td>
                <code>true</code> 
            </td>
            <td>No</td>
            <td>false</td>
        </tr>
    </tbody>
</table>

## Development

### Installation

1. Install [Node.js](https://nodejs.org/en/https://nodejs.org/en/)
1. Install [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/)
1. ```yarn install``` or ```npm install```
1. ```yarn run start``` or  ```npm run start```

### Building

1. ```yarn run build``` or  ```npm run build```

#### See also

* [iiif.io](https://iiif.io/)
* [React](https://reactjs.org/docs/getting-started.html)
* [Material UI](https://next.material-ui.com/)
* [Material icons](https://material.io/tools/icons/)
* [Material colors](https://material.io/tools/color/)
* [manifesto](https://github.com/IIIF-Commons/manifesto)
