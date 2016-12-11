var mysql = require('./mysql');
var bcrypt = require('./bCrypt.js');
var winston = require('winston');
var ObjectId = require('mongodb').ObjectId;


var mongo = require('./mongo.js');

var mq_client = require('../rpc/client');

var mongoURL = "mongodb://localhost:27017/ebay";
//-----------------
var soap = require('soap');
//var baseURL = "http://localhost:8080/LoginApp/services";

var baseURL = "http://localhost:8080/EbayAppV2/services";
//http://localhost:8080/EbayAppV2/services/home
//http://localhost:8080/WebServiceProject/services/home


var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'ebayLog.log' })
	]
});

//Redirects to the homepage
exports.redirectToHome = function(req,res) {
	//Checks before redirecting whether the session is valid
	if(req.session.userid)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		//res.render("homepage",{userid:req.session.userid});
		res.render('products',{validationMessage:'Empty Messgage'});
	}
	else
	{
		res.redirect('/signin');
	}
};

exports.signup=function (req,res) {
	getAllAuctionResults();
	
	res.render('signup', { validationMessage: 'Empty Message'});
};

exports.signin = function(req,res){
	getAllAuctionResults();
	res.render('signin',{validationMessage:'Empty Message'});
};

//Changed
exports.checksignup = function(req,res){ //check if email ID is valid or not
	console.log("In check signup .");

	//request parameters
/*	var email = req.param("email");
	var msg_payload = {"email":email};

	if(email!='') {
		//check if email already exists
		mq_client.make_request('checksignup_queue',msg_payload, function(err,results){

			console.log(results);
			if(err){
				throw err;
			}
			else
			{
				if(results.statusCode == 200){
					console.log("valid Login");
					res.send({"statusCode" : 200});
				}
				else {
					console.log("Invalid Login");
					res.send({"statusCode" : 401});
				}
			}
		});
	}*/

	var email = req.param("email");
	//var msg_payload = {"email":email};

	if(email!='') {
		//check if email already exists
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/home?wsdl";
		var args = {emailid:email};//
		soap.createClient(url,option, function(err, client) {
			client.checkSignUp(args, function(err, result) {
				console.log("---Result: "+ result);
				// if(result.validateReturn === true){
				var checkSignUpReturn = result.checkSignUpReturn;
				if( checkSignUpReturn == 200){
					res.send({statusCode:200});
				}
				else{
					res.send({statusCode:401});
				}
			});
		});
	}
};


exports.checksignupWithoutRabbitMQ = function(req,res){ //check if email ID is valid or not
	console.log("In check signup WithoutRabbitMQ.");

	//request parameters
	var email = req.param("email");

	if(email!='') {
		//check if email already exists

		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('login');
			coll.findOne({EmailId: email}, function(err, user){
				if (user) {
					console.log("Email exists!");
					logger.log('error', "Email exists for id: "+ email);
					res.send({"statusCode" : 200});
				} else {
					console.log("Email Doesn't exists");
					logger.log('info', "New mail for id: "+ email);
					res.send({"statusCode" : 401});
				}
			});
		});

	}
};


exports.checksignupWithConnectionPool = function(req,res){ //check if email ID is valid or not
	console.log("In check signup .");

	//request parameters
	var email = req.param("email");
	var msg_payload = {"email":email};

	if(email!='') {
		//check if email already exists
		mq_client.make_request('checksignup_queue_WithConnectionPool',msg_payload, function(err,results){

			console.log(results);
			if(err){
				throw err;
			}
			else
			{
				if(results.statusCode == 200){
					console.log("valid Login");
					res.send({"statusCode" : 200});
				}
				else {
					console.log("Invalid Login");
					res.send({"statusCode" : 401});
				}
			}
		});
	}
};

//Changed
exports.afterSignup = function(req,res){// load new user data in database
	console.log("In aftersignup");

	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var email = req.param("email");
	var password = req.param("password");
	var contact = req.param("contact");//not added in database
	var Address = req.param("location");
	var creditCardNumber = req.param("creditCardNumber");
	var dateOfBirth = req.param("dateOfBirth");

	password = bcrypt.hashSync(password);
	console.log("firstname :: " + firstname);
	console.log("lastname :: " + lastname);
	console.log("email :: " + email);
	console.log("password :: " + password);
	console.log("contact :: " + contact);
	console.log("Address : " + Address);
	console.log("creditCardNumber : " + creditCardNumber);
	console.log("dateOfBirth :: " +dateOfBirth);

	var args = {"firstname": firstname,"lastname": lastname,"email":email,"password" : password, "contact" : contact,"Address" : Address,"creditCardNumber" : creditCardNumber,"dateOfBirth" :dateOfBirth};
	if(email!='') {
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/home?wsdl";
		soap.createClient(url,option, function(err, client) {
			client.afterSignUp(args, function(err, result) {
				console.log("---Result: "+ result);
				// if(result.validateReturn === true){
				var afterSignUpReturn = result.afterSignUpReturn;
				if(afterSignUpReturn==1){
					res.send("true");
				}
				else{
					res.send("false");
				}

			});
		});
	}
};

//not done
function getAllAuctionResults(){
	console.log("In GetAllAuction method.");



	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL+"/home?wsdl";
	var args = {};//
	soap.createClient(url,option, function(err, client) {
		client.getAllAuctionResults(args, function(err, results) {
			console.log("---Result: "+ results);
			// if(result.validateReturn === true){
			if(results.length > 0) {
				console.log("Items exists!");
				for(result in results)
				{
					addAuctionWinnerToTheList(results[result].ItemId);
					itemIsSold(results[result].ItemId);
				}
			}
		});
	});
}


function itemIsSold(ItemId) {

	console.log("Inside itemIsSold flag.");

	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL+"/home?wsdl";
	var args = {};//
	soap.createClient(url,option, function(err, client) {
		client.itemIsSold(args, function(err, results) {
			console.log("---Result: "+ results);
			// if(result.validateReturn === true){

		});
	});
};

function addAuctionWinnerToTheList(ItemId) {

	console.log("Inside addAuctionWinnerToTheList method.");

	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL+"/home?wsdl";
	var args = {};//
	soap.createClient(url,option, function(err, client) {
		client.addAuctionWinnerToTheList(args, function(err, results) {
			console.log("---Result: "+ results);
			// if(result.validateReturn === true){

		});
	});
};

exports.signout = function(req,res){

	var userId = req.session.userid;

	if(userId!=undefined) {
		logger.log('info','Sign out request for userId: '+userId);
		addLastLogin(userId);
	}
	req.session.destroy();

	json_responses = {"statusCode" : 200};
	res.send(json_responses);
}

//changed
function addLastLogin(userId) {

	//failing because of userID is EmailId now
	/*var msg_payload = {"userId":userId};
	mq_client.make_request('addLastLogin_queue',msg_payload, function(err,results){

		console.log("Hello "+ results);
		if(err){
			throw err;
		}
		else
		{
			if(results.statusCode == 200){
				console.log("Valid Login.");
				res.send("true");
			}
			else {
				console.log("Invalid Login.");
				res.send("false");
			}
		}
	});*/

	var args = {"userId":userId};
	if(userId!='') {
		//check if email already exists
		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL+"/home?wsdl";
		var args = {"userId":userId};
		soap.createClient(url,option, function(err, client) {
			client.addLastLogin(args, function(err, result) {
				console.log("---Result: "+ result);
				// if(result.validateReturn === true){

			});
		});
	}

}
