import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { Button, Box } from "@mui/material";

const UseCamera = ({ onPhotoTaken }) => {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState("environment");

    const handleTakePhoto = () => {
        const photo = camera.current.takePhoto();
        setImage(photo);
        sendPhotoToServer(photo);
        setIsCameraOpen(false);
    };

    const sendPhotoToServer = (photo) => {
        fetch('/api/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64Image: photo }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.foodName) {
                onPhotoTaken(data.foodName);
            }
        })
        .catch(error => console.error('API request failed:', error));
    };

    const toggleFacingMode = () => {
        setFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center">
            {isCameraOpen ? (
                <Box position="relative" textAlign="center" zIndex={10} bgcolor="black" width="100vh" height="100vh">
                    <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} style={{ width: '100%', height: '100%' }} />
                    <Button onClick={handleTakePhoto}>Take photo</Button>
                    <Button 
                        disabled={numberOfCameras <= 1}
                        onClick={() => {
                            if (camera.current) {
                                camera.current.switchCamera();
                            }
                        }}
                    >
                        Switch Camera
                    </Button>
                </Box>
            ) : (
                <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
            )}
        </Box>
    );
};

export { UseCamera };