
import { BlockType, Question } from './types';

export const COLORS = {
  primary: '#202C54',
  secondary: '#42A4DC',
  accent: '#F39200', // ODS Orange for calls to action
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
  { label: 'En fase inicial / Idea', value: 1 },
  { label: 'Desarrollado parcialmente', value: 2 },
  { label: 'Implementado con métricas', value: 3 },
  { label: 'Líder / Referencia externa', value: 4 },
];

export const QUESTIONS: Question[] = [
  {
    id: 'G1',
    block: BlockType.GOVERNANCE,
    text: '¿La dirección ha formalizado un compromiso público con la Agenda Canaria 2030?',
    options: STANDARD_OPTIONS,
    odsImpact: [16, 17]
  },
  {
    id: 'G2',
    block: BlockType.GOVERNANCE,
    text: '¿Se han integrado criterios ESG (Ambientales, Sociales y de Gobernanza) en la toma de decisiones?',
    options: STANDARD_OPTIONS,
    odsImpact: [8, 12]
  },
  {
    id: 'P1',
    block: BlockType.PEOPLE,
    text: '¿Cuenta con un plan de igualdad y medidas activas de conciliación adaptadas a la realidad insular?',
    options: STANDARD_OPTIONS,
    odsImpact: [5, 10]
  },
  {
    id: 'P2',
    block: BlockType.PEOPLE,
    text: '¿Existen canales de participación para que los empleados propongan mejoras en sostenibilidad?',
    options: STANDARD_OPTIONS,
    odsImpact: [4, 8]
  },
  {
    id: 'V1',
    block: BlockType.VALUE_CHAIN,
    text: '¿Prioriza a proveedores de Tenerife o Canarias para reducir la huella de transporte y apoyar el empleo local?',
    options: STANDARD_OPTIONS,
    odsImpact: [8, 11, 13]
  },
  {
    id: 'V2',
    block: BlockType.VALUE_CHAIN,
    text: '¿Exige a sus proveedores principales certificaciones o compromisos básicos de sostenibilidad?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 17]
  },
  {
    id: 'E1',
    block: BlockType.ENVIRONMENT,
    text: '¿Ha implantado medidas de eficiencia energética o cuenta con instalaciones de energías renovables?',
    options: STANDARD_OPTIONS,
    odsImpact: [7, 13]
  },
  {
    id: 'E2',
    block: BlockType.ENVIRONMENT,
    text: '¿Dispone de un sistema para minimizar el consumo de agua y gestionar correctamente los residuos?',
    options: STANDARD_OPTIONS,
    odsImpact: [6, 12, 14, 15]
  },
  {
    id: 'C1',
    block: BlockType.COMMUNITY,
    text: '¿Realiza acciones de patrocinio o colaboración con entidades sociales y culturales de las islas?',
    options: STANDARD_OPTIONS,
    odsImpact: [1, 11]
  },
  {
    id: 'M1',
    block: BlockType.MEASUREMENT,
    text: '¿Publica un informe o memoria anual que recoja sus avances en materia de ODS?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 16]
  }
];
