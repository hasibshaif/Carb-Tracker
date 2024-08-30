function VisionAPI({ base64Image, onResult }) {
    fetch('/api/vision', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();  // First read as text to check if it's valid JSON
    })
    .then(text => {
        try {
            const data = JSON.parse(text);  // Try to parse text as JSON
            onResult(data.foodName);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            throw new Error('Failed to parse JSON');
        }
    })
    .catch(error => {
        console.error('API request failed:', error);
        onResult('Cannot detect any foods');
    });
}

export { VisionAPI };