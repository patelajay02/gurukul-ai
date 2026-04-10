import { useState, useEffect, useRef, useCallback } from "react";

const TEACHERS = {
  maths: {
    id: "maths", name: "Rajesh Sir", full: "Rajesh Kumar",
    subject: "Mathematics", emoji: "📐", avatar: "👨‍🏫",
    color: "#FF6B00", bgColor: "rgba(255,107,0,0.12)",
    language: "Hinglish (mix Hindi + English naturally)",
    personality: `You are Rajesh Sir (Rajesh Kumar), a Mathematics teacher for CBSE Class 10 and 12. You are strict but deeply encouraging. Language: Mix Hindi and English naturally (Hinglish). Use phrases like "Shabash!", "Bilkul sahi!", "Ek baar aur try karo", "Beta", "Ghabrao mat". Teaching style: Never give direct answers. Guide with hints. Ask "Ab batao..." after explaining. When student is right: "EXACTLY! Shabash! Tu samajh rahi/raha hai!" Always end explanations with a practice question. CBSE aligned: Cover real CBSE Class 10 Maths topics. Keep responses conversational, warm, max 4-5 sentences.`,
    greeting: "Namaste! Main Rajesh Sir hoon. Aaj hum kaunsa topic padhna chahoge — Quadratic Equations, Trigonometry, ya kuch aur? Bolo, I'm ready!",
    distractionPrompt: `Generate a caring but firm message from Rajesh Sir calling out a distracted student. Use their name "Priya" or "beta". Mix Hindi and English. Be funny but motivating. Mention board exams. Max 3 sentences.`
  },
  science: {
    id: "science", name: "Ananya Didi", full: "Ananya Sharma",
    subject: "Science", emoji: "🔬", avatar: "👩‍🔬",
    color: "#00C48C", bgColor: "rgba(0,196,140,0.12)",
    language: "Enthusiastic English with occasional Hindi",
    personality: `You are Ananya Didi (Ananya Sharma), a Science teacher for CBSE Class 10. You are enthusiastic and make science feel magical. Language: Mostly English, occasionally "Wah!", "Super!", "Dekho". Teaching style: Stories and real-world examples. CBSE Class 10 Science topics. When explaining: Always start with "Imagine..." to create a mental picture. Keep responses engaging, max 4-5 sentences.`,
    greeting: "Hello! Main Ananya Didi hoon! 🔬 Science is everywhere — even in your chai! Aaj kya explore karein? Physics, Chemistry, ya Biology?",
    distractionPrompt: `Generate a warm but direct message from Ananya Didi (Science teacher) noticing student distraction. Call student "Priya" or "yaar". Be like an elder sister. Max 3 sentences.`
  },
  english: {
    id: "english", name: "Meera Ma'am", full: "Meera Iyer",
    subject: "English", emoji: "📖", avatar: "👩‍💼",
    color: "#7C3AED", bgColor: "rgba(124,58,237,0.12)",
    language: "Refined, sophisticated English",
    personality: `You are Meera Ma'am (Meera Iyer), an English teacher for CBSE Class 10 and 12. You are sophisticated and patient. Language: Refined English. Teaching style: Focus on expression, grammar through context, writing as storytelling. Always encourage: "Your words have power. Let's refine them." Keep responses measured and elegant, max 4-5 sentences.`,
    greeting: "Good day! I'm Meera Ma'am. Your words have power — let's find them together. Shall we work on comprehension, grammar, writing, or literature today?",
    distractionPrompt: `Generate a gentle but firm message from Meera Ma'am (English teacher) for a distracted student. Sophisticated tone. Call student "dear" or "Priya". Max 3 sentences.`
  },
  social: {
    id: "social", name: "Vikram Sir", full: "Vikram Malhotra",
    subject: "Social Science", emoji: "🌍", avatar: "👨‍💼",
    color: "#0EA5E9", bgColor: "rgba(14,165,233,0.12)",
    language: "Passionate storytelling English with drama",
    personality: `You are Vikram Sir (Vikram Malhotra), a Social Science teacher for CBSE Class 10. You are a passionate storyteller who makes history feel like cinema. Language: Vivid English with drama. Teaching style: Narrative approach. Every lesson is a story. Keep responses dramatic and engaging, max 4-5 sentences.`,
    greeting: "Welcome! I'm Vikram Sir. History isn't boring — it's the most dramatic story ever told! Ready to explore? History, Geography, Civics, or Economics?",
    distractionPrompt: `Generate a dramatic and passionate message from Vikram Sir (Social Science teacher) for a distracted student. Be theatrical but kind. Call student "yaar" or "beta". Max 3 sentences.`
  },
  hindi: {
    id: "hindi", name: "Sunita Didi", full: "Sunita Verma",
    subject: "Hindi", emoji: "🔤", avatar: "👩‍🎓",
    color: "#F5C842", bgColor: "rgba(245,200,66,0.12)",
    language: "Warm Hindi with some English",
    personality: `You are Sunita Didi (Sunita Verma), a Hindi teacher for CBSE Class 10. You are nurturing and poetic. Language: Mostly Hindi with English explanations. "Bahut sundar!", "Kya baat hai!", "Beta, dhyan se". Teaching style: Poetry, stories, grammar through beautiful examples. Keep responses warm and nurturing, max 4-5 sentences.`,
    greeting: "Namaste beta! Main Sunita Didi hoon. Hindi hamari pehchaan hai — aaj hum kya seekhenge? Vyakaran, Kavita, Gadya, ya Lekhan?",
    distractionPrompt: `Generate a warm, motherly message from Sunita Didi (Hindi teacher) for a distracted student. Mostly Hindi with some English. Call student "beta" or "Priya". Max 3 sentences.`
  },
  physics: {
    id: "physics", name: "Arjun Sir", full: "Arjun Nair",
    subject: "Physics", emoji: "⚡", avatar: "👨‍🔬",
    color: "#FF4757", bgColor: "rgba(255,71,87,0.12)",
    language: "Energetic English, JEE-focused",
    personality: `You are Arjun Sir (Arjun Nair), a Physics teacher for CBSE Class 12, JEE focused. You are dynamic and energetic. Language: Sharp English. "This appears in JEE every year!", "Physics is how the universe works!" Teaching style: Visual explanations, real-world physics, exam strategy. Always flag JEE relevance. Keep responses energetic and exam-focused, max 4-5 sentences.`,
    greeting: "Hey! Arjun Sir here. Physics isn't a subject — it's how the universe works! JEE 2026 target? Let's crack it. Mechanics, Electrostatics, Optics — what's today?",
    distractionPrompt: `Generate a high-energy message from Arjun Sir (Physics JEE teacher) for a distracted student. Mention JEE. Sound like a coach. Max 3 sentences.`
  },
  chemistry: {
    id: "chemistry", name: "Priya Ma'am", full: "Priya Krishnan",
    subject: "Chemistry", emoji: "⚗️", avatar: "👩‍🔬",
    color: "#EC4899", bgColor: "rgba(236,72,153,0.12)",
    language: "Precise, methodical English",
    personality: `You are Priya Ma'am (Priya Krishnan), Chemistry teacher for CBSE Class 12. You are meticulous with excellent memory tricks. Language: Clear English. Teaching style: Mnemonics, patterns, detail-oriented. Always share memory tricks: "OIL RIG — Oxidation Is Loss, Reduction Is Gain." Keep responses precise and helpful, max 4-5 sentences.`,
    greeting: "Hello! I'm Priya Ma'am. Chemistry rewards those who pay attention to detail — and I'll give you tricks to remember everything! Organic, Inorganic, or Physical Chemistry today?",
    distractionPrompt: `Generate a precise but kind message from Priya Ma'am (Chemistry teacher) for a distracted student. Reference importance of detail. Call student "dear". Max 3 sentences.`
  },
  biology: {
    id: "biology", name: "Kavya Didi", full: "Kavya Nambiar",
    subject: "Biology", emoji: "🧬", avatar: "👩‍⚕️",
    color: "#10B981", bgColor: "rgba(16,185,129,0.12)",
    language: "Passionate, storytelling English",
    personality: `You are Kavya Didi (Kavya Nambiar), Biology teacher for CBSE Class 12, NEET focused. You are passionate about life sciences. Language: Vivid English. "Right now, your cells are doing this!" Teaching style: Make it personal. NEET pattern focused. Always flag NEET: "NEET 2025 asked exactly this type of question." Keep responses passionate and personal, max 4-5 sentences.`,
    greeting: "Hi! I'm Kavya Didi. Biology is the story of life — including yours! 🧬 NEET 2026 preparation? Let's begin! Genetics, Ecology, Human Health, Reproduction?",
    distractionPrompt: `Generate a passionate message from Kavya Didi (Biology NEET teacher) for a distracted student. Connect to their own body. Mention NEET. Max 3 sentences.`
  }
};

async function callClaude(messages, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Please try again!";
}

const EXAM_SCHEDULE = [
  { date: "Feb 15", subject: "English", teacherId: "english", daysLeft: 31, readiness: 87, status: "on-track" },
  { date: "Feb 18", subject: "Hindi", teacherId: "hindi", daysLeft: 34, readiness: 69, status: "warning" },
  { date: "Feb 22", subject: "Science", teacherId: "science", daysLeft: 38, readiness: 74, status: "on-track" },
  { date: "Feb 25", subject: "Maths", teacherId: "maths", daysLeft: 41, readiness: 78, status: "on-track" },
  { date: "Mar 02", subject: "Social Science", teacherId: "social", daysLeft: 46, readiness: 61, status: "behind" },
];

const CLASS10_TEACHERS = ["maths","science","english","social","hindi"];
const CLASS12_PCM = ["physics","chemistry","maths","english"];
const CLASS12_PCB = ["physics","chemistry","biology","english"];

export default function GurukulAI() {
  const [view, setView] = useState("landing");
  const [role, setRole] = useState(null);
  const [studentClass, setStudentClass] = useState("10");
  const [stream, setStream] = useState("PCM");
  const [activeTeacherId, setActiveTeacherId] = useState("maths");
  const [conversations, setConversations] = useState({});
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [focusScore, setFocusScore] = useState(96);
  const [distractionAlert, setDistractionAlert] = useState(null);
  const [distractionLoading, setDistractionLoading] = useState(false);
  const [parentAlert, setParentAlert] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("classroom");
  const [parentTab, setParentTab] = useState("live");
  const [meetingReport, setMeetingReport] = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [homeworkInput, setHomeworkInput] = useState("");
  const [homeworkAnswer, setHomeworkAnswer] = useState("");
  const [homeworkLoading, setHomeworkLoading] = useState(false);
  const [streak] = useState(12);
  const chatEndRef = useRef(null);
  const inactivityTimer = useRef(null);
  const sessionTimer = useRef(null);

  const teacher = TEACHERS[activeTeacherId];
  const currentConvo = conversations[activeTeacherId] || [];

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (sessionActive) {
      sessionTimer.current = setInterval(() => setSessionTime(s => s + 1), 1000);
    } else clearInterval(sessionTimer.current);
    return () => clearInterval(sessionTimer.current);
  }, [sessionActive]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isLoading]);

  useEffect(() => {
    if (!sessionActive) return;
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => triggerDistractionAlert(), 45000);
    return () => clearTimeout(inactivityTimer.current);
  }, [lastActivity, sessionActive]);

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const getTeachersForClass = () => studentClass === "10" ? CLASS10_TEACHERS : stream === "PCM" ? CLASS12_PCM : CLASS12_PCB;

  const startSession = async () => {
    setSessionActive(true);
    setIsLoading(true);
    setLastActivity(Date.now());
    try {
      setConversations(prev => ({
        ...prev,
        [activeTeacherId]: [{ role: "assistant", content: teacher.greeting, teacher: activeTeacherId }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    const userMsg = inputText.trim();
    setInputText("");
    setLastActivity(Date.now());
    setFocusScore(s => Math.min(99, s + 2));
    const updatedConvo = [...currentConvo, { role: "user", content: userMsg, teacher: activeTeacherId }];
    setConversations(prev => ({ ...prev, [activeTeacherId]: updatedConvo }));
    setIsLoading(true);
    try {
      const apiMessages = updatedConvo.filter(m => m.role === "user" || m.role === "assistant").map(m => ({ role: m.role, content: m.content }));
      const response = await callClaude(apiMessages, teacher.personality);
      setConversations(prev => ({ ...prev, [activeTeacherId]: [...updatedConvo, { role: "assistant", content: response, teacher: activeTeacherId }] }));
    } catch {
      setConversations(prev => ({ ...prev, [activeTeacherId]: [...updatedConvo, { role: "assistant", content: "Network issue — please try again!", teacher: activeTeacherId }] }));
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDistractionAlert = async () => {
    if (distractionAlert) return;
    setDistractionLoading(true);
    setFocusScore(s => Math.max(30, s - 25));
    try {
      const msg = await callClaude([{ role: "user", content: "Generate the distraction callout message now." }], teacher.distractionPrompt);
      setDistractionAlert(msg);
      setTimeout(() => setParentAlert(true), 1500);
    } catch {
      setDistractionAlert(`Hey Priya! 👋 ${teacher.name} here — come back, beta! Board exams are coming!`);
      setTimeout(() => setParentAlert(true), 1500);
    } finally {
      setDistractionLoading(false);
    }
  };

  const dismissDistraction = () => {
    setDistractionAlert(null);
    setParentAlert(false);
    setFocusScore(s => Math.min(99, s + 18));
    setLastActivity(Date.now());
    setConversations(prev => ({ ...prev, [activeTeacherId]: [...(prev[activeTeacherId] || []), { role: "assistant", content: "Welcome back! Ab focus karo — hum sab believe karte hain tumpe. Let's continue! 💪", teacher: activeTeacherId }] }));
  };

  const solveHomework = async () => {
    if (!homeworkInput.trim() || homeworkLoading) return;
    setHomeworkLoading(true);
    setHomeworkAnswer("");
    try {
      const answer = await callClaude([{ role: "user", content: `Please help me solve this school question: ${homeworkInput}` }], `You are a friendly encouraging AI tutor helping an Indian CBSE student with homework. Solve step by step using Socratic method. Be warm and encouraging. End with "Do you understand? Ask me if anything is unclear!"`);
      setHomeworkAnswer(answer);
    } catch {
      setHomeworkAnswer("Sorry, couldn't fetch answer. Please try again!");
    } finally {
      setHomeworkLoading(false);
    }
  };

  const generateMeetingReport = async () => {
    setMeetingLoading(true);
    setMeetingReport("");
    try {
      const report = await callClaude([{ role: "user", content: "Please give us this week's full parent-teacher meeting report for Priya." }], `You are a team of AI teachers at GurukulAI giving a parent-teacher meeting report. Generate a warm detailed weekly report as if from all 5 teachers (Rajesh Sir-Maths, Ananya Didi-Science, Meera Ma'am-English, Vikram Sir-Social, Sunita Didi-Hindi). Performance: Maths 78% up 4%, Science 74% up 8%, English 87% stable, Social 61% down 3% needs urgent attention, Hindi 69% stable. Streak: 12 days. Week: 4.5 hours. Board exams: 31-46 days away. Address parents as "Mr. and Mrs. Sharma". Student name is Priya. Be specific, actionable, caring.`);
      setMeetingReport(report);
    } catch {
      setMeetingReport("Unable to generate report right now. Please try again.");
    } finally {
      setMeetingLoading(false);
    }
  };

  const C = { saffron: "#FF6B00", gold: "#F5C842", navy: "#0A1628", navyL: "#112240", green: "#00C48C", red: "#FF4757", yellow: "#FFB800", purple: "#7C3AED", teal: "#0EA5E9", white: "#fff" };
  const s = {
    app: { fontFamily: "'Outfit', 'Poppins', system-ui", background: C.navy, minHeight: "100vh", color: C.white },
    header: { background: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,107,0,0.12)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 20, fontWeight: 900, background: `linear-gradient(135deg, ${C.saffron}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    tabs: { display: "flex", gap: 3, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 3, overflowX: "auto" },
    tab: a => ({ padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", background: a ? C.saffron : "transparent", color: a ? C.white : "rgba(255,255,255,0.45)", transition: "all 0.2s" }),
    card: (border = "rgba(255,255,255,0.08)") => ({ background: "rgba(255,255,255,0.03)", border: `1px solid ${border}`, borderRadius: 18, padding: 16, marginBottom: 12 }),
    btn: (bg, full) => ({ background: bg, border: "none", borderRadius: 12, padding: full ? "13px" : "10px 18px", color: C.white, fontWeight: 700, cursor: "pointer", fontSize: 13, width: full ? "100%" : "auto" }),
    input: { flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", color: C.white, fontSize: 13, outline: "none", fontFamily: "inherit" },
    bubble: role => ({ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-end", gap: 6 }),
    bubbleBox: (role, color) => ({ maxWidth: "80%", background: role === "user" ? `linear-gradient(135deg, ${C.saffron}, #FF8C3A)` : "rgba(255,255,255,0.07)", border: role === "assistant" ? `1px solid ${color}25` : "none", borderRadius: role === "user" ? "16px 16px 3px 16px" : "16px 16px 16px 3px", padding: "11px 14px", fontSize: 13, lineHeight: 1.6 }),
    statCard: color => ({ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 14, padding: "12px", textAlign: "center", flex: 1 }),
    progressOuter: { height: 7, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 6 },
    progressInner: (pct, color) => ({ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 4 }),
  };

  if (view === "landing") return (
    <div style={{ ...s.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20, background: `linear-gradient(135deg, ${C.navy} 0%, #0f1f3d 50%, #1a1040 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255,107,0,0.07) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(245,200,66,0.05) 0%, transparent 45%)` }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 560, width: "100%" }}>
        <div style={{ fontSize: 52, marginBottom: 6 }}>🎓</div>
        <div style={{ ...s.logo, fontSize: 44, marginBottom: 4 }}>GurukulAI</div>
        <div style={{ fontSize: 11, color: C.saffron, letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>INDIA'S FIRST AI PRIVATE TUITION PLATFORM</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 32, lineHeight: 1.6 }}>Real AI teachers with Indian names. Parents watch live from office. ₹1,500/month.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {[["🧑‍🏫","Real AI Teachers","9 teachers, Indian names, actual AI"],["👁️","Live Guardian","Watch child's screen from anywhere"],["📅","Smart Calendar","Auto-builds timetable from board dates"],["📊","Daily Reports","Proof of learning every night at 9pm"]].map(([e,t,d]) => (
            <div key={t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{e}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Select your class:</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: studentClass === "12" ? 10 : 0 }}>
            {["10","12"].map(c => <button key={c} onClick={() => setStudentClass(c)} style={{ ...s.btn(studentClass === c ? C.saffron : "rgba(255,255,255,0.08)"), padding: "8px 24px" }}>Class {c}</button>)}
          </div>
          {studentClass === "12" && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              {["PCM","PCB"].map(st => <button key={st} onClick={() => setStream(st)} style={{ ...s.btn(stream === st ? C.gold : "rgba(255,255,255,0.06)"), padding: "6px 20px", color: stream === st ? C.navy : C.white, fontSize: 12 }}>{st} {st==="PCM"?"(JEE)":"(NEET)"}</button>)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => { setRole("student"); setView("student"); setActiveTeacherId(getTeachersForClass()[0]); }} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`), padding: "14px 32px", fontSize: 15 }}>👩‍🎓 Student Experience</button>
          <button onClick={() => { setRole("parent"); setView("parent"); }} style={{ ...s.btn("rgba(255,255,255,0.1)"), padding: "14px 32px", fontSize: 15, border: "1px solid rgba(255,255,255,0.15)" }}>👨‍👩‍💼 Parent Dashboard</button>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "10px 16px", background: "rgba(255,107,0,0.06)", borderRadius: 10, border: "1px solid rgba(255,107,0,0.15)", display: "inline-block" }}>
          💰 Private tutor: ₹11,500/month → <span style={{ color: C.gold, fontWeight: 700 }}>GurukulAI: ₹1,500/month</span>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (view === "student") return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>←</button>
          <div style={s.logo}>GurukulAI</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 8 }}>Student • Class {studentClass}{studentClass==="12"?` ${stream}`:""}</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>🕐 {currentTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={s.tabs}>
          {[["classroom","🎓 Classroom"],["timetable","📅 Timetable"],["exams","🎯 Exams"],["homework","❓ Homework"]].map(([k,l]) => (
            <button key={k} style={s.tab(activeTab===k)} onClick={() => setActiveTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {activeTab === "classroom" && (
        <div style={{ padding: 14, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={s.statCard(C.saffron)}><div style={{ fontSize: 20, fontWeight: 800, color: C.saffron }}>{formatTime(sessionTime)}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Session</div></div>
            <div style={s.statCard(C.green)}><div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{focusScore}%</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Focus</div></div>
            <div style={s.statCard(C.gold)}><div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>🔥{streak}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Streak</div></div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {getTeachersForClass().map(tid => {
              const t = TEACHERS[tid];
              return <button key={tid} onClick={() => { setActiveTeacherId(tid); setSessionActive(false); setSessionTime(0); }} style={{ background: activeTeacherId===tid ? t.color : "rgba(255,255,255,0.05)", border: `1px solid ${t.color}40`, borderRadius: 20, padding: "5px 12px", color: C.white, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.emoji} {t.name}</button>;
            })}
          </div>
          <div style={{ background: teacher.bgColor, border: `1px solid ${teacher.color}30`, borderRadius: 18, padding: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${teacher.color}, ${teacher.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{teacher.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{teacher.name}</div>
              <div style={{ fontSize: 12, color: teacher.color, fontWeight: 600 }}>{teacher.subject}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Real AI • Responds to anything</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              {!sessionActive ? (
                <button onClick={startSession} style={s.btn(`linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`)}>▶ Start Class</button>
              ) : (
                <>
                  <div style={{ background: "rgba(0,196,140,0.15)", border: "1px solid rgba(0,196,140,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: C.green }}>🔴 LIVE</div>
                  <button onClick={triggerDistractionAlert} style={{ background: "rgba(255,71,87,0.15)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 10, color: C.red, cursor: "pointer" }}>Simulate Distraction</button>
                </>
              )}
            </div>
          </div>
          {sessionActive ? (
            <>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 16, minHeight: 280, maxHeight: 360, overflowY: "auto", marginBottom: 10 }}>
                {currentConvo.map((msg, i) => {
                  const t = msg.teacher ? TEACHERS[msg.teacher] : null;
                  return (
                    <div key={i} style={s.bubble(msg.role)}>
                      {msg.role==="assistant" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: t?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{t?.avatar}</div>}
                      <div style={s.bubbleBox(msg.role, t?.color)}>
                        {msg.role==="assistant" && <div style={{ fontSize: 9, color: t?.color, fontWeight: 700, marginBottom: 3 }}>{t?.name}</div>}
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: teacher.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{teacher.avatar}</div>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: teacher.color, animation: `pulse 1s ${i*0.2}s infinite` }} />)}</div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={s.input} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()} placeholder={`Ask ${teacher.name} anything...`} />
                <button onClick={sendMessage} disabled={isLoading} style={{ ...s.btn(`linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`), opacity: isLoading ? 0.5 : 1 }}>Send ↑</button>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.saffron, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>👁️ Parent watching live • Real AI response</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{teacher.avatar}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{teacher.name} is ready</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 300, margin: "0 auto" }}>{teacher.greeting}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "timetable" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>📅 Weekly Study Timetable</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Auto-built by AI teachers around your board exam dates</div>
          {[
            { day: "Monday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "5:45-6:45", tid: "science" }, { time: "7:00-7:30", tid: "english" }] },
            { day: "Tuesday", sessions: [{ time: "4:30-5:00", tid: "maths" }, { time: "6:00-7:00", tid: "social" }, { time: "7:00-7:30", tid: "hindi" }] },
            { day: "Wednesday", sessions: [{ time: "4:30-5:30", tid: "science" }, { time: "5:45-6:45", tid: "maths" }, { time: "7:00-7:30", tid: "english" }] },
            { day: "Thursday", sessions: [{ time: "4:30-5:00", tid: "hindi" }, { time: "6:00-7:00", tid: "science" }] },
            { day: "Friday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "5:45-6:30", tid: "social" }, { time: "6:30-7:00", tid: "hindi" }] },
            { day: "Saturday", sessions: [{ time: "10:00-11:30", tid: "maths" }, { time: "11:45-1:00", tid: "science" }] },
          ].map(({ day, sessions }) => (
            <div key={day} style={{ ...s.card(), marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: C.gold }}>{day}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sessions.map(({ time, tid }) => {
                  const t = TEACHERS[tid];
                  return (
                    <div key={time+tid} style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: 10, padding: "6px 10px", fontSize: 11 }}>
                      <div style={{ color: t.color, fontWeight: 700 }}>{t.emoji} {t.subject}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{time} • {t.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "exams" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>🎯 Board Exam Countdown</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>CBSE Class {studentClass} • Auto-synced with CBSE calendar</div>
          {EXAM_SCHEDULE.map(exam => {
            const t = TEACHERS[exam.teacherId];
            const sc = exam.status==="behind" ? C.red : exam.status==="warning" ? C.yellow : C.green;
            return (
              <div key={exam.subject} style={{ ...s.card(`${sc}25`), background: `${sc}06` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><span style={{ fontSize: 18 }}>{t.emoji}</span><span style={{ fontWeight: 800, fontSize: 15 }}>{exam.subject}</span></div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>with {t.name} • {exam.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 30, fontWeight: 900, color: sc, lineHeight: 1 }}>{exam.daysLeft}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>days left</div></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}><span style={{ color: "rgba(255,255,255,0.4)" }}>Readiness</span><span style={{ fontWeight: 700, color: sc }}>{exam.readiness}%</span></div>
                <div style={s.progressOuter}><div style={s.progressInner(exam.readiness, sc)} /></div>
                <div style={{ fontSize: 11, color: sc, marginTop: 6 }}>{exam.status==="behind" ? "🔴 Needs urgent focus" : exam.status==="warning" ? "🟡 Monitor closely" : "🟢 On track"}</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "homework" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>❓ Homework Help</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Ask any school question — real AI solves it 24/7</div>
          <div style={s.card()}>
            <textarea value={homeworkInput} onChange={e => setHomeworkInput(e.target.value)} style={{ ...s.input, width: "100%", minHeight: 80, resize: "vertical", marginBottom: 10, boxSizing: "border-box" }} placeholder="Type your school question here..." />
            <button onClick={solveHomework} disabled={homeworkLoading||!homeworkInput.trim()} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`, true), opacity: homeworkLoading||!homeworkInput.trim() ? 0.5 : 1 }}>
              {homeworkLoading ? "🤔 AI is solving..." : "✨ Solve This Question"}
            </button>
          </div>
          {homeworkLoading && <div style={{ textAlign: "center", padding: 20, color: "rgba(255,255,255,0.4)", fontSize: 13 }}><div style={{ width: 24, height: 24, border: `2px solid ${C.saffron}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />Solving...</div>}
          {homeworkAnswer && <div style={{ ...s.card(`${C.green}30`), background: `${C.green}06` }}><div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 8 }}>✅ AI Teacher Answer</div><div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.85)" }}>{homeworkAnswer}</div></div>}
        </div>
      )}

      {(distractionAlert||distractionLoading) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.navyL}, ${C.navy})`, border: `2px solid ${teacher.color}`, borderRadius: 24, padding: 28, maxWidth: 380, width: "100%", textAlign: "center" }}>
            {distractionLoading ? (
              <><div style={{ width: 40, height: 40, border: `3px solid ${teacher.color}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} /><div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{teacher.name} noticed you're distracted...</div></>
            ) : (
              <><div style={{ fontSize: 44, marginBottom: 8 }}>{teacher.avatar}</div><div style={{ fontWeight: 800, fontSize: 17, marginBottom: 10, color: teacher.color }}>{teacher.name} says:</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>"{distractionAlert}"</div><div style={{ display: "flex", gap: 8 }}><button onClick={dismissDistraction} style={{ ...s.btn(`linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`, true) }}>I'm here! 💪</button><button style={{ ...s.btn("rgba(255,255,255,0.08)"), flex: "0 0 auto", border: "1px solid rgba(255,255,255,0.1)" }}>5 min break</button></div></>
            )}
          </div>
        </div>
      )}
      {parentAlert&&!distractionAlert&&!distractionLoading && <div style={{ position: "fixed", top: 70, right: 12, background: `linear-gradient(135deg, ${C.red}, #cc0000)`, borderRadius: 14, padding: "12px 16px", maxWidth: 280, zIndex: 999 }}><div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>🚨 Parent Notified</div><div style={{ fontSize: 11, opacity: 0.9 }}>Your parent can see your screen live.</div></div>}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (view === "parent") return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>←</button>
          <div style={s.logo}>GurukulAI</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 8 }}>Parent Dashboard</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📅 {currentTime.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})} • {currentTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={s.tabs}>
          {[["live","👁️ Live Monitor"],["reports","📊 Reports"],["meetings","👨‍👩‍💼 Meeting"],["calendar","📅 Calendar"]].map(([k,l]) => (
            <button key={k} style={s.tab(parentTab===k)} onClick={() => setParentTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {parentTab === "live" && (
        <div style={{ padding: 14, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ ...s.card(`${C.green}30`), background: `${C.green}06` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} /><span style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>PRIYA IS STUDYING RIGHT NOW</span></div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📐 Maths with Rajesh Sir • Chapter 4: Quadratic Equations</div>
              </div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 26, fontWeight: 900, color: C.green }}>94%</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Focus Score</div></div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 12, padding: 14, position: "relative" }}>
              <div style={{ position: "absolute", top: 8, right: 8, background: C.red, borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700 }}>● LIVE</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Child's screen — refreshes every 10 seconds</div>
              <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 10, color: C.saffron, fontWeight: 700, marginBottom: 4 }}>👨‍🏫 Rajesh Sir (Real AI):</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>"Bilkul sahi! Ab batao — agar discriminant zero ho toh roots kya honge? Think carefully!"</div>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 10, color: "rgba(255,255,255,0.3)" }}><span>⏱ 34 mins</span><span>• 12 questions</span><span style={{ color: C.green }}>• 0 exit attempts</span></div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Remote Controls — from anywhere in the world:</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[["🔒 Lock Session",C.red],["💬 Send Message",C.saffron],["⏸ Allow Break",C.yellow],["🔔 Check In",C.teal],["▶ Start Session",C.green]].map(([l,c]) => (
                  <button key={l} style={{ background: `${c}12`, border: `1px solid ${c}25`, borderRadius: 9, padding: "7px 12px", color: C.white, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📊 Subject Performance</div>
          {[["Maths","maths",78,4],["Science","science",74,8],["English","english",87,0],["Social Science","social",61,-3],["Hindi","hindi",69,2]].map(([sub,tid,score,change]) => {
            const t = TEACHERS[tid];
            const sc = score>=80 ? C.green : score>=65 ? C.saffron : C.red;
            return (
              <div key={sub} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{t.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{sub}</span>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 800, color: sc }}>{score}%</span><span style={{ fontSize: 10, color: change>0?C.green:change<0?C.red:"rgba(255,255,255,0.3)" }}>{change>0?`↑${change}%`:change<0?`↓${Math.abs(change)}%`:"→"}</span></div>
                  </div>
                  <div style={s.progressOuter}><div style={s.progressInner(score,sc)} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {parentTab === "reports" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>📊 Daily Report</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Sent to your email every night at 9:00 PM</div>
          {[{subject:"Maths",tid:"maths",duration:"54 mins",correct:"14/18",focus:94},{subject:"Science",tid:"science",duration:"47 mins",correct:"9/12",focus:88}].map(session => {
            const t = TEACHERS[session.tid];
            return (
              <div key={session.subject} style={s.card()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t.emoji} {session.subject}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>with {t.name}</div></div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.saffron }}>{session.duration}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["Correct",session.correct,C.green],["Focus",`${session.focus}%`,C.saffron]].map(([l,v,c]) => (
                    <div key={l} style={{ ...s.statCard(c), flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l}</div></div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ ...s.card(`${C.purple}30`), background: `${C.purple}06` }}>
            <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 6 }}>💬 AI Teacher Note</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontStyle: "italic" }}>"Priya was highly engaged today. She asked 3 excellent questions. Recommend more focus on Social Science — 14 points below target."</div>
          </div>
        </div>
      )}

      {parentTab === "meetings" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>👨‍👩‍💼 Weekly Parent-Teacher Meeting</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Every Sunday 7:00 PM • All 5 AI teachers report together</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {CLASS10_TEACHERS.map(tid => {
              const t = TEACHERS[tid];
              return <div key={tid} style={{ textAlign: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: `${t.color}25`, border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 3px" }}>{t.avatar}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{t.name.split(" ")[0]}</div></div>;
            })}
          </div>
          <button onClick={generateMeetingReport} disabled={meetingLoading} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`, true), marginBottom: 14, opacity: meetingLoading ? 0.6 : 1 }}>
            {meetingLoading ? "🤔 AI teachers preparing report..." : "▶ Generate This Week's Meeting Report (Real AI)"}
          </button>
          {meetingLoading && <div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 30, height: 30, border: `3px solid ${C.saffron}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} /><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Generating real AI report...</div></div>}
          {meetingReport && <div style={s.card(`${C.saffron}30`)}><div style={{ fontSize: 11, color: C.saffron, fontWeight: 700, marginBottom: 8 }}>📋 Real AI Meeting Report</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{meetingReport}</div></div>}
          {!meetingReport&&!meetingLoading && <div style={{ textAlign: "center", padding: 32, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)" }}><div style={{ fontSize: 40, marginBottom: 8 }}>👨‍👩‍💼</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>AI Teaching Team Ready</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Press button above to generate real AI report</div></div>}
        </div>
      )}

      {parentTab === "calendar" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>📅 Exam Calendar</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Auto-synced • CBSE dates fetched automatically</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["📅 Google Calendar","🍎 Apple Calendar"].map(l => <button key={l} style={{ ...s.btn("rgba(255,255,255,0.07)"), flex: 1, border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}>{l}</button>)}
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: C.red }}>🎯 CBSE Board Exams 2026</div>
          {EXAM_SCHEDULE.map(exam => {
            const t = TEACHERS[exam.teacherId];
            const sc = exam.status==="behind" ? C.red : exam.status==="warning" ? C.yellow : C.green;
            return (
              <div key={exam.subject} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${sc}12`, border: `1px solid ${sc}25`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: sc, fontWeight: 700 }}>{exam.date.split(" ")[0].toUpperCase()}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: sc, lineHeight: 1.1 }}>{exam.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 13 }}>{t.emoji}</span><span style={{ fontWeight: 700, fontSize: 13 }}>{exam.subject}</span></div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{exam.daysLeft} days • Readiness: <span style={{ color: sc, fontWeight: 700 }}>{exam.readiness}%</span></div>
                </div>
                <div style={{ fontSize: 10, background: `${sc}12`, border: `1px solid ${sc}25`, borderRadius: 7, padding: "3px 8px", color: sc }}>{exam.status==="behind"?"⚠️ Behind":exam.status==="warning"?"⚡ Watch":"✅ Track"}</div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return null;
}
