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
            width={550}
            minHeight={700}
            gap={2} 
            border="4px solid #ff6d00" 
            boxShadow={20} 
            p={5}
            borderRadius={10}
            bgcolor='#ffdac7'
        >
            <Typography variant="h4" color="#3c096c" fontWeight={550}>{mealType}</Typography>
            <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="row" gap={2}>
                <TextField 
                    label="Search for food"
                    variant="outlined" 
                    value={searchTerm} 
                    onChange={handleSearchChange}
                    required
                />
                <Button 
                    sx={{ backgroundColor: '#ff9e00', color: '#9d4edd', fontWeight: 900, '&:hover': { backgroundColor: '#9d4edd', color: '#ff9e00'}, borderRadius: 10 }}
                    type="submit" 
                    variant="contained"
                >
                    Add food
                </Button>
            </Box>
            <Typography fontSize={12} color="#3c096c">Type the amount of food, followed by the food name. Example: &quot;100g rice&quot;</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
                {foods.map((food) => (
                    <Box 
                        key={food.id} 
                        mt={2} 
                        p={2} 
                        border={1} 
                        borderColor="#7b2cbf" 
                        borderRadius={5} 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                    >
                        <Box>
                            <Typography fontSize={20}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Typography>
                            <Typography fontSize={15}>Fiber: {food.fiber_g}g</Typography>
                            <Typography fontSize={15}>Sugar: {food.sugar_g}g</Typography>
                            <Typography fontSize={15}>Total Carbs: {food.carbohydrates_total_g}g</Typography>
                        </Box>
                        <Button variant="text" color="error" onClick={() => removeFoodItem(mealType, food.id)}>
                            <Typography fontWeight={1000} color="#ff8500">X</Typography>
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box 
                mt={2} 
                p={2} 
                border={2} 
                borderColor="#7b2cbf" 
                borderRadius={10} 
                width="100%"
            >
                <Typography variant="h6" color="#5a189a">
                    Total Carbs: {foods.reduce((sum, food) => sum + food.carbohydrates_total_g, 0).toFixed(2)}g
                </Typography>
            </Box>
        </Box>
    )
}