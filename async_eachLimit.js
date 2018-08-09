'use strict';

var async = require("async");
var _ = require('lodash');
/*var EntValuationModel = require('../api/enterprise/enterprisevaluation.model');
var EntValuationCtrl = require('../api/enterprise/enterprise.controller');*/
var ValuationModel = require('../api/valuation/valuation.model');
var ValuationCtrl = require('../api/valuation/valuation.controller');
/*var User = require('../api/user/user.model');*/
var TimeInterval =  6 * 5000;
var config = require('./../config/environment');
var util = require('util');

function getHoldValuations(){
  var today = new Date();
  	ValuationModel.find({$and: [
	  	{ statusHoldEndDate: {$exists: true } },
	  	{ onHold:  true }, 
	  	{ cancelled: false },
	  	{ statusHoldEndDate: {$lt: new Date()} }] 
	  }).exec(function (err, data) {
        if (err) { 
          return setTimeout(function () { getHoldValuations(); }, TimeInterval); //sleep 
        } else {
	        console.log( "Number of valuation status to be update cancel " + data.length);
	        valuationHoldStatusUpdateClosed(data, function () { getHoldValuations(); });
      	}
  	});
}

function valuationHoldStatusUpdateClosed ( dataArr ,cb ) {
  if( !dataArr || !dataArr.length){
    return setTimeout(function () { getHoldValuations(); },TimeInterval);
  }

  async.eachLimit(dataArr,2,_update,function(err){
  	if(err)
  	console.log("err",err);
  	setTimeout(function () { getHoldValuations(); },TimeInterval);
  });

  function _update(data,cb){
  	var objUpdate = {};
    objUpdate.status = "Closed";
    objUpdate.updatedAt = new Date();
    objUpdate.cancelled = true;
      
    var objSt = {};
  	objSt.status = "Closed";
  	objSt.createdAt = new Date();
  	objSt.fname = "System";
  	objSt.lname = "Auto";
      
    if (!data.statuses){
    	objUpdate.statuses = [];
    }
    else {
   	objUpdate.statuses = data.statuses;	
    }
    objUpdate.statuses.push(objSt);
    ValuationModel.update({_id : data._id},{$set:objUpdate},function(err){
     return cb(err);
  	});
  }
}

exports.start = function() {
  console.log("Valuation hold status check service started " + new Date());
  getHoldValuations();
};