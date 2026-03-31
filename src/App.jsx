import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Archive, Settings, ChevronLeft, ChevronRight, Plus, X, Check, Clock, AlignLeft, Trash2, RotateCcw, Bell, Trophy } from 'lucide-react';
import './App.css';

const TEAMS = {
  "Serie A": [
    { name: "Atalanta", primary: "#1E40AF", secondary: "#000000" },
    { name: "Bologna", primary: "#991B1B", secondary: "#1E3A8A" },
    { name: "Cagliari", primary: "#111827", secondary: "#991B1B" },
    { name: "Como", primary: "#2563EB", secondary: "#FFFFFF" },
    { name: "Empoli", primary: "#1D4ED8", secondary: "#FFFFFF" },
    { name: "Fiorentina", primary: "#5B21B6", secondary: "#FFFFFF" },
    { name: "Genoa", primary: "#7F1D1D", secondary: "#1E3A8A" },
    { name: "Inter", primary: "#000000", secondary: "#2563EB" },
    { name: "Juventus", primary: "#000000", secondary: "#FFFFFF" },
    { name: "Lazio", primary: "#87CEEB", secondary: "#FFFFFF" },
    { name: "Lecce", primary: "#EAB308", secondary: "#DC2626" },
    { name: "Milan", primary: "#DC2626", secondary: "#000000" },
    { name: "Monza", primary: "#DC2626", secondary: "#FFFFFF" },
    { name: "Napoli", primary: "#0EA5E9", secondary: "#FFFFFF" },
    { name: "Parma", primary: "#FDE047", secondary: "#1E3A8A" },
    { name: "Roma", primary: "#7F1D1D", secondary: "#FBBF24" },
    { name: "Torino", primary: "#7F1D1D", secondary: "#FFFFFF" },
    { name: "Udinese", primary: "#000000", secondary: "#FFFFFF" },
    { name: "Venezia", primary: "#065F46", secondary: "#D97706" },
    { name: "Verona", primary: "#1E3A8A", secondary: "#FDE047" }
  ],
  "Serie B": [
    { name: "Bari", primary: "#DC2626", secondary: "#FFFFFF" },
    { name: "Brescia", primary: "#1E3A8A", secondary: "#FFFFFF" },
    { name: "Catanzaro", primary: "#DC2626", secondary: "#EAB308" },
    { name: "Palermo", primary: "#F472B6", secondary: "#000000" },
    { name: "Sampdoria", primary: "#2563EB", secondary: "#FFFFFF" },
    { name: "Sassuolo", primary: "#059669", secondary: "#000000" },
    { name: "Spezia", primary: "#000000", secondary: "#FFFFFF" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('settimana');
  const [isAlertActive, setIsAlertActive] = useState(false);
  
  const [selectedTeam, setSelectedTeam] = useState(() => {
    const saved = localStorage.getItem('tifoTeam');
    return saved ? JSON.parse(saved) : TEAMS["Serie A"].find(t => t.name === "Roma");
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('tifoAppointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ title: '', day: 'MARTEDÌ 31 marzo', time: '15:00' });

  // CONTROLLO SCADENZA (FIXED)
  useEffect(() => {
    const checkStatus = () => {
      const ora = new Date();
      const oraStringa = ora.getHours().toString().padStart(2, '0') + ":" + ora.getMinutes().toString().padStart(2, '0');
      
      // Controlla se esiste almeno un appuntamento non archiviato scaduto
      const scaduto = appointments.some(a => !a.archived && a.time < oraStringa);
      setIsAlertActive(scaduto);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Controlla ogni 10 secondi
    return () => clearInterval(interval);
  }, [appointments]);

  useEffect(() => {
    document.documentElement.style.setProperty('--team-primary', selectedTeam.primary);
    localStorage.setItem('tifoTeam', JSON.stringify(selectedTeam));
  }, [selectedTeam]);

  useEffect(() => {
    localStorage.setItem('tifoAppointments', JSON.stringify(appointments));
  }, [appointments]);

  const days = ["LUNEDÌ 30 marzo", "MARTEDÌ 31 marzo", "MERCOLEDÌ 1 aprile", "GIOVEDÌ 2 aprile", "VENERDÌ 3 aprile", "SABATO 4 aprile", "DOMENICA 5 aprile"];

  const handleSave = () => {
    if (newAppt.title.trim() === "") return;
    setAppointments([...appointments, { ...newAppt, id: Date.now(), archived: false }]);
    setNewAppt({ title: '', day: 'MARTEDÌ 31 marzo', time: '15:00' });
    setIsModalOpen(false);
  };

  const archiveAppt = (id) => setAppointments(appointments.map(a => a.id === id ? { ...a, archived: true } : a));
  const restoreAppt = (id) => setAppointments(appointments.map(a => a.id === id ? { ...a, archived: false } : a));
  const deletePermanent = (id) => setAppointments(appointments.filter(a => a.id !== id));
  const clearArchive = () => { if(window.confirm("Svuotare l'archivio?")) setAppointments(appointments.filter(a => !a.archived)); };

  return (
    <div className="app-container">
      <header className="header-main">
        <div className="brand-section">
          <div className="logo-container-wrapper"><img src="/logo.jpg" alt="Logo" className="header-logo-img" /></div>
          <div className="brand-text"><h1>I MIEI APPUNTAMENTI</h1><p>{selectedTeam.name.toUpperCase()}</p></div>
        </div>
        {/* Campanella con classe condizionale */}
        <Bell 
          size={24} 
          color={isAlertActive ? "#ff0000" : "#cccccc"} 
          className={isAlertActive ? "bell-shake alert-red" : ""} 
        />
      </header>

      <nav className="nav-tabs">
        {['settimana', 'archivio', 'squadra'].map(tab => (
          <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'settimana' && <Calendar size={16} />}
            {tab === 'archivio' && <Archive size={16} />}
            {tab === 'squadra' && <Settings size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'settimana' && (
          <>
            <div className="hero-banner" style={{ background: `linear-gradient(135deg, ${selectedTeam.primary}, ${selectedTeam.secondary || '#444'})` }}>
              <h4>LA TUA SQUADRA DEL CUORE</h4>
              <h2>{selectedTeam.name.toUpperCase()}</h2>
            </div>
            <div className="week-nav">
              <span>Settimana</span>
              <div className="week-controls"><ChevronLeft size={20} color="#ccc" /><p>30 mar — 5 apr 2026</p><ChevronRight size={20} color="#ccc" /></div>
            </div>
            <div className="days-list">
              {appointments.filter(a => !a.archived).length === 0 ? <p className="empty-msg">Nessun impegno attivo</p> :
                days.map(d => {
                  const list = appointments.filter(a => a.day === d && !a.archived);
                  return list.length > 0 && (
                    <div key={d} className="day-row active">
                      <div className="day-label">{d}</div>
                      <div className="day-content">
                        {list.map(a => (
                          <div key={a.id} className="appt-item-container">
                             <div className="appt-item">{a.time} - {a.title}</div>
                             <button className="archive-btn-small" onClick={() => archiveAppt(a.id)}><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </>
        )}

        {activeTab === 'archivio' && (
          <div className="archive-page-content">
             <div className="archive-header"><h3>Archivio</h3><button className="clear-all-btn" onClick={clearArchive}><Trash2 size={14} /> SVUOTA</button></div>
             <div className="appointments-list-archive">
                {appointments.filter(a => a.archived).length === 0 ? <p className="empty-msg">Archivio vuoto</p> :
                  appointments.filter(a => a.archived).map(a => (
                    <div key={a.id} className="archive-card">
                       <div className="archive-info"><p className="archive-title">{a.title}</p><span>{a.day} • {a.time}</span></div>
                       <div className="archive-actions">
                          <button className="action-btn restore" onClick={() => restoreAppt(a.id)}><RotateCcw size={18} /></button>
                          <button className="action-btn delete" onClick={() => deletePermanent(a.id)}><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))
                }
             </div>
          </div>
        )}

        {activeTab === 'squadra' && (
          <div className="team-selection-page">
            <h3 className="section-title">Squadre Italiane</h3>
            {Object.entries(TEAMS).map(([league, list]) => (
              <div key={league} className="league-group">
                <h4>{league}</h4>
                <div className="team-grid">
                  {list.map(t => (
                    <div key={t.name} className={`team-card ${selectedTeam.name === t.name ? 'selected' : ''}`} onClick={() => { setSelectedTeam(t); setActiveTab('settimana'); }}>
                      <div className="team-color-circle" style={{ background: t.primary }}></div>
                      <span>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="action-sheet">
              <div className="sheet-handle"></div>
              <div className="sheet-header"><h3>Nuovo Impegno</h3><button className="close-sheet" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
              <div className="sheet-body">
                <div className="input-field"><label><AlignLeft size={16} /> Titolo</label><input type="text" placeholder="Cosa devi fare?" value={newAppt.title} onChange={e => setNewAppt({...newAppt, title: e.target.value})} autoFocus /></div>
                <div className="flex-fields">
                  <div className="input-field"><label><Calendar size={16} /> Giorno</label><select value={newAppt.day} onChange={e => setNewAppt({...newAppt, day: e.target.value})}>{days.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div className="input-field"><label><Clock size={16} /> Ora</label><input type="time" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} /></div>
                </div>
                <button className="confirm-btn" onClick={handleSave}>SALVA <Check size={20} /></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <button className="add-button" onClick={() => setIsModalOpen(true)}><Plus size={32} /></button>
    </div>
  );
}
