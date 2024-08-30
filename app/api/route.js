import { OpenAI } from 'openai';

const systemPrompt = "You are an image recognition bot. Your job is to identify the food in the image that is passed in."

export async function POST(req, res) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { base64Image } = req.body; // Assuming the image is sent as a base64 string

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: 'system',
                    content: {
                        type: "image_url",
                        image_url: {
                            "url": base64Image,
                            "detail": 'low',
                        },
                    }
                },
                {
                    role: 'user',
                    content: {
                        type: "text",
                        text: "What is the name of the food in this image?",
                    }
                }
            ],
        });
        const foodName = response.choices[0].message.content.trim();
        res.status(200).json({ foodName });
    } catch (error) {
        console.error('OpenAI API request failed:', error);
        res.status(500).json({ error: 'OpenAI API request failed' });
    }
}