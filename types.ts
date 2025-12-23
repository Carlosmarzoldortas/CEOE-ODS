
export enum BlockType {
  GOVERNANCE = 'Estrategia y Gobernanza',
  PEOPLE = 'Personas y Talento',
  VALUE_CHAIN = 'Operaciones y Suministro',
  ENVIRONMENT = 'Planeta y Clima',
  COMMUNITY = 'Impacto Social Canario',
  MEASUREMENT = 'Reporte y Transparencia'
}

export enum CompanySize {
  SELF_EMPLOYED = 'Autónomo / Profesional',
  MICRO = 'Microempresa (1-9)',
  SMALL = 'Pequeña (10-49)',
  MEDIUM = 'Mediana (50-249)'
}

export interface Question {
  id: string;
  block: BlockType;
  text: string;
  options: { label: string; value: number }[];
  odsImpact: number[];
}

export interface AssessmentResult {
  companyName: string;
  sector: string;
  size: CompanySize;
  scores: Record<BlockType, number>;
  totalScore: number;
  odsAlignment: Record<number, number>;
  recommendations?: string;
}

export interface UserInfo {
  companyName: string;
  sector: string;
  size: CompanySize;
  email: string;
}
