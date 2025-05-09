const API_BASE_URL = 'http://localhost:7860';

export interface QuestionResponse {
  question: string;
  answer: string;
}

export async function askQuestion(
  question: string,
  token: string,
  chatId: string
): Promise<QuestionResponse> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      token,
      chat_id: chatId,
      k: 5,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(`Failed to fetch: ${response.statusText}`, errorDetails);
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return await response.json();
}

