# common-logger
Common-logger is a utility that takes a set of configuration parameters and transport options, and returns a WInston logger.

Common-logger currently supports three transports: `Console`, `File` and `Syslog`.

## Install
Run `npm i @pillarwallet/common-logger`

## Examples
Instantiate a logger with default options (just writing out to Console):

```javascript
const commonLogger = require('@pillarwallet/common-logger');

commonLogger.build();
logger.debug('Hello');
```

Instantiate a logger with default options, with a console and file transport:

```javascript
const commonLogger = require('@pillarwallet/common-logger');

commonLogger.build({}, [{
  type: 'Console',
}, {
  type: 'File',
  options: {
    level: 'silly',
    filename: './logs/silly.log',
  }
}]);
logger.debug('Hello');
// -> writes to Console
// -> writes to File
```

You can add as many transports as you want, providing that they are supported (listed above). Any unrecognised transports are ignored.

# API

## Members

<dl>
<dt><a href="#constructTransports">constructTransports</a> ⇒ <code>Array</code></dt>
<dd><p>Builds an array of transports from a
list of desired transports. This function will try
to fulfil the request and cycle through the array
and match transports.</p>
</dd>
<dt><a href="#build">build</a></dt>
<dd><p>Main entrypoint function to build and return
a derived logger instance from Winston.</p>
</dd>
</dl>

<a name="constructTransports"></a>

## constructTransports ⇒ <code>Array</code>
Builds an array of transports from a
list of desired transports. This function will try
to fulfil the request and cycle through the array
and match transports.

**Kind**: global variable  
**Returns**: <code>Array</code> - constructedTransports  

| Param | Type |
| --- | --- |
| desiredTransports | <code>Array</code> | 

<a name="build"></a>

## build
Main entrypoint function to build and return
a derived logger instance from Winston.

**Kind**: global variable  

| Param | Type |
| --- | --- |
| configuration | <code>Object</code> | 
| desiredTransports | <code>Array</code> | 


* [build](#build)
    * [~winstonLogger](#build..winstonLogger)
    * [~intermediaryConfiguration](#build..intermediaryConfiguration)
    * [~constructedTransports](#build..constructedTransports)
    * [~finalConfiguration](#build..finalConfiguration)

<a name="build..winstonLogger"></a>

### build~winstonLogger
Create an instance of a derived logger from Winston,
using the finalConfiguration object build from the
previous methods.

**Kind**: inner property of [<code>build</code>](#build)  
<a name="build..intermediaryConfiguration"></a>

### build~intermediaryConfiguration
Setup scaffolding object for the
rest of the function to utilise.

**Kind**: inner constant of [<code>build</code>](#build)  
<a name="build..constructedTransports"></a>

### build~constructedTransports
Call the constructTransports method with the
incoming desired transports array.

**Kind**: inner constant of [<code>build</code>](#build)  
<a name="build..finalConfiguration"></a>

### build~finalConfiguration
Create a new object called finalConfiguration, merging
the intermediaryConfiguration, constructed transports
and the incoming configuration object, if any.

**Kind**: inner constant of [<code>build</code>](#build)  

