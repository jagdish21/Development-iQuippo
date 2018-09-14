'use strict';

var _ = require('lodash');
var xslx = require('xlsx');
var Seq = require('seq');
var trim = require('trim');
var handlebars = require('handlebars');
var fs = require('fs')
var gm = require("gm");
var path = require('path');
var validator = require('validator');
var async = require('async');
var exportModel = './api/export.model';

var Export_Header = {
  "Name" : {key:"name"},
  "Email":{key:"email"},
  "Created Date": {key:"createdAt"},
  "Updated Date": {key:"updatedAt"}
}

exports.renderXLSX = function(req, res) { 
    var query = exportModel.find().sort({
      _id: -1
    });
    query.lean().exec(
      function (err, dataToExport) {
        if (err) {
          return handleError(res, err);
        }
        var csvStr = "";
        var headers = Object.keys(Export_Header);
        csvStr += headers.join(',');
        csvStr += "\r\n";
        dataToExport.forEach(function (item, idx) {
          headers.forEach(function (header) {
            var key = Export_Header[header].key;
            var val = "";
            if (key === 'createdAt') {
              val = toDanishDate(_.get(item, 'createdAt', ''));
            }
            else
            val = _.get(item, key, "");
            val = toCsvValue(val);
            csvStr += val + ",";
          });
          csvStr += "\r\n";
        });
        var csvName = req.query.type;
        csvStr = csvStr.substring(0, csvStr.length - 1);
        try {
          return renderCsv(req, res, csvStr, csvName);
        } catch (e) {
          return handleError(res, e);
        }
      });
}
function renderCsv(req,res,csv){
  var fileName = req.filename + "_" + new Date().getTime();
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader("Content-Disposition", 'attachment; filename=' + fileName + '.csv;');
  res.end(csv, 'binary');
}
function handleError(res, err) {
  return res.status(500).send(err);
}

function toCsvValue(valStr) {
  valStr = valStr + "";
  if (valStr) {
    valStr = valStr.replace(/,|\n|\r\n|\t|\u202c|;/g, ' ');
    valStr = valStr.replace(/"/g, '');
    valStr = _.trim(valStr);
  }
  if (valStr == "null" || valStr == "undefined")
    valStr = "";
  return valStr;
}

function toDanishDate(value) {
  if (!value)
    return '';
  return moment(value).utcOffset('+0530').format('YYYY-MM-DD hh:mm a');
}
