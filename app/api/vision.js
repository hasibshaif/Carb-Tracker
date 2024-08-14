import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { base64Image } = req.body;

        try {
            const response = await openai.createImage({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: "text",
                                text: "What is the name of the food in this image? In your response, only provide the name of the food, no other words. If you cannot detect a food in this image, simply output 'Not a food'",
                            },
                            {
                                type: "image_url",
                                image_url: `data:image/jpg;base64,${base64Image}`,
                            }
                        ],
                    }
                ],
            });

            const foodName = response.choices[0].message.content.trim();
            res.status(200).json({ foodName });
        } catch (error) {
            console.error('OpenAI API request failed:', error);
            res.status(500).json({ error: 'OpenAI API request failed' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}