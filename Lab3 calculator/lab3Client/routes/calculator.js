var soap = require('soap');
var baseURL = "http://localhost:8237/CalculatorApp/services/";

exports.getCalculator = function(req, res){
	console.log("In Calculator Application.");
	res.render('calculator', { validationMessage: 'Empty Message'});
};

/*exports.checkLogin = function(req,res){
	var option = {
			ignoredNamespaces : true	
		};
	 var url = baseURL+"/Validate?wsdl";
	  var args = {username: req.param('username'),password: req.param('password')};
	  soap.createClient(url,option, function(err, client) {
	      client.validate(args, function(err, result) {
	    	  if(result.validateReturn === true){
	    		  res.send({statusCode:200});
	    	  }
	    	  else{
	    		  res.send({statusCode:401});
	    	  }
	      });
	  });
};*/


exports.getAddition= function(req, res){
	console.log("In getAddition Method");
	var option = {
			ignoredNamespaces : true	
		};
	var numberOne = req.param("numberOne");
	var numberTwo = req.param("numberTwo");
	
	var url = baseURL+"Calculate?wsdl";
	var arg = {number1: numberOne, number2: numberTwo};
	soap.createClient(url,option,function(err,client){
		client.add(arg,function(err,result){
			if(result.validateReturn === true){
				res.send({resultOfOperation:result});
			}else{
				res.send({resultOfOperation:result});
			}
		});
	});
};


exports.getSubtraction= function(req, res){
	console.log("In getSubtraction Method");
	var option = {
			ignoredNamespaces : true	
		};	
	var numberOne = req.param("numberOne");
	var numberTwo = req.param("numberTwo");
	
	
	var url = baseURL+"Calculate?wsdl";
	var arg = {number1: numberOne, number2: numberTwo};
	soap.createClient(url,option,function(err,client){
		client.subtract(arg,function(err,result){
			if(result.validateReturn === true){
				res.send({resultOfOperation:result});
			}else{
				res.send({resultOfOperation:result});
			}
		});
	});
	
};


exports.getMultiplication = function(req, res){
	console.log("In getMultiplication Method");
	var option = {
			ignoredNamespaces : true	
		};
	var numberOne = req.param("numberOne");
	var numberTwo = req.param("numberTwo");
	
	
	var url = baseURL+"Calculate?wsdl";
	var arg = {number1: numberOne, number2: numberTwo};
	soap.createClient(url,option,function(err,client){
		client.multiply(arg,function(err,result){
			if(result.validateReturn === true){
				res.send({resultOfOperation:result});
			}else{
				res.send({resultOfOperation:result});
			}
		});
	});
};


exports.getDivision = function(req, res){
	console.log("In getDivision Method");
	var option = {
			ignoredNamespaces : true	
		};
	var numberOne = req.param("numberOne");
	var numberTwo = req.param("numberTwo");
	
	
	var url = baseURL+"Calculate?wsdl";
	var arg = {number1: numberOne, number2: numberTwo};
	soap.createClient(url,option,function(err,client){
		client.divide(arg,function(err,result){
			if(result.validateReturn === true){
				res.send({resultOfOperation:result});
			}else{
				res.send({resultOfOperation:result});
			}
		});
	});
};
