export interface AskQuestionPayload {
  question: string;
  k: number;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
}

const API_URL = 'http://192.168.178.109:7860'; 

export const chatApi = {
  askQuestion: async (payload: AskQuestionPayload): Promise<AskQuestionResponse> => {
    const res = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: payload.question,
        token: payload.token || "",
        chat_id: payload.chat_id || "",
        k: payload.k || 5,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data: AskQuestionResponse = await res.json();
    return data;
  },
};
