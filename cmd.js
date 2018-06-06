#!/usr/bin/env node

/**
 * This module processes an Adobe Audience Manager (AAM) Data Feed (CDF) file and turns it
 * into a New Line delimited JSON file (NDJ)
 * @author Daniel Iñigo <dinigo@divisadero.es>
 * @module aam-cdf-parser
 * @example <caption>Call it from terminal</caption>
 * usr@path:$ ./process.js input.gz output.json
 * @example <caption>Call it explicitly with node</caption>
 * usr@path:$ node process.js input.gz output.json
 */

const {local} = require('./parser');
const chalkAnimation = require('chalk-animation');


const [, , inputFile, outputFile] = process.argv;
chalkAnimation.rainbow(`Procesando el archivo ${inputFile} -------> ${outputFile}`);
local(inputFile, outputFile).then(() => {console.log('finish')});
