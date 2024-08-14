function VisionAPI({ base64Image, onResult }) {
    fetch('/api/vision', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image }),
    })
    .then(response => response.json())
    .then(data => {
        onResult(data.foodName);
    })
    .catch(error => {
        console.error('API request failed:', error);
        onResult('Cannot detect any foods');
    });
}

export { VisionAPI };