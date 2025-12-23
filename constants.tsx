
import React from 'react';
import { BlockType, Question } from './types';

export const COLORS = {
  primary: '#202C54',   // CEOE Navy Blue
  secondary: '#42A4DC', // CEOE Tenerife Light Blue
  bg: '#f8fafc',
};

export const ODS_LIST = [
  { id: 1, name: "Fin de la pobreza", color: "#E5243B" },
  { id: 2, name: "Hambre cero", color: "#DDA63A" },
  { id: 3, name: "Salud y bienestar", color: "#4C9F38" },
  { id: 4, name: "Educación de calidad", color: "#C5192D" },
  { id: 5, name: "Igualdad de género", color: "#FF3A21" },
  { id: 6, name: "Agua limpia y saneamiento", color: "#26BDE2" },
  { id: 7, name: "Energía asequible y no contaminante", color: "#FCC30B" },
  { id: 8, name: "Trabajo decente y crecimiento económico", color: "#A21942" },
  { id: 9, name: "Industria, innovación e infraestructura", color: "#FD6925" },
  { id: 10, name: "Reducción de las desigualdades", color: "#DD1367" },
  { id: 11, name: "Ciudades y comunidades sostenibles", color: "#FD9D24" },
  { id: 12, name: "Producción y consumo responsables", color: "#BF8B2E" },
  { id: 13, name: "Acción por el clima", color: "#3F7E44" },
  { id: 14, name: "Vida submarina", color: "#0A97D9" },
  { id: 15, name: "Vida de ecosistemas terrestres", color: "#56C02B" },
  { id: 16, name: "Paz, justicia e instituciones sólidas", color: "#00689D" },
  { id: 17, name: "Alianzas para lograr los objetivos", color: "#19486A" },
];

const STANDARD_OPTIONS = [
  { label: 'No lo contemplamos', value: 0 },
  { label: 'En fase de planificación', value: 1 },
  { label: 'Implementado parcialmente', value: 2 },
  { label: 'Implementado totalmente', value: 3 },
  { label: 'Referente en el sector', value: 4 },
];

export const QUESTIONS: Question[] = [
  {
    id: 'G1',
    block: BlockType.GOVERNANCE,
    text: '¿La empresa cuenta con una misión y visión alineadas formalmente con la sostenibilidad?',
    options: STANDARD_OPTIONS,
    odsImpact: [8, 12, 17]
  },
  {
    id: 'G2',
    block: BlockType.GOVERNANCE,
    text: '¿Existe una persona o comité responsable de la gestión de la sostenibilidad en la organización?',
    options: STANDARD_OPTIONS,
    odsImpact: [16, 17]
  },
  {
    id: 'P1',
    block: BlockType.PEOPLE,
    text: '¿Dispone de políticas activas para asegurar la igualdad de género y la no discriminación?',
    options: STANDARD_OPTIONS,
    odsImpact: [5, 10]
  },
  {
    id: 'P2',
    block: BlockType.PEOPLE,
    text: '¿Existen programas de formación y desarrollo profesional para la plantilla?',
    options: STANDARD_OPTIONS,
    odsImpact: [4, 8]
  },
  {
    id: 'V1',
    block: BlockType.VALUE_CHAIN,
    text: '¿Prioriza la contratación de proveedores locales de las Islas Canarias?',
    options: STANDARD_OPTIONS,
    odsImpact: [8, 11]
  },
  {
    id: 'V2',
    block: BlockType.VALUE_CHAIN,
    text: '¿Evalúa a sus proveedores bajo criterios sociales o ambientales?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 17]
  },
  {
    id: 'E1',
    block: BlockType.ENVIRONMENT,
    text: '¿Realiza acciones para reducir el consumo energético o utiliza fuentes de energía renovable?',
    options: STANDARD_OPTIONS,
    odsImpact: [7, 13]
  },
  {
    id: 'E2',
    block: BlockType.ENVIRONMENT,
    text: '¿Cuenta con un sistema de gestión de residuos y fomento de la economía circular?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 14, 15]
  },
  {
    id: 'C1',
    block: BlockType.COMMUNITY,
    text: '¿Colabora activamente con entidades sociales o proyectos comunitarios locales?',
    options: STANDARD_OPTIONS,
    odsImpact: [1, 11, 17]
  },
  {
    id: 'M1',
    block: BlockType.MEASUREMENT,
    text: '¿Mide y reporta anualmente sus impactos no financieros (sociales y ambientales)?',
    options: STANDARD_OPTIONS,
    odsImpact: [12, 16]
  }
];
