package com.ebay;

import java.sql.*;
import java.util.*;

import com.ebay.dbscript;
import com.google.gson.Gson;

import javax.jws.WebService;
import org.json.* ;


@WebService
public class userProfile {
	public String getUserAccountDetails(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select UserId,FirstName,LastName,EmailId,Password,Address,CreditCardNumber,DateOfBirth,LastLoggedIn from user where UserId= '"+ userId+"';";
		     
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


	public String getAllProductsInCart(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select uc.UserCartId, uc.ItemId, i.ItemName, i.ItemDescription, i.ItemTypeId ,i.Price from ebay.usercart uc join ebay.item i on uc.ItemId =  i.itemId where uc.UserId = '" + userId +"'";
		     
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


	public int removeItemFromCart(int userid, int itemid ) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "delete from usercart where UserId = '"+userid+"' and ItemId = '"+itemid+"';";
		     
		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      int rs = preparedStmt.executeUpdate();
			  return 200; 
		    
	    
	        
		}catch(Exception e){
			e.printStackTrace();
			return 400;
		}
	        

	}
	
	public String getAllProductsInCartForCheckOut1(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "Select UserCartId,UserId,ItemId,Qty from usercart where UserId ="+userId+";";
		     
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
	
	//getAllUserDirectBuyingActivities
	//
	public String getAllUserDirectBuyingActivities(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select u.Solddate, u.Qty, i.ItemName, i.ItemDescription,i.Price,seller.FirstName from sold as u left join item as i on u.ItemId=i.ItemId left join user as seller on i.SellerId=seller.UserId where u.BuyerId = "+userId+";";
		     
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
	
	//getAllAuctionProductHistory
	//"select a.Paymentdate, i.ItemName, i.ItemDescription,i.Price, u.FirstName as SellerName from auctionWinners as a left join item as i on a.ItemId = i.ItemId left join user as u on i.SellerId = u.UserId where a.WinnerId = "+userId+";";
	public String getAllAuctionProductHistory(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select a.Paymentdate, i.ItemName, i.ItemDescription,i.Price, u.FirstName as SellerName from auctionwinners as a left join item as i on a.ItemId = i.ItemId left join user as u on i.SellerId = u.UserId where a.WinnerId = "+userId+";";
		     
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
	
	
	//getAllSoldProducts
	//
	public String getAllSoldProducts(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select i.ItemName, i.ItemDescription,s.Qty,s.SoldDate,u.FirstName as Buyer,i.Price from item as i right join sold as s on i.ItemId=s.ItemId left join user u on s.BuyerId=u.UserId where i.SellerId = "+userId+";";
		     
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
	
	
	//getAllUserBiddingActivity
	//
	public String getAllUserBiddingActivity(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select  i.ItemName, i.ItemDescription, i.Price, b.BidAmount,b.BidTime  from bidderlist as b left join item as i  on b.ItemId=i.ItemId where BidderId = "+userId+" order by BidTime desc";
		     
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
	
	//getAllWonAuctions
	//
	public String getAllWonAuctions(String userId) throws Exception
	{	
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		try{
			
			 String query = "select a.WinnerId, a.ItemId, a.PaymentByCard,a.PaymentDate,a.IsPaymentDone, i.ItemName, i.ItemDescription, i.price, b.BidAmount,b.BidTime from auctionwinners as a left join item as i on a.ItemId = i.ItemId left join bidderlist as b on a.winnerId = b.BidderId and a.ItemId= b.ItemId where a.IsPaymentDone=0 and a.WinnerId = '"+userId+";";
		     
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

}