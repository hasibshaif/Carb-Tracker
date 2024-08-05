'use client'
import { useState, useEffect, useCallback } from "react";
import { firestore } from "@/app/firebase/firebaseConfig"
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from '@/app/firebase/firebaseConfig'
import { useRouter } from "next/navigation";

import { MealSection } from '@/app/components/MealSection';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: []
  });

  const fetchMeals = useCallback(async () => {
    if (user) {
      const userMealsRef = collection(firestore, 'users', user.uid, 'meals');
      const snapshot = await getDocs(userMealsRef);
      const mealsData = {
        breakfast: [],
        lunch: [],
        dinner: []
      };
      snapshot.forEach((doc) => {
        const data = doc.data();
        const mealType = typeof data.mealType === 'string' ? data.mealType.toLowerCase() : '';
        if (mealsData.hasOwnProperty(mealType)) {
          mealsData[mealType].push({ ...data, id: doc.id });
        } else {
          console.warn(`Unknown or invalid meal type: ${data.mealType}`);
        }
      });
      setMeals(mealsData);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userSession = sessionStorage.getItem('user');
      if (!user && !userSession) {
        router.push('/sign-in');
      } else {
        fetchMeals();
      }
    }
  }, [user, router, fetchMeals]);

  const addFoodItem = async (mealType, foodItem) => {
    if (user) {
      const userMealsRef = collection(firestore, 'users', user.uid, 'meals');
      const newFoodRef = doc(userMealsRef);
      await setDoc(newFoodRef, {
        ...foodItem,
        mealType,
        id: newFoodRef.id
      });
      fetchMeals();
    }
  };

  const removeFoodItem = async (mealType, foodId) => {
    if (user) {
      const userMealsRef = collection(firestore, 'users', user.uid, 'meals');
      const foodDocRef = doc(userMealsRef, foodId);
      await deleteDoc(foodDocRef);
      fetchMeals();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#3c096c' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Carb Tracker
          </Typography>
          <Button 
            color="inherit"
            onClick={() => {
              signOut(auth);
              sessionStorage.removeItem('user');
            }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box 
        width="100%" 
        minHeight="calc(100vh - 64px)" 
        bgcolor='#240046' 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        gap={2} 
        py={4}
      >
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="flex-start" gap={4} flexWrap="wrap">
          <MealSection mealType="Breakfast" addFoodItem={(foodItem) => addFoodItem('breakfast', foodItem)} removeFoodItem={removeFoodItem} foods={meals.breakfast} />
          <MealSection mealType="Lunch" addFoodItem={(foodItem) => addFoodItem('lunch', foodItem)} removeFoodItem={removeFoodItem} foods={meals.lunch} />
          <MealSection mealType="Dinner" addFoodItem={(foodItem) => addFoodItem('dinner', foodItem)} removeFoodItem={removeFoodItem} foods={meals.dinner} />
        </Box>
      </Box>
    </Box>
  );
}