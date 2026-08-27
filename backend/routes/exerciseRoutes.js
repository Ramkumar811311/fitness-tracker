const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

// Cache for storing API responses
const apiCache = {
  bodyPartList: null,
  equipmentList: null,
  targetList: null,
  exercises: {}, // Cache exercises by search type and query
  cacheTime: {}, // Track when data was cached
};

// Cache expiration time (in milliseconds) - 24 hours
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Check if cached data is still valid
const isCacheValid = (cacheKey) => {
  if (!apiCache.cacheTime[cacheKey]) return false;
  const cacheAge = Date.now() - apiCache.cacheTime[cacheKey];
  return cacheAge < CACHE_EXPIRATION;
};

// Helper function for making API requests to ExerciseDB
const fetchFromExerciseDB = async (endpoint) => {
  const options = {
    method: 'GET',
    url: `https://exercisedb.p.rapidapi.com/${endpoint}`,
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ExerciseDB (${endpoint}):`, error.message);
    throw error;
  }
};

// Get body part list
router.get("/bodyPartList", async (req, res) => {
  try {
    // Return cached data if available and valid
    if (apiCache.bodyPartList && isCacheValid('bodyPartList')) {
      console.log("Returning cached body part list");
      return res.json(apiCache.bodyPartList);
    }

    // Fetch from API if cache is empty or expired
    console.log("Fetching body part list from API");
    const data = await fetchFromExerciseDB('exercises/bodyPartList');
    
    // Update cache
    apiCache.bodyPartList = data;
    apiCache.cacheTime.bodyPartList = Date.now();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching body part list", error: error.message });
  }
});

// Get equipment list
router.get("/equipmentList", async (req, res) => {
  try {
    // Return cached data if available and valid
    if (apiCache.equipmentList && isCacheValid('equipmentList')) {
      console.log("Returning cached equipment list");
      return res.json(apiCache.equipmentList);
    }

    // Fetch from API if cache is empty or expired
    console.log("Fetching equipment list from API");
    const data = await fetchFromExerciseDB('exercises/equipmentList');
    
    // Update cache
    apiCache.equipmentList = data;
    apiCache.cacheTime.equipmentList = Date.now();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching equipment list", error: error.message });
  }
});

// Get target list
router.get("/targetList", async (req, res) => {
  try {
    // Return cached data if available and valid
    if (apiCache.targetList && isCacheValid('targetList')) {
      console.log("Returning cached target list");
      return res.json(apiCache.targetList);
    }

    // Fetch from API if cache is empty or expired
    console.log("Fetching target list from API");
    const data = await fetchFromExerciseDB('exercises/targetList');
    
    // Update cache
    apiCache.targetList = data;
    apiCache.cacheTime.targetList = Date.now();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching target list", error: error.message });
  }
});

// Search exercises by name, bodyPart, equipment, or target
router.get("/search", async (req, res) => {
  try {
    const { type, query } = req.query;
    
    if (!type || !query) {
      return res.status(400).json({ message: "Type and query parameters are required" });
    }
    
    // Valid search types
    const validTypes = ['name', 'bodyPart', 'equipment', 'target'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid search type. Must be one of: name, bodyPart, equipment, target" });
    }
    
    // Create a cache key
    const cacheKey = `${type}_${query}`;
    
    // Return cached data if available and valid
    if (apiCache.exercises[cacheKey] && isCacheValid(cacheKey)) {
      console.log(`Returning cached exercises for ${type}: ${query}`);
      return res.json(apiCache.exercises[cacheKey]);
    }
    
    // Fetch from API if cache is empty or expired
    console.log(`Fetching exercises for ${type}: ${query} from API`);
    const data = await fetchFromExerciseDB(`exercises/${type}/${query}`);
    
    // Update cache
    apiCache.exercises[cacheKey] = data;
    apiCache.cacheTime[cacheKey] = Date.now();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error searching exercises", error: error.message });
  }
});

// Search exercises with multiple filters (name, bodyPart, equipment, target)
router.get("/searchMultiple", async (req, res) => {
  try {
    const { name, bodyPart, equipment, target } = req.query;
    
    if (!name && !bodyPart && !equipment && !target) {
      return res.status(400).json({ message: "At least one search parameter is required" });
    }
    
    // Create a cache key from all parameters
    const cacheKey = `multiple_${name || ''}_${bodyPart || ''}_${equipment || ''}_${target || ''}`;
    
    // Return cached data if available and valid
    if (apiCache.exercises[cacheKey] && isCacheValid(cacheKey)) {
      console.log(`Returning cached exercises for multiple filters`);
      return res.json(apiCache.exercises[cacheKey]);
    }
    
    console.log(`Fetching exercises with multiple filters from API`);
    
    // Start with all exercises or filter by one parameter to minimize API calls
    let data;
    if (bodyPart) {
      data = await fetchFromExerciseDB(`exercises/bodyPart/${bodyPart}`);
    } else if (equipment) {
      data = await fetchFromExerciseDB(`exercises/equipment/${equipment}`);
    } else if (target) {
      data = await fetchFromExerciseDB(`exercises/target/${target}`);
    } else if (name) {
      data = await fetchFromExerciseDB(`exercises/name/${name}`);
    }
    
    // Apply additional filters on the client side
    if (bodyPart && equipment) {
      data = data.filter(exercise => exercise.equipment === equipment);
    }
    if (bodyPart && target) {
      data = data.filter(exercise => exercise.target === target);
    }
    if (equipment && target) {
      data = data.filter(exercise => exercise.target === target);
    }
    if (name && (bodyPart || equipment || target)) {
      data = data.filter(exercise => 
        exercise.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // Update cache
    apiCache.exercises[cacheKey] = data;
    apiCache.cacheTime[cacheKey] = Date.now();
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error searching exercises with multiple filters", error: error.message });
  }
});

module.exports = router; 