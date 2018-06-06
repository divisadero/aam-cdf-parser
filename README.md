# AAM CDF Parser

![package version](https://badge.fury.io/js/aam-cdf-parser.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![dependencies](https://david-dm.org/divisadero/aam-cdf-parser.svg)

Here you have a tool for parsing Adobe Audience Manager CDF files. Those
are the log files from the DMP platform from Adobe. They use a
particular separation notation to represent in a line what is indeed a
hierarchical structure.

## Motivation

In te process of ingesting this data into a tool like BigQuery or any
data science platform we, at Divisadero, needed to transform this data
into something accessible.

The easiest way of preserving the whole _line/log_ structure without
loosing any data seemed to be another _line/log_ structure, but easier
to access.

## Installation

Simply use your preffered node package manager to add it:
```sh
yarn add aam-cdf-parser
```

## Local tryout

A small demonstration script is provided to checkout how it works in general
lines. It can be found in `cmd.js`. You can invoke it with:
```sh
./cmd.js input.gz output.ndj
```

## Create tables

We provide a small script for creating the table in BigQuery with the current
schema (defined in `schema.json`). To create the table just load the schema
on the Web UI or call the script from te terminal like so:
```sh
./mktable.js my_dataset
```
This creates in BigQuery a partitioned table (by event time, not ingestion) so
you can insert generated files directly.

## Usage

### Method `parse`
```ts
parse(in: InputStream, out: OutputStream): Stream
```
It has several convenience methods/wrappers arround the main `parse`
method. Which is the primitive method, and the core of the library.
It chains several stream transformations and returns the last one (just
in case you want to keep on chaining).
```js
const {parse} = require('aam-cdf-parser');
// ...
const input // = some.method.to.get.an.inputStream();
const output // = some.method.to.get.an.outputStream();
const onFinish = () => {console.log('done')};
parse(input, output).on('finish', onFinish);
```

### Method `promiseParse`
```ts
promiseParse(in: InputStream, out: OutputStream): Promise<boolean>
```
Import it into your code either with require or Import
```js
const {promiseParser} = require('aam-cdf-parser');
// ...
const input // = some.method.to.get.an.inputStream();
const output // = some.method.to.get.an.outputStream();
const onFinish = () => {console.log('done')};
promiseParser(input, output).then(onFinish);
```

### Method `callbackParse`
```ts
callbackParse(in: InputStream, out: OutputStream, callback: Function)
```
Import it into your code either with require or Import
```js
const {callbackParse} = require('aam-cdf-parser');
// ...
const input // = some.method.to.get.an.inputStream();
const output // = some.method.to.get.an.outputStream();
const onFinish = () => {console.log('done')};
callbackParse(input, output, onFinish);
```

### Method `local`
```ts
local(in: String, out: String, callback: Function)
```
Import it into your code either with require or Import
```js
const {callbackParse} = require('aam-cdf-parser');
// ...
const input = 'my-input-cdf-file.gz';
const output = 'my-output-file.json';
const onFinish = () => {console.log('done')};
local(input, output).then(onFinish);
```
