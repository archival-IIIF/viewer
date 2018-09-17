# Developer notes

## Redirects of info.json on different domains are not working in firefox < 63

If a info.json is redirected - for example for a restricted size - firefox outputs a cors error.

It's a bug of firefox and will be solved with version 63.

**The problem only occurs if the viewer and server are hosted on different domains, what is not the normal use case.**

Universalviewer is affected, too.