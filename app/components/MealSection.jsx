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
            const response = await fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
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
            width='100%'
            minHeight={500}
            gap={2} 
            border="4px solid gray" 
            boxShadow={20} 
            p={5}
            borderRadius={10}
            bgcolor='white'
        >
            <Typography variant="h4" color="#3c096c" fontWeight={550}>{mealType}</Typography>
            <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="row" gap={2}>
                <TextField 
                    label="Search for food"
                    variant="outlined" 
                    value={searchTerm} 
                    onChange={handleSearchChange}
                    required
                    InputProps={{
                        style: { color: '#3c096c' },
                    }}
                    InputLabelProps={{
                        style: { color: '#3c096c' },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#3c096c', 
                            },
                            '&:hover fieldset': {
                                borderColor: '#3c096c', 
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ff9e00', 
                            },
                        },
                    }}
                />
                <Button 
                    sx={{ backgroundColor: '#240046', color: 'white', fontWeight: 900, '&:hover': { backgroundColor: '#3c096c'}, borderRadius: 10 }}
                    type="submit" 
                    variant="contained"
                >
                    Add food
                </Button>
            </Box>
            <Typography fontSize={12} color="#240046">Type the amount of food, followed by the food name. Example: &quot;100g rice&quot;</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
                {foods.map((food) => (
                    <Box 
                        key={food.id} 
                        mt={2} 
                        p={2} 
                        border={2} 
                        borderColor="#3c096c" 
                        borderRadius={5} 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                    >
                        <Box>
                            <Typography color="#3c096c" fontSize={20}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Typography>
                            <Typography color="#3c096c" fontSize={15}>Fiber: {food.fiber_g}g</Typography>
                            <Typography color="#3c096c" fontSize={15}>Sugar: {food.sugar_g}g</Typography>
                            <Typography color="#3c096c" fontSize={15}>Total Carbs: {food.carbohydrates_total_g}g</Typography>
                        </Box>
                        <Button variant="text" color="error" onClick={() => removeFoodItem(mealType, food.id)}>
                            <Typography fontWeight={1000} color="#e5383b">X</Typography>
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box 
                mt={2} 
                p={2} 
                border={3} 
                borderColor="#3c096c" 
                borderRadius={10} 
                width="100%"
            >
                <Typography variant="h6" color="#3c096c">
                    Total Carbs: {foods.reduce((sum, food) => sum + food.carbohydrates_total_g, 0).toFixed(2)}g
                </Typography>
            </Box>
        </Box>
    )
}