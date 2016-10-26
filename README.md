# NHTSA Safety Data API

An NPM package to retrieve safety information from NHTSA for automobiles

## Basic usage

```javascript
var NHTSA = require("nhtsa-api");

var model = new NHTSA("1999","Ford","Mustang");

/**
* When the JSON body is fully received the 
* the "end" event is triggered and the full body
* is given to the handler or callback
**/
model.on("end", console.dir);

/**
* If a parsing, network or HTTP error occurs an
* error object is passed in to the handler or callback
**/
model.on("error", console.error);
