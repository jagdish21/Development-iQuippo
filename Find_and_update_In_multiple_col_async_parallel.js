process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var _ = require('lodash');
var UserModel = require('./../api/user/user.model');
var Serivices = require('./../api/services/services.model'); 
var config = require('./../config/environment');
var async = require("async");
var util = require('util');
var mongoose = require('mongoose');

var AssetSaleBidModel = require('./../api/assetsale/assetsalebid.model');
var AuctionModel = require('./../api/auction/auction.model');
var BannerLeadModel = require('./../api/bannerlead/bannerlead.model');
var CallbackModel = require('./../api/callback/callback.model');
var EmdModel = require('./../api/common/emd.model');
var EntValuationModel = require('./../api/enterprise/enterprisevaluation.model');
var IncomingModel = require('./../components/incomingproduct.model');
var NegotiationModel = require('./../api/negotiation/negotiation.model');
var NewOfferRequestModel = require('./../api/common/newofferrequest.model');
var PaymentTransectionModel = require('./../api/payment/payment.model');
var ProductModel = require('./../api/product/product.model');
var ServiceEnqModel = require('./../api/services/services.model');
var UserRegForAuctionModel = require('./../api/auction/userregisterforauction.model');
var ValuationModel = require('./../api/valuation/valuation.model');


// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
    util.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

function init(processCb) {
    findAllEenterpiseUsers();

    function findAllEenterpiseUsers() {
        UserModel.find({"deleted": false, "role": "enterprise" }, function (err, users) {
            if (err){
                return processCb(err);
            }
            console.log('Number of Records to update:-',users.length);
            async.eachLimit(users, 3, _updateAllCollection, function (err, result) {
                if (err) {
                    console.log("##########", err);
                }
            return processCb();
            });
        });
                        
        function _updateAllCollection( user, cb) {
	    	async.parallel([productColUpdate, assetsaleColUpdate, auctionColUpdate, bannerLeadColUpdate, callbackColUpdate,
	    		emdColUpdate, enterprisevalColUpdate, incomingColUpdate, negotiationColUpdate, newofferreqColUpdate, 
	    		paymentransColUserUpdate, paymentransColRegiUpdate, paymentransColPaymentUpdateBy, paymentransColRegUpdateBy, 
	    		paymentransColBattonAssignBy, serviceenquirieColUpdate, userregforauctionColUpdate, userregforauctionColRegiUpdate, 
	    		valuationColUpdate], function (err, data) {
	            if (err) {
	                return cb(err);
	            }
	            return cb();
	        });

	        function productColUpdate(callback) {
				if ( user.mobile && user.customerId ) {
		        	ProductModel.update({'seller.mobile':user.mobile, 'seller.customerId' : { $ne: user.customerId } }, { $set: {"seller.customerId": user.customerId} }, {"multi": true}, function (error, resultData) {
		                if (error) {
		                    console.log("Error in update product collection", error);
		                }
		                if (resultData.nModified && resultData.n) {
		                	console.log( user.mobile,' Updated customer Id in product collection : ',user.customerId);	
		                }
		                return callback();
		            });
		        }
		        else {
		            return callback();
		        }
	        }

	        function assetsaleColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		AssetSaleBidModel.update({'product.seller.mobile':user.mobile, 'product.seller.customerId' : { $ne: user.customerId } }, { $set: {"product.seller.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update assetsale collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in assetsale collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function auctionColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		AuctionModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $nin: ['iqvl',user.customerId] } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update auction collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in auction collection : ",user.customerId);
	        			}
	        			return callback();	
	        		});
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function bannerLeadColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		BannerLeadModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update bannerlead collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in bannerlead collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function callbackColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		CallbackModel.update({ 'mobile':user.mobile, 'customerId' : { $ne: user.customerId } }, { $set: {"customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update callback collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in callback collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function emdColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		EmdModel.update({ 'createdBy.mobile':user.mobile, 'createdBy.customerId' : { $ne: user.customerId } }, { $set: {"createdBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update emds collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in emds collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function enterprisevalColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		EntValuationModel.update({ 'createdBy.mobile':user.mobile, 'createdBy.userCustomerId' : { $ne: user.customerId } }, { $set: {"createdBy.userCustomerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update enterprisevaluation collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in enterprisevaluation collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function incomingColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		IncomingModel.update({ 'seller.mobile':user.mobile, 'seller.customerId' : { $ne: user.customerId } }, { $set: {"seller.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update assetsale collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in assetsale collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function negotiationColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		NegotiationModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update Negotiation collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in Negotiation collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function newofferreqColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		NewOfferRequestModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update newofferrequest collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in newofferrequest collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function paymentransColUserUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		PaymentTransectionModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update paymenttransection collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in paymenttransection collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function paymentransColRegiUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		PaymentTransectionModel.update({ 'registerBy.mobile':user.mobile, 'registerBy.customerId' : { $ne: user.customerId } }, { $set: {"registerBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update paymenttransection collection registerBy.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in paymenttransection collection registerBy : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function paymentransColPaymentUpdateBy(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		PaymentTransectionModel.update({ 'paymentUpdatedBy.mobile':user.mobile, 'paymentUpdatedBy.customerId' : { $ne: user.customerId } }, { $set: {"paymentUpdatedBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update paymenttransection collection paymentUpdatedBy.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in paymenttransection collection paymentUpdatedBy : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function paymentransColRegUpdateBy(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		PaymentTransectionModel.update({ 'registrationUpdatedBy.mobile':user.mobile, 'registrationUpdatedBy.customerId' : { $ne: user.customerId } }, { $set: {"registrationUpdatedBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update paymenttransection collection registrationUpdatedBy.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in paymenttransection collection registrationUpdatedBy : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function paymentransColBattonAssignBy(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		PaymentTransectionModel.update({ 'batonAssignedBy.mobile':user.mobile, 'batonAssignedBy.customerId' : { $ne: user.customerId } }, { $set: {"batonAssignedBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update paymenttransection collection batonAssignedBy.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in paymenttransection collection batonAssignedBy : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function serviceenquirieColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		ServiceEnqModel.update({ 'quote.mobile':user.mobile, 'quote.customerId' : { $ne: user.customerId } }, { $set: {"quote.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update serviceenquiries collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in serviceenquiries collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function userregforauctionColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		UserRegForAuctionModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update user registration for auction collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in user registration for auction collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        		
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function userregforauctionColRegiUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		UserRegForAuctionModel.update({ 'registerBy.mobile':user.mobile, 'registerBy.customerId' : { $ne: user.customerId } }, { $set: {"registerBy.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update user registration for auction collection 'registerBy'.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in user registration for auction collection 'registerBy' : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        	}
	        	else {
	        		return callback();
	        	}
	        }

	        function valuationColUpdate(callback) {
	        	if ( user.mobile && user.customerId ) {
	        		ValuationModel.update({ 'user.mobile':user.mobile, 'user.customerId' : { $ne: user.customerId } }, { $set: {"user.customerId": user.customerId} }, {"multi": true}, function (error, resultData){
	        			if (error) {
	        				console.log("Error in update Individual Valuation collection.",error);
	        			}
	        			if(resultData.nModified && resultData.n){
	        				console.log(user.mobile," Updated customer Id in Individual valuation collection : ",user.customerId);
	        			}
	        			return callback();
	        		});
	        	}
	        	else {
	        		return callback();
	        	}
	        }
	   	
	    }
    }
}

if (require.main === module) {
    console.log("Started At:-- " + new Date());
    (function () {
        init(function (err, errList) {
            if (err) {
                util.log(err);
                return process.exit(1);
            }
            console.log("Done without error:-- " + new Date());
            return process.exit(0);
        });
    }());
}