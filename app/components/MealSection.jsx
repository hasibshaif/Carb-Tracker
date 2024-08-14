'use client'

import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";

import { API_KEY } from "../api/apiNinjas";
import { UseCamera } from "./UseCamera";
import { VisionAPI } from "./VisionAPI";

export const MealSection = ({ mealType, addFoodItem, foods, removeFoodItem }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchTerm;
        fetchFoodData(query);
    };

    const fetchFoodData = (query) => {
        fetch(`https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
            headers: {
                'X-Api-Key': API_KEY
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const foodItem = data[0];
                const { name, fiber_g, sugar_g, carbohydrates_total_g } = foodItem;
                addFoodItem({ name, fiber_g, sugar_g, carbohydrates_total_g });
                setSearchTerm('');
                setErrorMessage('');
            } else {
                setErrorMessage("No food item found");
            }
        })
        .catch(error => {
            console.error('Request failed:', error);
            setErrorMessage(error.message);
        });
    };

    const handlePhotoTaken = (photo) => {
        setPhoto(photo);
    };

    const handleVisionAPIResult = (foodName) => {
        if (foodName !== 'Not a food') {
            fetchFoodData(foodName);
        } else {
            setErrorMessage('Not a food');
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
            border="4px solid #ff6d00"
            boxShadow={20}
            p={5}
            borderRadius={10}
            bgcolor='transparent'
            sx={{
                background: 'linear-gradient(to bottom, #240046, #3c096c)'
            }}
        >
            <Typography variant="h4" color="#ff9e00" fontWeight={550}>{mealType}</Typography>
            <UseCamera onPhotoTaken={handlePhotoTaken} />
            {photo && <VisionAPI base64Image={photo} onResult={handleVisionAPIResult} />}
            <Box component="form" onSubmit={handleSearch} display="flex" flexDirection="row" gap={2}>
                <TextField
                    label="Search for food"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    required
                    InputProps={{
                        style: { color: 'white' },
                    }}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ff6d00',
                            },
                            '&:hover fieldset': {
                                borderColor: '#9d4edd',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ff9e00',
                            },
                        },
                    }}
                />
                <Button
                    sx={{ backgroundColor: '#ff9e00', color: '#9d4edd', fontWeight: 900, '&:hover': { backgroundColor: '#9d4edd', color: '#ff9e00' }, borderRadius: 10 }}
                    type="submit"
                    variant="contained"
                >
                    Add food
                </Button>
            </Box>
            <Typography fontSize={12} color="white">Type the amount of food, followed by the food name. Example: &quot;100g rice&quot;</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
                {foods.map((food) => (
                    <Box
                        key={food.id}
                        mt={2}
                        p={2}
                        border={2}
                        borderColor="#ff8500"
                        borderRadius={5}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography color="white" fontSize={20}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Typography>
                            <Typography color="white" fontSize={15}>Fiber: {food.fiber_g}g</Typography>
                            <Typography color="white" fontSize={15}>Sugar: {food.sugar_g}g</Typography>
                            <Typography color="white" fontSize={15}>Total Carbs: {food.carbohydrates_total_g}g</Typography>
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
                borderColor="#ff9100"
                borderRadius={10}
                width="100%"
            >
                <Typography variant="h6" color="white">
                    Total Carbs: {foods.reduce((sum, food) => sum + food.carbohydrates_total_g, 0).toFixed(2)}g
                </Typography>
            </Box>
        </Box>
    )
}