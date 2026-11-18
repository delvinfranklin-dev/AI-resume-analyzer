import { Request, Response } from 'express';
import { generateChatbotResponse } from '../services/ai/chatbotService.js';

export async function handleChatRequest(req: Request, res: Response): Promise<void> {
  try {
    const { message, resume_context, conversation_history } = req.body;

    // 1. Validation: Message existence and type
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'A valid message string is required.' });
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    // 2. Length check to protect LLM context window
    if (trimmedMessage.length > 2000) {
      res.status(400).json({ error: 'Message is too long. Please keep your question under 2,000 characters.' });
      return;
    }

    // 3. Conversation history formatting
    const sanitizedHistory: { role: 'user' | 'assistant'; content: string }[] = Array.isArray(conversation_history)
      ? conversation_history
          .filter((item: any) => item && typeof item.content === 'string')
          .map((item: any) => ({
            role: item.role === 'assistant' ? 'assistant' : 'user',
            content: String(item.content).slice(0, 1500),
          }))
      : [];

    // 4. Generate AI response
    const botReply = await generateChatbotResponse(
      trimmedMessage,
      resume_context,
      sanitizedHistory
    );

    res.json({ response: botReply });
  } catch (err: any) {
    console.error('[ChatController] Error generating chat response:', err);
    res.status(500).json({
      error: 'Unable to generate a response at this time. Please try again.',
      response: "I apologize, but I'm having trouble processing that right now. Please try asking again in a moment.",
    });
  }
}
