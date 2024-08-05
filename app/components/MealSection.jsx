'use client'

import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";

import { API_KEY } from "../api/apiNinjas";

export const MealSection = ({ mealType, addFoodItem }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = async(e) => {
        const [query, value] = e.target;
        setSearchTerm((prevSearch) => ({
            ...prevSearch,
            [query]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault(); 
        const query = searchTerm.query;
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
                headers: {
                    'X-Api-Key': API_KEY
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.length > 0) {
                const foodItem = data[0];
                const {name, fiber_g, sugar_g, carbohydrates_total_g} = foodItem;
                console.log(`Food: ${name}`);
                console.log(`Fiber: ${fiber_g}g`);
                console.log(`Sugar: ${sugar_g}g`);
                console.log(`Total Carbohydrates: ${carbohydrates_total_g}g`);
            }
            else {
                console.log("No food item found");
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Box>
                <Typography variant="h4">{mealType}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={2}>
                <TextField 
                label="Search for food"
                placeholder="Enter the food name, followed by amount" 
                variant="outlined" 
                value={searchTerm.query || ''} 
                onChange={(e) => handleSearchChange({ target: ['query', e.target.value] })}
                required
                />
                <Button type="submit" variant="contained">
                    Add food
                </Button>
            </Box>
        </Box>
    )
} 