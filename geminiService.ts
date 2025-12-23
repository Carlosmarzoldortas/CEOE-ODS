import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "./types";

/**
 * Generates a strategic SDG report using Gemini 3 Pro.
 * Adheres to Google GenAI SDK guidelines for Gemini 3 models and thinking budget.
 */
export const generateSdgReport = async (result: AssessmentResult): Promise<string> => {
  // Always initialize GoogleGenAI with a named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scoresText = Object.entries(result.scores)
    .map(([block, score]) => `${block}: ${Math.round(score)}/100`)
    .join('\n');

  const prompt = `
    Actúa como el Director del Gabinete de Sostenibilidad de CEOE Tenerife. 
    Tu objetivo es redactar una "Hoja de Ruta Estratégica" personalizada para una empresa canaria.

    IMPORTANTE: No menciones en ningún momento que eres una inteligencia artificial, ni que este informe ha sido generado por IA. El tono debe ser puramente institucional and técnico, como si fuera un documento redactado por consultores expertos de CEOE.

    PERFIL EMPRESARIAL:
    - Empresa: ${result.companyName}
    - Sector: ${result.sector}
    - Tamaño: ${result.size}
    
    DESEMPEÑO DIAGNOSTICADO:
    ${scoresText}
    Índice de Madurez Global: ${Math.round(result.totalScore)}%

    CONTEXTO OBLIGATORIO:
    1. Menciona la relevancia de la "Agenda Canaria 2030" y la Ley Canaria de Cambio Climático.
    2. Adapta las recomendaciones al tamaño (${result.size}). Si es pequeña, prioriza acciones de bajo coste y alto impacto.
    3. Enfócate en la insularidad (transporte, agua, economía circular local).

    ESTRUCTURA DEL INFORME (Formato Markdown):
    # Análisis de Madurez Agenda 2030
    [Breve párrafo sobre su posición actual comparada con su sector]

    ## Fortalezas Destacadas
    [2 puntos clave detectados]

    ## Áreas de Acción Prioritaria
    [3 recomendaciones específicas por orden de urgencia]

    ## Recomendación de "Impacto Canario"
    [Una acción específica para mejorar el ecosistema insular]

    Mantén un lenguaje ejecutivo, inspirador y riguroso.
  `;

  try {
    // Correct usage of generateContent for text generation with thinking budget
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        // Recommendation: Set both maxOutputTokens and thinkingConfig.thinkingBudget at the same time
        maxOutputTokens: 4000,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    // Accessing .text directly as a property, as per guidelines
    return response.text || "No se pudo generar el análisis en este momento.";
  } catch (error) {
    console.error("Technical Error:", error);
    return "Error en la conexión con el Gabinete Técnico. Por favor, contacte con CEOE Tenerife.";
  }
};