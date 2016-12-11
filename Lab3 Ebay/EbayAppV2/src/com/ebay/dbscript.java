package com.ebay;
import java.sql.*;

public class dbscript {
	private String url = "jdbc:mysql://localhost:3306/ebay";
	private String user = "root";
	private String password ="toor";
	
	
	public java.sql.Connection getConnection()
	{
	  
		java.sql.Connection conn=null;
		try {
			Class.forName("com.mysql.jdbc.Driver"); 
			java.sql.Connection myConn = DriverManager.getConnection(url,user,password);
			if(myConn !=null)
			{
				System.out.println("Connected to the database");
				conn = myConn;
			}
				
			
		}
		catch (Exception e)
		{
		  System.out.println("Cannot establish connection");	
		  e.printStackTrace();
		}
		
		return conn;
		
	}
	
	public ResultSet executeGetResults(Connection con, String query) throws SQLException {

		    Statement stmt = null;
		    ResultSet rs;
		    try {
		        stmt = con.createStatement();
		         rs = stmt.executeQuery(query);

		        return rs;
		    } catch (SQLException e ) {
		    	e.printStackTrace();
		        return null;
		    } finally {
		        if (stmt != null) { stmt.close(); }
		    }
		}
	
	public int executeUpdateResults(Connection con, String query) throws SQLException {

	    Statement stmt = null;
	    int rs;
	    try {
	        stmt = con.createStatement();
	         rs = stmt.executeUpdate(query);
	        
	        return rs;
	    } catch (SQLException e ) {
	    	e.printStackTrace();
	        return 0;
	    } finally {
	        if (stmt != null) { stmt.close(); }
	    }
	}
}
