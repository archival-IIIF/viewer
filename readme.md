# Archival IIIF viewer

## Components

![](https://raw.githubusercontent.com/archival-IIIF/server/master/docs/components.png)

## Installation

1. Install [Node.js](https://nodejs.org/en/https://nodejs.org/en/)
1. Install [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/)
1. ```yarn install``` or ```npm install```
1. ```yarn run start``` or  ```npm run start```

## Init

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="path-to-viewer/archivalIIIFViewer.min.css">
    </head>
    <body>
    
        <div id="root"></div>
    
        <script type="text/javascript" src="path-to-viewer/archivalIIIFViewer.min.js"></script>
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
            <td>'root'</td>
            <td>Yes</td>
            <td></td>
        </tr>
        <tr>
            <td>language</td>
            <td>Default interface language</td>
            <td>'en'</td>
            <td>No</td>
            <td></td>
        </tr>
        <tr>
            <td>manifest</td>
            <td>Initial manifest url</td>
            <td>'https://iiif.sozialarchiv.ch/iiif/collection/demo'</td>
            <td>No</td>
            <td></td>
        </tr>
        <tr>
            <td>disableSharing/td>
            <td>Disable share button</td>
            <td>true</td>
            <td>No</td>
            <td>false</td>
        </tr>
    </tbody>
</table>

## Supported Browsers

| Edge | Firefox | Chrome | Safari |
|------|---------|--------|--------|
| ≥ 14 | ≥ 52    | ≥ 49   | ≥ 10   |


## IIIF suport

* [IIIF Image API 2 & 3](https://iiif.io/api/image/3.0/)
* [IIIF Presentation API 2 & 3](https://iiif.io/api/presentation/3.0/)
* [IIIF Authentication API 1](https://iiif.io/api/auth/1.0/)

## Demo

https://iiif.sozialarchiv.ch

## See also

* [iiif.io](https://iiif.io/)
* [React](https://reactjs.org/docs/getting-started.html)
* [Material UI](https://next.material-ui.com/)
* [Material icons](https://material.io/tools/icons/)
* [Material colors](https://material.io/tools/color/)
* [manifesto](https://github.com/IIIF-Commons/manifesto)
