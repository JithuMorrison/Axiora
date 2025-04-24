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
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          MOU Assistant
        </h2>
        <div className="relative mb-6">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the MOU..."
            className="w-full p-4 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-700 text-lg"
          />
          <button
            onClick={sendToGemini}
            disabled={loading || !question.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ask AI</span>
              </>
            )}
          </button>
        </div>
        {response && (
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-inner animate-fadeIn">
            <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Response
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MOUChatbot;