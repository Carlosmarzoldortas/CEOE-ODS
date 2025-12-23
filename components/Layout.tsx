
import React from 'react';

// Logotipo de CEOE Tenerife (Versión Vectorial optimizada)
export const CEOELogo = ({ className = "h-12", style = {} }: { className?: string, style?: React.CSSProperties }) => (
  <div className={`flex flex-col items-start leading-none ${className} select-none shrink-0`} style={style}>
    <span style={{ color: '#202C54', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em', fontFamily: 'Arial, sans-serif' }}>CEOE</span>
    <div className="flex items-center -mt-1">
      <div style={{ backgroundColor: '#42A4DC', width: '16px', height: '10px', marginRight: '4px' }}></div>
      <span style={{ color: '#42A4DC', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>Tenerife</span>
    </div>
  </div>
);

// Logotipo de Corporación 5 (C5)
export const Corp5Logo = ({ className = "h-12", style = {} }: { className?: string, style?: React.CSSProperties }) => (
  <img 
    src="https://corporacion5-my.sharepoint.com/:i:/r/personal/cmardor_corporacion5_com/Documents/C5/c5_positivo.jpg?csf=1&web=1&e=bJMvte" 
    alt="Corporación 5" 
    className={`${className} object-contain shrink-0`}
    style={{ height: 'auto', maxWidth: '280px', ...style }}
    onError={(e) => {
      e.currentTarget.src = "https://www.corporacion5.com/wp-content/uploads/2021/05/logo-corporacion-5.png";
    }}
  />
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Estilo Prensa - CEOE a la izquierda, Título centrado, C5 eliminado */}
      <header className="pt-6 pb-4 px-8 border-b-[6px] border-[#202C54]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="newspaper-rule flex justify-between items-center text-[13px] font-black uppercase tracking-[0.4em] text-slate-500">
            <span>Santa Cruz de Tenerife</span>
            <span className="hidden md:block">Evaluación Estratégica Agenda Canaria 2030</span>
            <span>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between py-6">
             {/* CEOE a la izquierda */}
             <div className="hover:opacity-80 transition-opacity flex items-center h-20">
               <CEOELogo className="h-20" />
             </div>
             
             {/* Título centrado con fuente aumentada según petición */}
             <div className="text-center flex-1 px-8">
                <h4 className="text-[18px] font-black text-[#202C54] uppercase tracking-[0.25em] leading-tight">
                  Herramienta Digital de Autodiagnóstico<br/>
                  <span className="text-[#42A4DC] font-bold">Gabinete ODS Empresarial</span>
                </h4>
             </div>
             
             {/* Espaciador para equilibrar la izquierda */}
             <div className="hidden md:block w-40"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Institucional Limpio */}
      <footer className="bg-[#202C54] text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start mb-12">
            <div className="space-y-6">
              {/* Logo CEOE vinculado a su web oficial */}
              <div className="p-0 overflow-hidden flex items-center bg-transparent">
                <a href="https://ceoe-tenerife.com/" target="_blank" rel="noopener noreferrer" className="hover:brightness-150 transition-all">
                  <img 
                    src="https://corporacion5-my.sharepoint.com/:i:/r/personal/cmardor_corporacion5_com/Documents/C5/Captura%20de%20pantalla%202025-12-23%20084300.png?csf=1&web=1&e=Qd8C6u" 
                    alt="CEOE Tenerife Logo" 
                    className="h-24 w-auto object-contain brightness-125 mix-blend-screen"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </a>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium max-w-xs">
                La Confederación Provincial de Empresarios de Santa Cruz de Tenerife lidera la transición hacia un modelo económico sostenible en las Islas Canarias.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-[0.3em] text-[#42A4DC] mb-6">Iniciativa</h5>
              <ul className="text-xs space-y-3 font-bold text-slate-300 uppercase tracking-widest">
                <li>Gabinete de ODS</li>
                <li>Agenda Canaria 2030</li>
                <li>Pacto Mundial</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-end gap-6">
               <div className="text-right">
                 <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.2em]">
                   Excelencia Técnica por Corporación 5
                 </p>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] mt-2">
                   Gabinete de Sostenibilidad
                 </p>
               </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 gap-4">
             <span>© 2024 Confederación Provincial de Empresarios de Santa Cruz de Tenerife.</span>
             <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Aviso Legal</a>
               <a href="#" className="hover:text-white transition-colors">Privacidad</a>
               <a href="#" className="hover:text-white transition-colors">Gabinete ODS</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
