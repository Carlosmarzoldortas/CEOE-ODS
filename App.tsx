
import React, { useState, useMemo, useEffect } from 'react';
import Layout, { CEOELogo } from './components/Layout';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell, ComposedChart
} from 'recharts';
import { 
  Loader2, Target, BarChart3, ArrowRight, ArrowLeft, CheckCircle2, Quote, Globe2, Compass, Zap, Building2, Users, ShieldCheck, Award, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, ODS_LIST } from './constants';
import { UserInfo, AssessmentResult, BlockType, CompanySize } from './types';
import { generateSdgReport } from './geminiService';

type AppStep = 'landing' | 'register' | 'assessment' | 'results' | 'ods-detail' | 'methodology';

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
    setIsGeneratingReport(false);
  };

  const assessmentResults = useMemo(() => {
    if (step !== 'results') return null;
    const blockScores: Record<string, number> = {};
    const odsAlignment: Record<number, number> = {};
    ODS_LIST.forEach(ods => { odsAlignment[ods.id] = 0; });

    (Object.values(BlockType) as string[]).forEach(block => {
      const blockQuestions = QUESTIONS.filter(q => q.block === (block as BlockType));
      const totalPossible = blockQuestions.length * 4;
      let actualScore: number = 0;
      blockQuestions.forEach(q => {
        const val = answers[q.id] || 0;
        actualScore += val;
        q.odsImpact.forEach(odsId => { 
          odsAlignment[odsId] = (odsAlignment[odsId] || 0) + val; 
        });
      });
      blockScores[block as BlockType] = totalPossible > 0 ? (actualScore / totalPossible) * 100 : 0;
    });

    const totalPossibleAll = QUESTIONS.length * 4;
    const actualScoreAll = Object.values(answers).reduce((acc, val) => acc + val, 0);
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
    if (step === 'results' && assessmentResults && !report && !isGeneratingReport) {
      const runGeneration = async () => {
        setIsGeneratingReport(true);
        try {
          const reportText = await generateSdgReport(assessmentResults);
          setReport(reportText);
        } catch (error) {
          console.error("Critical Error:", error);
          setReport("Error al generar el informe.");
        } finally {
          setIsGeneratingReport(false);
        }
      };
      runGeneration();
    }
  }, [step, assessmentResults, report, isGeneratingReport]);

  const LandingView = () => (
    <div className="max-w-7xl mx-auto py-12 md:py-24 px-8">
      <div className="flex flex-col items-center text-center mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 max-w-5xl"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#42A4DC]/10 text-[#42A4DC] rounded-full text-xs font-black uppercase tracking-widest mx-auto">
              <Zap className="w-4 h-4" /> Gabinete de Sostenibilidad CEOE Tenerife
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-[#202C54] leading-[0.75] newspaper-font">
              Liderazgo <br/><span className="text-[#42A4DC]">Empresarial</span><br/>Sostenible
            </h1>
            <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed italic mx-auto mt-8">
              "Herramienta avanzada de autodiagnóstico para alinear la competitividad de las empresas canarias con la Agenda Canaria 2030."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
             <button 
               onClick={() => setStep('register')}
               className="bg-[#202C54] text-white px-12 py-8 font-black uppercase tracking-[0.4em] text-sm hover:bg-[#42A4DC] transition-all shadow-2xl flex items-center justify-center gap-6 group"
             >
               INICIAR EVALUACIÓN <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
             </button>
             <button 
               onClick={() => setStep('methodology')}
               className="border-4 border-[#202C54] text-[#202C54] px-12 py-8 font-black uppercase tracking-[0.4em] text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
             >
               VER METODOLOGÍA
             </button>
          </div>
        </motion.div>
      </div>

      <div className="space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-8 border-[#202C54] pb-12">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 text-[#42A4DC]">
               <Globe2 className="w-10 h-10" />
               <span className="text-[12px] font-black uppercase tracking-[0.8em]">Explorador Agenda 2030</span>
            </div>
            <h3 className="text-5xl font-black text-[#202C54] uppercase tracking-tighter">Impacto por Objetivos</h3>
          </div>
          <p className="text-slate-400 font-bold max-w-md text-right uppercase tracking-widest text-[10px]">
            Seleccione un ODS para analizar su relevancia en el tejido empresarial de Canarias.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ODS_LIST.map((ods) => (
            <motion.button
              key={ods.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedOdsId(ods.id); setStep('ods-detail'); }}
              className="aspect-square relative group overflow-hidden shadow-lg flex items-center justify-center bg-white border-2 border-slate-100"
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
                  <span className="text-5xl block opacity-30">{ods.id}</span>
                  <span className="text-[9px] uppercase tracking-tighter">{ods.name}</span>
                </div>
              )}
            </motion.button>
          ))}
          <div className="aspect-square bg-slate-50 flex flex-col items-center justify-center p-8 text-center border-4 border-dashed border-slate-200">
             <CEOELogo className="h-12 opacity-30 mb-4" />
             <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Gabinete ODS</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MethodologyView = () => (
    <div className="bg-white py-16 md:py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start">
          <div className="w-full md:w-[45%] lg:w-[40%] space-y-8 sticky md:top-12 text-left pr-0 md:pr-12">
             <div className="w-24 h-3 bg-[#42A4DC] mb-8" />
             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#202C54] uppercase tracking-tighter leading-[1.05] newspaper-font whitespace-normal overflow-visible hyphens-none">
               Marco Técnico<br/>Metodológico
             </h2>
             <p className="text-lg lg:text-xl text-slate-500 font-medium italic leading-relaxed">
               "Diseñado para medir la madurez ESG bajo los estándares de la Agenda Canaria 2030."
             </p>
             <button 
               onClick={() => setStep('register')}
               className="bg-[#202C54] text-white px-10 py-5 font-black uppercase tracking-widest text-xs hover:bg-[#42A4DC] transition-all flex items-center gap-4"
             >
               EMPEZAR AHORA <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          
          <div className="w-full md:w-[55%] lg:w-[60%] space-y-16 lg:space-y-20 text-left pt-12 md:pt-0">
            <section className="space-y-8">
               <div className="flex items-center gap-4 text-[#42A4DC]">
                  <ShieldCheck className="w-10 h-10" />
                  <h4 className="text-xs font-black uppercase tracking-[0.5em]">Fundamentos del Sistema</h4>
               </div>
               <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed font-serif">
                 El Gabinete ODS de CEOE Tenerife ha desarrollado este algoritmo basándose en la <strong className="font-black text-[#202C54]">Matriz de Interdependencias de Canarias</strong>, que vincula 18 indicadores clave con los 17 ODS.
               </p>
            </section>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {[
                { title: "Gobernanza", icon: <ShieldCheck />, desc: "Compromiso de la dirección y ética en la toma de decisiones." },
                { title: "Personas", icon: <Users />, desc: "Igualdad, conciliación y fomento del empleo de calidad local." },
                { title: "Planeta", icon: <Globe2 />, desc: "Eficiencia energética, hídrica y circularidad insular." },
                { title: "Comunidad", icon: <Award />, desc: "Impacto social directo en el bienestar de Tenerife." },
              ].map((item, i) => (
                <div key={i} className="p-8 lg:p-10 border-2 border-slate-50 bg-slate-50/50 group hover:border-[#42A4DC] transition-all">
                  <div className="text-[#202C54] group-hover:text-[#42A4DC] mb-6 transition-colors">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-12 h-12" })}
                  </div>
                  <h5 className="text-xl font-black text-[#202C54] uppercase tracking-widest mb-4">{item.title}</h5>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
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
        className="max-w-4xl w-full bg-white shadow-5xl border-t-[24px] border-[#202C54] p-16 md:p-24 relative overflow-hidden text-left"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Building2 className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-6xl font-black text-[#202C54] uppercase tracking-tighter leading-none">IDENTIFICACIÓN</h3>
            <p className="text-[#42A4DC] font-black uppercase tracking-[0.5em] text-xs">Alineamiento Estratégico CEOE Tenerife</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep('assessment'); }} className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Nombre de la Empresa</label>
              <input required type="text" className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#42A4DC] focus:bg-white p-6 outline-none font-bold text-xl transition-all" placeholder="Ej: Tenerife Sostenible S.A." value={userInfo.companyName} onChange={e => setUserInfo(p => ({...p, companyName: e.target.value}))} />
            </div>
            
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Sector Económico</label>
              <select required className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#42A4DC] focus:bg-white p-6 outline-none font-bold text-xl appearance-none cursor-pointer" value={userInfo.sector} onChange={e => setUserInfo(p => ({...p, sector: e.target.value}))}>
                <option value="">Seleccione Sector...</option>
                <option value="Turismo">Turismo y Hostelería</option>
                <option value="Servicios">Servicios Profesionales</option>
                <option value="Construcción">Construcción e Industrial</option>
                <option value="Comercio">Retail y Comercio</option>
                <option value="Logística">Transporte y Logística</option>
                <option value="Primario">Sector Primario / Agro</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block ml-2">Dimensión de Plantilla</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(CompanySize).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setUserInfo(p => ({...p, size}))}
                    className={`flex items-center gap-4 p-4 border-2 transition-all text-left ${userInfo.size === size ? 'border-[#42A4DC] bg-[#42A4DC]/5 text-[#202C54]' : 'border-slate-100 hover:border-slate-300 text-slate-400'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userInfo.size === size ? 'border-[#42A4DC]' : 'border-slate-200'}`}>
                      {userInfo.size === size && <div className="w-2.5 h-2.5 bg-[#42A4DC] rounded-full" />}
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">{size}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-end">
               <div className="bg-[#202C54]/5 p-8 border-l-8 border-[#202C54]">
                 <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                   "Los datos proporcionados son confidenciales y se utilizarán exclusivamente para generar su hoja de ruta personalizada."
                 </p>
               </div>
               <button type="submit" className="w-full bg-[#202C54] text-white py-8 font-black uppercase tracking-[0.5em] text-sm hover:bg-[#42A4DC] transition-all shadow-2xl flex items-center justify-center gap-4">
                EMPEZAR CUESTIONARIO <ArrowRight className="w-6 h-6" />
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
          <div className="bg-white p-6 shadow-xl flex items-center justify-between border-b-4 border-[#202C54]">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-[#202C54] flex items-center justify-center text-white text-4xl font-black">
                   {currentQuestionIndex + 1}
                </div>
                <div className="text-left">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 mb-1">Módulo Estratégico</h4>
                   <p className="font-black text-[#202C54] uppercase tracking-tighter text-2xl">{q.block}</p>
                </div>
             </div>
             <div className="hidden md:flex flex-col items-end gap-3 pr-4">
                <span className="text-5xl font-black text-[#42A4DC]">{Math.round(progress)}%</span>
                <div className="w-56 h-3 bg-slate-100 overflow-hidden">
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
            className="bg-white p-16 md:p-32 shadow-5xl relative text-left"
          >
            <div className="absolute top-10 left-10 text-[200px] font-black text-slate-50/50 leading-none select-none -z-10">
               {q.id}
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
                      setStep('results');
                    }
                  }}
                  className="group flex flex-col p-8 border-4 border-slate-50 hover:border-[#42A4DC] hover:bg-slate-50 transition-all text-left space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-[#42A4DC] text-slate-400 group-hover:text-white flex items-center justify-center text-lg font-black transition-colors">
                      {opt.value}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-slate-700 group-hover:text-[#202C54] uppercase tracking-tighter leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-between items-center px-4">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(c => c - 1)}
              className={`flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] transition-colors ${currentQuestionIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-[#202C54] hover:text-[#42A4DC]'}`}
            >
              <ArrowLeft className="w-5 h-5" /> Anterior
            </button>
            <div className="flex gap-3">
               {QUESTIONS.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-[#202C54] w-6' : 'bg-slate-200'}`} />
               ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const res = assessmentResults;
    if (!res) return null;

    const radarData = Object.entries(res.scores).map(([name, value]) => ({
      subject: name.split(' ')[0],
      Empresa: Math.round(value),
      fullMark: 100,
    }));

    const odsChartData = ODS_LIST.map(ods => ({
      name: `ODS ${ods.id}`,
      impacto: res.odsAlignment[ods.id] || 0,
      color: ods.color,
    })).filter(d => d.impacto > 0).sort((a, b) => b.impacto - a.impacto);

    return (
      <div className="bg-slate-100 py-16 px-4 md:px-8 print:bg-white print:p-0">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header del Certificado */}
          <div className="bg-white border-[24px] border-[#202C54] p-16 md:p-32 shadow-6xl relative overflow-hidden text-left print:border-8 print:shadow-none">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <CEOELogo className="h-[400px]" />
            </div>
            
            <div className="flex flex-col xl:flex-row items-center justify-between gap-16 relative z-10">
              <div className="flex-1 space-y-8 text-center xl:text-left">
                <div className="inline-flex items-center gap-4 text-[#42A4DC] font-black text-xs uppercase tracking-[0.6em]">
                   <Compass className="w-5 h-5" /> CERTIFICADO DE POSICIONAMIENTO ODS
                </div>
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase text-[#202C54] leading-[0.8]">{res.companyName}</h2>
                <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                   <div className="px-6 py-3 bg-[#202C54] text-white font-black text-xs uppercase tracking-widest">{res.sector}</div>
                   <div className="px-6 py-3 border-2 border-[#202C54] text-[#202C54] font-black text-xs uppercase tracking-widest">{res.size}</div>
                </div>
                <p className="text-3xl text-slate-400 italic font-light uppercase tracking-tighter border-l-8 border-[#42A4DC] pl-8 max-w-2xl mt-8">
                  Evaluación de alineamiento con la Agenda Canaria 2030.
                </p>
              </div>

              <div className="relative flex flex-col items-center">
                 <div className="w-80 h-80 rounded-full border-[20px] border-slate-50 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray={880} strokeDashoffset={880 - (880 * res.totalScore) / 100} className="text-[#42A4DC]" />
                    </svg>
                    <div className="text-center">
                       <span className="text-8xl font-black text-[#202C54] tracking-tighter">{Math.round(res.totalScore)}%</span>
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#42A4DC] mt-2">ÍNDICE DE MADUREZ</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Gráficos de Analítica */}
          <div className="grid lg:grid-cols-2 gap-12 text-left print:grid-cols-2">
            <div className="bg-white p-12 md:p-16 shadow-3xl border-t-[12px] border-[#202C54]">
               <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter mb-12 flex items-center gap-6">
                  <BarChart3 className="w-10 h-10 text-[#42A4DC]" /> Radar de Desempeño
               </h3>
               <div className="h-[450px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                     <PolarGrid stroke="#e2e8f0" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#202C54', fontSize: 14, fontWeight: 900 }} />
                     <Radar name="Empresa" dataKey="Empresa" stroke="#42A4DC" strokeWidth={5} fill="#42A4DC" fillOpacity={0.15} />
                     <Tooltip />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-12 md:p-16 shadow-3xl border-t-[12px] border-[#42A4DC]">
               <h3 className="text-3xl font-black text-[#202C54] uppercase tracking-tighter mb-12 flex items-center gap-6">
                  <Target className="w-10 h-10 text-[#42A4DC]" /> Matriz de Impacto 2030
               </h3>
               <div className="h-[450px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={odsChartData.slice(0, 8)} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fontWeight: 900, fill: '#202C54' }} width={90} axisLine={false} />
                     <Tooltip />
                     <Bar dataKey="impacto" radius={[0, 10, 10, 0]} barSize={35}>
                       {odsChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                     </Bar>
                   </ComposedChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Informe de IA - Hoja de Ruta */}
          <div className="bg-white shadow-6xl border-l-[60px] border-[#202C54] text-left print:border-0">
             <div className="p-12 md:p-20 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-12">
                   <div className="w-20 h-20 bg-[#202C54] text-white flex items-center justify-center">
                      <Zap className="w-12 h-12" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-5xl font-black text-[#202C54] tracking-tighter uppercase leading-none">Hoja de Ruta Estratégica</h3>
                      <p className="text-[#42A4DC] font-black uppercase tracking-[0.4em] text-[10px]">Análisis del Gabinete de Sostenibilidad</p>
                   </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-[#42A4DC] text-white px-10 py-6 font-black uppercase tracking-widest text-xs hover:bg-[#202C54] transition-all flex items-center gap-4 print:hidden"
                >
                   <Printer className="w-5 h-5" /> Imprimir Diagnóstico
                </button>
             </div>
             
             <div className="p-12 md:p-24 bg-slate-50/50 min-h-[500px]">
               {isGeneratingReport ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-10">
                     <div className="relative">
                        <Loader2 className="w-24 h-24 text-[#42A4DC] animate-spin" />
                        <div className="absolute inset-0 m-auto w-10 h-10 bg-[#202C54] rounded-full" />
                     </div>
                     <div className="text-center space-y-2">
                        <p className="text-lg font-black uppercase tracking-[0.6em] text-[#202C54]">Sintetizando Hoja de Ruta</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Análisis por Gemini 3 Pro</p>
                     </div>
                  </div>
               ) : (
                 <div className="max-w-4xl mx-auto">
                   <div className="bg-white p-12 md:p-20 border border-slate-200 shadow-sm leading-relaxed text-[#202C54] newspaper-font first-letter:text-8xl first-letter:font-black first-letter:text-[#42A4DC] first-letter:mr-4 first-letter:float-left first-letter:mt-4">
                      {report ? (
                        <div className="prose prose-slate prose-lg" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
                      ) : (
                        <p className="italic text-slate-400">Análisis técnico en proceso de validación.</p>
                      )}
                   </div>
                 </div>
               )}
             </div>
          </div>
          
          <div className="text-center pt-16 pb-32 print:hidden">
             <button onClick={resetAssessment} className="group relative text-2xl font-black text-[#202C54] uppercase tracking-[0.4em] inline-block">
                Nueva Evaluación
                <div className="h-1.5 w-full bg-[#42A4DC] mt-4 transform scale-x-50 group-hover:scale-x-100 transition-transform origin-center" />
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-5xl overflow-hidden text-left border border-slate-100">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative min-h-[500px] flex items-center justify-center bg-slate-50">
               {!imageErrors[ods.id] ? (
                 <img src={ods.icon} className="w-full h-full object-cover" alt={ods.name} />
               ) : (
                 <div className="text-9xl font-black text-white p-20" style={{ backgroundColor: ods.color }}>{ods.id}</div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#202C54] via-transparent to-transparent p-16 flex flex-col justify-end">
                  <button onClick={() => setStep('landing')} className="absolute top-10 left-10 flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-4">
                     <ArrowLeft className="w-4 h-4" /> Volver
                  </button>
                  <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">{ods.name}</h2>
                  <p className="text-[#42A4DC] font-black uppercase tracking-[0.4em] text-[10px]">Objetivo Global {ods.id}</p>
               </div>
            </div>
            
            <div className="lg:w-3/5 p-12 md:p-24 space-y-16">
               <div className="bg-[#202C54]/5 p-12 border-l-[20px] border-[#202C54]">
                  <Quote className="w-12 h-12 text-[#42A4DC]/30 mb-8" />
                  <p className="text-3xl font-medium text-slate-800 italic leading-snug">"{ods.description}"</p>
               </div>

               <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <h4 className="text-lg font-black text-[#202C54] uppercase tracking-widest border-b-4 border-[#42A4DC] pb-4 inline-block">Metas en Canarias</h4>
                     <ul className="space-y-6">
                        {ods.goals?.map((g, i) => (
                           <li key={i} className="flex items-start gap-4">
                              <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" style={{ color: ods.color }} />
                              <span className="text-xl font-bold text-slate-700 leading-tight">{g}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="bg-slate-50 p-10 flex flex-col justify-between border border-slate-100">
                     <p className="text-slate-500 font-medium leading-relaxed italic">
                        "La integración de este objetivo permite a las empresas de Tenerife liderar la transición justa en el archipiélago."
                     </p>
                     <button onClick={() => setStep('register')} className="mt-12 bg-[#202C54] text-white py-6 font-black uppercase tracking-widest text-[10px] hover:bg-[#42A4DC] transition-all">
                        Evaluar Diagnóstico
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <Layout onGoHome={resetAssessment}>
      <AnimatePresence mode="wait">
        {step === 'landing' && <LandingView key="l" />}
        {step === 'register' && <RegisterView key="r" />}
        {step === 'assessment' && <AssessmentView key="a" />}
        {step === 'results' && <ResultsView key="rs" />}
        {step === 'ods-detail' && <OdsDetailView key="od" />}
        {step === 'methodology' && <MethodologyView key="m" />}
      </AnimatePresence>
    </Layout>
  );
};

export default App;
