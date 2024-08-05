'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/app/firebase/firebaseConfig"
import { Box, Button, Modal, Stack, TextField, Typography, AppBar, Toolbar } from '@mui/material';
import { collection, doc, deleteDoc, getDocs, getDoc, setDoc, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from '@/app/firebase/firebaseConfig'
import { useRouter } from "next/navigation";

import {MealSection} from '@/app/components/MealSection';

export default function Home() {

  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  if (!user && !userSession) {
    router.push('/sign-in');
  }
  console.log(user)

  const [foods, setFoods] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const updateFoods = async () => {
    const snapshot = query(collection(firestore, 'foods'));
    const docs = await getDocs(snapshot);
    const foodList = [];
    docs.forEach((doc) => {
      foodList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setFoods(foodList);
    console.log(foodList);
  }

  const addFoods = async (food) => {
    const docRef = doc(collection(firestore, 'foods'), food);
    const docSnap = await getDoc(docRef); 

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    updateFoods(); // Update food list after adding
  }

  const removeFoods = async (food) => {
    const docRef = doc(collection(firestore, 'foods'), food);
    const docSnap = await getDoc(docRef); 

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      updateFoods();
    }
  }

  useEffect(() => {
    updateFoods();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={2}>
      <Box border="1px solid #333" bgcolor="white" boxShadow={24}>
        <Box 
          width="500px" 
          height="200px" 
          variant="outlined" 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
        >
          <MealSection mealType={"Breakfast"}></MealSection>
        </Box> 
        <Stack width="400px" height="300px" spacing={2} overflow="auto">
          
        </Stack>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" top="50%" left="50%" 
          width={400} 
          bgcolor="white" border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addFoods(name);
                setName('');
                handleClose();
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>
      <Button 
        variant="contained"
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem('user');
        }}
      >
        Log Out
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Food Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            foods.map(({ name, count }) => (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center" textTransform="capitalize">
                  {name}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center" textTransform="capitalize">
                  {count}
                </Typography>
                <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => {
                  addFoods(name);
                }}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => {
                  removeFoods(name);
                }}>
                  Remove
                </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
