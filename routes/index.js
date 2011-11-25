/*
 * @author Drew Foehn
 */

var ZipProvider = require('./../models/zipprovider-mongodb').ZipProvider;

exports.geo2zip = function(req, res) {

  var loc = req.params.loc.split(',');

  for (var i = 0; i < loc.length; i++) {
    loc[i] = parseFloat(loc[i], 10);
  }

  var db = new ZipProvider('localhost', 27017),
      start = new Date().getTime();

  db.getZipByGeo(loc, function(err, result) {

    var elapsed = new Date().getTime() - start;

    if(!err && result) {
      delete result._id;
      res.json(result);
    } else {
        res.json({errorStr: "not found", err : err} );
    }
    console.log('geo2zip elapsed time ', elapsed, "(ms)");

  });

};

exports.getZip = function(req, res) {

  var db = new ZipProvider('localhost', 27017),
      start = new Date().getTime();

  db.getZip(req.params.zip, function(err, result) {
    var elapsed = new Date().getTime() - start;

    if(!err && result) {
      delete result._id;
      res.json(result);
    } else {
      res.json({errorStr: "not found", err : err} );
    }
    
    console.log('getZip elapsed time ', elapsed, '(ms)');

  });
};

exports.installDb = function(req, res) {

  var csv = require('csv'),
      async = require('async'),
      db = new ZipProvider('localhost', 27017),
      zips = [];
      
  csv().fromPath(__dirname + "/../db/zips.csv", {
    columns: true,
    trim: true
  }).transform(function(data, index) {

    data.loc = [parseFloat(data.longitude, 10), parseFloat(data.latitude, 10)];

    delete data.longitude;
    delete data.latitude;

    return data;

  }).on("data", function(data, index) {
    zips.push(data);
  }).on("end", function() {

    db.drop();
    
    async.series({
      setZipIndex: function(cb){
        db.ensureIndex({"zip": 1}, cb);
      },
      setSpatialIndex: function(cb){
        db.ensureIndex({"loc": "2d"}, cb);
      },
      saveZipsToDB : function(cb) {
        db.insert(zips, cb);
      } 
      
    },
    function(err, results) {
      if(!err) {
       res.render('install', {
          title: 'US zipcode db installed'
        });
      }
    });
    
  });
  
};