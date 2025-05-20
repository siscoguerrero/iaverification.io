// Configuración sensible - no committear a repositorios públicos
const OPENAI_API_KEY = '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';

export const getOpenAIConfig = () => ({
  apiKey: OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000
});