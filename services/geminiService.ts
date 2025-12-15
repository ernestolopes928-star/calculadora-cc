import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport, DocType } from '../types';

const getModelForType = (type: DocType) => {
  // Use pro-preview for images as requested, flash for heavy text lifting
  if (type === DocType.IMAGE || type === DocType.PDF) {
    return 'gemini-3-pro-preview';
  }
  return 'gemini-2.5-flash';
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Um resumo executivo claro e conciso do documento." },
    keyPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista dos pontos mais importantes abordados." 
    },
    requests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["Normal", "Urgente"] }
        }
      },
      description: "Pedidos ou solicitações identificadas no texto."
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"] }
        }
      },
      description: "Riscos potenciais ou avisos encontrados."
    },
    benefits: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Benefícios, vantagens ou pontos positivos."
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 a 10 palavras-chave principais do documento."
    },
    additionalNotes: { type: Type.STRING, description: "Observações gerais adicionais, se houver." }
  },
  required: ["summary", "keyPoints", "requests", "risks", "benefits", "keywords"]
};

export const GeminiService = {
  analyzeDocument: async (
    content: string, 
    type: DocType
  ): Promise<AnalysisReport> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Chave de API não configurada.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = getModelForType(type);

    const prompt = `
      Você é um assistente administrativo especialista. Analise o documento fornecido.
      Objetivo: Facilitar a tomada de decisão administrativa.
      Linguagem: Português (Brasil), claro, direto, sem jargões.
      
      Estruture a resposta estritamente conforme o JSON schema solicitado.
      Se o documento for uma imagem, descreva o conteúdo visual relevante para um contexto de negócios.
    `;

    let parts: any[] = [];

    if (type === DocType.TEXT || type === DocType.WORD) {
      // WORD type is passed as extracted plain text string
      parts = [{ text: prompt }, { text: `Conteúdo do Documento:\n${content}` }];
    } else if (type === DocType.IMAGE || type === DocType.PDF) {
      // Content is expected to be base64 without the data prefix for the SDK sometimes, 
      // but let's parse the prefix out just in case the UI passes full dataURI.
      const base64Data = content.split(',')[1] || content;
      const mimeType = type === DocType.PDF ? 'application/pdf' : 'image/jpeg'; // Defaulting image to jpeg generic, usually works for png too with modern multimodal

      parts = [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ];
    }

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      if (!response.text) {
        throw new Error("O modelo não retornou texto.");
      }

      const json = JSON.parse(response.text);
      return json as AnalysisReport;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }
};