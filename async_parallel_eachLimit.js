'use strict';

var async = require("async");
var _ = require('lodash');
var EntValuationModel = require('../api/enterprise/enterprisevaluation.model');
var EntValuationCtrl = require('../api/enterprise/enterprise.controller');
var ValuationModel = require('../api/valuation/valuation.model');
var ValuationCtrl = require('../api/valuation/valuation.controller');
var TimeInterval =  5 * 60 * 1000;
var config = require('./../config/environment');
var util = require('util');

function _getHoldValuations(callback){
  var today = new Date();
  	ValuationModel.find({$and: [
	  	{ statusHoldEndDate: {$exists: true } },
	  	{ onHold:  true }, 
	  	{ cancelled: false },
	  	{ statusHoldEndDate: {$lt: new Date()} }] 
	  }).exec(function (err, data) {
        if (err) { 
          return callback(err);
        } else {
	        console.log( "Valuation status to be update cancel " + data.length);
	        valuationHoldStatusUpdateClosed(data, function () { 
          return callback(); 
        });
      	}
  	});
}

function valuationHoldStatusUpdateClosed ( dataArr ,callback ) {
  if( !dataArr || !dataArr.length){
    return callback();
  }

  async.eachLimit(dataArr,2,_update,function(err){
  	if(err)
  	console.log("err",err);
    return callback(err);
  });

  function _update(data,cb){
  	var objUpdate = {};
    objUpdate.status = "Closed";
    objUpdate.updatedAt = new Date();
    objUpdate.cancelled = true;
    objUpdate.statusHoldEndDate = "";
      
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
/*Enterprise valuation status update cancel start*/
function _getHoldEValuation(callback){
  var today = new Date();
    EntValuationModel.find({$and: [
      { statusHoldEndDate: {$exists: true } },
      { onHold:  true }, 
      { cancelled: false },
      { statusHoldEndDate: {$lt: new Date()} }] 
    }).exec(function (err, data) {
        if (err) { 
          return callback(err);
        } else {
          console.log( "Enterprise valuation status to be update cancel " + data.length);
          eValuationHoldStatusUpdateClosed(data, function () { 
          return callback();
          });
        }
    });
}

function eValuationHoldStatusUpdateClosed ( dataArr ,callback ) {
  if( !dataArr || !dataArr.length){
    return callback();
  }

  async.eachLimit(dataArr,2,_update,function(err){
    if(err)
    console.log("err",err);
    callback();
  });

  function _update(data,cb){
    var objUpdate = {};
    objUpdate.status = "Closed";
    objUpdate.updatedAt = new Date();
    objUpdate.cancelled = true;
    objUpdate.statusHoldEndDate = "";
      
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
    EntValuationModel.update({_id : data._id},{$set:objUpdate},function(err){
      return cb(err);
    });
  }
}
/*Enterprise valuation status update cancel End*/

function updateValuationAndEValuationStatus () {
  async.parallel([_getHoldValuations, _getHoldEValuation], function (err) {
    if (err)
      console.log('Error in Valuation/Evaluation status update cancel job', err);
    return setTimeout(function () { updateValuationAndEValuationStatus(); }, TimeInterval);
  });
}

exports.start = function() {
  console.log("Valuation hold status check service started " + new Date());
  updateValuationAndEValuationStatus();
};