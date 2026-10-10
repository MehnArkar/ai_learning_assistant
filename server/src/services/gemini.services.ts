// Read at call time, not import time — imports run before dotenv.config() in index.ts
const getApiKey = () => process.env.GEMINI_API_KEY
const BASE_URL = "https://generativelanguage.googleapis.com"
const EMBEDDING_MODEL = 'gemini-embedding-001'
const EMBEDDING_DIMENSIONS = 768
const EMBED_BATCH_SIZE = 100

interface ChatHistoryItem {
    role: 'user' | 'ai'
    text: string
}

type EmbedTaskType = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'

// Turns texts into vectors. Chunks use RETRIEVAL_DOCUMENT, questions use RETRIEVAL_QUERY.
export const embedTexts = async (texts: string[], taskType: EmbedTaskType): Promise<number[][]> => {
    const embeddings: number[][] = []

    for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
        const batch = texts.slice(i, i + EMBED_BATCH_SIZE)

        const res = await fetch(`${BASE_URL}/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${getApiKey()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: batch.map((text) => ({
                    model: `models/${EMBEDDING_MODEL}`,
                    content: { parts: [{ text }] },
                    taskType,
                    outputDimensionality: EMBEDDING_DIMENSIONS,
                })),
            }),
        })

        if (!res.ok) {
            throw new Error(`Gemini batchEmbedContents failed: ${await res.text()}`)
        }

        const data = (await res.json()) as { embeddings?: Array<{ values: number[] }> }
        embeddings.push(...(data.embeddings ?? []).map((e) => e.values))
    }

    return embeddings
}

export const generateChatReply = async (
    chunks: string[],
    history: ChatHistoryItem[],
    question: string
): Promise<string> => {
    const excerpts = chunks.map((chunk, i) => `[Excerpt ${i + 1}]\n${chunk}`).join('\n\n')

    const contents = [
        ...history.map((turn) => ({
            role: turn.role === 'ai' ? 'model' : 'user',
            parts: [{ text: turn.text }],
        })),
        {
            role: 'user',
            parts: [{ text: `Document excerpts:\n${excerpts}\n\nQuestion: ${question}` }],
        },
    ]

    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash'

    const res = await fetch(`${BASE_URL}/v1beta/models/${model}:generateContent?key=${getApiKey()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{
                    text: 'You are a study assistant. Answer the question using only the document excerpts provided. ' +
                        'If the answer is not in the excerpts, say that the document does not cover it. Be clear and concise.',
                }],
            },
            contents,
        }),
    })

    if (!res.ok) {
        throw new Error(`Gemini generateContent failed: ${await res.text()}`)
    }

    const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const parts = data.candidates?.[0]?.content?.parts ?? []

    return parts.map((p) => p.text ?? '').join('')
}
