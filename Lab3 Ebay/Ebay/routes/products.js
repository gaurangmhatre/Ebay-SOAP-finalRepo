var mysql = require('./mysql');
var winston = require('winston');
var ObjectId = require('mongodb').ObjectId;

var mongo = require('./mongo.js');
var mongoURL = "mongodb://localhost:27017/ebay";

var mq_client = require('../rpc/client');

var soap = require('soap');
var baseURL = "http://localhost:8080/EbayAppV2/services";

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'ebayLog.log' })
	]
});

var EventLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'ebayEventLog.log' })
	]
});

exports.getProductsPage = function(req,res){
		res.render('products',{validationMessage:'Empty Messgage'});
};

//changed
exports.getAllProducts = function(req,res){
	console.log("In getAllProducts.");

	console.log("userId: "+req.session.userid);

	var email = req.session.userid;
	//var msg_payload = {"email":email};
/*
	if(email != undefined ) {

		if(email != undefined) {
*/

			var option = {
				ignoredNamespaces : true
			};
			var url = baseURL+"/product?wsdl";
			var args = {};

			soap.createClient(url,option, function(err, client) {
				client.getAllProducts(args, function(err, result) {


							if(result){
								var rs = JSON.parse(result.getAllProductsReturn);
								console.log(rs);
								res.send(rs);
							}
							else{
								throw err;
							}


				});
			});
			
/*
		}
		else {
			//var json_responses = {"statusCode": 401};
			res.send({"statusCode": 401});
		}
	}
	else {
		var json_responses = {"statusCode": 401};
		res.send(json_responses);
	}
*/
};

//changed
exports.getAllProductsForAuction = function(req,res){
	console.log("In getAllProductsForAuction.");

	console.log("userId: "+req.session.userid);

	var email = req.session.userid;
	//var msg_payload = {"email":email};

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/product?wsdl";
		var args = {};
		soap.createClient(url,option, function(err, client) {
			client.getAllProductsForAuction(args, function(err, result) {

				if(result){
					var rs = JSON.parse(result.getAllProductsForAuctionReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});

};

//changed
exports.userAddToCart = function(req,res){
	console.log("In userAddToCart method.");

	var ItemId = req.param("ItemId");
	var Qty = 	 req.param("Qty");
	var UserId =  req.session.userid;
	var args = {"ItemId": ItemId,"Qty": Qty,"UserId":UserId};
	if(UserId != undefined) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/product?wsdl";

		soap.createClient(url,option, function(err, client) {
			client.userAddToCart(args, function(err, result) {
				console.log("---Result: "+ result);
				// if(result.validateReturn === true){
				if(result==200){
					res.send({"statusCode":200});
				}
				else{
					res.send({"statusCode":401});
				}
			});
		});
	}
	else {
		//var json_responses = {"statusCode": 401};
		res.send({"statusCode": 401});
	}

};

//changed
exports.addBidOnProduct = function(req,res){
	console.log("In addBidOnProduct method.");
	
	var ItemId = req.param("ItemId");
	var BidAmount = req.param("BidAmount");
	var UserId =  req.session.userid;

	var msg_payload = {"UserId": UserId, "ItemId":ItemId, "BidAmount":BidAmount};

	if(UserId != undefined ) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/product?wsdl";

		soap.createClient(url,option, function(err, client) {
			client.addBidOnProduct(args, function(err, result) {

                console.log("---Result: "+ result);
                // if(result.validateReturn === true){
                if(result==200){
                    res.send({"statusCode":200});
                }
                else{
                    res.send({"statusCode":401});
                }
			});
		});
	}
	else {
		var json_responses = {"statusCode": 401};
		res.send(json_responses);
	}
};

/*exports.getItemType = function(req,res){
	console.log("Inside getItemType Method.");
	
	var getItemTypeQuery = "SELECT ItemTypeId,ItemType FROM itemtype;";
	console.log("Query:: " + getItemTypeQuery);
	logger.log('info',"Query:: " + getItemTypeQuery);
	mysql.fetchData(function(err,results) {
		if(err) {
			throw err;
			logger.log('error',err);
		}
		else {
			if(results.length > 0) {
					console.log("Successful got All the ItemTypes.");
					logger.log('info',"Successful got All the ItemTypes.");

					json_responses = results;
			}
			else{
					res.send(json_responses);
					console.log("Invalid string.");
					logger.log('error', "zero itemsTypes retrived.");
					json_responses = {"statusCode" : 401};
			}
			res.send(json_responses);
		}	
		
	}, getItemTypeQuery);
	
};*/

//changed
exports.addProduct = function(req,res){
	console.log("Inside addProduct.");
	var json_responses="";

	var userId = req.session.userid;

	var ItemName = req.param("ItemName");
	var ItemDescription = req.param("ItemDescription");
	var ItemTypeId = req.param("ItemTypeId");
	var Price = req.param("Price");
	var Qty = req.param("Qty");
	var IsBidItem = req.param("IsBidItem");
	var Sold = 0;

	if(IsBidItem==1)
	{
		Qty=1; // Bid can only happen on one item at a time.
	}


	var msg_payload= {"ItemName":ItemName,"ItemDescription":ItemDescription,"ItemTypeId":1,"SellerId":userId, "Price":Price,"Qty":Qty, "IsBidItem":IsBidItem, "Sold":Sold};

	if(userId != undefined ) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/product?wsdl";


		soap.createClient(url,option, function(err, client) {
				client.addProduct(msg_payload, function(err, result) {
					console.log("---Result: "+ result);

					if(results > 0) {
						console.log("Item removed from cart");

						json_responses = {"statusCode" : 200};
					}
					else{

						console.log('No data retrieved for userId' + userid);
						json_responses = {"statusCode" : 401};
					}
					res.send(json_responses);
				});
			});
	}
};

exports.labProducts = function(req,res){
	console.log("Inside logger.");
	EventLogger.log('info', req.session.userid +"userOver Product" +new Date());
};
