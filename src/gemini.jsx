import React, { useState } from "react";

function MOUChatbot() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToGemini = async () => {
    const mouDetailsRaw = localStorage.getItem("moudetails");

    if (!mouDetailsRaw) {
      alert("No MOU data found in localStorage");
      return;
    }

    const mouDetails = JSON.parse(mouDetailsRaw);
    const fullPrompt = `Here is the MOU data:\n${JSON.stringify(
      mouDetails,
      null,
      2
    )}\n\nUser's question: ${question}\n\nAnswer the question based on the above data.`;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/key");
      const dat = await res.json();
      const apiKey = dat.apiKey;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      });

      const data = await result.json();
      if (data.error) {
        setResponse(`Error: ${data.error.message}`);
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        setResponse(reply);
      }
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setResponse("Failed to get response from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Ask about the MOU</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={sendToGemini}
          disabled={loading || !question.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask Gemini"}
        </button>
        {response && (
          <div className="mt-6 p-4 bg-gray-50 border rounded shadow">
            <h3 className="font-semibold mb-2">Answer:</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MOUChatbot;