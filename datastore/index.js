const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// Crud -- Create
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('could not find id');
    } else {
      let currPath = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(currPath, text, (err) => {
        if (err) {
          throw ('could not write data');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  /*
  var id = counter.getNextUniqueId();
  items[id] = text;
  callback(null, { id, text });
  */
};

// cRud - Read
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('cannot read directory');
    } else {
      var res = _.map(files, (name) => {
        let slicedname = name.slice(0, -4);
        return {id: slicedname, text: slicedname};
      });
      callback(null, res);
    }
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

// cRud - Read single item
exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('cannot read directory');
    } else {
      let found = false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].slice(0, -4) === id) {
          found = true;
          let currPath = path.join(exports.dataDir, files[i]);
          fs.readFile(currPath, (err, data) => {
            let text = data.toString();
            callback(null, {id, text});
          });
        }
      }
      if (!found) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

// Update if ID does exist
exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('cannot read directory');
    } else {
      let found = false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].slice(0, -4) === id) {
          found = true;
          let currPath = path.join(exports.dataDir, files[i]);
          fs.writeFile(currPath, text, (err, data) => {
            callback(null, {id, text});
          });
        }
      }
      if (!found) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

//
exports.delete = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('cannot read directory');
    } else {
      let found = false;
      for (let i = 0; i < files.length; i++) {
        if (files[i].slice(0, -4) === id) {
          found = true;
          let currPath = path.join(exports.dataDir, files[i]);
          fs.unlink(currPath, (err) => {
            callback(null);
          });
        }
      }
      if (!found) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
  /*
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
  */
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

// path.join /'string of file path' , + string of data = '/dirname/data'
// Each time a POST request is made to the collection route, save a file with the todo item in this folder.
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
