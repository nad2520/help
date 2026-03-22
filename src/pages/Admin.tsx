import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, BookOpen, MessageSquare, Shield, Lock,
  Coins, Settings, LogOut, Search, Edit2, Trash2, Eye, ChevronDown,
  ChevronUp, Plus, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle,
  XCircle, Star, TrendingUp, Zap, Crown, Bell, Filter, MoreHorizontal,
  BookMarked, Award, Flame, RefreshCw, Save, X, Check, Info, Sparkles,
  EyeOff, Tag, ArrowUp, ArrowDown, BarChart2, Clock, UserCheck,
  PieChart as LucidePieChart, BarChart as LucideBarChart
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type Role = "Admin" | "User +18" | "User -18";
type BookAudience = "All" | "+18 Only";
type PostStatus = "Clean" | "Flagged by Lumo" | "Pending Admin Review" | "Reviewed";
type PostTag = "discussion" | "review" | "theory" | "spoiler";
type DetectionType = "Spoiler" | "Spam" | "Offensive" | "Age-Sensitive";
type Severity = "Low" | "Medium" | "High";
type ModerationStatus = "Pending" | "Approved" | "Rejected";

interface User { id: number; username: string; email: string; role: Role; level: number; coins: number; avatar: string; joinDate: string; }
interface Book { id: number; title: string; author: string; genre: string; cover: string; coinCost: number; xpReward: number; coinReward: number; audience: BookAudience; trending: boolean; description: string; }
interface Post { id: number; title: string; author: string; book: string; tag: PostTag; upvotes: number; comments: number; status: PostStatus; }
interface ModerationFlag { id: number; preview: string; author: string; book: string; type: DetectionType; severity: Severity; suggested: string; status: ModerationStatus; }

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  { id: 1, username: "ArcaneLord", email: "arcane@lexora.io", role: "Admin", level: 99, coins: 12500, avatar: "AL", joinDate: "2023-01-15" },
  { id: 2, username: "ShadowReader", email: "shadow@mail.com", role: "User +18", level: 34, coins: 4320, avatar: "SR", joinDate: "2023-05-22" },
  { id: 3, username: "LittleScribe", email: "scribe@mail.com", role: "User -18", level: 7, coins: 880, avatar: "LS", joinDate: "2024-01-03" },
  { id: 4, username: "VelvetPages", email: "velvet@mail.com", role: "User +18", level: 52, coins: 7100, avatar: "VP", joinDate: "2023-03-11" },
  { id: 5, username: "MoonlitTales", email: "moonlit@mail.com", role: "User -18", level: 12, coins: 1200, avatar: "MT", joinDate: "2024-02-18" },
  { id: 6, username: "GoldenQuill", email: "quill@mail.com", role: "User +18", level: 28, coins: 3400, avatar: "GQ", joinDate: "2023-07-30" },
  { id: 7, username: "CrimsonInk", email: "crimson@mail.com", role: "User +18", level: 61, coins: 9800, avatar: "CI", joinDate: "2023-02-05" },
  { id: 8, username: "YoungSage", email: "sage@mail.com", role: "User -18", level: 5, coins: 450, avatar: "YS", joinDate: "2024-03-01" },
];

const MOCK_BOOKS: Book[] = [
  { id: 1, title: "Throne of Midnight", author: "E. Blackwood", genre: "Fantasy", cover: "🏰", coinCost: 150, xpReward: 200, coinReward: 50, audience: "All", trending: true, description: "An epic tale of power and darkness." },
  { id: 2, title: "Crimson Desires", author: "V. Morel", genre: "Romance", cover: "🌹", coinCost: 200, xpReward: 180, coinReward: 60, audience: "+18 Only", trending: false, description: "A passionate romance for mature readers." },
  { id: 3, title: "The Whispering Stars", author: "A. Celeste", genre: "Sci-Fi", cover: "⭐", coinCost: 120, xpReward: 160, coinReward: 40, audience: "All", trending: true, description: "Explore the cosmos through young eyes." },
  { id: 4, title: "Blood & Gold", author: "M. Thorne", genre: "Historical", cover: "⚔️", coinCost: 180, xpReward: 220, coinReward: 70, audience: "+18 Only", trending: false, description: "War, betrayal, and gold in ancient times." },
  { id: 5, title: "Dragon's Lullaby", author: "S. Ember", genre: "Fantasy", cover: "🐉", coinCost: 100, xpReward: 140, coinReward: 35, audience: "All", trending: true, description: "A young dragon finds her destiny." },
  { id: 6, title: "Neon Labyrinth", author: "K. Raven", genre: "Thriller", cover: "🔮", coinCost: 160, xpReward: 190, coinReward: 55, audience: "All", trending: false, description: "A cyberpunk mystery unfolds in neon rain." },
];

const MOCK_POSTS: Post[] = [
  { id: 1, title: "The ending of Throne of Midnight was...", author: "ShadowReader", book: "Throne of Midnight", tag: "spoiler", upvotes: 143, comments: 28, status: "Flagged by Lumo" },
  { id: 2, title: "Best fantasy reads of the decade?", author: "VelvetPages", book: "General", tag: "discussion", upvotes: 89, comments: 42, status: "Clean" },
  { id: 3, title: "Dragon's Lullaby - my full review", author: "MoonlitTales", book: "Dragon's Lullaby", tag: "review", upvotes: 56, comments: 14, status: "Clean" },
  { id: 4, title: "Is the Neon Labyrinth protagonist actually...", author: "CrimsonInk", book: "Neon Labyrinth", tag: "theory", upvotes: 210, comments: 67, status: "Pending Admin Review" },
  { id: 5, title: "BUY COINS CHEAP HERE!!! LIMITED TIME", author: "SpamUser99", book: "General", tag: "discussion", upvotes: 0, comments: 2, status: "Flagged by Lumo" },
  { id: 6, title: "Crimson Desires: Chapter 7 analysis", author: "GoldenQuill", book: "Crimson Desires", tag: "review", upvotes: 34, comments: 8, status: "Reviewed" },
];

const MOCK_FLAGS: ModerationFlag[] = [
  { id: 1, preview: "The ending when she dies was so...", author: "ShadowReader", book: "Throne of Midnight", type: "Spoiler", severity: "High", suggested: "Mark as Spoiler", status: "Pending" },
  { id: 2, preview: "BUY CHEAP COINS AT coinshop.xyz!!!!", author: "SpamUser99", book: "General", type: "Spam", severity: "High", suggested: "Hide Post", status: "Pending" },
  { id: 3, preview: "This content is clearly inappropriate and...", author: "DarkMage", book: "Crimson Desires", type: "Offensive", severity: "Medium", suggested: "Warn User", status: "Approved" },
  { id: 4, preview: "The scene in chapter 7 was extremely...", author: "GoldenQuill", book: "Crimson Desires", type: "Age-Sensitive", severity: "Medium", suggested: "Escalate to Admin Review", status: "Pending" },
  { id: 5, preview: "I know who the killer is in chapter...", author: "VelvetPages", book: "Neon Labyrinth", type: "Spoiler", severity: "Low", suggested: "Mark as Spoiler", status: "Rejected" },
  { id: 6, preview: "Stop posting the same thing over and over...", author: "CrimsonInk", book: "General", type: "Spam", severity: "Low", suggested: "Warn User", status: "Approved" },
];

const GROWTH_DATA = [
  { name: "Jan", users: 4000, books: 240 }, { name: "Feb", users: 4500, books: 270 },
  { name: "Mar", users: 5200, books: 290 }, { name: "Apr", users: 5800, books: 320 },
  { name: "May", users: 6500, books: 342 }, { name: "Jun", users: 8241, books: 342 },
];

const ECONOMY_DATA = [
  { day: "01", earned: 4500, spent: 3200 }, { day: "05", earned: 5200, spent: 3800 },
  { day: "10", earned: 4800, spent: 4100 }, { day: "15", earned: 6100, spent: 4500 },
  { day: "20", earned: 5500, spent: 4900 }, { day: "25", earned: 7200, spent: 5200 },
  { day: "30", earned: 6800, spent: 5800 },
];

const GENRE_ENGAGEMENT = [
  { name: "Fantasy", value: 38 }, { name: "Sci-Fi", value: 24 },
  { name: "Romance", value: 18 }, { name: "Thriller", value: 12 },
  { name: "Historical", value: 8 },
];

const SPARKLINE_DATA = [
  { v: 30 }, { v: 45 }, { v: 40 }, { v: 65 }, { v: 50 }, { v: 80 }, { v: 75 },
];

const FLAG_DISTRIBUTION = [
  { name: "Spam", value: 45, color: "#EF4444" },
  { name: "Spoiler", value: 30, color: "#D4AF37" },
  { name: "Offensive", value: 15, color: "#6B1A2A" },
  { name: "Other", value: 10, color: "#A855F7" },
];

const MOCK_ALERTS = [
  { id: 1, icon: <MessageSquare size={14} />, title: "Community Review", text: "5 posts awaiting admin review", time: "2m ago", color: "text-blue-400" },
  { id: 2, icon: <BookOpen size={14} />, title: "Unclassified Books", text: "3 uploads need age verification", time: "15m ago", color: "text-yellow-400" },
  { id: 3, icon: <Coins size={14} />, title: "Economy Update", text: "Reward settings modified", time: "2h ago", color: "text-green-400" },
  { id: 4, icon: <Shield size={14} />, title: "Lumo Detection", text: "7 new flags since midnight", time: "4h ago", color: "text-purple-400" },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────

const C = {
  gold: "#D4AF37",
  goldLight: "#F5E27A",
  goldDim: "#8B7322",
  cream: "#F5EDD6",
  creamDark: "#EAD9B5",
  burgundy: "#6B1A2A",
  burgundyLight: "#8B2439",
  mahogany: "#3D1F0F",
  mahoganyLight: "#5C3019",
  bg: "#1A0D06",
  card: "#261508",
  cardHover: "#2E1A0A",
  border: "#4A2A10",
  borderGold: "#6B4E1A",
  text: "#F5EDD6",
  textMuted: "#A08060",
  textDim: "#7A6040",
};

// ─── SHARED SMALL COMPONENTS ──────────────────────────────────────────────────

const Badge = ({ children, color = "gold" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    gold: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
    green: "bg-green-900/40 text-green-300 border-green-700/50",
    red: "bg-red-900/40 text-red-300 border-red-700/50",
    blue: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    purple: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    orange: "bg-orange-900/40 text-orange-300 border-orange-700/50",
    gray: "bg-gray-800/40 text-gray-400 border-gray-600/50",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[color] || colors.gold}`}>
      {children}
    </span>
  );
};

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) => (
  <button onClick={onChange} className="flex items-center gap-2 group">
    <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? "bg-yellow-600" : "bg-gray-700"}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
    {label && <span className="text-sm" style={{ color: checked ? C.gold : C.textMuted }}>{label}</span>}
  </button>
);

const StatCard = ({ icon, label, value, sub, color = "gold", sparkline = false }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string; sparkline?: boolean }) => {
  const glows: Record<string, string> = {
    gold: "shadow-yellow-900/30", green: "shadow-green-900/30", red: "shadow-red-900/30", blue: "shadow-blue-900/30",
  };
  const borders: Record<string, string> = {
    gold: "border-yellow-700/30", green: "border-green-700/30", red: "border-red-700/30", blue: "border-blue-700/30",
  };
  const colors: Record<string, string> = {
    gold: "#D4AF37", green: "#22C55E", red: "#EF4444", blue: "#A855F7"
  };

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-4 shadow-lg ${glows[color] || glows.gold} ${borders[color] || borders.gold} transition-all duration-300 hover:scale-[1.02]`}
      style={{ background: "linear-gradient(135deg, #261508 0%, #1F1005 100%)" }}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl`} style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: C.textMuted }}>{label}</p>
          <p className="text-2xl font-bold mt-0.5" style={{ color: C.gold }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: C.textDim }}>{sub}</p>}
        </div>
      </div>
      {sparkline && (
        <div className="h-10 w-full mt-2 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SPARKLINE_DATA}>
              <Line type="monotone" dataKey="v" stroke={colors[color] || colors.gold} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      {icon && <div style={{ color: C.gold }}>{icon}</div>}
      <h2 className="text-xl font-bold tracking-wide" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>{title}</h2>
    </div>
    {subtitle && <p className="text-sm ml-9" style={{ color: C.textMuted }}>{subtitle}</p>}
    <div className="mt-3 h-px" style={{ background: `linear-gradient(90deg, ${C.goldDim}, transparent)` }} />
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border p-6 ${className}`}
    style={{ background: "linear-gradient(135deg, #261508 0%, #1F1005 100%)", borderColor: C.border }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "ghost"; className?: string; disabled?: boolean;
}) => {
  const variants = {
    primary: "bg-yellow-700 hover:bg-yellow-600 text-yellow-100 border-yellow-600",
    secondary: "bg-transparent hover:bg-white/5 border-yellow-700/50 text-yellow-400",
    danger: "bg-red-900/60 hover:bg-red-800/60 text-red-300 border-red-700/50",
    ghost: "bg-transparent hover:bg-white/5 border-transparent text-gray-400 hover:text-yellow-400",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${variants[variant]} ${className} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={`bg-black/30 border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-1 focus:ring-yellow-700 ${className}`}
    style={{ borderColor: C.border, color: C.cream }} />
);

const Select = ({ value, onChange, options, className = "" }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[]; className?: string }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className={`bg-black/30 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-700 ${className}`}
    style={{ borderColor: C.border, color: C.cream, background: C.card }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ─── ROLE & STATUS BADGE HELPERS ──────────────────────────────────────────────

const roleBadge = (role: Role) => {
  if (role === "Admin") return <Badge color="gold"><Crown size={10} className="mr-1" />{role}</Badge>;
  if (role === "User +18") return <Badge color="purple">{role}</Badge>;
  return <Badge color="green">{role}</Badge>;
};

const audienceBadge = (a: BookAudience) => a === "+18 Only"
  ? <Badge color="red">🔞 +18 Only</Badge>
  : <Badge color="green">👁 All Ages</Badge>;

const postStatusBadge = (s: PostStatus) => {
  const map: Record<PostStatus, [string, string]> = {
    "Clean": ["green", "✓ Clean"],
    "Flagged by Lumo": ["red", "⚡ Flagged"],
    "Pending Admin Review": ["orange", "⏳ Pending"],
    "Reviewed": ["blue", "✔ Reviewed"],
  };
  const [c, l] = map[s];
  return <Badge color={c}>{l}</Badge>;
};

const severityBadge = (s: Severity) => {
  const map: Record<Severity, string> = { Low: "blue", Medium: "orange", High: "red" };
  return <Badge color={map[s]}>{s}</Badge>;
};

const modStatusBadge = (s: ModerationStatus) => {
  const map: Record<ModerationStatus, string> = { Pending: "orange", Approved: "green", Rejected: "red" };
  return <Badge color={map[s]}>{s}</Badge>;
};

const detectionBadge = (t: DetectionType) => {
  const map: Record<DetectionType, string> = { Spoiler: "blue", Spam: "orange", Offensive: "red", "Age-Sensitive": "purple" };
  return <Badge color={map[t]}>{t}</Badge>;
};

const tagBadge = (t: PostTag) => {
  const map: Record<PostTag, string> = { discussion: "blue", review: "green", theory: "purple", spoiler: "red" };
  return <Badge color={map[t]}>{t}</Badge>;
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────

const Avatar = ({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" }) => (
  <div className={`flex items-center justify-center rounded-full font-bold uppercase ${size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"}`}
    style={{ background: "linear-gradient(135deg, #6B1A2A, #D4AF37)", color: C.cream }}>
    {initials}
  </div>
);

// ─── EDIT USER MODAL ──────────────────────────────────────────────────────────

const EditUserModal = ({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (u: User) => void }) => {
  const [form, setForm] = useState({ ...user });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-2xl p-6 w-full max-w-md border shadow-2xl" style={{ background: C.card, borderColor: C.borderGold }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>Edit User</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={16} style={{ color: C.textMuted }} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>USERNAME</label>
            <Input value={form.username} onChange={v => setForm({ ...form, username: v })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>ROLE</label>
            <Select value={form.role} onChange={v => setForm({ ...form, role: v as Role })} className="w-full"
              options={[{ label: "Admin", value: "Admin" }, { label: "User +18", value: "User +18" }, { label: "User -18", value: "User -18" }]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>LEVEL</label>
              <Input value={String(form.level)} onChange={v => setForm({ ...form, level: parseInt(v) || 0 })} className="w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>COINS</label>
              <Input value={String(form.coins)} onChange={v => setForm({ ...form, coins: parseInt(v) || 0 })} className="w-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onSave(form); onClose(); }}><Save size={14} /> Save Changes</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── EDIT BOOK MODAL ──────────────────────────────────────────────────────────

const EditBookModal = ({ book, onClose, onSave, isNew = false }: { book: Book; onClose: () => void; onSave: (b: Book) => void; isNew?: boolean }) => {
  const [form, setForm] = useState({ ...book });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="rounded-2xl p-6 w-full max-w-xl border shadow-2xl overflow-y-auto max-h-[90vh]" style={{ background: C.card, borderColor: C.borderGold }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>{isNew ? "Add New Book" : "Edit Book"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={16} style={{ color: C.textMuted }} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>TITLE</label>
            <Input value={form.title} onChange={v => setForm({ ...form, title: v })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>AUTHOR</label>
            <Input value={form.author} onChange={v => setForm({ ...form, author: v })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>GENRE</label>
            <Input value={form.genre} onChange={v => setForm({ ...form, genre: v })} className="w-full" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full bg-black/30 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-700 resize-none"
              style={{ borderColor: C.border, color: C.cream }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>COIN COST</label>
            <Input value={String(form.coinCost)} onChange={v => setForm({ ...form, coinCost: parseInt(v) || 0 })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>XP REWARD</label>
            <Input value={String(form.xpReward)} onChange={v => setForm({ ...form, xpReward: parseInt(v) || 0 })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>COIN REWARD</label>
            <Input value={String(form.coinReward)} onChange={v => setForm({ ...form, coinReward: parseInt(v) || 0 })} className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>AUDIENCE</label>
            <Select value={form.audience} onChange={v => setForm({ ...form, audience: v as BookAudience })} className="w-full"
              options={[{ label: "All Ages", value: "All" }, { label: "+18 Only", value: "+18 Only" }]} />
          </div>
          <div className="col-span-2 flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
            <span className="text-sm font-medium flex items-center gap-2" style={{ color: C.cream }}><Flame size={14} style={{ color: C.gold }} /> Trending Badge</span>
            <Toggle checked={form.trending} onChange={() => setForm({ ...form, trending: !form.trending })} />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onSave(form); onClose(); }}><Save size={14} /> {isNew ? "Add Book" : "Save Changes"}</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: DASHBOARD ───────────────────────────────────────────────────────

const DashboardSection = () => (
  <div className="space-y-6">
    <SectionHeader title="Kingdom Overview" subtitle="Real-time snapshot of your reading realm" icon={<LayoutDashboard size={20} />} />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Users size={20} style={{ color: C.gold }} />} label="Total Users" value="8,241" sub="+124 this week" sparkline />
      <StatCard icon={<BookOpen size={20} style={{ color: C.gold }} />} label="Total Books" value="342" sub="24 genres" sparkline color="blue" />
      <StatCard icon={<MessageSquare size={20} style={{ color: C.gold }} />} label="Community Posts" value="14,890" sub="Active discussions" sparkline color="green" />
      <StatCard icon={<AlertTriangle size={20} style={{ color: "#EF4444" }} />} label="Flagged by Lumo" value="23" sub="Pending review" color="red" sparkline />
      <StatCard icon={<Lock size={20} style={{ color: "#A855F7" }} />} label="+18 Books" value="89" sub="Age-restricted" color="blue" />
      <StatCard icon={<Eye size={20} style={{ color: "#22C55E" }} />} label="Visible to -18" value="253" sub="Safe content" color="green" />
      <StatCard icon={<Coins size={20} style={{ color: C.gold }} />} label="Coins in Circulation" value="2.4M" sub="Economy health: stable" sparkline />
      <StatCard icon={<Flame size={20} style={{ color: "#F97316" }} />} label="Active Today" value="1,832" sub="Reading right now" color="red" />
    </div>

    {/* Evolution Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="h-[300px] flex flex-col">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: C.cream }}><TrendingUp size={16} style={{ color: C.gold }} /> Kingdom Growth</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="name" stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: C.card, borderColor: C.border, borderRadius: "12px", fontSize: "12px", color: C.cream }}
                itemStyle={{ color: C.gold }}
              />
              <Area type="monotone" dataKey="users" stroke={C.gold} fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[300px] flex flex-col">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: C.cream }}><BarChart2 size={16} style={{ color: C.gold }} /> Engagement by Genre</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GENRE_ENGAGEMENT}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="name" stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ background: C.card, borderColor: C.border, borderRadius: "12px", fontSize: "12px", color: C.cream }}
              />
              <Bar dataKey="value" fill={C.goldDim} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: <Star size={16} style={{ color: C.gold }} />, label: "Most Popular Genre", value: "Fantasy", sub: "38% of reads" },
        { icon: <BookMarked size={16} style={{ color: C.gold }} />, label: "Most Read Book", value: "Dragon's Lullaby", sub: "4,210 reads" },
        { icon: <Crown size={16} style={{ color: C.gold }} />, label: "Top Active User", value: "CrimsonInk", sub: "Level 61 · 9,800 coins" },
        { icon: <AlertTriangle size={16} style={{ color: "#EF4444" }} />, label: "Most Flagged Type", value: "Spoilers", sub: "42% of flags" },
      ].map((item, i) => (
        <div key={i} className="rounded-2xl border p-4 flex items-start gap-3"
          style={{ background: "linear-gradient(135deg, #1F1005, #170D04)", borderColor: C.borderGold }}>
          <div className="p-2 rounded-lg mt-0.5" style={{ background: "rgba(212,175,55,0.08)" }}>{item.icon}</div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.textMuted }}>{item.label}</p>
            <p className="font-bold text-sm" style={{ color: C.cream }}>{item.value}</p>
            <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{item.sub}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-2xl border p-5" style={{ background: "linear-gradient(135deg, #261508, #1F1005)", borderColor: "#6B1A2A" }}>
      <div className="flex items-center gap-2 mb-4">
        <Bell size={16} style={{ color: "#EF4444" }} />
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: C.cream }}>Quick Alerts</h3>
      </div>
      <div className="space-y-2">
        {[
          { icon: <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />, text: "5 community posts awaiting admin review" },
          { icon: <BookOpen size={14} className="text-yellow-400 flex-shrink-0" />, text: "3 newly uploaded books need age classification" },
          { icon: <Coins size={14} className="text-green-400 flex-shrink-0" />, text: "Reward settings were modified 2 hours ago" },
          { icon: <Shield size={14} className="text-blue-400 flex-shrink-0" />, text: "Lumo AI flagged 7 new posts since midnight" },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: "rgba(0,0,0,0.25)", color: C.textMuted }}>
            {a.icon} {a.text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── SECTION: USERS ───────────────────────────────────────────────────────────

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editUser, setEditUser] = useState<User | null>(null);

  const filtered = users.filter(u =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="User Management" subtitle="Manage all Lexora kingdom members" icon={<Users size={20} />} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
          <Input value={search} onChange={setSearch} placeholder="Search username or email..." className="w-full pl-8" />
        </div>
        <Select value={roleFilter} onChange={setRoleFilter} className="min-w-[160px]"
          options={[{ label: "All Roles", value: "All" }, { label: "Admin", value: "Admin" }, { label: "User +18", value: "User +18" }, { label: "User -18", value: "User -18" }]} />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: C.border }}>
              {["Avatar", "Username", "Email", "Role", "Level", "Coins", "Joined", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: i < filtered.length - 1 ? C.border : "transparent" }}>
                <td className="px-4 py-3"><Avatar initials={u.avatar} /></td>
                <td className="px-4 py-3 font-semibold" style={{ color: C.cream }}>{u.username}</td>
                <td className="px-4 py-3" style={{ color: C.textMuted }}>{u.email}</td>
                <td className="px-4 py-3">{roleBadge(u.role)}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1" style={{ color: C.gold }}>
                    <Zap size={12} />{u.level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1" style={{ color: C.gold }}>
                    <Coins size={12} />{u.coins.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textDim }}>{u.joinDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Btn variant="ghost" onClick={() => { }}><Eye size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => setEditUser(u)}><Edit2 size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => setUsers(users.filter(x => x.id !== u.id))}><Trash2 size={13} className="text-red-400" /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: C.textMuted }}>No users found matching your filters.</div>
        )}
      </Card>

      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)}
          onSave={updated => setUsers(users.map(u => u.id === updated.id ? updated : u))} />
      )}
    </div>
  );
};

// ─── SECTION: BOOKS ───────────────────────────────────────────────────────────

const BooksSection = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [addNew, setAddNew] = useState(false);

  const genres = ["All", ...Array.from(new Set(MOCK_BOOKS.map(b => b.genre)))];
  const filtered = books.filter(b =>
    (genreFilter === "All" || b.genre === genreFilter) &&
    (audienceFilter === "All" || b.audience === audienceFilter) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
  );

  const newBook: Book = { id: Date.now(), title: "", author: "", genre: "Fantasy", cover: "📖", coinCost: 100, xpReward: 150, coinReward: 40, audience: "All", trending: false, description: "" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Books Management" subtitle="Curate and manage your reading library" icon={<BookOpen size={20} />} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
          <Input value={search} onChange={setSearch} placeholder="Search title or author..." className="w-full pl-8" />
        </div>
        <Select value={genreFilter} onChange={setGenreFilter} className="min-w-[140px]"
          options={genres.map(g => ({ label: g, value: g }))} />
        <Select value={audienceFilter} onChange={setAudienceFilter} className="min-w-[160px]"
          options={[{ label: "All Audiences", value: "All" }, { label: "+18 Only", value: "+18 Only" }, { label: "All Ages", value: "All Ages" }]} />
        <Btn onClick={() => setAddNew(true)}><Plus size={14} /> Add Book</Btn>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: C.border }}>
              {["Cover", "Title", "Author", "Genre", "Cost", "Reward", "Audience", "Trending", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: i < filtered.length - 1 ? C.border : "transparent" }}>
                <td className="px-4 py-3 text-2xl">{b.cover}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: C.cream }}>{b.title}</td>
                <td className="px-4 py-3" style={{ color: C.textMuted }}>{b.author}</td>
                <td className="px-4 py-3"><Badge color="blue">{b.genre}</Badge></td>
                <td className="px-4 py-3"><span className="flex items-center gap-1" style={{ color: C.gold }}><Coins size={12} />{b.coinCost}</span></td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>+{b.xpReward}xp / +{b.coinReward}🪙</td>
                <td className="px-4 py-3">{audienceBadge(b.audience)}</td>
                <td className="px-4 py-3">{b.trending ? <Badge color="orange"><Flame size={10} className="mr-1" />Hot</Badge> : <span style={{ color: C.textDim }}>—</span>}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Btn variant="ghost"><Eye size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => setEditBook(b)}><Edit2 size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => setBooks(books.filter(x => x.id !== b.id))}><Trash2 size={13} className="text-red-400" /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {editBook && <EditBookModal book={editBook} onClose={() => setEditBook(null)} onSave={updated => setBooks(books.map(b => b.id === updated.id ? updated : b))} />}
      {addNew && <EditBookModal book={newBook} isNew onClose={() => setAddNew(false)} onSave={b => { setBooks([...books, b]); setAddNew(false); }} />}
    </div>
  );
};

// ─── SECTION: COMMUNITY ───────────────────────────────────────────────────────

const CommunitySection = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = posts.filter(p =>
    (tagFilter === "All" || p.tag === tagFilter) &&
    (statusFilter === "All" || p.status === statusFilter) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: number, status: PostStatus) => setPosts(posts.map(p => p.id === id ? { ...p, status } : p));

  return (
    <div className="space-y-6">
      <SectionHeader title="Community Management" subtitle="Monitor and moderate reader discussions" icon={<MessageSquare size={20} />} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
          <Input value={search} onChange={setSearch} placeholder="Search posts..." className="w-full pl-8" />
        </div>
        <Select value={tagFilter} onChange={setTagFilter} className="min-w-[140px]"
          options={[{ label: "All Tags", value: "All" }, { label: "Discussion", value: "discussion" }, { label: "Review", value: "review" }, { label: "Theory", value: "theory" }, { label: "Spoiler", value: "spoiler" }]} />
        <Select value={statusFilter} onChange={setStatusFilter} className="min-w-[180px]"
          options={[{ label: "All Status", value: "All" }, { label: "Clean", value: "Clean" }, { label: "Flagged by Lumo", value: "Flagged by Lumo" }, { label: "Pending Review", value: "Pending Admin Review" }, { label: "Reviewed", value: "Reviewed" }]} />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: C.border }}>
              {["Post Title", "Author", "Book", "Tag", "↑", "💬", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: i < filtered.length - 1 ? C.border : "transparent" }}>
                <td className="px-4 py-3 max-w-[200px]">
                  <p className="font-medium truncate" style={{ color: C.cream }}>{p.title}</p>
                </td>
                <td className="px-4 py-3" style={{ color: C.textMuted }}>{p.author}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textDim }}>{p.book}</td>
                <td className="px-4 py-3">{tagBadge(p.tag)}</td>
                <td className="px-4 py-3" style={{ color: C.gold }}>{p.upvotes}</td>
                <td className="px-4 py-3" style={{ color: C.textMuted }}>{p.comments}</td>
                <td className="px-4 py-3">{postStatusBadge(p.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Btn variant="ghost"><Eye size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => updateStatus(p.id, "Reviewed")}><EyeOff size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => setPosts(posts.filter(x => x.id !== p.id))}><Trash2 size={13} className="text-red-400" /></Btn>
                    {p.tag !== "spoiler" && <Btn variant="ghost" onClick={() => updateStatus(p.id, "Reviewed")}><Tag size={13} className="text-blue-400" /></Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center" style={{ color: C.textMuted }}>No posts found.</div>}
      </Card>
    </div>
  );
};

// ─── SECTION: LUMO AI MODERATION ─────────────────────────────────────────────

const LumoSection = () => {
  const [flags, setFlags] = useState<ModerationFlag[]>(MOCK_FLAGS);
  const [lumoActive, setLumoActive] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  const filtered = flags.filter(f =>
    (typeFilter === "All" || f.type === typeFilter) &&
    (severityFilter === "All" || f.severity === severityFilter)
  );

  const updateStatus = (id: number, status: ModerationStatus) => setFlags(flags.map(f => f.id === id ? { ...f, status } : f));

  const pending = flags.filter(f => f.status === "Pending").length;

  return (
    <div className="space-y-6">
      <SectionHeader title="Lumo AI Moderation" subtitle="Supervise the autonomous moderation engine of the realm" icon={<Shield size={20} />} />

      {/* Lumo Status & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border p-6 flex items-start gap-5" style={{
          background: "linear-gradient(135deg, #1A0B10 0%, #110A08 100%)",
          borderColor: lumoActive ? "#7C3AED" : C.border,
          boxShadow: lumoActive ? "0 0 30px rgba(124,58,237,0.15)" : "none"
        }}>
          <div className="p-4 rounded-2xl flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Sparkles size={28} className={lumoActive ? "text-purple-400" : "text-gray-500"} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-base" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>Lumo AI Moderation Engine</h3>
                <p className="text-sm mt-1" style={{ color: C.textMuted }}>Autonomous content monitoring · Supervised by Admin</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: lumoActive ? "#A78BFA" : C.textMuted }}>
                  {lumoActive ? "● Active" : "○ Inactive"}
                </span>
                <Toggle checked={lumoActive} onChange={() => setLumoActive(!lumoActive)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Flags Today", value: "23", color: "text-orange-400" },
                { label: "Pending Review", value: String(pending), color: "text-yellow-400" },
                { label: "Auto-resolved", value: "41", color: "text-green-400" },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="flex flex-col h-full overflow-hidden">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: C.cream }}><LucidePieChart size={16} style={{ color: C.gold }} /> Flag Distribution</h3>
          <div className="flex-1 min-h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={FLAG_DISTRIBUTION} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                  {FLAG_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: C.card, borderColor: C.border, borderRadius: "12px", fontSize: "10px", color: C.cream }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={typeFilter} onChange={setTypeFilter} className="min-w-[160px]"
          options={[{ label: "All Types", value: "All" }, { label: "Spoiler", value: "Spoiler" }, { label: "Spam", value: "Spam" }, { label: "Offensive", value: "Offensive" }, { label: "Age-Sensitive", value: "Age-Sensitive" }]} />
        <Select value={severityFilter} onChange={setSeverityFilter} className="min-w-[140px]"
          options={[{ label: "All Severity", value: "All" }, { label: "Low", value: "Low" }, { label: "Medium", value: "Medium" }, { label: "High", value: "High" }]} />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: C.border }}>
              {["Preview", "Author", "Book", "Type", "Severity", "Suggested Action", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: i < filtered.length - 1 ? C.border : "transparent" }}>
                <td className="px-4 py-3 max-w-[160px]">
                  <p className="text-xs truncate italic" style={{ color: C.textMuted }}>"{f.preview}"</p>
                </td>
                <td className="px-4 py-3" style={{ color: C.cream }}>{f.author}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textDim }}>{f.book}</td>
                <td className="px-4 py-3">{detectionBadge(f.type)}</td>
                <td className="px-4 py-3">{severityBadge(f.severity)}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{f.suggested}</td>
                <td className="px-4 py-3">{modStatusBadge(f.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Btn variant="ghost" onClick={() => updateStatus(f.id, "Approved")} className="text-green-400"><Check size={13} /></Btn>
                    <Btn variant="ghost" onClick={() => updateStatus(f.id, "Rejected")} className="text-red-400"><X size={13} /></Btn>
                    <Btn variant="ghost"><Eye size={13} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center" style={{ color: C.textMuted }}>No flags match your filters.</div>}
      </Card>
    </div>
  );
};

// ─── SECTION: AGE ACCESS CONTROL ─────────────────────────────────────────────

const AgeAccessSection = () => {
  const [plus18, setPlus18] = useState({ about: true, store: true, lamp: true, community: true, bountyBoard: true, plus18Books: true });
  const [minus18, setMinus18] = useState({ about: false, store: false, lamp: false, community: true, bountyBoard: true, plus18Books: false });

  const Row = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: C.border }}>
      <span className="text-sm" style={{ color: C.cream }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: checked ? "#86EFAC" : "#FCA5A5" }}>{checked ? "Visible" : "Hidden"}</span>
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Age Access Control" subtitle="Define what each age group can see and access" icon={<Lock size={20} />} />

      <div className="p-4 rounded-2xl border flex items-start gap-3" style={{ borderColor: "#854D0E", background: "rgba(120,53,15,0.15)" }}>
        <Info size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: "#FDE68A" }}>
          These settings control platform section visibility per age group. Changes take effect immediately across all sessions. Content marked +18 is never shown to -18 users regardless of these settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* +18 Card */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#7C3AED", boxShadow: "0 0 20px rgba(124,58,237,0.1)" }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))" }}>
            <div className="p-2 rounded-xl" style={{ background: "rgba(124,58,237,0.2)" }}><UserCheck size={18} className="text-purple-300" /></div>
            <div>
              <h3 className="font-bold" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>User +18 View</h3>
              <p className="text-xs" style={{ color: C.textMuted }}>Adult readers — full access</p>
            </div>
            <Badge color="purple">+18</Badge>
          </div>
          <div className="px-6 py-2" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Row label="About Section" checked={plus18.about} onChange={() => setPlus18({ ...plus18, about: !plus18.about })} />
            <Row label="Store" checked={plus18.store} onChange={() => setPlus18({ ...plus18, store: !plus18.store })} />
            <Row label="Lamp of Knowledge" checked={plus18.lamp} onChange={() => setPlus18({ ...plus18, lamp: !plus18.lamp })} />
            <Row label="Community" checked={plus18.community} onChange={() => setPlus18({ ...plus18, community: !plus18.community })} />
            <Row label="Lumo's Bounty Board" checked={plus18.bountyBoard} onChange={() => setPlus18({ ...plus18, bountyBoard: !plus18.bountyBoard })} />
            <Row label="Show +18 Books" checked={plus18.plus18Books} onChange={() => setPlus18({ ...plus18, plus18Books: !plus18.plus18Books })} />
          </div>
        </div>

        {/* -18 Card */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#166534", boxShadow: "0 0 20px rgba(22,101,52,0.1)" }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: "linear-gradient(90deg, rgba(22,101,52,0.2), rgba(22,101,52,0.05))" }}>
            <div className="p-2 rounded-xl" style={{ background: "rgba(22,101,52,0.2)" }}><UserCheck size={18} className="text-green-300" /></div>
            <div>
              <h3 className="font-bold" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>User -18 View</h3>
              <p className="text-xs" style={{ color: C.textMuted }}>Young readers — restricted access</p>
            </div>
            <Badge color="green">-18</Badge>
          </div>
          <div className="px-6 py-2" style={{ background: "rgba(0,0,0,0.2)" }}>
            <Row label="About Section" checked={minus18.about} onChange={() => setMinus18({ ...minus18, about: !minus18.about })} />
            <Row label="Store" checked={minus18.store} onChange={() => setMinus18({ ...minus18, store: !minus18.store })} />
            <Row label="Lamp of Knowledge" checked={minus18.lamp} onChange={() => setMinus18({ ...minus18, lamp: !minus18.lamp })} />
            <Row label="Community" checked={minus18.community} onChange={() => setMinus18({ ...minus18, community: !minus18.community })} />
            <Row label="Lumo's Bounty Board" checked={minus18.bountyBoard} onChange={() => setMinus18({ ...minus18, bountyBoard: !minus18.bountyBoard })} />
            <Row label="Show +18 Books" checked={minus18.plus18Books} onChange={() => setMinus18({ ...minus18, plus18Books: !minus18.plus18Books })} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SECTION: REWARDS & ECONOMY ───────────────────────────────────────────────

const RewardsSection = () => {
  const [defaultXP, setDefaultXP] = useState("150");
  const [defaultCoin, setDefaultCoin] = useState("40");
  const [penaltyEnabled, setPenaltyEnabled] = useState(true);
  const [penalties, setPenalties] = useState({ l1_5: "10", l6_15: "20", l16_25: "30", l26: "40" });

  return (
    <div className="space-y-6">
      <SectionHeader title="Rewards & Economy" subtitle="Configure the Lexora coin and XP economy" icon={<Coins size={20} />} />

      {/* Economy Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: <ArrowUp size={16} className="text-green-400" />, label: "Total Coins Earned", value: "3.2M", sub: "All time" },
          { icon: <ArrowDown size={16} className="text-red-400" />, label: "Total Coins Spent", value: "780K", sub: "On books & store" },
          { icon: <BarChart2 size={16} style={{ color: C.gold }} />, label: "Avg Reward / Book", value: "45 🪙", sub: "+120 XP avg" },
          { icon: <Crown size={16} style={{ color: C.gold }} />, label: "Most Expensive Book", value: "Blood & Gold", sub: "200 coins" },
          { icon: <Coins size={16} style={{ color: C.gold }} />, label: "Coins in Circulation", value: "2.4M", sub: "Active balance" },
          { icon: <TrendingUp size={16} className="text-blue-400" />, label: "Economy Health", value: "Stable ✓", sub: "Inflation: low" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-4 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #1F1005, #170D04)", borderColor: C.border }}>
            <div className="p-2 rounded-lg mt-0.5" style={{ background: "rgba(212,175,55,0.08)" }}>{s.icon}</div>
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.textMuted }}>{s.label}</p>
              <p className="font-bold" style={{ color: C.cream }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Economy Evolution */}
      <Card className="h-[300px] flex flex-col">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: C.cream }}><BarChart2 size={16} style={{ color: C.gold }} /> 30-Day Economy Trend</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ECONOMY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={C.textDim} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: C.card, borderColor: C.border, borderRadius: "12px", fontSize: "12px", color: C.cream }}
              />
              <Line type="monotone" dataKey="earned" stroke={C.gold} strokeWidth={3} dot={{ r: 4, fill: C.gold }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="spent" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: "#EF4444" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Default Reward Settings */}
      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: C.cream }}><Award size={16} style={{ color: C.gold }} /> Default Reward Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>DEFAULT XP REWARD PER BOOK</label>
            <div className="relative">
              <Input value={defaultXP} onChange={setDefaultXP} className="w-full pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.textMuted }}>XP</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>DEFAULT COIN REWARD PER BOOK</label>
            <div className="relative">
              <Input value={defaultCoin} onChange={setDefaultCoin} className="w-full pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.textMuted }}>🪙</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Lamp Penalty Settings */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold flex items-center gap-2" style={{ color: C.cream }}>
              <span className="text-lg">🪔</span> Lamp of Knowledge — Penalty Rules
            </h3>
            <p className="text-xs mt-1" style={{ color: C.textMuted }}>Configure quiz failure penalties per player level range</p>
          </div>
          <Toggle checked={penaltyEnabled} onChange={() => setPenaltyEnabled(!penaltyEnabled)} label={penaltyEnabled ? "Enabled" : "Disabled"} />
        </div>

        <div className={`space-y-3 transition-opacity duration-300 ${penaltyEnabled ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
          {[
            { key: "l1_5" as keyof typeof penalties, label: "Level 1–5 Penalty %", icon: "🌱" },
            { key: "l6_15" as keyof typeof penalties, label: "Level 6–15 Penalty %", icon: "📖" },
            { key: "l16_25" as keyof typeof penalties, label: "Level 16–25 Penalty %", icon: "⚔️" },
            { key: "l26" as keyof typeof penalties, label: "Level 26+ Penalty %", icon: "👑" },
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
              <span className="text-sm flex items-center gap-2" style={{ color: C.cream }}>
                <span>{icon}</span> {label}
              </span>
              <div className="flex items-center gap-2">
                <Input value={penalties[key]} onChange={v => setPenalties({ ...penalties, [key]: v })} className="w-16 text-center" />
                <span style={{ color: C.textMuted }}>%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── SECTION: SITE SETTINGS ───────────────────────────────────────────────────

const SiteSettingsSection = () => {
  const defaults = {
    siteName: "Lexora", tagline: "Where Every Page Sparks a New Adventure",
    lumoMessage: "Greetings, young scholar! I am Lumo, your guide through the Reading Kingdom.",
    lumoChatbot: true, lumoModeration: true, booksPerPage: "12", trendingBadge: true
  };
  const [settings, setSettings] = useState({ ...defaults });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Site Settings" subtitle="Global configuration for the Lexora platform" icon={<Settings size={20} />} />

      <Card>
        <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: C.cream }}><BookMarked size={16} style={{ color: C.gold }} /> Platform Identity</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>SITE NAME</label>
            <Input value={settings.siteName} onChange={v => setSettings({ ...settings, siteName: v })} className="w-full max-w-md" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>TAGLINE</label>
            <Input value={settings.tagline} onChange={v => setSettings({ ...settings, tagline: v })} className="w-full max-w-xl" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>LUMO WELCOME MESSAGE</label>
            <textarea value={settings.lumoMessage} onChange={e => setSettings({ ...settings, lumoMessage: e.target.value })}
              rows={3} className="w-full bg-black/30 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-700 resize-none max-w-xl"
              style={{ borderColor: C.border, color: C.cream }} />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: C.cream }}><Sparkles size={16} style={{ color: C.gold }} /> Feature Toggles</h3>
        <div className="space-y-3">
          {[
            { key: "lumoChatbot", icon: "🤖", label: "Enable Lumo Chatbot", desc: "Show the AI chat assistant on all pages" },
            { key: "lumoModeration", icon: "🛡️", label: "Enable Lumo AI Moderation", desc: "Automatic content moderation engine" },
            { key: "trendingBadge", icon: "🔥", label: "Enable Trending Badge", desc: "Show hot/trending labels on popular books" },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: C.cream }}>{label}</p>
                  <p className="text-xs" style={{ color: C.textMuted }}>{desc}</p>
                </div>
              </div>
              <Toggle checked={settings[key as keyof typeof settings] as boolean}
                onChange={() => setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: C.cream }}><BarChart2 size={16} style={{ color: C.gold }} /> Display Settings</h3>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>DEFAULT BOOKS PER PAGE</label>
          <Select value={settings.booksPerPage} onChange={v => setSettings({ ...settings, booksPerPage: v })} className="w-40"
            options={["6", "8", "12", "16", "24"].map(v => ({ label: `${v} books`, value: v }))} />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Btn onClick={handleSave} className="px-5">
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </Btn>
        <Btn variant="secondary" onClick={() => setSettings({ ...defaults })}>
          <RefreshCw size={14} /> Reset to Default
        </Btn>
        {saved && <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Settings saved successfully</span>}
      </div>
    </div>
  );
};

// ─── SIDEBAR ITEMS ────────────────────────────────────────────────────────────

type Section = "dashboard" | "users" | "books" | "community" | "lumo" | "age" | "rewards" | "settings";

const NAV_ITEMS: { id: Section | "logout"; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "users", label: "Users", icon: <Users size={17} /> },
  { id: "books", label: "Books", icon: <BookOpen size={17} /> },
  { id: "community", label: "Community", icon: <MessageSquare size={17} />, badge: "5" },
  { id: "lumo", label: "Lumo AI Moderation", icon: <Shield size={17} />, badge: "23" },
  { id: "age", label: "Age Access Control", icon: <Lock size={17} /> },
  { id: "rewards", label: "Rewards & Economy", icon: <Coins size={17} /> },
  { id: "settings", label: "Site Settings", icon: <Settings size={17} /> },
  { id: "logout", label: "Logout", icon: <LogOut size={17} /> },
];

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────

export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardSection />;
      case "users": return <UsersSection />;
      case "books": return <BooksSection />;
      case "community": return <CommunitySection />;
      case "lumo": return <LumoSection />;
      case "age": return <AgeAccessSection />;
      case "rewards": return <RewardsSection />;
      case "settings": return <SiteSettingsSection />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: C.bg, fontFamily: "'Georgia', serif", color: C.text }}>

      {/* ── SIDEBAR ── */}
      <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
        style={{ background: "linear-gradient(180deg, #1A0A04 0%, #0F0603 100%)", borderRight: `1px solid ${C.border}` }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0" style={{ borderColor: C.border }}>
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-lg"
            style={{ background: "linear-gradient(135deg, #6B1A2A, #D4AF37)" }}>✦</div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="text-base font-bold tracking-widest" style={{ color: C.gold }}>LEXORA</span>
              <p className="text-xs" style={{ color: C.textDim }}>Admin Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map(item => {
            const isLogout = item.id === "logout";
            const isActive = activeSection === item.id;
            return (
              <button key={item.id}
                onClick={() => { if (!isLogout) setActiveSection(item.id as Section); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative ${isActive
                  ? "shadow-lg"
                  : isLogout ? "hover:bg-red-900/20" : "hover:bg-white/5"
                  }`}
                style={{
                  background: isActive ? "linear-gradient(135deg, rgba(107,26,42,0.4), rgba(212,175,55,0.15))" : undefined,
                  border: isActive ? `1px solid ${C.borderGold}` : "1px solid transparent",
                  color: isActive ? C.gold : isLogout ? "#EF4444" : C.textMuted,
                }}>
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "#6B1A2A", color: "#FCA5A5" }}>
                    {item.badge}
                  </span>
                )}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ background: C.gold }} />}
              </button>
            );
          })}
        </nav>

        {/* Admin info at bottom */}
        {sidebarOpen && (
          <div className="p-4 border-t flex-shrink-0" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #6B1A2A, #D4AF37)", color: C.cream }}>AL</div>
              <div>
                <p className="text-xs font-bold" style={{ color: C.cream }}>ArcaneLord</p>
                <p className="text-xs" style={{ color: C.textDim }}>Super Admin</p>
              </div>
              <Crown size={14} className="ml-auto" style={{ color: C.gold }} />
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN AREA ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
          style={{ background: "rgba(26,13,6,0.95)", borderColor: C.border, backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: C.textMuted }}>
              <MoreHorizontal size={18} />
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase" style={{ color: C.cream }}>
                {NAV_ITEMS.find(n => n.id === activeSection)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
              style={{ color: showNotifications ? C.gold : C.textMuted }}>
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ background: C.card, borderColor: C.borderGold, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
                  <h3 className="text-sm font-bold tracking-wider" style={{ color: C.cream }}>Kingdom Alerts</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-900/50">4 NEW</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {MOCK_ALERTS.map((alert) => (
                    <div key={alert.id} className="p-4 border-b last:border-0 hover:bg-white/5 transition-colors cursor-pointer group" style={{ borderColor: C.border }}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 bg-black/40 border border-white/5 ${alert.color}`}>
                          {alert.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold truncate" style={{ color: C.cream }}>{alert.title}</p>
                            <span className="text-[10px] whitespace-nowrap" style={{ color: C.textDim }}>{alert.time}</span>
                          </div>
                          <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: C.textMuted }}>{alert.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  style={{ color: C.gold, borderTop: `1px solid ${C.border}` }}>
                  View All Chronicles
                </button>
              </div>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #6B1A2A, #D4AF37)", color: C.cream }}>AL</div>
          </div>
        </header>

        {/* Decorative top border glow */}
        <div className="h-px flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${C.goldDim}, transparent)` }} />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
