
import { BlockType, Question } from './types';

export const COLORS = {
  primary: '#202C54',
  secondary: '#42A4DC',
  accent: '#F39200', 
  bg: '#f8fafc',
};

export const ODS_LIST = [
  { 
    id: 1, 
    name: "Fin de la pobreza", 
    color: "#E5243B", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01.jpg",
    description: "Apoyo a la inclusión social en el entorno local de las islas.",
    goals: ["Inclusión social", "Empleo vulnerable", "Colaboración con ONGs locales"]
  },
  { 
    id: 2, 
    name: "Hambre cero", 
    color: "#DDA63A", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-02.jpg",
    description: "Fomento del producto local (Km 0) y seguridad alimentaria.",
    goals: ["Producto canario", "Desperdicio cero", "Agricultura sostenible"]
  },
  { 
    id: 3, 
    name: "Salud y bienestar", 
    color: "#4C9F38", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-03.jpg",
    description: "Salud laboral y bienestar de la plantilla en el archipiélago.",
    goals: ["Salud mental", "Ergonomía", "Prevención de riesgos"]
  },
  { 
    id: 4, 
    name: "Educación de calidad", 
    color: "#C5192D", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-04.jpg",
    description: "Formación continua y capacitación en competencias verdes.",
    goals: ["Formación técnica", "Becas", "Dual canaria"]
  },
  { 
    id: 5, 
    name: "Igualdad de género", 
    color: "#FF3A21", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-05.jpg",
    description: "Eliminación de la brecha salarial y fomento del liderazgo femenino.",
    goals: ["Igualdad retributiva", "Conciliación", "Liderazgo"]
  },
  { 
    id: 6, 
    name: "Agua limpia y saneamiento", 
    color: "#26BDE2", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-06.jpg",
    description: "Uso eficiente del agua, recurso crítico en las Islas Canarias.",
    goals: ["Ahorro hídrico", "Vertido cero", "Reutilización"]
  },
  { 
    id: 7, 
    name: "Energía asequible y no contaminante", 
    color: "#FCC30B", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-07.jpg",
    description: "Transición hacia renovables en el mix energético canario.",
    goals: ["Fotovoltaica", "Eficiencia LED", "Auditoría energética"]
  },
  { 
    id: 8, 
    name: "Trabajo decente y crecimiento económico", 
    color: "#A21942", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-08.jpg",
    description: "Impulso a la economía canaria con empleo de calidad.",
    goals: ["Contrato indefinido", "Crecimiento local", "Productividad"]
  },
  { 
    id: 9, 
    name: "Industria, innovación e infraestructura", 
    color: "#FD6925", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-09.jpg",
    description: "Digitalización y modernización del tejido empresarial insular.",
    goals: ["Digitalización", "I+D Canario", "Infraestructura verde"]
  },
  { 
    id: 10, 
    name: "Reducción de las desigualdades", 
    color: "#DD1367", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-10.jpg",
    description: "Garantizar la inclusión de todas las personas sin distinción.",
    goals: ["Accesibilidad", "Inclusión", "Equidad"]
  },
  { 
    id: 11, 
    name: "Ciudades y comunidades sostenibles", 
    color: "#FD9D24", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-11.jpg",
    description: "Protección del patrimonio cultural y natural de Tenerife.",
    goals: ["Patrimonio canario", "Movilidad limpia", "Apoyo local"]
  },
  { 
    id: 12, 
    name: "Producción y consumo responsables", 
    color: "#BF8B2E", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-12.jpg",
    description: "Hacia una economía circular en un territorio fragmentado.",
    goals: ["Reciclaje", "Ecodiseño", "Consumo Km0"]
  },
  { 
    id: 13, 
    name: "Acción por el clima", 
    color: "#3F7E44", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-13.jpg",
    description: "Medidas urgentes para combatir el cambio climático en las islas.",
    goals: ["Huella de Carbono", "Resiliencia", "Adaptación"]
  },
  { 
    id: 14, 
    name: "Vida submarina", 
    color: "#0A97D9", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-14.jpg",
    description: "Conservación de la biodiversidad marina de Canarias.",
    goals: ["Protección costa", "Sin plásticos", "Pesca artesanal"]
  },
  { 
    id: 15, 
    name: "Vida de ecosistemas terrestres", 
    color: "#56C02B", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-15.jpg",
    description: "Cuidado de los montes, laurisilva y biodiversidad endémica.",
    goals: ["Reforestación", "Biodiversidad", "Control especies"]
  },
  { 
    id: 16, 
    name: "Paz, justicia e instituciones sólidas", 
    color: "#00689D", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-16.jpg",
    description: "Ética empresarial, transparencia y cumplimiento normativo.",
    goals: ["Compliance", "Transparencia", "Anticorrupción"]
  },
  { 
    id: 17, 
    name: "Alianzas para lograr los objetivos", 
    color: "#19486A", 
    icon: "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-17.jpg",
    description: "Cooperación público-privada en el marco de CEOE Tenerife.",
    goals: ["Asociacionismo", "Proyectos ODS", "Cooperación"]
  },
];

const STANDARD_OPTIONS = [
  { label: 'No aplicado / Desconocido', value: 0 },
  { label: 'Incipiente / Planificando', value: 1 },
  { label: 'Parcialmente implementado', value: 2 },
  { label: 'Maduro con indicadores', value: 3 },
  { label: 'Referente sectorial', value: 4 },
];

export const QUESTIONS: Question[] = [
  // ESTRATEGIA Y GOBERNANZA
  {
    id: 'G1',
    block: BlockType.GOVERNANCE,
    text: '¿La alta dirección ha formalizado un compromiso público con la Agenda Canaria 2030 y los ODS?',
    options: STANDARD_OPTIONS,
    odsImpact: [16, 17]
  },
  {
    id: 'G2',
    block: BlockType.GOVERNANCE,
    text: '¿Existe una persona o comité responsable de supervisar la sostenibilidad y los criterios ESG?',
    options: STANDARD_OPTIONS,
    odsImpact: [16, 12]
  },
  {
    id: 'G3',
    block: BlockType.GOVERNANCE,
    text: '¿Se han integrado los riesgos climáticos en el plan de continuidad de negocio de la empresa?',
    options: STANDARD_OPTIONS,
    odsImpact: [13, 9]
  },

  // PERSONAS Y TALENTO
  {
    id: 'P1',
    block: BlockType.PEOPLE,
    text: '¿Dispone de medidas de conciliación y flexibilidad horaria adaptadas al mercado laboral canario?',
    options: STANDARD_OPTIONS,
    odsImpact: [5, 8]
  },
  {
    id: 'P2',
    block: BlockType.PEOPLE,
    text: '¿Aplica políticas de igualdad retributiva y fomento del liderazgo femenino en puestos directivos?',
    options: STANDARD_OPTIONS,
    odsImpact: [5, 10]
  },
  {
    id: 'P3',
    block: BlockType.PEOPLE,
    text: '¿Invierte en la formación de su plantilla en competencias digitales y de sostenibilidad (Green Skills)?',
    options: STANDARD_OPTIONS,
    odsImpact: [4, 8]
  },

  // OPERACIONES Y SUMINISTRO
  {
    id: 'V1',
    block: BlockType.VALUE_CHAIN,
    text: '¿Prioriza activamente la contratación de proveedores locales de Tenerife o Canarias (Producto Km0)?',
    options: STANDARD_OPTIONS,
    odsImpact: [8, 11, 12]
  },
  {
    id: 'V2',
    block: BlockType.VALUE_CHAIN,
    text: '¿Evalúa a sus proveedores bajo criterios sociales y medioambientales antes de su contratación?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 17]
  },
  {
    id: 'V3',
    block: BlockType.VALUE_CHAIN,
    text: '¿Optimiza sus rutas de transporte para minimizar las emisiones en el territorio insular?',
    options: STANDARD_OPTIONS,
    odsImpact: [11, 13]
  },

  // PLANETA Y CLIMA
  {
    id: 'E1',
    block: BlockType.ENVIRONMENT,
    text: '¿Monitoriza y cuenta con un plan de reducción de su Huella de Carbono anual?',
    options: STANDARD_OPTIONS,
    odsImpact: [7, 13]
  },
  {
    id: 'E2',
    block: BlockType.ENVIRONMENT,
    text: '¿Ha implementado medidas de eficiencia hídrica (ahorro de agua), recurso crítico en Canarias?',
    options: STANDARD_OPTIONS,
    odsImpact: [6, 15]
  },
  {
    id: 'E3',
    block: BlockType.ENVIRONMENT,
    text: '¿Aplica criterios de economía circular para maximizar el reciclaje y reducir el desperdicio?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 14]
  },

  // IMPACTO SOCIAL CANARIO
  {
    id: 'C1',
    block: BlockType.COMMUNITY,
    text: '¿Colabora económicamente o mediante voluntariado con entidades sociales del archipiélago?',
    options: STANDARD_OPTIONS,
    odsImpact: [1, 10, 17]
  },
  {
    id: 'C2',
    block: BlockType.COMMUNITY,
    text: '¿Contribuye a la preservación del patrimonio cultural o natural de las Islas Canarias?',
    options: STANDARD_OPTIONS,
    odsImpact: [11, 15]
  },
  {
    id: 'C3',
    block: BlockType.COMMUNITY,
    text: '¿Participa en programas de fomento del empleo para colectivos vulnerables en Tenerife?',
    options: STANDARD_OPTIONS,
    odsImpact: [1, 8]
  },

  // REPORTE Y TRANSPARENCIA
  {
    id: 'M1',
    block: BlockType.MEASUREMENT,
    text: '¿Publica anualmente una Memoria de Sostenibilidad o Estado de Información No Financiera?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 16]
  },
  {
    id: 'M2',
    block: BlockType.MEASUREMENT,
    text: '¿Comunica de forma transparente sus avances en ODS a través de su web o redes sociales?',
    options: STANDARD_OPTIONS,
    odsImpact: [17, 12]
  },
  {
    id: 'M3',
    block: BlockType.MEASUREMENT,
    text: '¿Utiliza indicadores (KPIs) específicos para medir el impacto social y ambiental de su actividad?',
    options: STANDARD_OPTIONS,
    odsImpact: [9, 16]
  }
];
