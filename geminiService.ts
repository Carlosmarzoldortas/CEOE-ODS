
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "./types";

/**
 * Generates a high-level strategic SDG report using Gemini 3 Pro.
 * Adheres to CEOE Tenerife institutional tone.
 */
export const generateSdgReport = async (result: AssessmentResult): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    return "Error de configuración: API_KEY no disponible.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const scoresText = Object.entries(result.scores)
      .map(([block, score]) => `- **${block}**: ${Math.round(score)}%`)
      .join('\n');

    const prompt = `
      Eres el Director del Gabinete de Sostenibilidad de CEOE Tenerife. 
      Debes redactar un "Informe Estratégico de Posicionamiento ODS" para la empresa "${result.companyName}".
      
      CONTEXTO:
      - Sector: ${result.sector}
      - Tamaño: ${result.size}
      - Marco Normativo: Agenda Canaria 2030 y Ley Canaria de Cambio Climático.
      
      RESULTADOS DEL AUTODIAGNÓSTICO:
      ${scoresText}
      Índice Global de Madurez: ${Math.round(result.totalScore)}%

      INSTRUCCIONES DE REDACCIÓN:
      1. Usa un tono institucional, ejecutivo, inspirador y técnico.
      2. No menciones que eres una IA.
      3. Estructura el informe con los siguientes apartados:
         # DIAGNÓSTICO ESTRATÉGICO DE SOSTENIBILIDAD
         ## 1. Análisis de Madurez
         (Analiza brevemente el desempeño actual según los bloques evaluados).
         ## 2. Fortalezas Destacadas
         (Identifica dónde la empresa está liderando).
         ## 3. Hoja de Ruta Prioritaria (Tenerife 2030)
         (Propón 3 acciones concretas y realistas para el contexto canario: ej. autoconsumo fotovoltaico, economía circular, igualdad local).
         ## 4. Conclusión Institucional
         (Cierre breve sobre la importancia de la colaboración empresarial en CEOE Tenerife).

      IMPORTANTE: Usa Markdown para el formato. El informe debe ser denso en valor estratégico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    return response.text || "Informe generado con éxito. Consulte sus KPIs en el panel superior.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "El motor de análisis estratégico está saturado en este momento. Por favor, descargue sus resultados cuantitativos arriba.";
  }
};
