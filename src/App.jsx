import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/mdavlaek";

const questions = [
  {
    id: "name_role",
    section: "01 — You",
    question: "What's your name, and what do you do?",
    type: "textarea",
    placeholder: "e.g. Jordan — I run a small skincare brand and consult on the side.",
    rows: 2,
  },
  {
    id: "life_now",
    section: "01 — You",
    question: "In one sentence, how would you describe your life right now?",
    type: "textarea",
    placeholder: "Be honest. There's no wrong answer here.",
    rows: 2,
  },
  {
    id: "biggest_chaos",
    section: "02 — What's Not Working",
    question: "What's the one area of your life that feels the most disorganized or overwhelming?",
    type: "textarea",
    placeholder: "Work, finances, health, time — whatever comes to mind first.",
    rows: 3,
  },
  {
    id: "keep_meaning",
    section: "02 — What's Not Working",
    question: "What do you keep meaning to track or stay on top of — but never do?",
    type: "textarea",
    placeholder: "The thing that lives on your mental list but never gets done.",
    rows: 3,
  },
  {
    id: "tried_before",
    section: "02 — What's Not Working",
    question: "Have you tried any apps, planners, or systems before? What happened?",
    type: "textarea",
    placeholder: "e.g. I tried Notion but it was too complicated.",
    rows: 3,
  },
  {
    id: "ideal_day",
    section: "03 — What You Want",
    question: "If everything in your life had a place and a system, what would feel different about your day?",
    type: "textarea",
    placeholder: "How would mornings feel? How would you make decisions?",
    rows: 3,
  },
  {
    id: "what_matters",
    section: "03 — What You Want",
    question: "What matters most to you right now?",
    type: "multiselect",
    options: ["Work & Business", "Health & Wellness", "Finances", "Daily Habits", "Relationships", "Something else"],
  },
  {
    id: "devices",
    section: "04 — How You Operate",
    question: "Are you mostly on your phone, computer, or both?",
    type: "select",
    options: ["Mostly my phone", "Mostly my computer", "Both equally"],
  },
  {
    id: "tech_comfort",
    section: "04 — How You Operate",
    question: "How comfortable are you with technology?",
    type: "scale",
    low: "I keep it simple",
    high: "I love figuring things out",
  },
  {
    id: "timeline",
    section: "05 — Logistics",
    question: "What's your timeline?",
    type: "select",
    options: ["Ready to start now", "Within the next month", "Still exploring"],
  },
  {
    id: "budget",
    section: "05 — Logistics",
    question: "Do you have a budget in mind?",
    type: "select",
    options: ["Under $500", "$500 – $750", "$750 – $1,000", "$1,000+", "Not sure yet"],
  },
  {
    id: "referral",
    section: "05 — Logistics",
    question: "How did you hear about BritAlly?",
    type: "text",
    placeholder: "Instagram, a friend, Threads...",
  },
];

export default function BritAllyIntake() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const isLast = current === questions.length - 1;
  const answer = answers[q.id];

  const canAdvance = () => {
    if (answer === undefined || answer === null) return false;
    if (typeof answer === "string") return answer.trim().length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === "number") return true;
    return false;
  };

  const handleText = (val) => setAnswers({ ...answers, [q.id]: val });
  const handleSelect = (val) => setAnswers({ ...answers, [q.id]: val });
  const handleMulti = (val) => {
    const arr = answers[q.id] || [];
    setAnswers({ ...answers, [q.id]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] });
  };
  const handleScale = (val) => setAnswers({ ...answers, [q.id]: val });

  const submitForm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = {};
      questions.forEach(q => {
        const a = answers[q.id];
        formData[q.question] = Array.isArray(a) ? a.join(", ") : (a?.toString() || "");
      });
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const next = () => {
    if (!canAdvance()) return;
    if (isLast) submitForm();
    else setCurrent(current + 1);
  };

  const back = () => { if (current > 0) setCurrent(current - 1); };

  const handleKey = (e) => {
    if (e.key === "Enter" && q.type !== "textarea") next();
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.topBar}>
          <span style={s.brandMark}>BritAlly</span>
        </div>
        <div style={s.progressTrack}><div style={{ ...s.progressFill, width: "100%" }} /></div>
        <div style={s.confirmWrap}>
          <div style={s.confirmMark}>—</div>
          <h2 style={s.confirmTitle}>Received.</h2>
          <p style={s.confirmText}>
            Thank you for taking the time to share. BritAlly will be in touch within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page} onKeyDown={handleKey} tabIndex={-1}>
      <div style={s.topBar}>
        <span style={s.brandMark}>BritAlly</span>
        <span style={s.stepCount}>{String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
      </div>

      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${progress}%` }} />
      </div>

      <div style={s.content}>
        <div style={s.sectionTag}>{q.section}</div>
        <h2 style={s.questionText}>{q.question}</h2>

        <div style={s.fieldWrap}>
          {q.type === "textarea" && (
            <textarea autoFocus rows={q.rows || 3} placeholder={q.placeholder}
              value={answer || ""} onChange={e => handleText(e.target.value)} style={s.textarea}/>
          )}
          {q.type === "text" && (
            <input autoFocus type="text" placeholder={q.placeholder}
              value={answer || ""} onChange={e => handleText(e.target.value)} style={s.textInput}/>
          )}
          {q.type === "select" && (
            <div style={s.choiceList}>
              {q.options.map(opt => (
                <button key={opt} onClick={() => handleSelect(opt)}
                  style={{ ...s.choiceBtn, ...(answer === opt ? s.choiceActive : {}) }}>
                  <span style={s.choiceDot}>{answer === opt ? "●" : "○"}</span>{opt}
                </button>
              ))}
            </div>
          )}
          {q.type === "multiselect" && (
            <div style={s.choiceList}>
              {q.options.map(opt => {
                const selected = (answers[q.id] || []).includes(opt);
                return (
                  <button key={opt} onClick={() => handleMulti(opt)}
                    style={{ ...s.choiceBtn, ...(selected ? s.choiceActive : {}) }}>
                    <span style={s.choiceDot}>{selected ? "●" : "○"}</span>{opt}
                  </button>
                );
              })}
            </div>
          )}
          {q.type === "scale" && (
            <div style={s.scaleWrap}>
              <div style={s.scaleRow}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => handleScale(n)}
                    style={{ ...s.scaleNum, ...(answer === n ? s.scaleActive : {}) }}>{n}</button>
                ))}
              </div>
              <div style={s.scaleLabels}>
                <span style={s.scaleLbl}>{q.low}</span>
                <span style={s.scaleLbl}>{q.high}</span>
              </div>
            </div>
          )}
        </div>

        {error && <p style={{color:"#c01010",fontSize:13,marginBottom:12,fontFamily:"'Helvetica Neue',sans-serif"}}>{error}</p>}

        <div style={s.navRow}>
          <button onClick={back} style={{ ...s.backBtn, visibility: current === 0 ? "hidden" : "visible" }}>Back</button>
          <button onClick={next} disabled={!canAdvance() || submitting}
            style={{ ...s.nextBtn, ...(!canAdvance() || submitting ? s.nextDisabled : {}) }}>
            {submitting ? "Sending..." : isLast ? "Submit" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

const IVORY = "#F7F5F2";
const INK = "#1A1A1A";
const MID = "#888880";
const LIGHT = "#DDDBD7";

const s = {
  page: { minHeight:"100vh", background:IVORY, display:"flex", flexDirection:"column", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", color:INK },
  topBar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"28px 48px", borderBottom:`1px solid ${LIGHT}` },
  brandMark: { fontSize:"12px", letterSpacing:"0.18em", textTransform:"uppercase", color:INK, fontWeight:"500" },
  stepCount: { fontSize:"11px", letterSpacing:"0.12em", color:MID },
  progressTrack: { height:"1px", background:LIGHT, width:"100%" },
  progressFill: { height:"1px", background:INK, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)" },
  content: { flex:1, display:"flex", flexDirection:"column", maxWidth:"560px", width:"100%", margin:"0 auto", padding:"72px 24px 48px", boxSizing:"border-box" },
  sectionTag: { fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:MID, marginBottom:"20px" },
  questionText: { fontSize:"26px", fontWeight:"300", lineHeight:"1.5", color:INK, margin:"0 0 40px 0", letterSpacing:"-0.01em" },
  fieldWrap: { flex:1, marginBottom:"48px" },
  textarea: { width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${LIGHT}`, color:INK, fontSize:"16px", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight:"300", lineHeight:"1.8", padding:"4px 0 12px", resize:"none", outline:"none", boxSizing:"border-box", caretColor:INK, transition:"border-color 0.2s" },
  textInput: { width:"100%", background:"transparent", border:"none", borderBottom:`1px solid ${LIGHT}`, color:INK, fontSize:"16px", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight:"300", padding:"4px 0 12px", outline:"none", boxSizing:"border-box", caretColor:INK },
  choiceList: { display:"flex", flexDirection:"column", gap:"2px" },
  choiceBtn: { display:"flex", alignItems:"center", gap:"14px", background:"transparent", border:"none", borderBottom:`1px solid ${LIGHT}`, color:MID, fontSize:"15px", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight:"300", padding:"16px 4px", cursor:"pointer", textAlign:"left", transition:"color 0.15s", letterSpacing:"0.01em" },
  choiceActive: { color:INK, borderBottomColor:INK },
  choiceDot: { fontSize:"10px", color:"inherit", minWidth:"12px" },
  scaleWrap: { display:"flex", flexDirection:"column", gap:"16px" },
  scaleRow: { display:"flex", gap:"8px" },
  scaleNum: { width:"52px", height:"52px", background:"transparent", border:`1px solid ${LIGHT}`, color:MID, fontSize:"15px", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight:"300", cursor:"pointer", transition:"all 0.15s", borderRadius:"0" },
  scaleActive: { background:INK, borderColor:INK, color:IVORY },
  scaleLabels: { display:"flex", justifyContent:"space-between" },
  scaleLbl: { fontSize:"10px", color:MID, letterSpacing:"0.08em" },
  navRow: { display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${LIGHT}`, paddingTop:"28px" },
  backBtn: { background:"transparent", border:"none", color:MID, fontSize:"12px", letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", padding:"0", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif" },
  nextBtn: { background:INK, border:"none", color:IVORY, fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", padding:"14px 32px", cursor:"pointer", fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight:"400", transition:"opacity 0.2s" },
  nextDisabled: { opacity:0.2, cursor:"default" },
  confirmWrap: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px", textAlign:"center" },
  confirmMark: { fontSize:"24px", color:MID, marginBottom:"32px", letterSpacing:"0.3em" },
  confirmTitle: { fontSize:"32px", fontWeight:"300", color:INK, margin:"0 0 20px 0", letterSpacing:"-0.02em" },
  confirmText: { fontSize:"15px", color:MID, lineHeight:"1.8", fontWeight:"300", maxWidth:"360px" },
};