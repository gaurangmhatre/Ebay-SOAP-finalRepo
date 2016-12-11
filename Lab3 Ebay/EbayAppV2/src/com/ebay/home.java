package com.ebay;

import java.sql.Connection;
import org.json.* ;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.*;

import javax.jws.WebService;

import com.ebay.dbscript;

@WebService
public class home {
	
	public int checkSignUp(String emailid) throws Exception
	{
		
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			

		try{
		
		 String query = "SELECT * FROM ebay.user where EmailId ='"+emailid+"'";
	     
	      PreparedStatement preparedStmt = conn.prepareStatement(query);
	      ResultSet result = preparedStmt.executeQuery();
		
	      
	      	while(result.next())
			{
	      			return 200;
				
			}
	      	
	      	return 401;
			
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
		
		
	}
	
	public int afterSignUp(String firstname,String lastname,String email,String hash,String location,String creditCardNumber,String dateOfBirth) throws Exception
	{
		
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query = "INSERT INTO user (FirstName, LastName, EmailId, Password, Address, CreditCardNumber,DateOfBirth) VALUES ('" + firstname + "','" + lastname + "','" + email + "','" + hash + "','" + location + "','" + creditCardNumber + "','"+dateOfBirth+"')";
		int  result = stmt.executeUpdate(query);
	    return result;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	public String login (String email) throws Exception
	{		
		System.out.println("I am hit "+email);
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		Statement stmt = conn.createStatement();
		try {

		      String query = " select * from  user where EmailId ='"+email+"'";
		      	

		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      ResultSet rs = preparedStmt.executeQuery();
		      
			  JSONArray jsonArray = new JSONArray();
		        while (rs.next()) {
		            int total_rows = rs.getMetaData().getColumnCount();
		            JSONObject obj = new JSONObject();
		            for (int i = 0; i < total_rows; i++) {
		                obj.put(rs.getMetaData().getColumnLabel(i + 1)
		                        .toLowerCase(), rs.getObject(i + 1));
		                
		            }
		            jsonArray.put(obj);
		        }
		        conn.close();
		        return jsonArray.toString();
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error"; 
		}
		
	}
	
	public int addLastLogin(String userId) throws Exception
	{
		
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query = "UPDATE user	SET LastLoggedIn = NOW() WHERE UserId = "+userId+";";
		int  result = stmt.executeUpdate(query);
	    return result;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	//getAllAuctionResults
	// "select ItemId from item as i where i.IsBidItem =1  and i.AuctionEndDate < now() and sold = 0";
	public String getAllAuctionResults (String email) throws Exception
	{		
		System.out.println("I am hit "+email);
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
		
		Statement stmt = conn.createStatement();
		try {

		      String query = "select ItemId from item as i where i.IsBidItem =1  and i.AuctionEndDate < now() and sold = 0";
		      	

		      PreparedStatement preparedStmt = conn.prepareStatement(query);
		      ResultSet rs = preparedStmt.executeQuery();
		      
			  JSONArray jsonArray = new JSONArray();
		        while (rs.next()) {
		            int total_rows = rs.getMetaData().getColumnCount();
		            JSONObject obj = new JSONObject();
		            for (int i = 0; i < total_rows; i++) {
		                obj.put(rs.getMetaData().getColumnLabel(i + 1)
		                        .toLowerCase(), rs.getObject(i + 1));
		                
		            }
		            jsonArray.put(obj);
		        }
		        conn.close();
		        return jsonArray.toString();
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "error"; 
		}
		
	}
	
	public int addAuctionWinnerToTheList(String ItemId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query = "INSERT INTO `ebay`.`auctionwinners`(`WinnerId`,`ItemId`,`IsPaymentDone`)(select b.BidderId, b.ItemId, 0 as IsPaymentDone from bidderlist as b where ItemId = "+ItemId+" and b.BidAmount = (	select max(b.BidAmount)	from bidderlist as b left join item as i	on b.ItemId=i.ItemId	where i.IsBidItem =1  and i.AuctionEndDate < now() and i.ItemId="+ItemId+"));";
		int  result = stmt.executeUpdate(query);
	    return result;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
	
	public int itemIsSold(String ItemId) throws Exception
	{
		dbscript db = new dbscript();
		Connection conn = db.getConnection();
			
		Statement stmt = conn.createStatement();
		try{
				
		String query = "update Item set sold = 1 where ItemId = "+ItemId;
		int  result = stmt.executeUpdate(query);
	    return result;
				
		}catch(Exception e){
			e.printStackTrace();
			return 401;
		}
	}
}
