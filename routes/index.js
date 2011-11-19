/*
 * @author Drew Foehn
 */
exports.geo2zip = function(req, res){
  
  var loc = req.params.loc.split(',');
  
  for(var i=0;i<loc.length;i++) {
    loc[i] = parseFloat(loc[i],10); 
  }
  
  var db = new ZipProvider('localhost', 27017), start = new Date().getTime();
  
  db.getZipByGeo(loc, function(err, result) {
    
    var elapsed = new Date().getTime() - start;
    
    delete result._id;
    res.json(result); 
    
    console.log('geo2zip elapsed time ', elapsed, "(ms)");
    
    db.close();
  });
  
};

exports.getZip = function(req, res) {
  
  var db = new ZipProvider('localhost', 27017), start = new Date().getTime();
  
  db.getZip(req.params.zip, function(err,result) {
    var elapsed = new Date().getTime() - start;
    
    delete result._id;
    res.json(result);
    
    console.log('getZip elapsed time ', elapsed, '(ms)');
    
    db.close();
  });
};

exports.installDb = function(req, res) {
  
  var csv = require('csv'), 
    db = new ZipProvider('localhost', 27017), 
    zips = [];
  
  csv().fromPath(__dirname+ "/../db/zips.csv", {
        columns: true,
        trim: true
    })
  .transform(function(data, index) {
    
    data.loc = [parseFloat(data.longitude, 10), parseFloat(data.latitude, 10)];
    
    delete data.longitude;
    delete data.latitude;
    
    return data;
    
    })
    .on("data", function(data, index) {

      if(index > 0) {
        zips.push(data);
      }
      
    })
    .on("end", function() {
      
      db.drop();
      
      db.save(zips);
       
      db.createIndex([
          {"zip" : 1},
          {"loc" :"2d"}
        ]);
      
      res.render('install', {title: 'US Zip Database Installed'});
      
      db.close();
    });
};