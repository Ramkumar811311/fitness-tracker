const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// Route to proxy nutrition data requests to CalorieNinjas API
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Log debugging info
    console.log(`Attempting to fetch nutrition data for: ${query}`);
    
    // Get API key from environment
    const apiKey = process.env.CALORIE_NINJAS_API_KEY;
    console.log(`Using API key: ${apiKey.substring(0, 5)}...`); // Only log first few chars for security

    const response = await axios.get(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json"
        },
        timeout: 10000 // Add timeout to prevent hanging requests
      }
    );

    console.log("Received response from CalorieNinjas API");
    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Calorie Ninjas API:", error.message);
    
    // Provide more detailed error information
    const errorData = {
      message: "Error fetching nutrition data",
      error: error.message
    };
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      errorData.statusCode = error.response.status;
      errorData.responseData = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from API");
      errorData.requestError = "No response received";
    }
    
    res.status(500).json(errorData);
  }
});

// Test route to verify API key and connection
router.get("/test", async (req, res) => {
  try {
    console.log("Testing CalorieNinjas API connection");
    const apiKey = process.env.CALORIE_NINJAS_API_KEY;
    console.log(`API Key from env: ${apiKey ? "Present" : "Missing"}`);
    
    // Basic test query
    const testQuery = "apple";
    
    const response = await axios({
      method: 'get',
      url: `https://api.calorieninjas.com/v1/nutrition?query=${testQuery}`,
      headers: { 
        'X-Api-Key': apiKey
      },
      timeout: 10000
    });
    
    console.log("Test successful!");
    res.json({
      success: true,
      message: "API connection test successful",
      data: response.data
    });
  } catch (error) {
    console.error("API test failed:", error.message);
    res.status(500).json({
      success: false,
      message: "API connection test failed",
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
  }
});

module.exports = router; 