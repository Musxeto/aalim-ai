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
  try {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
}

