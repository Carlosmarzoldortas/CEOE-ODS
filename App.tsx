
import React, { useState, useMemo, useEffect } from 'react';
import Layout, { CEOELogo, Corp5Logo } from './components/Layout';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell
} from 'recharts';
import { 
  Loader2, Sparkles, Target, BarChart3, ArrowRight, CheckCircle2, FileText, Quote, MapPin, Globe2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, ODS_LIST } from './constants';
import { UserInfo, AssessmentResult, BlockType } from './types';
import { generateSdgReport } from './geminiService';

type AppStep = 'landing' | 'register' | 'assessment' | 'processing' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo>({ companyName: '', sector: '', email: '' });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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
        const val: number = Number(answers[q.id] || 0);
        actualScore += val;
        q.odsImpact.forEach(odsId => { 
          const currentVal: number = Number(odsAlignment[odsId] || 0);
          odsAlignment[odsId] = currentVal + val; 
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
      const timer = setTimeout(runGeneration, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, assessmentResults]);

  // VISTA DE PORTADA CON IMAGEN DE TENERIFE ACTUALIZADA Y TAMAÑO AJUSTADO
  const LandingView = () => (
    <div className="max-w-7xl mx-auto py-12 md:py-20 px-8 min-h-[85vh] flex flex-col items-center">
      {/* Sección Principal con Grid */}
      <div className="w-full grid lg:grid-cols-12 items-center gap-12 mb-32">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-12 z-10"
        >
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight text-[#202C54] leading-[0.9] newspaper-font">
              DIAGNÓSTICO<br/>DE<br/>CONTRIBUCIÓN<br/>A LOS ODS
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light uppercase tracking-tighter text-[#202C54] newspaper-font opacity-70">
              MEDIANTE<br/>
              AUTOEVALUACIÓN<br/>
              EMPRESARIAL
            </h2>
          </div>

          <div className="pt-6">
             <button 
               onClick={() => setStep('register')}
               className="bg-[#202C54] text-white px-12 py-5 font-black uppercase tracking-[0.25em] text-sm hover:bg-[#42A4DC] transition-all shadow-2xl flex items-center justify-center gap-4 group"
             >
               COMENZAR TEST <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </motion.div>

        {/* Rueda ODS con Tenerife ajustada al centro */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 flex justify-end relative w-full h-full min-h-[450px]"
        >
          <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center lg:translate-x-24">
             {/* Rueda ODS - Con efecto de giro continuo */}
             <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                <img 
                  src="https://corporacion5-my.sharepoint.com/:i:/r/personal/cmardor_corporacion5_com/Documents/C5/Observatorio%20para%20el%20Comercio%20Canarias/objetivos-desarrollo-sostenible-circulo-3330086937.jpg?csf=1&web=1&e=Xqb718" 
                  className="w-full h-full object-contain ods-wheel-spin"
                  alt="Rueda ODS"
                  onError={(e) => {
                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/SDG_Wheel_Transparent.svg/1024px-SDG_Wheel_Transparent.svg.png";
                  }}
                />
             </div>
             
             {/* Mapa de Tenerife Central - ACTUALIZADO CON NUEVA IMAGEN Y TAMAÑO LIGERAMENTE MAYOR */}
             <div className="absolute inset-0 flex items-center justify-center p-24 md:p-36">
                <img 
                  src="https://corporacion5-my.sharepoint.com/:i:/r/personal/cmardor_corporacion5_com/Documents/C5/tenerife_ods_text_transparente.png?csf=1&web=1&e=gkW3O4" 
                  className="w-full max-w-[82%] h-auto drop-shadow-3xl z-20 contrast-125 brightness-110 pointer-events-none"
                  alt="Isla de Tenerife"
                  onError={(e) => {
                    e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Tenerife_map_shaded_relief.png/800px-Tenerife_map_shaded_relief.png";
                  }}
                />
             </div>

             {/* Caja de Texto ODS Flotante */}
             <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-slate-100 shadow-2xl z-30 rounded-sm hidden md:block">
                <h5 className="text-[10px] font-black uppercase text-[#202C54] tracking-[0.2em] leading-tight">
                  OBJETIVOS<br/>DE DESARROLLO<br/><span className="text-[#42A4DC]">SOSTENIBLE</span>
                </h5>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Logos Inferiores con Enlaces a webs oficiales */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 opacity-90"
      >
         <div className="flex items-center justify-center">
            <a href="https://corporacion5.es/" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
              <Corp5Logo className="h-24" style={{ height: '80px', width: 'auto' }} />
            </a>
         </div>
         <div className="hidden md:block w-px h-20 bg-slate-200"></div>
         <div className="flex items-center justify-center">
            <a href="https://ceoe-tenerife.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
              <CEOELogo className="h-24" style={{ transform: 'scale(1.1)', height: '80px' }} />
            </a>
         </div>
      </motion.div>
    </div>
  );

  const RegisterView = () => (
    <div className="bg-slate-50 min-h-[60vh] flex items-center justify-center py-20 px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white shadow-3xl border-t-[10px] border-[#202C54] p-16">
        <h3 className="text-4xl font-black text-[#202C54] mb-4 text-center uppercase tracking-tighter">REGISTRO DE ENTIDAD</h3>
        <p className="text-slate-400 text-center mb-12 font-medium italic">Acceda al gabinete de diagnóstico personalizado.</p>
        <form onSubmit={(e) => { e.preventDefault(); setStep('assessment'); }} className="space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 block">Razón Social de la Empresa</label>
            <input required type="text" className="w-full border-b-2 border-slate-200 focus:border-[#42A4DC] py-4 outline-none font-bold text-3xl transition-all" value={userInfo.companyName} onChange={e => setUserInfo(p => ({...p, companyName: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 block">Sector Estratégico</label>
            <select required className="w-full border-b-2 border-slate-200 focus:border-[#42A4DC] py-4 outline-none font-bold text-3xl appearance-none bg-transparent cursor-pointer" value={userInfo.sector} onChange={e => setUserInfo(p => ({...p, sector: e.target.value}))}>
              <option value="">Seleccione Sector...</option>
              <option value="Turismo">Turismo y Hostelería</option>
              <option value="Servicios">Servicios Avanzados</option>
              <option value="Construcción">Construcción y Urbanismo</option>
              <option value="Comercio">Comercio y Logística</option>
              <option value="Industria">Industria y Economía Circular</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#202C54] text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-[#42A4DC] transition-all shadow-xl">
            ACCEDER AL AUTOEVALUACIÓN
          </button>
        </form>
      </motion.div>
    </div>
  );

  const AssessmentView = () => {
    const q = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="bg-slate-50 min-h-[80vh] py-20 px-8 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="mb-12 flex justify-between items-end border-b-4 border-[#202C54] pb-6">
            <div className="space-y-2">
              <span className="bg-[#42A4DC] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{q.block}</span>
              <h3 className="text-4xl font-black text-[#202C54] tracking-tighter uppercase">DIAGNÓSTICO PRO</h3>
            </div>
            <div className="text-right">
              <span className="text-6xl font-black text-[#202C54]/10">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="bg-white p-20 shadow-3xl border border-slate-100">
            <h2 className="text-4xl font-black text-[#202C54] mb-20 leading-tight tracking-tight uppercase">
              {q.text}
            </h2>
            
            <div className="grid gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const nextAnswers = { ...answers, [q.id]: opt.value };
                    setAnswers(nextAnswers);
                    if (currentQuestionIndex < QUESTIONS.length - 1) {
                      setCurrentQuestionIndex(prev => prev + 1);
                    } else {
                      setStep('processing');
                    }
                  }}
                  className="group flex items-center justify-between p-8 border-2 border-slate-50 hover:border-[#42A4DC] hover:bg-slate-50 transition-all text-left"
                >
                  <span className="text-xl font-bold text-slate-700 group-hover:text-[#202C54] uppercase tracking-tighter">{opt.label}</span>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-[#42A4DC] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#42A4DC] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">
            MÓDULO DE CONSULTORÍA · {currentQuestionIndex + 1} / {QUESTIONS.length}
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    if (!assessmentResults) return null;

    const radarData = (Object.entries(assessmentResults.scores) as [string, number][]).map(([name, value]) => ({
      subject: name.split(' ')[0],
      A: Math.round(value),
      fullMark: 100,
    }));

    const odsChartData = ODS_LIST.map(ods => ({
      name: `ODS ${ods.id}`,
      value: assessmentResults.odsAlignment[ods.id] || 0,
      color: ods.color,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    return (
      <div className="bg-slate-50 py-20 px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="bg-white border-[16px] border-[#202C54] p-20 shadow-3xl flex flex-col xl:flex-row items-center justify-between gap-16">
            <div className="flex-1 space-y-6 text-center xl:text-left">
              <span className="text-[#42A4DC] font-black text-xs uppercase tracking-[0.6em] block mb-2">INFORME EJECUTIVO DE MADUREZ</span>
              <h2 className="text-8xl font-black tracking-tighter uppercase text-[#202C54] leading-none">{assessmentResults.companyName}</h2>
              <div className="h-2 w-48 bg-[#42A4DC] mx-auto xl:mx-0"></div>
              <p className="text-3xl text-slate-400 italic font-light uppercase tracking-tighter">Resultados Gabinete ODS CEOE Tenerife</p>
            </div>
            <div className="text-center bg-[#202C54] p-16 text-white min-w-[350px]">
              <div className="text-[140px] font-black text-[#42A4DC] leading-none tracking-tighter">
                {Math.round(assessmentResults.totalScore)}%
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.6em] mt-10 opacity-60">ALINEAMIENTO GLOBAL</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-16 shadow-2xl border-t-[8px] border-[#42A4DC]">
              <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter mb-12 flex items-center gap-4">
                <BarChart3 className="text-[#42A4DC] w-8 h-8"/> PERFIL DE CAPACIDADES
              </h3>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#eee" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#202C54', fontSize: 13, fontWeight: 900 }} />
                    <Radar name="Puntaje" dataKey="A" stroke="#42A4DC" strokeWidth={5} fill="#42A4DC" fillOpacity={0.15} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-16 shadow-2xl border-t-[8px] border-[#42A4DC]">
              <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter mb-12 flex items-center gap-4">
                <Target className="text-[#42A4DC] w-8 h-8"/> MATRIZ DE IMPACTO ODS
              </h3>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={odsChartData.slice(0, 6)} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fontWeight: 900, fill: '#202C54' }} width={90} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                      {odsChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white border-l-[40px] border-[#202C54] shadow-3xl overflow-hidden">
            <div className="p-16 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-12">
                <div className="bg-[#202C54] p-12 text-white shadow-3xl">
                  <FileText className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-6xl font-black text-[#202C54] tracking-tighter uppercase">HOJA DE RUTA</h3>
                  <p className="text-[#42A4DC] font-black uppercase tracking-[0.5em] text-xs mt-4">DIAGNÓSTICO PERSONALIZADO POR IA · CEOE TENERIFE</p>
                </div>
              </div>
              <button className="bg-[#42A4DC] text-white px-14 py-6 font-black uppercase tracking-widest text-sm hover:bg-[#202C54] transition-all shadow-xl">
                DESCARGAR INFORME TÉCNICO
              </button>
            </div>
            
            <div className="p-16 bg-slate-50">
              {isGeneratingReport ? (
                 <div className="flex flex-col items-center justify-center py-24 gap-10">
                   <Loader2 className="w-24 h-24 text-[#42A4DC] animate-spin" />
                   <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-400">Analizando discrepancias estratégicas...</p>
                 </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="bg-white p-20 border border-slate-200 shadow-sm leading-relaxed text-[#202C54] text-3xl font-medium first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:mt-3 first-letter:text-[#42A4DC]">
                    {report}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center pt-10 pb-24">
             <button onClick={() => window.location.reload()} className="border-b-[6px] border-[#42A4DC] text-[#202C54] font-black uppercase tracking-[0.4em] text-lg py-3 hover:text-[#42A4DC] transition-all">
               INICIAR NUEVA EVALUACIÓN
             </button>
          </div>
        </div>
      </div>
    );
  };

  const ProcessingView = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#202C54] text-white p-12 text-center">
      <Loader2 className="w-32 h-32 text-[#42A4DC] animate-spin mb-16" />
      <h2 className="text-7xl font-black tracking-tighter uppercase mb-10">ANALIZANDO<br/>DATOS</h2>
      <div className="flex flex-col gap-6 opacity-30">
        <p className="text-xs font-black uppercase tracking-[0.6em]">SINCRONIZANDO CON AGENDA CANARIA 2030...</p>
        <p className="text-xs font-black uppercase tracking-[0.6em]">PONDERANDO IMPACTO TERRITORIAL...</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {step === 'landing' && <LandingView key="l" />}
        {step === 'register' && <RegisterView key="r" />}
        {step === 'assessment' && <AssessmentView key="a" />}
        {step === 'processing' && <ProcessingView key="p" />}
        {step === 'results' && <ResultsView key="rs" />}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
