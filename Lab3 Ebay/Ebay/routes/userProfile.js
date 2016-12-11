var mysql = require('./mysql');
var winston = require('winston');
var ObjectId = require('mongodb').ObjectId;

var mongo = require('./mongo.js');

var mq_client = require('../rpc/client');

var mongoURL = "mongodb://localhost:27017/ebay";

var soap = require('soap');
var baseURL = "http://localhost:8080/EbayAppV2/services";

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'ebayLog.log' })
	]
});

exports.accountdetails = function(req,res){
	
	//res.render('userProfile',{validationMessage:'Empty Message'});

	//Checks before redirecting whether the session is valid
	if(req.session.userid)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		//res.render("homepage",{userid:req.session.userid});
		res.render('userProfile',{validationMessage:'Empty Messgage'});
	}
	else
	{
		res.redirect('/signin');
	}


};

//chnaged
exports.getUserAccountDetails = function(req,res){
	
	console.log("userId: "+req.session.userid);
	
	var userid = req.session.userid;
	var msg_payload = {"userId":userid};
	if(userid != undefined ) {


		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getUserAccountDetails(msg_payload, function(err, result) {
				console.log("---Result: "+ result);

				if(result){
					var rs = JSON.parse(result.getUserAccountDetailsReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});
	}
	else {
		//var json_responses = {"statusCode": 401};
		res.send({"statusCode": 401});
	}
};

//chnaged
exports.getAllProductsInCart = function(req,res){
	console.log("inside get All Products from cart for user: "+req.session.userid);
	
	var userid = req.session.userid;

	var msg_payload = {"userid":userid};
	if(userid != undefined) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllProductsInCart(msg_payload, function(err, result) {
				console.log("---Result: "+ result);
				if(result){
					var rs = JSON.parse(result.getAllProductsInCartReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});
	}
};

//chnaged
exports.removeItemFromCart = function(req,res){
	console.log("Inside removeItemFromCart for user: "+req.session.userid);
	
	var userid = req.session.userid;
	var item = req.param("item");
	var msg_payload= {"userid":userid,"itemid":item.itemid};


	if(userid != undefined) {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.removeItemFromCart(msg_payload, function(err, results) {
				console.log("---Result: "+ results);

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

		/*mq_client.make_request('removeItemFromCart_queue',msg_payload, function(err,results){

			console.log(results.statusCode);
			if(err){
				throw err;
			}
			else			{
				if(results.statusCode == 200){
					console.log("removed ite from the cart.");
					res.send(results.json_responses);
				}
				else {
					console.log("Error! removing item from cart.");
					res.send({"statusCode" : 401});
				}
			}
		});*/
	}
};

//chnaged
exports.buyItemsInCart = function(req,res){

	var userId = req.session.userid;
	var creditCardNumber = req.param("CreditCardNumber");
	var msg_payload= {"userId":userId ,"creditCardNumber":creditCardNumber};
	var msg_payload2= {"userId":userId };

	if(userId != undefined) {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllProductsInCartForCheckOut1(msg_payload2, function(err, resultss) {
				console.log("---Result: "+ resultss);

				if(resultss){
					var results = JSON.parse(resultss.getAllProductsInCartForCheckOut1Return);

					//res.send(rs);
					if(results.length > 0) {
						console.log("Got all the items for userId: "+ userId);
						for(result in results) {
							AddItemToSoldTable(results[result].itemid,userId,creditCardNumber);
							updateItemQty(results[result].itemid);
							removingItemFromCart(userId,results[result].itemid);
						}
						json_responses = results;
					}
					else{
						res.send(json_responses);
						console.log("No items in cart.");
						json_responses = {"statusCode" : 401};
					}


				}
				else{
					throw err;
				}

			});
		});

		/*mq_client.make_request('buyItemsInCart_queue',msg_payload, function(err,results){

			console.log(results.statusCode);
			if(err){
				throw err;
			}
			else{
				if(results.statusCode == 200){
					console.log("Success while buying items in cart.");
					res.send(results.json_responses);
				}
				else {
					console.log("Error! while buying items from cart.");
					res.send({"statusCode" : 401});
				}
			}
		});*/
    }

}

function AddItemToSoldTable(ItemId,userId,creditCardNumber) {

	console.log("Inside addItemTOSoldTable method.")

	var option = {
		ignoredNamespaces : true
	};
	var msg_payload= {"ItemId": ItemId, "UserId":userId ,"creditCardNumber":creditCardNumber};
	var url = baseURL+"/product?wsdl";
	soap.createClient(url,option, function(err, client) {
		client.AddItemToSoldTable(msg_payload, function(err, resultss) {
			console.log("---Result: "+ resultss);

		});
	});
}

function updateItemQty(ItemId) {

	console.log("Inside updateItemQty method.")

	var option = {
		ignoredNamespaces : true
	};
	var msg_payload= {"ItemId": ItemId};
	var url = baseURL+"/product?wsdl";
	soap.createClient(url,option, function(err, client) {
		client.updateItemQty(msg_payload, function(err, resultss) {
			console.log("---Result: "+ resultss);
		});
	});
}

function removingItemFromCart(userId,ItemId) {

	console.log("Inside removingItemFromCart method.")

	var option = {
		ignoredNamespaces : true
	};
	var msg_payload= {"userId": userId,"ItemId": ItemId};
	var url = baseURL+"/product?wsdl";
	soap.createClient(url,option, function(err, client) {
		client.removingItemFromCart(msg_payload, function(err, resultss) {
			console.log("---Result: "+ resultss);

		});
	});
}

exports.updatePaymentDetailsForAuction= function(req,res){
	console.log("Inside updatePaymentDetailsForAuction method.")
	var userId = req.session.userid;
	var creditCardNumber = req.param("CreditCardNumber");
	var ItemId = req.param("ItemId");

    var option = {
        ignoredNamespaces : true
    };
    var msg_payload= {"userId":userId,"creditCardNumber": creditCardNumber,};
    var url = baseURL+"/product?wsdl";
    soap.createClient(url,option, function(err, client) {
        client.updatePaymentDetailsForAuction(msg_payload, function(err, resultss) {
            console.log("---Result: "+ resultss);
            if (!err) {
                console.log('Auction payment details updated for userId: ' + userId);
                logger.log('info', 'Auction payment details updated for userId: ' + userId);
                UpdateItemStatusToSold(ItemId);
                json_responses = {
                    "statusCode": 200
                }

                //res.send(json_responses);
            }
            else {
                console.log('ERROR! Insertion not done');
                logger.log('error', err);
                throw err;

                var json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }


        });
    });
}

function UpdateItemStatusToSold(ItemId) {

	console.log("Inside UpdateItemStatusToSold method.")

    var option = {
        ignoredNamespaces : true
    };
    var msg_payload= {"ItemId":ItemId};
    var url = baseURL+"/product?wsdl";
    soap.createClient(url,option, function(err, client) {
        client.UpdateItemStatusToSold(msg_payload, function(err, resultss) {
            console.log("---Result: "+ resultss);
            if (!err) {
                console.log('Item is sold!');
                logger.log('info','Item is sold :: ' +ItemId);
                json_responses = {
                    "statusCode" : 200
                }

                //res.send(json_responses);
            }
            else {
                console.log('ERROR! Insertion not done');
                logger.log('error',err);

                throw err;
            }


        });
    });
}



exports.getAllWonAuctions= function(req,res){
	console.log("inside getAllWonAuctions for user: "+req.session.userid);

	var userId = req.session.userid;
	var msg_payload = {"userId":userId};
	if(userId != undefined) {


        var option = {
            ignoredNamespaces : true
        };
        var url = baseURL+"/userProfile?wsdl";
        soap.createClient(url,option, function(err, client) {
            client.getAllWonAuctions(msg_payload, function(err, result) {
                console.log("---Result: "+ result);
                if(result){
                    var rs = JSON.parse(result.getAllWonAuctionsReturn);
                    console.log(rs);
                    res.send(rs);
                }
                else{
                    throw err;
                }
            });
        });
	}
	/*else {
	 var json_responses = {"statusCode": 401};
	 res.send(json_responses);
	 }*/
}

//History
exports.getAllUserDirectBuyingActivities= function(req,res){
	console.log("inside getAllUserDirectBuyingActivities for user: "+req.session.userid);

	var userId = req.session.userid;
	var msg_payload = {"userId":userId};
	if(userId != undefined) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllUserDirectBuyingActivities(msg_payload, function(err, result) {
				console.log("---Result: "+ result);
				if(result){
					var rs = JSON.parse(result.getAllUserDirectBuyingActivitiesReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});
	}
	else {
		//var json_responses = {"statusCode": 401};
		res.send({"statusCode": 401});
	}
	
	/*else {
	 var json_responses = {"statusCode": 401};
	 res.send(json_responses);
	 }*/
};

//history
exports.getAllAuctionProductHistory= function(req,res){
	console.log("Inside getAllAuctionProductHistory method.")
	var userId = req.session.userid;
	var msg_payload = {"userId":userId};
	
	if(userId != undefined) {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllAuctionProductHistory(msg_payload, function(err, result) {
				console.log("---Result: "+ result);
				if(result){
					var rs = JSON.parse(result.getAllAuctionProductHistoryReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});
		
	}
	else {
		//var json_responses = {"statusCode": 401};
		res.send({"statusCode": 401});
	}

}

//history
exports.getAllSoldProducts= function(req,res){
	
	console.log("inside getAllSoldProducts for user: "+req.session.userid);

	var userId = req.session.userid;
	var msg_payload = {"userId":userId};

	if(userId != undefined) {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllSoldProducts(msg_payload, function(err, result) {
				console.log("---Result: "+ result);
				if(result){
					var rs = JSON.parse(result.getAllSoldProductsReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});
	}
	/*else {
	 var json_responses = {"statusCode": 401};
	 res.send(json_responses);
	 }*/
};

//history
exports.getAllUserBiddingActivity = function(req,res){
	console.log("inside getAllUserBiddingActivity for user: "+req.session.userid);

	var userId = req.session.userid;
	var msg_payload = {"userId":userId};
	if(userId != undefined) {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/userProfile?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.getAllUserBiddingActivity(msg_payload, function(err, result) {
				console.log("---Result: "+ result);
				if(result){
					var rs = JSON.parse(result.getAllUserBiddingActivityReturn);
					console.log(rs);
					res.send(rs);
				}
				else{
					throw err;
				}
			});
		});

	}
}

