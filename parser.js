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
 */

const zlib = require('zlib');
const Transform = require('stream').Transform;
const LineStream = require('byline').LineStream;
const fs = require('fs');

// unicode separators
/**
 * @const
 * @type {string}
 * @default
 */
const FIELD_SEPARATOR = '\x01';

/**
 * @const
 * @type {string}
 * @default
 */
const ARRAY_SEPARATOR = '\x02';

/**
 * @const
 * @type {string}
 * @default
 */
const KEYVAL_SEPARATOR = '\x03';

/**
 * Parse an Adobe Audience Manager log line
 * @see [Adobe CDF documentation]{@link https://marketing.adobe.com/resources/help/en_US/aam/cdf-file-structure.html}
 * @param line - Adobe Audience Manager CDF
 * @returns {{
 *      eventTime: number, device: string, containerId: string, realizedTraits: string[],
 *      realizedSegments: string[], requestParameters: {key: string, value: string}[],
 *      referer: string, ip: string, mid: string, allSegments: string[], allTraits: string[]
 * }} The log object
 */
function parseLogLine(line) {
    // split the line into the fields
    const [
        eventTime, device, containerId, _realizedTraits, _realizedSegments,
        _requestParameters, _referer, ip, mid, _allSegments, _allTraits
    ] = line.split(FIELD_SEPARATOR);
    // convenience function for splitting into arrays and filtering empty values
    const toArray = field => field.split(ARRAY_SEPARATOR).filter(el => el !== '\\N');
    // convert not inmediate fields
    const realizedTraits = toArray(_realizedTraits);
    const realizedSegments = toArray(_realizedSegments);
    const allSegments = toArray(_allSegments);
    const allTraits = toArray(_allTraits);
    const referer = decodeURI(_referer);
    const requestParameters = _requestParameters.split(ARRAY_SEPARATOR).map(param => {
        const [key, _value] = param.split(KEYVAL_SEPARATOR);
        const value = decodeURIComponent(_value);
        return {key, value};
    });
    // return in the shape of an object
    return {
        eventTime, device, containerId, realizedTraits, realizedSegments,
        requestParameters, referer, ip, mid, allSegments, allTraits
    };
}

/**
 * Unzip stream
 */
const unzipTransform = zlib.createUnzip();

/**
 * Transform AAM CDF lines into JSON objects
 */
const parseTransform = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        const line = chunk.toString();
        const logObject = parseLogLine(line);
        this.push(logObject);
        callback();
    }
});

/**
 * Convert an object stream to a string stream. Each object will be separated
 * by a new line from the next one
 */
const stringifyTransform = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        const line = JSON.stringify(chunk) + '\n';
        this.push(line);
        callback()
    }
});

/**
 * Split binary data into lines
 * @type {LineStream}
 */
const lineTransform = new LineStream();

/**
 * Main processing function. Takes all the transformations and applies them to the streams. It emmits 'finish' event
 * when the processing is done
 * @param inputStream
 * @param outputStream
 */
function parse(inputStream, outputStream) {
    // define the streams
    return inputStream
      .pipe(unzipTransform)
      .pipe(lineTransform)
      .pipe(parseTransform)
      .pipe(stringifyTransform)
      .pipe(outputStream);
}

/**
 * Convenience function to parse local files
 * @param inputFile
 * @param outputFile
 * @return {Promise<boolean>}
 */
function local(inputFile, outputFile) {
    const input = fs.createReadStream(inputFile);
    const output = fs.createWriteStream(outputFile);
    return promiseParse(input, output);
}

/**
 * Processes input into output streams and calls the callback when it's done
 * @param inputStream
 * @param outputStream
 * @param {Function} callback
 */
function callbackParse(inputStream, outputStream, callback) {
    parse(inputStream, outputStream)
      .on('finish', () => {
          callback(null, true)
      })
      .on('error', err => {
          callback(err)
      });
}

/**
 * Processes input into output streams and resolves a promise when it's done
 * @param inputStream
 * @param outputStream
 * @returns {Promise<boolean>}
 */
function promiseParse(inputStream, outputStream) {
    return new Promise((resolve, reject) => {
        callbackParse(inputStream, outputStream, (err, flag) => {
            err? reject(err) : resolve(flag);
        })
    })
}

module.exports = {parse, local, promiseParse, callbackParse};
