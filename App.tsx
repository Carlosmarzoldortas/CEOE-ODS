
import React, { useState, useMemo, useEffect } from 'react';
import Layout, { CEOELogo, Corp5Logo } from './components/Layout';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell, Legend, Line, ComposedChart
} from 'recharts';
import { 
  Loader2, Target, BarChart3, ArrowRight, ArrowLeft, CheckCircle2, FileText, Quote, Globe2, Compass, Info, Zap, Building2, Users, ShieldCheck, BookOpen, Layers, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, ODS_LIST, COLORS } from './constants';
import { UserInfo, AssessmentResult, BlockType, CompanySize } from './types';
import { generateSdgReport } from './geminiService';

type AppStep = 'landing' | 'register' | 'assessment' | 'processing' | 'results' | 'ods-detail' | 'methodology';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [selectedOdsId, setSelectedOdsId] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({ companyName: '', sector: '', size: CompanySize.MICRO, email: '' });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const resetAssessment = () => {
    setStep('landing');
    setSelectedOdsId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setReport(null);
  };

  const assessmentResults = useMemo(() => {
    if (step !== 'results' && step !== 'processing') return null;
    const blockScores: Record<string, number> = {};
    const odsAlignment: Record<number, number> = {};
    ODS_LIST.forEach(ods => { odsAlignment[ods.id] = 0; });

    (Object.values(BlockType) as string[]).forEach(block => {
      const blockQuestions = QUESTIONS.filter(q => q.block === (block as BlockType));
      const totalPossible = blockQuestions.length * 4;
      let actualScore: number = 0;
      blockQuestions.forEach(q => {
        const val = (answers[q.id] ?? 0) as number;
        actualScore += val;
        q.odsImpact.forEach(odsId => { 
          odsAlignment[odsId] = ((odsAlignment[odsId] || 0) as number) + val; 
        });
      });
      blockScores[block as BlockType] = totalPossible > 0 ? (actualScore / totalPossible) * 100 : 0;
    });

    const totalPossibleAll = QUESTIONS.length * 4;
    const actualScoreAll = (Object.values(answers) as number[]).reduce((acc: number, val: number) => acc + val, 0);
    const totalScore = totalPossibleAll > 0 ? (actualScoreAll / totalPossibleAll) * 100 : 0;

    return {
      companyName: userInfo.companyName,
      sector: userInfo.sector,
      size: userInfo.size,
      scores: blockScores as Record<BlockType, number>,
      totalScore,
      odsAlignment
    } as AssessmentResult;
  }, [answers, userInfo, step]);

  useEffect(() => {
    if (step === 'processing' && assessmentResults) {
      const runGeneration = async () => {
        setIsGeneratingReport(true);
        const reportText = await generateSdgReport(assessmentResults);
        setReport(reportText);
        setIsGeneratingReport(false);
        setStep('results');
      };
      runGeneration();
    }
  }, [step, assessmentResults]);

  const LandingView = () => (
    <div className="max-w-7xl mx-auto py-12 md:py-20 px-8">
      <div className="flex flex-col items-center text-center mb-40">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 max-w-5xl"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#42A4DC]/10 text-[#42A4DC] rounded-full text-xs font-black uppercase tracking-widest mx-auto">
              <Zap className="w-4 h-4" /> Gabinete de Sostenibilidad
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#202C54] leading-[0.8] newspaper-font">
              Hacia una <br/><span className="text-[#42A4DC]">Empresa</span><br/>Sostenible
            </h1>
            <p className="text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed italic mx-auto">
              "Liderando la Agenda Canaria 2030 desde el corazón del tejido empresarial de Tenerife."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <button 
               onClick={() => setStep('register')}
               className="bg-[#202C54] text-white px-12 py-8 font-black uppercase tracking-[0.4em] text-sm hover:bg-[#42A4DC] transition-all shadow-3xl flex items-center justify-center gap-6 group"
             >
               EMPEZAR DIAGNÓSTICO <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
             </button>
             <button 
               onClick={() => setStep('methodology')}
               className="border-4 border-[#202C54] text-[#202C54] px-12 py-8 font-black uppercase tracking-[0.4em] text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
             >
               METODOLOGÍA ODS
             </button>
          </div>
        </motion.div>
      </div>

      <div className="space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-8 border-[#202C54] pb-12">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 text-[#42A4DC]">
               <Globe2 className="w-10 h-10" />
               <span className="text-[12px] font-black uppercase tracking-[0.8em]">Marco Estratégico Global</span>
            </div>
            <h3 className="text-5xl font-black text-[#202C54] uppercase tracking-tighter">Explorador de Objetivos</h3>
          </div>
          <p className="text-slate-400 font-bold max-w-md text-right uppercase tracking-widest text-[10px]">
            Haga clic en cada ODS para conocer las metas específicas y casos de éxito en empresas tinerfeñas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ODS_LIST.map((ods) => (
            <motion.button
              key={ods.id}
              whileHover={{ scale: 1.05, y: -5, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedOdsId(ods.id); setStep('ods-detail'); }}
              className="aspect-square relative group overflow-hidden shadow-xl flex items-center justify-center bg-white border-2 border-slate-100"
              style={{ backgroundColor: ods.color }}
            >
              {!imageErrors[ods.id] ? (
                <img 
                  src={ods.icon} 
                  alt={ods.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={() => setImageErrors(prev => ({...prev, [ods.id]: true}))}
                />
              ) : (
                <div className="text-center p-6 text-white font-black">
                  <span className="text-6xl block opacity-30">{ods.id}</span>
                  <span className="text-[10px] uppercase tracking-tighter">{ods.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
            </motion.button>
          ))}
          <div className="aspect-square bg-slate-50 flex flex-col items-center justify-center p-8 text-center border-4 border-dashed border-slate-200">
             <CEOELogo className="h-10 opacity-30 mb-4" />
             <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Sinergia <br/> Tenerife</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MethodologyView = () => (
    <div className="bg-white py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-start mb-32">
          <div className="md:w-1/3 space-y-8 sticky top-12">
             <div className="w-20 h-2 w-full bg-[#42A4DC] mb-8" />
             <h2 className="text-6xl font-black text-[#202C54] uppercase tracking-tighter leading-none newspaper-font">Marco Técnico<br/>Metodológico</h2>
             <p className="text-xl text-slate-500 font-medium italic leading-relaxed">
               "Un sistema de evaluación riguroso diseñado por el Gabinete de Sostenibilidad para alinear la competitividad empresarial con el bienestar social de Canarias."
             </p>
             <button 
               onClick={() => setStep('register')}
               className="bg-[#202C54] text-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-[#42A4DC] transition-all flex items-center gap-4"
             >
               INICIAR AHORA <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          
          <div className="md:w-2/3 space-y-20">
            <section className="space-y-8">
               <div className="flex items-center gap-4 text-[#42A4DC]">
                  <ShieldCheck className="w-10 h-10" />
                  <h4 className="text-xs font-black uppercase tracking-[0.5em]">Fundamentos del Diagnóstico</h4>
               </div>
               <p className="text-2xl text-slate-700 leading-relaxed font-serif">
                 Esta herramienta utiliza una matriz de indicadores cruzados que vinculan las operaciones empresariales con las metas específicas de la <strong>Agenda Canaria 2030</strong> y los requerimientos de la <strong>Ley Canaria de Cambio Climático</strong>.
               </p>
            </section>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "Gobernanza", icon: <ShieldCheck />, desc: "Análisis del compromiso de la dirección y la ética empresarial." },
                { title: "Personas", icon: <Users />, desc: "Igualdad, conciliación y talento local en el archipiélago." },
                { title: "Planeta", icon: <Globe2 />, desc: "Eficiencia hídrica, energética y gestión de residuos insulares." },
                { title: "Comunidad", icon: <Target />, desc: "Impacto social y apoyo al tejido económico de Tenerife." },
              ].map((item, i) => (
                <div key={i} className="p-10 border-2 border-slate-50 bg-slate-50/30 group hover:border-[#42A4DC] transition-all">
                  <div className="text-[#202C54] group-hover:text-[#42A4DC] mb-6 transition-colors">
                    {/* Fix: Cast icon to React.ReactElement<any> to allow className prop */}
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-12 h-12" })}
                  </div>
                  <h5 className="text-xl font-black text-[#202C54] uppercase tracking-widest mb-4">{item.title}</h5>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <section className="bg-[#202C54] text-white p-12 md:p-20 space-y-12">
               <div className="flex items-center gap-4 text-[#42A4DC]">
                  <Award className="w-10 h-10" />
                  <h4 className="text-xs font-black uppercase tracking-[0.5em]">Escala de Madurez</h4>
               </div>
               <div className="space-y-6">
                 {[
                   { level: 0, title: "No Aplicado", desc: "La empresa aún no ha identificado la relevancia de este ODS." },
                   { level: 1, title: "Incipiente", desc: "Existen intenciones o acciones aisladas sin planificación." },
                   { level: 2, title: "En Desarrollo", desc: "Se han implementado procesos básicos de gestión." },
                   { level: 3, title: "Consolidado", desc: "Métricas claras y alineamiento estratégico total." },
                   { level: 4, title: "Liderazgo", desc: "La empresa es un referente y motor de cambio en Canarias." },
                 ].map((lv) => (
                   <div key={lv.level} className="flex gap-8 border-b border-white/10 pb-6 items-center">
                     <span className="text-4xl font-black text-[#42A4DC] opacity-50">{lv.level}</span>
                     <div>
                        <h6 className="font-black uppercase tracking-widest text-sm">{lv.title}</h6>
                        <p className="text-slate-400 text-xs mt-1">{lv.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterView = () => (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-20 px-8">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl w-full bg-white shadow-[0_50px_100px_rgba(32,44,84,0.15)] border-t-[20px] border-[#202C54] p-16 md:p-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Building2 className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-6xl font-black text-[#202C54] uppercase tracking-tighter leading-none">REGISTRO TÉCNICO</h3>
            <p className="text-[#42A4DC] font-black uppercase tracking-[0.5em] text-xs">Identificación para el Gabinete ODS de CEOE Tenerife</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep('assessment'); }} className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Nombre Comercial</label>
              <div className="relative group">
                <input required type="text" className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#42A4DC] focus:bg-white p-6 outline-none font-bold text-xl transition-all" placeholder="Ej: Tech Tenerife S.L." value={userInfo.companyName} onChange={e => setUserInfo(p => ({...p, companyName: e.target.value}))} />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Sector Actividad</label>
              <select required className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#42A4DC] focus:bg-white p-6 outline-none font-bold text-xl appearance-none cursor-pointer" value={userInfo.sector} onChange={e => setUserInfo(p => ({...p, sector: e.target.value}))}>
                <option value="">Seleccione...</option>
                <option value="Turismo">Turismo y Ocio</option>
                <option value="Servicios">Servicios Empresariales</option>
                <option value="Construcción">Construcción y Renovación</option>
                <option value="Comercio">Retail y Comercio</option>
                <option value="Logística">Logística y Transporte</option>
                <option value="Agro">Sector Primario / Agro</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Tamaño Empresa</label>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(CompanySize).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setUserInfo(p => ({...p, size}))}
                    className={`flex items-center gap-4 p-4 border-2 transition-all text-left ${userInfo.size === size ? 'border-[#42A4DC] bg-[#42A4DC]/5 text-[#202C54]' : 'border-slate-100 hover:border-slate-300 text-slate-400'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${userInfo.size === size ? 'border-[#42A4DC]' : 'border-slate-200'}`}>
                      {userInfo.size === size && <div className="w-3 h-3 bg-[#42A4DC] rounded-full" />}
                    </div>
                    <span className="font-bold text-sm uppercase">{size}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-end">
               <div className="bg-[#202C54]/5 p-8 border-l-8 border-[#202C54]">
                 <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                   "La veracidad de sus datos permite al Gabinete Técnico generar un informe de recomendaciones adaptado a su realidad operativa."
                 </p>
               </div>
               <button type="submit" className="w-full bg-[#202C54] text-white py-8 font-black uppercase tracking-[0.5em] text-sm hover:bg-[#42A4DC] transition-all shadow-2xl flex items-center justify-center gap-4">
                ENTRAR AL PANEL <ArrowRight className="w-6 h-6" />
               </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );

  const AssessmentView = () => {
    const q = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="bg-slate-50 min-h-[85vh] py-12 px-8 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">
          <div className="bg-white p-4 shadow-xl flex items-center justify-between border-b-4 border-[#202C54]">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#202C54] flex items-center justify-center text-white text-3xl font-black">
                   {currentQuestionIndex + 1}
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 mb-1">Módulo Actual</h4>
                   <p className="font-black text-[#202C54] uppercase tracking-tighter text-xl">{q.block}</p>
                </div>
             </div>
             <div className="hidden md:flex flex-col items-end gap-2 pr-4">
                <span className="text-4xl font-black text-[#42A4DC]">{Math.round(progress)}%</span>
                <div className="w-48 h-2 bg-slate-100 overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    className="h-full bg-[#42A4DC]" 
                   />
                </div>
             </div>
          </div>
          
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-16 md:p-32 shadow-4xl relative"
          >
            <div className="absolute top-10 left-10 text-[180px] font-black text-slate-50 leading-none select-none -z-10">
               ?
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-[#202C54] mb-32 leading-[0.85] tracking-tighter uppercase max-w-4xl relative">
              {q.text}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setAnswers({ ...answers, [q.id]: opt.value });
                    if (currentQuestionIndex < QUESTIONS.length - 1) {
                      setCurrentQuestionIndex(prev => prev + 1);
                    } else {
                      setStep('processing');
                    }
                  }}
                  className="group flex flex-col p-8 border-4 border-slate-50 hover:border-[#42A4DC] hover:bg-slate-50 transition-all text-left space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#42A4DC] text-slate-400 group-hover:text-white flex items-center justify-center text-sm font-black transition-colors">
                      {opt.value}
                    </span>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-[#42A4DC] flex items-center justify-center">
                       <div className="w-3 h-3 bg-[#42A4DC] scale-0 group-hover:scale-100 transition-transform rounded-full" />
                    </div>
                  </div>
                  <span className="text-xl font-black text-slate-700 group-hover:text-[#202C54] uppercase tracking-tighter leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-between items-center px-4">
            <button 
              onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(c => c - 1)}
              className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-[#202C54] hover:text-[#42A4DC] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Pregunta Anterior
            </button>
            <div className="flex gap-4">
               {QUESTIONS.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${i === currentQuestionIndex ? 'bg-[#202C54]' : 'bg-slate-200'}`} />
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const currentResults = assessmentResults;
    if (!currentResults) return null;

    const radarData = Object.entries(currentResults.scores).map(([name, value]) => ({
      subject: name.split(' ')[0],
      A: Math.round(value as number),
      B: 50 + Math.random() * 20, 
      fullMark: 100,
    }));

    const odsChartData = ODS_LIST.map(ods => ({
      name: `ODS ${ods.id}`,
      value: currentResults.odsAlignment[ods.id] || 0,
      color: ods.color,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    const totalScoreValue = Number(currentResults.totalScore);

    return (
      <div className="bg-slate-50 py-20 px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="bg-white border-[30px] border-[#202C54] p-24 shadow-5xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <CEOELogo className="h-96" />
            </div>
            
            <div className="flex flex-col xl:flex-row items-center justify-between gap-24 relative z-10">
              <div className="flex-1 space-y-10 text-center xl:text-left">
                <div className="inline-flex items-center gap-4 text-[#42A4DC] font-black text-xs uppercase tracking-[0.8em]">
                   <Compass className="w-5 h-5" /> CERTIFICADO DE DIAGNÓSTICO ODS
                </div>
                <h2 className="text-8xl font-black tracking-tighter uppercase text-[#202C54] mt-4 leading-[0.8]">{currentResults.companyName}</h2>
                <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                   <div className="px-6 py-3 bg-[#202C54] text-white font-black text-[10px] uppercase tracking-widest">{currentResults.sector}</div>
                   <div className="px-6 py-3 border-2 border-[#202C54] text-[#202C54] font-black text-[10px] uppercase tracking-widest">{currentResults.size}</div>
                </div>
                <p className="text-3xl text-slate-400 italic font-light uppercase tracking-tighter border-l-8 border-[#42A4DC] pl-8 max-w-2xl">
                  Evaluación de alineamiento estratégico con la Agenda Canaria 2030.
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                 <div className="relative flex items-center justify-center">
                    <svg className="w-80 h-80 transform -rotate-90">
                       <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-50" />
                       <motion.circle 
                        cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="20" fill="transparent" 
                        strokeDasharray={880}
                        initial={{ strokeDashoffset: 880 }}
                        animate={{ strokeDashoffset: 880 - (880 * (totalScoreValue as number)) / 100 }}
                        transition={{ duration: 2 }}
                        className="text-[#42A4DC]" 
                       />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-9xl font-black text-[#202C54] tracking-tighter">{Math.round(totalScoreValue)}%</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#42A4DC]">MADUREZ ODS</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-16 shadow-2xl border-t-[16px] border-[#202C54]">
               <div className="flex justify-between items-center mb-16">
                  <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter flex items-center gap-6">
                     <BarChart3 className="w-10 h-10 text-[#42A4DC]" /> Pilar de Gestión
                  </h3>
                  <div className="flex gap-4 text-[10px] font-black uppercase">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#42A4DC]" /> Tu Empresa</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200" /> Promedio Sector</div>
                  </div>
               </div>
               <div className="h-[500px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                     <PolarGrid stroke="#eee" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#202C54', fontSize: 13, fontWeight: 900 }} />
                     <Radar name="Empresa" dataKey="A" stroke="#42A4DC" strokeWidth={5} fill="#42A4DC" fillOpacity={0.15} />
                     <Radar name="Sector" dataKey="B" stroke="#cbd5e1" strokeWidth={2} fill="#f1f5f9" fillOpacity={0.4} />
                     <Tooltip />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-16 shadow-2xl border-t-[16px] border-[#42A4DC]">
               <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter mb-16 flex items-center gap-6">
                  <Target className="w-10 h-10 text-[#42A4DC]" /> Matriz de Impacto 2030
               </h3>
               <div className="h-[500px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={odsChartData.slice(0, 8)} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fontWeight: 900, fill: '#202C54' }} width={110} axisLine={false} />
                     <Tooltip />
                     <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                       {odsChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Bar>
                   </ComposedChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="bg-white shadow-5xl border-l-[80px] border-[#202C54]">
             <div className="p-16 md:p-24 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-16">
                   <div className="w-24 h-24 bg-[#202C54] text-white flex items-center justify-center shadow-3xl">
                      <Zap className="w-14 h-14" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-6xl font-black text-[#202C54] tracking-tighter uppercase leading-none">Hoja de Ruta</h3>
                      <p className="text-[#42A4DC] font-black uppercase tracking-[0.5em] text-xs">Análisis Estratégico · Gabinete ODS CEOE Tenerife</p>
                   </div>
                </div>
                <button className="bg-[#42A4DC] text-white px-16 py-8 font-black uppercase tracking-widest text-sm hover:bg-[#202C54] transition-all shadow-3xl">
                   Descargar Informe PDF
                </button>
             </div>
             
             <div className="p-16 md:p-32 bg-slate-50/50">
               {isGeneratingReport ? (
                  <div className="flex flex-col items-center justify-center py-40 space-y-12">
                     <div className="relative">
                        <Loader2 className="w-32 h-32 text-[#42A4DC] animate-spin" />
                        <Compass className="w-12 h-12 text-[#202C54] absolute inset-0 m-auto animate-pulse" />
                     </div>
                     <div className="text-center space-y-4">
                        <p className="text-xl font-black uppercase tracking-[0.8em] text-[#202C54]">Generando Análisis</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sincronizando resultados con la Agenda Canaria 2030...</p>
                     </div>
                  </div>
               ) : (
                 <div className="max-w-5xl mx-auto prose prose-2xl prose-slate text-left">
                   <div className="bg-white p-20 border-2 border-slate-100 shadow-sm leading-relaxed text-[#202C54] newspaper-font first-letter:text-9xl first-letter:font-black first-letter:text-[#42A4DC] first-letter:mr-4 first-letter:float-left first-letter:mt-4">
                      <div dangerouslySetInnerHTML={{ __html: report?.replace(/\n/g, '<br/>') || '' }} />
                   </div>
                 </div>
               )}
             </div>
          </div>
          
          <div className="text-center pt-24 pb-40">
             <button onClick={resetAssessment} className="group relative text-3xl font-black text-[#202C54] uppercase tracking-[0.4em] inline-block">
                Nueva Evaluación
                <div className="h-2 w-full bg-[#42A4DC] mt-4 transform scale-x-50 group-hover:scale-x-100 transition-transform origin-center" />
             </button>
          </div>
        </div>
      </div>
    );
  };

  const OdsDetailView = () => {
    const ods = ODS_LIST.find(o => o.id === selectedOdsId);
    if (!ods) return null;

    return (
      <div className="max-w-7xl mx-auto py-12 px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-5xl border-[1px] border-slate-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[500px] flex items-center justify-center bg-slate-50">
               {!imageErrors[ods.id] ? (
                 <img src={ods.icon} className="w-full h-full object-cover" alt={ods.name} />
               ) : (
                 <div className="text-9xl font-black text-white" style={{ backgroundColor: ods.color }}>{ods.id}</div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-16">
                  <button onClick={() => setStep('landing')} className="absolute top-10 left-10 flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md px-6 py-4">
                     <ArrowLeft className="w-5 h-5" /> Regresar
                  </button>
                  <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-4 text-left">{ods.name}</h2>
                  <p className="text-[#42A4DC] font-black uppercase tracking-[0.5em] text-xs text-left">Objetivo Estratégico {ods.id}</p>
               </div>
            </div>
            
            <div className="lg:w-3/5 p-16 md:p-24 space-y-16">
               <div className="bg-[#202C54]/5 p-12 border-l-[16px] border-[#202C54]">
                  <Quote className="w-16 h-16 text-[#42A4DC]/30 mb-8" />
                  <p className="text-4xl font-medium text-slate-800 italic leading-snug text-left">"{ods.description}"</p>
               </div>

               <div className="grid md:grid-cols-2 gap-20">
                  <div className="space-y-10">
                     <h4 className="text-xl font-black text-[#202C54] uppercase tracking-[0.5em] border-b-4 border-[#42A4DC] pb-4 inline-block">Metas Canarios</h4>
                     <ul className="space-y-8 text-left">
                        {ods.goals?.map((g, i) => (
                           <li key={i} className="flex items-start gap-6 group">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform group-hover:scale-125" style={{ backgroundColor: ods.color }}>
                                 <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-2xl font-bold text-slate-700 leading-tight">{g}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="bg-slate-50 p-12 border border-slate-100 flex flex-col justify-between">
                     <div className="space-y-6">
                        <Compass className="w-12 h-12 text-[#202C54]" />
                        <p className="text-slate-500 font-medium leading-relaxed italic text-left">
                           "Integrar este objetivo en el tejido empresarial de Tenerife garantiza la resiliencia económica frente a los retos climáticos y demográficos de la región."
                        </p>
                     </div>
                     <button onClick={() => setStep('register')} className="mt-12 bg-[#202C54] text-white py-6 font-black uppercase tracking-widest text-xs hover:bg-[#42A4DC] transition-all">
                        Evaluar este ODS
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const ProcessingView = () => (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#202C54] text-white p-12 text-center overflow-hidden">
      <div className="relative mb-24">
         <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-80 h-80 border-[20px] border-white/5 border-t-[#42A4DC] rounded-full"
         />
         <img 
            src="https://corporacion5-my.sharepoint.com/:i:/r/personal/cmardor_corporacion5_com/Documents/C5/ceoe_tenerife_transparente.png?csf=1&web=1&e=qBSGTg" 
            className="absolute inset-0 m-auto h-24 object-contain brightness-200" 
            alt="CEOE Tenerife" 
         />
      </div>
      <h2 className="text-8xl font-black tracking-tighter uppercase mb-12">Sintetizando<br/><span className="text-[#42A4DC]">Estrategia</span></h2>
      <div className="space-y-6 opacity-30">
         <p className="text-xs font-black uppercase tracking-[1em]">Generando Recomendaciones CEOE...</p>
         <p className="text-xs font-black uppercase tracking-[1em]">Sincronizando con Metas del Gobierno de Canarias...</p>
      </div>
    </div>
  );

  return (
    <Layout onGoHome={resetAssessment}>
      <AnimatePresence mode="wait">
        {step === 'landing' && <LandingView key="l" />}
        {step === 'register' && <RegisterView key="r" />}
        {step === 'assessment' && <AssessmentView key="a" />}
        {step === 'processing' && <ProcessingView key="p" />}
        {step === 'results' && <ResultsView key="rs" />}
        {step === 'ods-detail' && <OdsDetailView key="od" />}
        {step === 'methodology' && <MethodologyView key="m" />}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
