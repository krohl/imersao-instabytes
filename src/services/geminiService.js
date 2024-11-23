import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function generateDescriptionWithGemini(imageBuffer) {
    const prompt = "Retorne somente uma descrição detalhada sem título em português do brasil para a seguinte imagem. Utilize apenas aspas simples quando necessário. Crie parágrafos para separar as ideias.";

    try {
        const image = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/png",
            },
        };
        const res = await model.generateContent([prompt, image]);
        return res.response.text() || "Alt-text not available.";
    } catch (error) {
        console.error("Error getting alt-text:", error.message, error);
        throw new Error("Error getting alt-text from Gemini.");
    }
}