export interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'ollama'
  model: string
  temperature?: number
  maxTokens?: number
}

export interface ModelResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function generateResponse(
  prompt: string,
  context: string,
  config: ModelConfig = { provider: 'openai', model: 'gpt-3.5-turbo' }
): Promise<string> {
  try {
    let response: ModelResponse

    switch (config.provider) {
      case 'openai':
        response = await generateOpenAIResponse(prompt, context, config)
        break
      case 'anthropic':
        response = await generateAnthropicResponse(prompt, context, config)
        break
      case 'ollama':
        response = await generateOllamaResponse(prompt, context, config)
        break
      default:
        throw new Error(`Unsupported provider: ${config.provider}`)
    }

    return response.content
  } catch (error) {
    console.error(`Error generating response with ${config.provider}:`, error)
    throw error
  }
}

async function generateOpenAIResponse(
  prompt: string,
  context: string,
  config: ModelConfig
): Promise<ModelResponse> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that writes professional business review responses.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nContext: ${context}`
        }
      ],
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 200,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  
  return {
    content: data.choices[0]?.message?.content || '',
    usage: data.usage
  }
}

async function generateAnthropicResponse(
  prompt: string,
  context: string,
  config: ModelConfig
): Promise<ModelResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens || 200,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nContext: ${context}`
        }
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  
  return {
    content: data.content[0]?.text || '',
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    }
  }
}

async function generateOllamaResponse(
  prompt: string,
  context: string,
  config: ModelConfig
): Promise<ModelResponse> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      prompt: `${prompt}\n\nContext: ${context}`,
      stream: false,
      options: {
        temperature: config.temperature || 0.7,
        num_predict: config.maxTokens || 200,
      }
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`)
  }

  const data = await response.json()
  
  return {
    content: data.response || '',
  }
}
