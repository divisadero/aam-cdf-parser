#!/usr/bin/env node

/**
 * @licence
 * MIT License
 *
 * Copyright (c) 2018 by Divisadero
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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