/* ZIP: 
{
  zip: '',
  state: '',
  latitude: '',
  longitude: '',
  city: '',
  state: ''
}
*/

var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID;

ZipProvider = function(host, port) {
  this.db = new Db('zips', new Server(host, port, {
    auto_reconnect: true
  }, {}));
  this.db.open(function() {});
};

ZipProvider.prototype.getCollection = function(cb) {
  this.db.collection('zip', function(error, col) {
    if (error) {
      cb(error);
    } else {
      cb(null, col);
    }
  });
};

ZipProvider.prototype.getZipByGeo = function(loc, cb) {
  this.getCollection(function(err, col) {
    if (err) {
      cb(err);
    } else {
      col.findOne({
        loc: {
          $near: loc
        }
      }, function(err, result) {
        if (err) {
          cb(err);
        } else {
          cb(null, result);
        }
      });
    }
  });

};

ZipProvider.prototype.getZip = function(zip, cb) {
  this.getCollection(function(err, col) {
    if (err) {
      cb(err);
    } else {
      col.findOne({
        zip: zip
      }, function(err, result) {
        if (err) {
          cb(err);
        } else {
          cb(null, result);
        }
      });
    }
  });
};

ZipProvider.prototype.getZipsByState = function(state, cb) {
  this.getCollection(function(err, col) {
    if (err) {
      cb(err);
    } else {
      col.find({
        stateAbbr: state
      }, function(err, result) {
        if (err) {
          cb(err);
        } else {
          cb(null, result);
        }
      });
    }
  });
};

ZipProvider.prototype.save = function(zips, cb) {
  this.getCollection(function(err, col) {
    if (err) {
      if (cb) cb(err);
    } else {
      col.insert(zips, function() {
        if (cb) cb(null, zips);
      });
    }
  });
};

ZipProvider.prototype.remove = function(zip, cb) {
  this.getCollection(function(err, col) {
    if (err) {
      if (cb) cb(err);
    } else {
      col.remove({
        zip: zip
      }, cb);
    }
  });
};

ZipProvider.prototype.close = function() {
  this.db.close();
};

ZipProvider.prototype.drop = function() {
  this.getCollection(function(err, col) {
    if(err) {
       
    } else {
       col.drop(); 
    }
  });
};

ZipProvider.prototype.ensureIndex = function(idxs) {
  var db = this.db;
  this.getCollection(function(err, col) {
    if (!err) {
      col.ensureIndex(idxs, {background:true});
    }
  });
};