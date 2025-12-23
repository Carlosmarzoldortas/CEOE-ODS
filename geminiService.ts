
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "./types";

// Always initialize GoogleGenAI with a named parameter for the API key.
// The key is provided by the environment.

export const generateSdgReport = async (result: AssessmentResult): Promise<string> => {
  // Create a new GoogleGenAI instance inside the function to use the current API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scoresText = Object.entries(result.scores)
    .map(([block, score]) => `${block}: ${score}/100`)
    .join('\n');

  const prompt = `
    Actúa como un consultor senior experto en sostenibilidad y ODS para CEOE Tenerife.
    Debes elaborar un breve informe ejecutivo de recomendaciones para una pyme canaria basada en sus resultados de autodiagnóstico.

    DATOS DE LA EMPRESA:
    Nombre: ${result.companyName}
    Sector: ${result.sector}
    
    PUNTUACIONES POR BLOQUE:
    ${scoresText}

    PUNTUACIÓN TOTAL DE MADUREZ: ${result.totalScore}/100

    ESTRUCTURA DEL INFORME:
    1. Resumen de la situación actual (Señalar fortalezas y debilidades según las notas).
    2. Tres recomendaciones estratégicas clave para mejorar el alineamiento con los ODS.
    3. Una recomendación específica adaptada al tejido empresarial canario.
    
    Mantén un tono profesional, alentador y práctico. Usa Markdown para el formato.
  `;

  try {
    // Sustainability analysis is a complex reasoning task, so we use gemini-3-pro-preview.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    // Access response.text as a property.
    return response.text || "No se pudo generar el informe en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error al generar las recomendaciones. Por favor, inténtelo más tarde.";
  }
};
