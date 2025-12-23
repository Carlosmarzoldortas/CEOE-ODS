
export enum BlockType {
  GOVERNANCE = 'Gobernanza y Estrategia',
  PEOPLE = 'Personas y Talento',
  VALUE_CHAIN = 'Cadena de Valor y Proveedores',
  ENVIRONMENT = 'Medio Ambiente y Clima',
  COMMUNITY = 'Comunidad e Impacto Social',
  MEASUREMENT = 'Medición y Transparencia'
}

export interface Question {
  id: string;
  block: BlockType;
  text: string;
  options: { label: string; value: number }[];
  odsImpact: number[]; // Array of SDG numbers affected
}

export interface AssessmentResult {
  companyName: string;
  sector: string;
  scores: Record<BlockType, number>;
  totalScore: number;
  odsAlignment: Record<number, number>;
  recommendations?: string;
}

export interface UserInfo {
  companyName: string;
  sector: string;
  email: string;
}
