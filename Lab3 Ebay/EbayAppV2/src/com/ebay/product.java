package com.ebay;

import java.sql.Connection;
import org.json.* ;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.*;

import java.util.*;

import com.ebay.dbscript;
import com.google.gson.Gson;

import javax.jws.WebService;
import org.json.* ;


@WebService
public class product {
	public String getAllProducts() throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		ArrayList<productModel> productArrayList = new ArrayList<productModel>(); 
		productModel pm = new productModel();
		 
		try{
			
			 String query = "select ItemId, ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,IsBidItem, sold from item where IsBidItem=0 and Qty>0 ;";
		     
		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      ResultSet rs = preparedStmt.executeQuery();
			
		      JSONArray jsonArray = new JSONArray();
		      int total_rows = rs.getMetaData().getColumnCount();
		      
		      while (rs.next()) {
		            JSONObject obj = new JSONObject();
		            for (int i = 0; i < total_rows; i++) {
		                obj.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));
		            }
		            jsonArray.put(obj);
		        }
		      conn.close();
		        System.out.println(jsonArray.toString());
		        return jsonArray.toString();
	    
	        
		}catch(Exception e){
			e.printStackTrace();
			return "error";
		}
	        

	}
	public String getAllProductsForAuction() throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		ArrayList<productModel> productArrayList = new ArrayList<productModel>(); 
		productModel pm = new productModel();
		 
		try{
			
			 String query = "select ItemId, ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,IsBidItem, sold from item where IsBidItem=1;";
		     
		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      ResultSet rs = preparedStmt.executeQuery();
			
		      JSONArray jsonArray = new JSONArray();
		      int total_rows = rs.getMetaData().getColumnCount();
		      
		      while (rs.next()) {
		            JSONObject obj = new JSONObject();
		            for (int i = 0; i < total_rows; i++) {
		                obj.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));
		            }
		            jsonArray.put(obj);
		        }
		      conn.close();
		        System.out.println(jsonArray.toString());
		        return jsonArray.toString();
	    
	        
		}catch(Exception e){
			e.printStackTrace();
			return "error";
		}
	        

	}
	
	//addProduct
	// 
	public int addProduct(String ItemName,String ItemDescription, String ItemTypeId, String SellerId, String Price,String Qty, String IsBidItem,  String Sold) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query = "INSERT INTO item (ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,AuctionEndDate,IsBidItem,Sold) VALUES ('"+ItemName+"','"+ItemDescription+"',"+ItemTypeId+","+SellerId+","+Price+","+Qty+",NOW(),date_add(NOW(),INTERVAL 4 DAY),"+IsBidItem+","+Sold+");";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//userAddToCart
	public int userAddToCart(String ItemId,String Qty, String UserId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =  "INSERT INTO usercart(`UserId`,`ItemId`,`Qty`)VALUES(" + UserId + "," + ItemId + "," + Qty + ");";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//-------buy product methods----
	//AddItemToSoldTable
	public int AddItemToSoldTable(String ItemId, String UserId, String creditCardNumber) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =  "INSERT INTO sold(ItemId,BuyerId,SoldDate,Qty,PaymentByCard)VALUES("+ItemId+","+UserId+",NOW(),1,'"+creditCardNumber+"');";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//updateItemQty
	public int updateItemQty(String ItemId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =   "UPDATE ebay.item SET Qty=Qty-1  WHERE ItemId = "+ItemId;
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//removingItemFromCart
	//
	public int removingItemFromCart(String userId, String ItemId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =   "delete from usercart where UserId ="+userId+" and ItemId = "+ItemId+";";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//--AddBid in product--------------
	public int addBidOnProduct(String UserId, String ItemId, String BidAmount) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =   "INSERT INTO bidderlist(BidderId,ItemId,BidAmount,BidTime)VALUES(" + UserId + "," + ItemId + "," + BidAmount + ",NOW());";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//---auctionWinner--------------
	//"select a.WinnerId, a.ItemId, a.PaymentByCard,a.PaymentDate,a.IsPaymentDone, i.ItemName, i.ItemDescription, i.price, b.BidAmount,b.BidTime from auctionwinners as a left join item as i on a.ItemId = i.ItemId left join bidderList as b on a.winnerId = b.BidderId and a.ItemId= b.ItemId where a.IsPaymentDone=0 and a.WinnerId = "+userId;
	public String getAllWonAuctions(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		 
		try{
			
			 String query = "select a.WinnerId, a.ItemId, a.PaymentByCard,a.PaymentDate,a.IsPaymentDone, i.ItemName, i.ItemDescription, i.price, b.BidAmount,b.BidTime from auctionwinners as a left join item as i on a.ItemId = i.ItemId left join bidderList as b on a.winnerId = b.BidderId and a.ItemId= b.ItemId where a.IsPaymentDone=0 and a.WinnerId = "+userId;
		     
		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      ResultSet rs = preparedStmt.executeQuery();
			
		      JSONArray jsonArray = new JSONArray();
		      int total_rows = rs.getMetaData().getColumnCount();
		      
		      while (rs.next()) {
		            JSONObject obj = new JSONObject();
		            for (int i = 0; i < total_rows; i++) {
		                obj.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));
		            }
		            jsonArray.put(obj);
		        }
		      conn.close();
		        System.out.println(jsonArray.toString());
		        return jsonArray.toString();
	    
	        
		}catch(Exception e){
			e.printStackTrace();
			return "error";
		}
	        

	}
	
	//-------------------------------------------------

	//updatePaymentDetailsForAuction
	// "UPDATE `auctionwinners` SET `PaymentByCard` = " + creditCardNumber + ", `PaymentDate` = now(),`IsPaymentDone` = 1 WHERE `WinnerId` = " + userId + " and IsPaymentDone = 0;";
	public int updatePaymentDetailsForAuction(String userId , String creditCardNumber) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =  "UPDATE `auctionwinners` SET `PaymentByCard` = " + creditCardNumber + ", `PaymentDate` = now(),`IsPaymentDone` = 1 WHERE `WinnerId` = " + userId + " and IsPaymentDone = 0;";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//UpdateItemStatusToSold
	//
	public int UpdateItemStatusToSold(String ItemId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query =  "UPDATE `ebay`.`item`	SET `Sold` = 1 WHERE `ItemId` = "+ItemId +";";
		int  result = stmt.executeUpdate(query);
	    return 200;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
}
