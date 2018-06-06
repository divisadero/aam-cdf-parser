#!/usr/bin/env node

// Imports the Google Cloud client library
const bigquery = require('@google-cloud/bigquery')();

// Obtain table location
const [,, datasetId] = process.argv;
const tableId = 'aam_cdf_logs';

// For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
const options = {
  schema: require('./schema'),
  timePartitioning: {
    type: 'DAY',
    field: 'eventTime'
  }
};

// Create a new table in the dataset
bigquery
  .dataset(datasetId)
  .createTable(tableId, options)
  .then(results => {
    const table = results[0];
    console.log(`Table ${table.id} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
