// ============================================
// AI Service (Mock) - modules/chat/services/ai.service.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';

export interface AIResponse {
  content: string;
  tokens: number;
  model: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  // Mock AI responses for different scenarios
  private readonly mockResponses = [
    "这是一个模拟的 AI 回应。我理解您正在与我交流，您可以问我任何问题，我会尽力提供帮助。",
    "您好！我是您的 AI 助手。很高兴为您服务。请告诉我您需要什么帮助？",
    "收到！我已经理解您的问题。这是一个模拟的回复，用于测试聊天功能。",
    "有意思的话题！让我来思考一下这个问题并给出我的看法。",
    "感谢您的提问！作为 AI 助手，我会持续学习和改进，以提供更好的服务。",
  ];

  async generateResponse(message: string, model: string = 'gpt-3.5-turbo'): Promise<AIResponse> {
    this.logger.log(`Generating AI response using model: ${model}`);

    // Simulate network delay (500ms - 2000ms)
    const delay = Math.floor(Math.random() * 1500) + 500;
    await this.delay(delay);

    // Generate mock response
    const content = this.generateContextualResponse(message);
    const tokens = Math.floor(content.length / 4); // Rough estimate

    this.logger.log(`AI response generated: ${tokens} tokens`);

    return {
      content,
      tokens,
      model,
    };
  }

  private generateContextualResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Context-aware responses
    if (lowerMessage.includes('你好') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return '您好！很高兴见到您！我是您的 AI 助手。有什么我可以帮助您的吗？';
    }

    if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
      return '我可以帮助您完成以下任务：\n1. 回答问题\n2. 提供建议\n3. 编写代码\n4. 翻译文本\n5. 写作和编辑\n请告诉我您具体需要什么帮助！';
    }

    if (lowerMessage.includes('天气')) {
      return '我无法获取实时天气信息，但建议您查看天气预报应用获取准确的天气数据。';
    }

    if (lowerMessage.includes('时间') || lowerMessage.includes('现在几点')) {
      return `当前时间是 ${new Date().toLocaleString('zh-CN')}。`;
    }

    // Default response with message echo
    const randomResponse = this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];
    return `${randomResponse}\n\n---\n您发送的消息是：「${message.substring(0, 50)}${message.length > 50 ? '...' : ''}」`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

