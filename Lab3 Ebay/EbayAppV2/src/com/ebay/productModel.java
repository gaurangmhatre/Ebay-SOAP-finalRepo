package com.ebay;
import java.util.*;

public class productModel {

	public String ItemId = "";
	public String ItemName = "";
	public String ItemDescription = "";
	public String ItemTypeId= "";
	public String SellerId = "";
	
	public String Price = "";
	public String Qty= "";
	public String DateAdded = "";
	public String AuctionEndDate= "";
	public String IsBidItem = "";
	public String Sold = "";
	
	void setproductArrayList(ArrayList<String> product)
	{
		ItemId = product.get(0);
		ItemName = product.get(1);
		ItemDescription = product.get(2);
		ItemTypeId = product.get(3);
		SellerId = product.get(4);
		
		Price = product.get(5);
		Qty = product.get(6);
		DateAdded = product.get(7);
		AuctionEndDate = product.get(8);
		IsBidItem = product.get(9);
		//Sold = product.get(10);		
		
	}
	
}
