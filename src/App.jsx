import { useState, useEffect, useRef } from "react";

const TEACHERS = {
  maths: {
    id: "maths", name: "Rajesh Sir", full: "Rajesh Kumar",
    subject: "Mathematics", emoji: "📐", avatar: "👨‍🏫",
    color: "#FF6B00", bg: "rgba(255,107,0,0.12)",
    personality: `You are Rajesh Sir (Rajesh Kumar), a Mathematics teacher for CBSE Class 10 and 12.
You are strict but deeply loving — the teacher students fear but secretly love the most.
ALWAYS address student as "Priya" by name. Use name frequently — feels personal.
Language: Natural Hinglish. Mix Hindi and English.
Use: "Shabash!", "Bilkul sahi!", "Ek baar aur try karo", "Beta", "Ghabrao mat", "Dekho", "Samjhe?", "Acha!", "Haan!", "Nahi nahi"
Teaching: NEVER give direct answers. Guide with hints. Socratic method.
When right: "BILKUL SAHI PRIYA! SHABASH! Main bahut proud hoon!"
When wrong: "Nahi nahi Priya — dekho phir se. Step 2 mein kya hua?"
When going to board: Say "Ruko — main board pe likhta hoon" then explain formula.
Always end with a question back to student.
Board exam awareness: Mention "board exams X din door hain" occasionally.
Feel like a real caring home tutor. Max 3-4 sentences per response.
CBSE Class 10: Quadratic Equations, AP, Triangles, Coordinate Geometry, Trigonometry, Statistics, Probability.`,
    greeting: "Aao Priya! Baitho baitho — aaj bahut kuch seekhenge! Kal ka homework kiya? Kaunsa topic padhna hai aaj?",
    distraction: `You are Rajesh Sir, a loving but firm Maths teacher.
Student Priya has been distracted for 45 seconds.
Generate a warm, personal, slightly humorous message to bring her back.
Use her name "Priya". Mix Hindi English. Reference board exams.
Max 2-3 sentences. Sound exactly like a real caring teacher.`,
    boardTriggers: ["board pe likhta", "likhta hoon", "dekho yahan", "formula likhta", "samjhata hoon board"],
  },
  science: {
    id: "science", name: "Ananya Didi", full: "Ananya Sharma",
    subject: "Science", emoji: "🔬", avatar: "👩‍🔬",
    color: "#00C48C", bg: "rgba(0,196,140,0.12)",
    personality: `You are Ananya Didi (Ananya Sharma), Science teacher for CBSE Class 10.
You are enthusiastic, warm, like an elder sister who loves science.
ALWAYS address student as "Priya" by name.
Language: Mostly English with Hindi sprinkled. "Wah!", "Super!", "Dekho yaar", "Samjhi?"
Teaching: Connect EVERYTHING to real life. "Imagine karo...", "Think about..."
When explaining: Start with a relatable real-world example first.
When going to board: "Chalo — diagram banate hain" then explain.
When right: "WAAAH Priya! Super! Exactly right! You're thinking like a scientist!"
Feel like an enthusiastic elder sister. Max 3-4 sentences per response.
CBSE Class 10 Science: Chemical Reactions, Acids Bases, Metals, Carbon, Life Processes,
Control Coordination, Heredity Evolution, Light, Electricity, Magnetic Effects.`,
    greeting: "Priya! Aao aao! Science is everywhere — even in your chai! Aaj kya explore karein? Physics, Chemistry, ya Biology?",
    distraction: `You are Ananya Didi, enthusiastic Science teacher like an elder sister.
Student Priya has been distracted for 45 seconds.
Generate a warm, fun message to bring her back.
Connect it to something interesting about science.
Use "Priya" and "yaar". Max 2-3 sentences.`,
    boardTriggers: ["diagram banate", "board pe", "likhte hain", "draw karte", "dekho yahan"],
  }
};

const EXAM_SCHEDULE = [
  { date: "Feb 15", subject: "English", daysLeft: 31, readiness: 87, status: "on-track" },
  { date: "Feb 18", subject: "Hindi", daysLeft: 34, readiness: 69, status: "warning" },
  { date: "Feb 22", subject: "Science", daysLeft: 38, readiness: 74, status: "on-track" },
  { date: "Feb 25", subject: "Maths", daysLeft: 41, readiness: 78, status: "on-track" },
  { date: "Mar 02", subject: "Social Science", daysLeft: 46, readiness: 61, status: "behind" },
];

const TIMETABLE = [
  { day: "Monday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "5:45-6:45", tid: "science" }] },
  { day: "Tuesday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "6:00-7:00", tid: "science" }] },
  { day: "Wednesday", sessions: [{ time: "4:30-5:30", tid: "science" }, { time: "5:45-6:45", tid: "maths" }] },
  { day: "Thursday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "6:00-7:00", tid: "science" }] },
  { day: "Friday", sessions: [{ time: "4:30-5:30", tid: "maths" }, { time: "5:45-6:30", tid: "science" }] },
  { day: "Saturday", sessions: [{ time: "10:00-11:30", tid: "maths" }, { time: "11:45-1:00", tid: "science" }] },
];

async function callClaude(messages, system) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Please try again!";
}

async function textToSpeech(text, voiceId) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey || !voiceId) return null;
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true }
      })
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch { return null; }
}

const C = {
  saffron: "#FF6B00", gold: "#F5C842", navy: "#0A1628",
  navyL: "#112240", green: "#00C48C", red: "#FF4757",
  yellow: "#FFB800", purple: "#7C3AED", teal: "#0EA5E9", white: "#fff"
};

export default function GurukulAI() {
  const [view, setView] = useState("landing");
  const [studentClass, setStudentClass] = useState("10");
  const [stream, setStream] = useState("PCM");
  const [activeTeacherId, setActiveTeacherId] = useState("maths");
  const [conversations, setConversations] = useState({});
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [boardContent, setBoardContent] = useState("");
  const [boardWriting, setBoardWriting] = useState(false);
  const [teacherState, setTeacherState] = useState("sitting");
  const [parentMessage, setParentMessage] = useState("");
  const [childMessage, setChildMessage] = useState(null);

  const teacher = TEACHERS[activeTeacherId];
  const currentConvo = conversations[activeTeacherId] || [];
  const chatEndRef = useRef(null);
  const inactivityTimer = useRef(null);
  const sessionTimer = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const boardTimer = useRef(null);

  const RAJESH_VOICE = import.meta.env.VITE_ELEVENLABS_VOICE_RAJESH;
  const ANANYA_VOICE = import.meta.env.VITE_ELEVENLABS_VOICE_ANANYA;

  const getVoiceId = () => activeTeacherId === "maths" ? RAJESH_VOICE : ANANYA_VOICE;

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
    inactivityTimer.current = setTimeout(triggerDistraction, 45000);
    return () => clearTimeout(inactivityTimer.current);
  }, [lastActivity, sessionActive]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timeStr = currentTime.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Please use Chrome for voice input");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      handleStudentMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speakResponse = async (text) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(true);
    const audioUrl = await textToSpeech(text, getVoiceId());
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); audioRef.current = null; };
      audio.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = activeTeacherId === "maths" ? 0.8 : 1.1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkBoardTrigger = (text) => {
    const lower = text.toLowerCase();
    return teacher.boardTriggers.some(t => lower.includes(t));
  };

  const triggerBoardSequence = async (formula) => {
    setTeacherState("standing");
    await new Promise(r => setTimeout(r, 800));
    setTeacherState("walking");
    await new Promise(r => setTimeout(r, 1000));
    setTeacherState("writing");
    setShowBoard(true);
    setBoardContent("");
    setBoardWriting(true);
    let i = 0;
    boardTimer.current = setInterval(() => {
      if (i < formula.length) {
        setBoardContent(prev => prev + formula[i]);
        i++;
      } else {
        clearInterval(boardTimer.current);
        setBoardWriting(false);
      }
    }, 80);
    await new Promise(r => setTimeout(r, formula.length * 80 + 2000));
    setTeacherState("returning");
    await new Promise(r => setTimeout(r, 1000));
    setTeacherState("sitting");
  };

  const handleStudentMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    setLastActivity(Date.now());
    setFocusScore(s => Math.min(99, s + 3));
    const userMsg = { role: "user", content: text, teacher: activeTeacherId };
    const updatedConvo = [...currentConvo, userMsg];
    setConversations(prev => ({ ...prev, [activeTeacherId]: updatedConvo }));
    setIsLoading(true);
    try {
      const apiMessages = updatedConvo
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role, content: m.content }));
      const response = await callClaude(apiMessages, teacher.personality);
      setConversations(prev => ({
        ...prev,
        [activeTeacherId]: [...updatedConvo, { role: "assistant", content: response, teacher: activeTeacherId }]
      }));
      if (checkBoardTrigger(response)) {
        speakResponse(response);
        await triggerBoardSequence("x = (-b ± √(b²-4ac)) / 2a");
      } else {
        await speakResponse(response);
      }
    } catch {
      setConversations(prev => ({
        ...prev,
        [activeTeacherId]: [...updatedConvo, { role: "assistant", content: "Network issue — please try again!", teacher: activeTeacherId }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async () => {
    setSessionActive(true);
    setLastActivity(Date.now());
    setTeacherState("sitting");
    setConversations(prev => ({
      ...prev,
      [activeTeacherId]: [{ role: "assistant", content: teacher.greeting, teacher: activeTeacherId }]
    }));
    await speakResponse(teacher.greeting);
  };

  const triggerDistraction = async () => {
    if (distractionAlert || distractionLoading) return;
    setDistractionLoading(true);
    setFocusScore(s => Math.max(30, s - 28));
    try {
      const msg = await callClaude(
        [{ role: "user", content: "Generate distraction message now." }],
        teacher.distraction
      );
      setDistractionAlert(msg);
      speakResponse(msg);
      setTimeout(() => setParentAlert(true), 1500);
    } catch {
      const fallback = `Priya! ${teacher.name} yahan hai — dhyan kahan hai beta? Board exams aa rahe hain!`;
      setDistractionAlert(fallback);
      speakResponse(fallback);
    } finally {
      setDistractionLoading(false);
    }
  };

  const dismissDistraction = () => {
    setDistractionAlert(null);
    setParentAlert(false);
    setFocusScore(s => Math.min(99, s + 20));
    setLastActivity(Date.now());
    const welcomeBack = "Welcome back Priya! Ab focus karo — tum bilkul kar sakti ho! 💪";
    setConversations(prev => ({
      ...prev,
      [activeTeacherId]: [...(prev[activeTeacherId] || []),
        { role: "assistant", content: welcomeBack, teacher: activeTeacherId }
      ]
    }));
    speakResponse(welcomeBack);
  };

  const solveHomework = async () => {
    if (!homeworkInput.trim() || homeworkLoading) return;
    setHomeworkLoading(true);
    setHomeworkAnswer("");
    try {
      const answer = await callClaude(
        [{ role: "user", content: `Help me solve: ${homeworkInput}` }],
        `You are a friendly CBSE tutor helping student Priya with homework.
        Solve step by step. Use Socratic method. Be warm, use "Priya" by name.
        Mix Hindi-English naturally. End with "Samjhi? Koi aur doubt?" Max 150 words.`
      );
      setHomeworkAnswer(answer);
    } catch {
      setHomeworkAnswer("Network issue — please try again!");
    } finally {
      setHomeworkLoading(false);
    }
  };

  const generateMeeting = async () => {
    setMeetingLoading(true);
    setMeetingReport("");
    try {
      const report = await callClaude(
        [{ role: "user", content: "Generate this week's parent-teacher meeting report." }],
        `You are all 5 AI teachers at GurukulAI giving a weekly parent meeting.
        Speak as each teacher: Rajesh Sir (Maths), Ananya Didi (Science),
        Meera Ma'am (English), Vikram Sir (Social), Sunita Didi (Hindi).
        Performance: Maths 78% up 4%, Science 74% up 8%, English 87% stable,
        Social 61% down 3% URGENT, Hindi 69% stable.
        Streak: 12 days. Hours: 4.5hrs. Mock test: 71%.
        Board exams: 31-46 days away. Student: Priya. Parents: Mr & Mrs Sharma.
        Be warm, specific, actionable. Each teacher 2-3 sentences.
        End with overall recommendation. Format with teacher names as headers.`
      );
      setMeetingReport(report);
    } catch {
      setMeetingReport("Unable to generate — please try again.");
    } finally {
      setMeetingLoading(false);
    }
  };

  const sendParentMessage = () => {
    if (!parentMessage.trim()) return;
    setChildMessage(parentMessage);
    setParentMessage("");
    setTimeout(() => setChildMessage(null), 8000);
  };

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
    progressInner: (pct, color) => ({ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 4, transition: "width 0.6s ease" }),
  };

  const TeacherAvatar = () => (
    <div style={{ background: `linear-gradient(135deg, ${C.navyL}, ${C.navy})`, border: `2px solid ${teacher.color}30`, borderRadius: 24, padding: 20, marginBottom: 16, position: "relative", minHeight: 260 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 100%, rgba(255,107,0,0.06) 0%, transparent 70%)`, pointerEvents: "none", borderRadius: 24 }} />
      <div style={{ position: "absolute", top: 12, right: 12, fontSize: 18, opacity: 0.25 }}>📚📖📕</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, position: "relative", zIndex: 1 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, ${teacher.color}, ${teacher.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, marginBottom: 12, boxShadow: `0 0 30px ${teacher.color}40`, border: `3px solid ${teacher.color}`, transform: teacherState === "walking" || teacherState === "returning" ? "translateX(20px)" : "translateX(0)", transition: "all 0.8s ease", animation: isSpeaking ? "speakPulse 0.5s ease-in-out infinite alternate" : "breathe 3s ease-in-out infinite" }}>
          {teacher.avatar}
        </div>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{teacher.name}</div>
          <div style={{ fontSize: 12, color: teacher.color, fontWeight: 600 }}>{teacher.subject}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: isSpeaking ? C.green : isListening ? C.saffron : "rgba(255,255,255,0.2)", animation: (isSpeaking || isListening) ? "pulse 1s infinite" : "none" }} />
            {isSpeaking ? "Teaching..." : isListening ? "Listening to you..." : teacherState === "walking" ? "Walking to board..." : teacherState === "writing" ? "Writing on board..." : "Ready"}
          </div>
        </div>
        {isSpeaking && (
          <div style={{ display: "flex", gap: 3, alignItems: "center", marginBottom: 8 }}>
            {[1, 2, 3, 4, 5, 4, 3, 2].map((h, i) => (
              <div key={i} style={{ width: 4, height: h * 4, borderRadius: 2, background: teacher.color, animation: `soundBar${i % 3} 0.4s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}
        {isListening && (
          <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "6px 14px", background: "rgba(255,107,0,0.15)", borderRadius: 20, border: "1px solid rgba(255,107,0,0.3)" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.saffron, animation: `pulse 0.6s ${i * 0.2}s ease-in-out infinite` }} />)}
            <span style={{ fontSize: 11, color: C.saffron, marginLeft: 4 }}>Listening...</span>
          </div>
        )}
      </div>
      {sessionActive && (
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
          <span>⏱ {formatTime(sessionTime)}</span>
          <span style={{ color: C.green }}>🔴 LIVE</span>
          <span>Focus: {focusScore}%</span>
        </div>
      )}
      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
        @keyframes speakPulse { 0%{transform:scale(1);box-shadow:0 0 20px ${teacher.color}40} 100%{transform:scale(1.05);box-shadow:0 0 40px ${teacher.color}80} }
        @keyframes soundBar0 { 0%{height:4px} 100%{height:16px} }
        @keyframes soundBar1 { 0%{height:8px} 100%{height:24px} }
        @keyframes soundBar2 { 0%{height:6px} 100%{height:20px} }
      `}</style>
    </div>
  );

  const Whiteboard = () => !showBoard ? null : (
    <div style={{ background: "#f5f0e8", border: "4px solid #8B7355", borderRadius: 8, padding: 20, marginBottom: 16, position: "relative", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#8B7355", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 12px", borderRadius: 4 }}>📋 WHITEBOARD</div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18, color: "#1a1a2e", fontWeight: 700, letterSpacing: 1, minHeight: 40, lineHeight: 1.6 }}>
        {boardContent}
        {boardWriting && <span style={{ display: "inline-block", width: 2, height: 20, background: "#FF6B00", marginLeft: 2, animation: "blink 0.5s step-end infinite" }} />}
      </div>
      <button onClick={() => setShowBoard(false)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "#8B7355", cursor: "pointer", fontSize: 16 }}>✕</button>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );

  if (view === "landing") return (
    <div style={{ ...s.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20, background: `linear-gradient(135deg, ${C.navy} 0%, #0f1f3d 50%, #1a1040 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255,107,0,0.07) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(245,200,66,0.05) 0%, transparent 45%)` }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 580, width: "100%" }}>
        <div style={{ fontSize: 56, marginBottom: 6 }}>🎓</div>
        <div style={{ ...s.logo, fontSize: 44, marginBottom: 4 }}>GurukulAI</div>
        <div style={{ fontSize: 11, color: C.saffron, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>INDIA'S FIRST AI PRIVATE TUITION PLATFORM</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 8, lineHeight: 1.6, fontStyle: "italic" }}>"Apna Teacher. Apni Class. Har Waqt."</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>Real AI teachers. Indian faces. Indian accent. Parent guardian system.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[["🧑‍🏫", "Real AI Teachers", "Indian names, faces & accent"], ["🗣️", "Voice Conversation", "Student speaks — no typing ever"], ["👁️", "Live Guardian", "Parents watch from office"], ["📋", "Whiteboard Live", "Teacher writes formulas live"], ["📅", "Smart Calendar", "Built around board exam dates"], ["📊", "Daily Reports", "Proof of learning at 9pm"]].map(([e, t, d]) => (
            <div key={t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{e}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Select class:</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: studentClass === "12" ? 10 : 0 }}>
            {["10", "12"].map(c => <button key={c} onClick={() => setStudentClass(c)} style={{ ...s.btn(studentClass === c ? C.saffron : "rgba(255,255,255,0.08)"), padding: "8px 24px" }}>Class {c}</button>)}
          </div>
          {studentClass === "12" && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
              {["PCM", "PCB"].map(st => <button key={st} onClick={() => setStream(st)} style={{ ...s.btn(stream === st ? C.gold : "rgba(255,255,255,0.06)"), padding: "6px 20px", color: stream === st ? C.navy : C.white, fontSize: 12 }}>{st} {st === "PCM" ? "(JEE)" : "(NEET)"}</button>)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => { setView("student"); setActiveTeacherId("maths"); }} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`), padding: "14px 32px", fontSize: 15 }}>👩‍🎓 Student Experience</button>
          <button onClick={() => setView("parent")} style={{ ...s.btn("rgba(255,255,255,0.1)"), padding: "14px 32px", fontSize: 15, border: "1px solid rgba(255,255,255,0.15)" }}>👨‍👩‍💼 Parent Dashboard</button>
        </div>
        <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>💰 Why GurukulAI?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 12 }}>
            {[["Subject", "Private Tutor", "GurukulAI"], ["Maths", "₹3,000", "✅"], ["Science", "₹3,000", "✅"], ["English", "₹2,000", "✅"], ["Social", "₹2,000", "✅"], ["Hindi", "₹1,500", "✅"], ["TOTAL", "₹11,500/mo", "₹1,500/mo"]].map(([a, b, c], i) => (
              <>
                <div key={a} style={{ color: i === 0 || i === 6 ? C.gold : "rgba(255,255,255,0.6)", fontWeight: i === 0 || i === 6 ? 700 : 400, padding: "4px 0", borderTop: i === 6 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>{a}</div>
                <div style={{ color: i === 6 ? C.red : "rgba(255,255,255,0.4)", padding: "4px 0", borderTop: i === 6 ? "1px solid rgba(255,255,255,0.1)" : "none", textDecoration: i === 6 ? "line-through" : "none" }}>{b}</div>
                <div style={{ color: C.green, fontWeight: i === 6 ? 800 : 400, padding: "4px 0", borderTop: i === 6 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>{c}</div>
              </>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: C.gold, textAlign: "center" }}>You save ₹10,000 every month! 🎉</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>⚡ Powered by real Claude AI • 🗣️ ElevenLabs Indian voice • 📅 {dateStr}</div>
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
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 8 }}>Priya Sharma • Class {studentClass}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>🕐 {timeStr}</div>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.saffron}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>P</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={s.tabs}>
          {[["classroom", "🎓 Classroom"], ["timetable", "📅 Timetable"], ["exams", "🎯 Exams"], ["homework", "❓ Homework"]].map(([k, l]) => (
            <button key={k} style={s.tab(activeTab === k)} onClick={() => setActiveTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {activeTab === "classroom" && (
        <div style={{ padding: 14, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={s.statCard(C.saffron)}><div style={{ fontSize: 20, fontWeight: 800, color: C.saffron }}>{formatTime(sessionTime)}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Session</div></div>
            <div style={s.statCard(C.green)}><div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{focusScore}%</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Focus</div></div>
            <div style={s.statCard(C.gold)}><div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>🔥12</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Streak</div></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {Object.values(TEACHERS).map(t => (
              <button key={t.id} onClick={() => { setActiveTeacherId(t.id); setSessionActive(false); setSessionTime(0); setShowBoard(false); setTeacherState("sitting"); }}
                style={{ background: activeTeacherId === t.id ? t.color : "rgba(255,255,255,0.05)", border: `1px solid ${t.color}40`, borderRadius: 20, padding: "5px 14px", color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          <TeacherAvatar />
          <Whiteboard />
          {childMessage && (
            <div style={{ background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 14, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 20 }}>💬</div>
              <div>
                <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, marginBottom: 2 }}>Message from Papa/Mummy:</div>
                <div style={{ fontSize: 13 }}>{childMessage}</div>
              </div>
            </div>
          )}
          {sessionActive ? (
            <>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 16, minHeight: 180, maxHeight: 250, overflowY: "auto", marginBottom: 12 }}>
                {currentConvo.map((msg, i) => {
                  const t = msg.teacher ? TEACHERS[msg.teacher] : null;
                  return (
                    <div key={i} style={s.bubble(msg.role)}>
                      {msg.role === "assistant" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: t?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{t?.avatar}</div>}
                      <div style={s.bubbleBox(msg.role, t?.color)}>
                        {msg.role === "assistant" && <div style={{ fontSize: 9, color: t?.color, fontWeight: 700, marginBottom: 3 }}>{t?.name}</div>}
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: teacher.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{teacher.avatar}</div>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: teacher.color, animation: `pulse 1s ${i * 0.2}s infinite` }} />)}</div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <button onMouseDown={startListening} onMouseUp={stopListening} onTouchStart={startListening} onTouchEnd={stopListening} disabled={isLoading || isSpeaking}
                  style={{ width: 80, height: 80, borderRadius: "50%", background: isListening ? `linear-gradient(135deg, ${C.red}, #cc0000)` : isSpeaking ? `linear-gradient(135deg, ${C.green}, #009970)` : `linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`, border: "none", color: C.white, fontSize: 32, cursor: isLoading || isSpeaking ? "not-allowed" : "pointer", boxShadow: isListening ? `0 0 30px ${C.red}60` : `0 0 20px ${teacher.color}40`, transition: "all 0.3s", opacity: isLoading ? 0.5 : 1 }}>
                  {isListening ? "🔴" : isSpeaking ? "🔊" : "🎤"}
                </button>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                  {isListening ? "Listening... release when done" : isSpeaking ? "Teacher is speaking..." : isLoading ? "Processing..." : "Hold to speak to teacher"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={triggerDistraction} style={{ ...s.btn("rgba(255,71,87,0.15)"), flex: 1, border: "1px solid rgba(255,71,87,0.3)", color: C.red, fontSize: 11 }}>🎭 Demo: Simulate Distraction</button>
                <button onClick={() => triggerBoardSequence("x = (-b ± √(b²-4ac)) / 2a")} style={{ ...s.btn("rgba(255,107,0,0.15)"), flex: 1, border: "1px solid rgba(255,107,0,0.3)", color: C.saffron, fontSize: 11 }}>📋 Demo: Show Whiteboard</button>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.saffron, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>👁️ Parent watching live • Real AI • Speak naturally — no typing needed</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{teacher.avatar}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{teacher.name} is ready for you</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 300, margin: "0 auto 20px" }}>{teacher.greeting}</div>
              <button onClick={startSession} style={{ ...s.btn(`linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`), padding: "14px 40px", fontSize: 15 }}>▶ Start Class with {teacher.name}</button>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>🎤 Just speak — no typing needed ever</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "timetable" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>📅 Weekly Study Timetable</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Auto-built by AI teachers • Aligned with board exam dates</div>
          {TIMETABLE.map(({ day, sessions }) => (
            <div key={day} style={{ ...s.card(), marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: C.gold }}>{day}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {sessions.map(({ time, tid }) => {
                  const t = TEACHERS[tid];
                  return (
                    <div key={time + tid} style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: 10, padding: "6px 10px", fontSize: 11 }}>
                      <div style={{ color: t.color, fontWeight: 700 }}>{t.emoji} {t.subject}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{time} • {t.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ ...s.card("rgba(255,107,0,0.2)"), textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📸</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Upload School Exam Timetable</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Take a photo — AI reads it and rebuilds your schedule automatically</div>
          </div>
        </div>
      )}

      {activeTab === "exams" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>🎯 Board Exam Countdown</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>CBSE Class {studentClass} • Auto-synced with CBSE calendar</div>
          {EXAM_SCHEDULE.map(exam => {
            const sc = exam.status === "behind" ? C.red : exam.status === "warning" ? C.yellow : C.green;
            return (
              <div key={exam.subject} style={{ ...s.card(`${sc}25`), background: `${sc}06` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{exam.subject}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{exam.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 30, fontWeight: 900, color: sc, lineHeight: 1 }}>{exam.daysLeft}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>days left</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Readiness</span>
                  <span style={{ fontWeight: 700, color: sc }}>{exam.readiness}%</span>
                </div>
                <div style={s.progressOuter}><div style={s.progressInner(exam.readiness, sc)} /></div>
                <div style={{ fontSize: 11, color: sc, marginTop: 6 }}>{exam.status === "behind" ? "🔴 Needs urgent focus" : exam.status === "warning" ? "🟡 Monitor closely" : "🟢 On track"}</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "homework" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>❓ Homework Help</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Ask any school question — real AI solves it step by step, 24/7</div>
          <div style={s.card()}>
            <textarea value={homeworkInput} onChange={e => setHomeworkInput(e.target.value)} style={{ ...s.input, width: "100%", minHeight: 80, resize: "vertical", marginBottom: 10, boxSizing: "border-box" }} placeholder="Type any school question..." />
            <button onClick={solveHomework} disabled={homeworkLoading || !homeworkInput.trim()} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`, true), opacity: homeworkLoading || !homeworkInput.trim() ? 0.5 : 1 }}>
              {homeworkLoading ? "🤔 AI is solving..." : "✨ Solve This Question"}
            </button>
          </div>
          {homeworkLoading && <div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 28, height: 28, border: `3px solid ${C.saffron}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} /><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Solving...</div></div>}
          {homeworkAnswer && <div style={{ ...s.card(`${C.green}30`), background: `${C.green}06` }}><div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 8 }}>✅ AI Teacher Answer</div><div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.85)" }}>{homeworkAnswer}</div></div>}
          <div style={{ ...s.card(), marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>📸 Photo Upload</div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Photograph homework question<br />AI reads and solves automatically</div>
            </div>
          </div>
        </div>
      )}

      {(distractionAlert || distractionLoading) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.navyL}, ${C.navy})`, border: `2px solid ${teacher.color}`, borderRadius: 24, padding: 28, maxWidth: 380, width: "100%", textAlign: "center" }}>
            {distractionLoading ? (
              <><div style={{ width: 44, height: 44, border: `3px solid ${teacher.color}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} /><div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{teacher.name} noticed you're distracted...</div></>
            ) : (
              <><div style={{ fontSize: 52, marginBottom: 8 }}>{teacher.avatar}</div><div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10, color: teacher.color }}>{teacher.name} says:</div><div style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>"{distractionAlert}"</div><div style={{ display: "flex", gap: 8 }}><button onClick={dismissDistraction} style={{ ...s.btn(`linear-gradient(135deg, ${teacher.color}, ${teacher.color}cc)`, true) }}>I'm here! Let's go 💪</button><button style={{ ...s.btn("rgba(255,255,255,0.08)"), flex: "0 0 auto", border: "1px solid rgba(255,255,255,0.1)" }}>5 min break</button></div></>
            )}
          </div>
        </div>
      )}
      {parentAlert && !distractionAlert && !distractionLoading && (
        <div style={{ position: "fixed", top: 70, right: 12, background: `linear-gradient(135deg, ${C.red}, #cc0000)`, borderRadius: 14, padding: "12px 16px", maxWidth: 280, zIndex: 999, boxShadow: "0 8px 28px rgba(255,71,87,0.4)" }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>🚨 Parent Notified</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>Your parent can see your screen live right now.</div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (view === "parent") return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>←</button>
          <div style={s.logo}>GurukulAI</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 8 }}>Parent Dashboard • Sharma Family</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📅 {dateStr} • {timeStr}</div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={s.tabs}>
          {[["live", "👁️ Live Monitor"], ["reports", "📊 Reports"], ["meetings", "👨‍👩‍💼 Meeting"], ["calendar", "📅 Calendar"]].map(([k, l]) => (
            <button key={k} style={s.tab(parentTab === k)} onClick={() => setParentTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {parentTab === "live" && (
        <div style={{ padding: 14, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ ...s.card(`${C.green}30`), background: `${C.green}06` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
                  <span style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>PRIYA IS IN CLASS RIGHT NOW</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>📐 Maths with Rajesh Sir • Chapter 4: Quadratic Equations</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>94%</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Focus Score</div>
              </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 12, padding: 14, position: "relative", marginBottom: 12 }}>
              <div style={{ position: "absolute", top: 8, right: 8, background: C.red, borderRadius: 5, padding: "2px 7px", fontSize: 9, fontWeight: 700 }}>● LIVE</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Child's screen — refreshes every 10 seconds</div>
              <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: C.saffron, fontWeight: 700, marginBottom: 4 }}>👨‍🏫 Rajesh Sir (Real AI):</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>"Bilkul sahi Priya! Ab batao — agar discriminant zero ho toh roots kya honge? Think carefully beta..."</div>
              </div>
              <div style={{ background: "#f5f0e8", border: "2px solid #8B7355", borderRadius: 6, padding: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: "#8B7355", marginBottom: 4 }}>📋 WHITEBOARD</div>
                <div style={{ fontFamily: "monospace", fontSize: 14, color: "#1a1a2e", fontWeight: 700 }}>x = (-b ± √(b²-4ac)) / 2a</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                <span>⏱ 34 mins</span><span>• 12 questions</span><span style={{ color: C.green }}>• 0 exit attempts ✅</span>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Remote Controls — from anywhere in the world:</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[["🔒 Lock Session", C.red], ["⏸ Allow Break", C.yellow], ["🔔 Check In", C.teal], ["▶ Start Session", C.green]].map(([l, c]) => (
                  <button key={l} style={{ background: `${c}12`, border: `1px solid ${c}25`, borderRadius: 9, padding: "7px 12px", color: C.white, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>💬 Send message to Priya:</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={s.input} value={parentMessage} onChange={e => setParentMessage(e.target.value)} placeholder="e.g. Beta focus karo — main dekh raha hoon! 💪" onKeyDown={e => e.key === "Enter" && sendParentMessage()} />
                <button onClick={sendParentMessage} style={s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`)}>Send</button>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Message appears on Priya's screen instantly</div>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📊 Subject Performance</div>
          {[["Maths", "📐", C.saffron, 78, 4], ["Science", "🔬", C.green, 74, 8], ["English", "📖", C.purple, 87, 0], ["Social Science", "🌍", C.teal, 61, -3], ["Hindi", "🔤", C.gold, 69, 2]].map(([sub, emoji, tc, score, change]) => {
            const sc = score >= 80 ? C.green : score >= 65 ? C.saffron : C.red;
            return (
              <div key={sub} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${tc}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{sub}</span>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: sc }}>{score}%</span>
                      <span style={{ fontSize: 10, color: change > 0 ? C.green : change < 0 ? C.red : "rgba(255,255,255,0.3)" }}>{change > 0 ? `↑${change}%` : change < 0 ? `↓${Math.abs(change)}%` : "→"}</span>
                    </div>
                  </div>
                  <div style={s.progressOuter}><div style={s.progressInner(score, sc)} /></div>
                </div>
              </div>
            );
          })}
          <div style={{ ...s.card(`${C.red}30`), background: `${C.red}06` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>🚨 Guardian Alert System</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Instant notification if Priya gets distracted or tries to exit</div></div>
              <div style={{ background: C.green, borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>✓ ACTIVE</div>
            </div>
          </div>
        </div>
      )}

      {parentTab === "reports" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>📊 Daily Report</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Sent to your email every night at 9:00 PM • {dateStr}</div>
          <div style={{ ...s.card(`${C.green}30`), background: `${C.green}06`, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>✅ Today's Proof of Learning</div>
            {[["⏱️", "Total study time", "1 hr 41 mins"], ["🎯", "Focus score", "91% (Excellent)"], ["🚫", "Exit attempts", "0"], ["🔥", "Study streak", "12 days in a row"], ["❓", "School questions solved", "2"]].map(([emoji, label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{emoji} {label}</span>
                <span style={{ fontWeight: 700, color: C.green }}>{value}</span>
              </div>
            ))}
          </div>
          {[{ subject: "Maths", emoji: "📐", color: C.saffron, duration: "54 mins", correct: "14/18", focus: 94 }, { subject: "Science", emoji: "🔬", color: C.green, duration: "47 mins", correct: "9/12", focus: 88 }].map(session => (
            <div key={session.subject} style={s.card()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>{session.emoji} {session.subject}</div></div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.saffron }}>{session.duration}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["Correct", session.correct, C.green], ["Focus", `${session.focus}%`, C.saffron]].map(([l, v, c]) => (
                  <div key={l} style={{ ...s.statCard(c), flex: 1 }}><div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l}</div></div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ ...s.card(`${C.gold}30`), background: `${C.gold}06` }}>
            <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, marginBottom: 8 }}>❓ School Questions Solved Today</div>
            {["Why does ice float on water?", "Difference between speed and velocity"].map((q, i) => (
              <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${C.saffron}` }}>✅ {q}</div>
            ))}
          </div>
          <div style={{ ...s.card(`${C.purple}30`), background: `${C.purple}06` }}>
            <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 6 }}>💬 Rajesh Sir's Note</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontStyle: "italic" }}>"Priya was exceptional today. She finally understood the discriminant concept — I could see the moment it clicked! She is ready for tomorrow's practice test. Main bahut proud hoon. 🌟"</div>
          </div>
        </div>
      )}

      {parentTab === "meetings" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>👨‍👩‍💼 Weekly Parent-Teacher Meeting</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Every Sunday 7:00 PM • All 5 AI teachers report together</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[["👨‍🏫", C.saffron, "Rajesh Sir", "Maths"], ["👩‍🔬", C.green, "Ananya Didi", "Science"], ["👩‍💼", C.purple, "Meera Ma'am", "English"], ["👨‍💼", C.teal, "Vikram Sir", "Social"], ["👩‍🎓", C.gold, "Sunita Didi", "Hindi"]].map(([emoji, color, name, subject]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${color}25`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 4px" }}>{emoji}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{name.split(" ")[0]}</div>
                <div style={{ fontSize: 8, color }}>{subject}</div>
              </div>
            ))}
          </div>
          <button onClick={generateMeeting} disabled={meetingLoading} style={{ ...s.btn(`linear-gradient(135deg, ${C.saffron}, #FF8C3A)`, true), marginBottom: 14, opacity: meetingLoading ? 0.6 : 1 }}>
            {meetingLoading ? "🤔 All 5 teachers preparing report..." : "▶ Generate This Week's Meeting Report (Real AI)"}
          </button>
          {meetingLoading && <div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 32, height: 32, border: `3px solid ${C.saffron}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} /><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Generating real AI report...</div></div>}
          {meetingReport && <div style={s.card(`${C.saffron}30`)}><div style={{ fontSize: 11, color: C.saffron, fontWeight: 700, marginBottom: 10 }}>📋 Real AI Meeting Report</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{meetingReport}</div></div>}
          {!meetingReport && !meetingLoading && <div style={{ textAlign: "center", padding: 32, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.08)" }}><div style={{ fontSize: 44, marginBottom: 8 }}>👨‍👩‍💼</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Teaching Team Ready</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Press button above to generate real AI report from all 5 teachers</div></div>}
        </div>
      )}

      {parentTab === "calendar" && (
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>📅 Exam Calendar</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Auto-synced with CBSE official calendar • Live countdown</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["📅 Google Calendar", "🍎 Apple Calendar"].map(l => <button key={l} style={{ ...s.btn("rgba(255,255,255,0.07)"), flex: 1, border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}>{l}</button>)}
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: C.red }}>🎯 CBSE Board Exams 2026</div>
          {EXAM_SCHEDULE.map(exam => {
            const sc = exam.status === "behind" ? C.red : exam.status === "warning" ? C.yellow : C.green;
            return (
              <div key={exam.subject} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${sc}12`, border: `1px solid ${sc}25`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: sc, fontWeight: 700 }}>{exam.date.split(" ")[0].toUpperCase()}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: sc, lineHeight: 1.1 }}>{exam.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{exam.subject}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{exam.daysLeft} days away • Readiness: <span style={{ color: sc, fontWeight: 700 }}>{exam.readiness}%</span></div>
                  <div style={s.progressOuter}><div style={s.progressInner(exam.readiness, sc)} /></div>
                </div>
                <div style={{ fontSize: 10, background: `${sc}12`, border: `1px solid ${sc}25`, borderRadius: 8, padding: "4px 8px", color: sc }}>{exam.status === "behind" ? "⚠️ Behind" : exam.status === "warning" ? "⚡ Watch" : "✅ On Track"}</div>
              </div>
            );
          })}
          <div style={{ marginTop: 16, ...s.card() }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🔔 Notification Schedule</div>
            {[["10 weeks before each exam", true], ["4 weeks — Final push alert", true], ["1 week — Readiness report", true], ["Night before — Support reminder", true], ["Exam morning — Checklist", true], ["Post exam — Result check-in", true]].map(([l, on]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{l}</span>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? C.green : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: on ? 18 : 2, transition: "left 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return null;
}
