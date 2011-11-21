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
    ZipProvider;

exports.ZipProvider = ZipProvider = function(host, port) {
  this.db = new Db('zips', new Server(host, port, {
    auto_reconnect: true,
    poolSize: 4
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
    if (err && cb) {
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
    if (err && cb) {
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

ZipProvider.prototype.insert = function(zips, cb) {
  this.getCollection(function(err, col) {
    if (err && cb) {
      cb(err);
    } else {
      if(cb) {
        col.insert(zips, {safe:true}, cb); 
      } else {
        col.insert(zips);
      }
    }
  });
};

ZipProvider.prototype.remove = function(zip, cb) {
  this.getCollection(function(err, col) {
    if (err && cb) {
      cb(err);
    } else {
      col.remove({
        zip: zip
      }, cb);
    }
  });
};

ZipProvider.prototype.drop = function() {
  this.getCollection(function(err, col) {
    if(!err) {
       col.drop(); 
    }
  });
};

ZipProvider.prototype.ensureIndex = function(idx,cb) {
  this.getCollection(function(err, col) {
    if (!err) {
      col.ensureIndex(idx, {background:true}, function(err, indexName) {
        if(err) {
          cb(err); 
        } else {
          cb(null, indexName);
        }
      });
    }
  });
};
