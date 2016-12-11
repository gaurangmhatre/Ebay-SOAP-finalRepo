package com.calculator;

import javax.jws.WebService;

@WebService
public class Calculate {
	
	public float add(float number1, float number2)
	{
		return number1+number2;
	}
	
	public float subtract(float number1, float number2)
	{
		return number1-number2;
	}
	
	public float multiply(float number1, float number2)
	{
		return number1*number2;
	}
	
	public float divide(float number1, float number2)
	{
		return number1/number2;
	}
}
