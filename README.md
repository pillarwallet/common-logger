# common-logger
Common-logger is a utility that takes a set of configuration parameters and returns a logger.

Common-logger currently supports two log types: `Console`(stdout), `File`(stream).

## Updating this README.md
Run `npm run generateReadme` to parse the code for JSDoc comment blocks and recreate this README.md file.

## Install
Run `npm i @pillarwallet/common-logger`

## Examples
Instantiate a logger with default options (just writing out to Console): <br />
@param level - (optional) set the level for a single output stream <br />
@param name - (required) name of Log <br />
@param path - (optional) Specify the file path to which log records are written <br />
@param src - (optional - default false). Set true to enable 'src' automatic
        field with log call source info<br />

```javascript
const buildLogger = require('@pillarwallet/common-logger');

const logger = buildLogger({ level: 'info', name: 'logTest', path: __dirname , src: false });
logger.info('Logger Info Hey!');
logger.warn('Logger Warn Hey!');
logger.fatal('Logger Fatal Hey!');
logger.error('Logger Error Hey!');
// with serializer
// "serializer" functions to produce a JSON-able object from a JavaScript object, so you can easily do the following:
const req = {
  method: req.method,
  url: req.url,
  headers: req.headers
};
logger.info(req, 'Logger Info Test!');

```

To use HTTP request logger middleware, just follow the example:

```javascript
const express = require('express');

const app = express();

app.use(logger.middleware());

```


Standard serializers are:

|Field	|Description|
| ----- | --------------------------------------------------------------------------------------- |
| err |	Used for serializing JavaScript error objects, including traversing an error's cause chain for error objects with a .cause() -- e.g. as from verror.|
| req	| Common fields from a node.js HTTP request object.|
| res	| Common fields from a node.js HTTP response object.|

# API

## Members

<dl>
<dt><a href="#Constructor">Constructor</a> ⇒</dt>
<dd><p>This is the constructor of the Logger instance.
It allows to set Configuration keys:</p>
</dd>
<dt><a href="#middleware">middleware</a></dt>
<dd><p>use this method as middleware to log http requests.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#httpHeaderParser">httpHeaderParser(string, begin, end)</a> ⇒ <code>string</code></dt>
<dd><p>Simple string parser</p>
</dd>
</dl>

<a name="Constructor"></a>

## Constructor ⇒
This is the constructor of the Logger instance.
It allows to set Configuration keys:

**Kind**: global variable  
**Returns**: Object<Logger>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | (required) name of Log |
| level | <code>String</code> | (optional) set the level for a single output stream |
| path | <code>String</code> | (optional) Specify the file path to which log records are written |
| src | <code>Boolean</code> | (optional) Defaults to false. Set true to enable 'src' automatic        field with log call source info |

<a name="middleware"></a>

## middleware
use this method as middleware to log http requests.

**Kind**: global variable  

| Param |
| --- |
| req | 
| res | 
| next | 

<a name="httpHeaderParser"></a>

## httpHeaderParser(string, begin, end) ⇒ <code>string</code>
Simple string parser

**Kind**: global function  

| Param |
| --- |
| string | 
| begin | 
| end | 


test
