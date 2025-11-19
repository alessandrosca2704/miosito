const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Server not configured" })
    };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    console.error("[chatAssistant] invalid JSON body", error);
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Invalid payload" })
    };
  }

  const messages = Array.isArray(body.messages) ? body.messages : null;

  if (!messages?.length) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing messages" })
    };
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        temperature: 0.6,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[chatAssistant] upstream error", response.status, errorText);
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "OpenAI request failed" })
      };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("[chatAssistant] unexpected error", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Unable to connect to assistant" })
    };
  }
}
