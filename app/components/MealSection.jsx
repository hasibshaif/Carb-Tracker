'use client'

import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";

import { API_KEY } from "../api/apiNinjas";

export const MealSection = ({ mealType, addFoodItem, foods, removeFoodItem }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault(); 
        const query = searchTerm;
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
                addFoodItem({name, fiber_g, sugar_g, carbohydrates_total_g});
                setSearchTerm('');
                setErrorMessage('');
            }
            else {
                setErrorMessage("No food item found");
            }
        } catch (error) {
            console.error('Request failed:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            width={400}
            gap={2} 
            border="4px solid #6b2a00" 
            boxShadow={20} 
            p={5}
            borderRadius={10}
            bgcolor='#e2d9ff'
        >
            <Typography variant="h4">{mealType}</Typography>
            <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="row" gap={2}>
                <TextField 
                    label="Search for food"
                    placeholder="Enter the food name, followed by amount" 
                    variant="outlined" 
                    value={searchTerm} 
                    onChange={handleSearchChange}
                    required
                />
                <Button 
                    sx={{ backgroundColor: '#3c00ff', '&:hover': { backgroundColor: '#1e0082' } }}
                    type="submit" 
                    variant="contained"
                >
                    Add food
                </Button>
            </Box>
            <Typography fontSize={12}>Type the amount of food, followed by the food name. Example: 100g rice</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Box>
                {foods.map((food) => (
                    <Box key={food.id} mt={2} p={2} border={1} borderColor="grey.300" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h6">{food.name}</Typography>
                            <Typography>Fiber: {food.fiber_g}g</Typography>
                            <Typography>Sugar: {food.sugar_g}g</Typography>
                            <Typography>Total Carbs: {food.carbohydrates_total_g}g</Typography>
                        </Box>
                        <Button variant="text" color="error" onClick={() => removeFoodItem(mealType, food.id)}>
                            <Typography fontWeight="bold">X</Typography>
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={2} width="100%">
                <Typography variant="h6">
                    Total Carbs: {foods.reduce((sum, food) => sum + food.carbohydrates_total_g, 0).toFixed(2)}g
                </Typography>
            </Box>
        </Box>
    )
}