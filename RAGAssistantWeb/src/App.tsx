import { useState } from 'react'
import './App.css'

interface AIResponse {
  answer: string;
  context: string;
}

interface ServerError {
  error: string;
  code: string;
}

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [context, setContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showContext, setShowContext] = useState(false)

  const CLOUD_FUNCTION_URL = 'https://us-central1-coatl-rag-lab-5b3fd.cloudfunctions.net/askAI'

  const askAI = async (query?: string) => {
    const finalQuestion = query || question
    if (!finalQuestion.trim()) return

    setIsLoading(true)
    setErrorMessage('')
    setAnswer('')
    setContext('')

    try {
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: finalQuestion }),
      })

      if (!response.ok) {
        const errorData: ServerError = await response.json()
        throw new Error(errorData.error || 'Error desconocido')
      }

      const data: AIResponse = await response.json()
      setAnswer(data.answer)
      setContext(data.context)
    } catch (error: any) {
      setErrorMessage(error.message || 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { title: 'Comida barata', icon: '💰' },
    { title: 'Algo vegetariano', icon: '🌿' },
    { title: 'Algo rápido', icon: '⚡' }
  ]

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mesh-background"></div>
      
      <header className="text-center mb-12 mt-8">
        <div className="inline-block p-4 mb-4 relative">
          <span className="text-6xl animate-pulse inline-block">✨</span>
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2 tracking-tight">
          RAG Assistant
        </h1>
        <p className="text-secondary font-medium">
          Tu asistente gastronómico potenciado por IA
        </p>
      </header>

      <main className="space-y-8">
        {/* Input Section */}
        <section className="premium-card space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-3">🔍</span>
            <textarea
              className="input-field bg-transparent border-none p-0 focus:ring-0 resize-none min-h-[60px]"
              placeholder="¿Qué se te antoja hoy?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <button
            className="premium-button w-full flex items-center justify-center gap-2 text-lg"
            onClick={() => askAI()}
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? '...' : '✨ Preguntar'}
          </button>
        </section>

        {/* Quick Actions */}
        <section className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="chip flex items-center gap-2"
              onClick={() => {
                setQuestion(action.title)
                askAI(action.title)
              }}
              disabled={isLoading}
            >
              <span>{action.icon}</span>
              <span>{action.title}</span>
            </button>
          ))}
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="premium-card flex flex-col items-center gap-4 animate-in fade-in zoom-in">
            <div className="spinner"></div>
            <p className="text-secondary font-semibold">Pensando...</p>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="premium-card border-red-500/30 bg-red-500/10 flex items-start gap-4 animate-in slide-in-from-top">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-400">Ups, algo falló</h3>
              <p className="text-secondary text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Answer State */}
        {answer && (
          <div className="premium-card border-purple-500/30 shadow-purple-500/10 animate-in slide-in-from-bottom">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs">✨</span>
              </div>
              <h3 className="font-bold text-xl">Respuesta</h3>
            </div>
            <p className="text-white leading-relaxed whitespace-pre-wrap">{answer}</p>
          </div>
        )}

        {/* Context Section */}
        {context && (
          <div className="premium-card bg-white/5 border-white/10">
            <button 
              className="w-full flex items-center justify-between text-left"
              onClick={() => setShowContext(!showContext)}
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-400">📄</span>
                <h3 className="font-bold">Contexto utilizado</h3>
              </div>
              <span className={`transition-transform ${showContext ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showContext && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-secondary text-xs font-mono leading-relaxed overflow-x-auto">
                  {context}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 pb-8 text-center text-secondary text-xs">
        RAG Assistant Demo • 2026
      </footer>
    </div>
  )
}

export default App
