//working first ithu  nalaikuu limit varum wait and use 

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const model = {
  generateContent: async (prompt) => {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return {
      response: {
        text: () => response.text,
      },
    };
  },
};




// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(
//   import.meta.env.VITE_GEMINI_API_KEY
// );

// const modelInstance = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash",
// });

// export const model = {
//   generateContent: async (prompt) => {
//     try {
//       const result = await modelInstance.generateContent(prompt);
//       const response = await result.response;

//       return {
//         response: {
//           text: () => response.text(),
//         },
//       };
//     } catch (error) {
//       console.log("Gemini Error:", error);

//       return {
//         response: {
//           text: () => "Gemini API Error",
//         },
//       };
//     }
//   },
// };






