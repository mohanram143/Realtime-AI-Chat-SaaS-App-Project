import { useState, useCallback, useRef } from "react";
import { model } from "../state/lib/gemini";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSending = useRef(false); // 👈 ADD THIS

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    // 🚫 prevent spam / double calls
    if (isSending.current) return;

    isSending.current = true;
    setLoading(true);

    const userMsg = {
      id: Date.now() + Math.random(),
      role: "user",
      content: userText,
      ts: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const prompt = `
You are Mohan Ram, an intelligent AI assistant inside Mohan Ram Ai.

Be helpful, concise, and friendly.

User message:
${userText}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      const aiMsg = {
        id: Date.now() + Math.random(),
        role: "assistant",
        content: aiText,
        ts: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          role: "assistant",
          content: "⚠️ Gemini API Error",
          ts: new Date(),
        },
      ]);
    } finally {
      isSending.current = false;
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  };
}















































// // src/hooks/useChat.js

// import { useState, useCallback } from "react";
// import { model } from "../state/lib/gemini";

// export function useChat() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const sendMessage = useCallback(async (userText) => {
//     if (!userText.trim()) return;

//     const userMsg = {
//       id: Date.now() + Math.random(),
//       role: "user",
//       content: userText,
//       ts: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);

//     setLoading(true);

//     try {
//       const prompt = `
// You are Mohan Ram, an intelligent AI assistant inside Mohan Ram Ai.

// Be helpful, concise, and friendly.

// User message:
// ${userText}
// `;
// const result = await model.generateContent(prompt);

// const response = await result.response;

// const aiText = response.text();

//       const aiMsg = {
//         id: Date.now() + Math.random(),
//         role: "assistant",
//         content: aiText,
//         ts: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMsg]);

//     } catch (error) {
//       console.log(error);

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + Math.random(),
//           role: "assistant",
//           content: "⚠️ Gemini API Error",
//           ts: new Date(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const clearMessages = useCallback(() => {
//     setMessages([]);
//   }, []);

//   return {
//     messages,
//     loading,
//     sendMessage,
//     clearMessages,
//   };
// }