const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  // reads files asynchronously... takes in two params, a path and a callback
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  // writes file asynchornously... takes in three params, file, data, cB
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // invoke readCounter... and return the number
  readCounter((err, num) => {
    if (err) {
      throw ('could not read file');
    } else {
      writeCounter(num + 1, (err, counterString) => {
        if (err) {
          throw ('could not write counter');
        } else {
          callback(err, counterString);
          return counterString;
        }
      });
    }
  });

  /*
  // if the fileData is 0
  if (fileData === 0) {
    // invoke write=Counter
    writeCounter(count, callback);
  }
  // increment counterFile by 1
  counterFile++;
  return zeroPaddedNumber(counterFile);
  */
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
