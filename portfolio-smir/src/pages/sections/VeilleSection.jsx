// src/pages/sections/VeilleSection.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";

/* ============================
   Golden Ratio + Thème
   ============================ */
const PHI = 1.618;
const INV = 1 / PHI;
const INV2 = INV * INV;

const THEME = {
  bg: "#080d18",
  card: "rgba(10,16,30,0.75)",
  border: "rgba(255,215,0,0.12)",
  glowLine:
    "linear-gradient(90deg, rgba(56,189,248,.0) 0%, rgba(56,189,248,.5) 23.6%, rgba(212,175,55,.85) 50%, rgba(147,51,234,.6) 76.4%, rgba(56,189,248,.0) 100%)",
  text: "#e2e8f0",
  sub: "#94a3b8",
  brandFrom: "#22d3ee", // cyan
  brandTo: "#a855f7",   // violet
};

/* ============================
   Feature flags via Vite
   ============================ */
const CG_KEY = import.meta?.env?.VITE_COINGECKO_KEY || "";

/* ============================
   Sources & People
   ============================ */
const TOP_SITES = [
  { name: "Ars Technica", url: "https://arstechnica.com" },
  { name: "The Verge", url: "https://www.theverge.com" },
  { name: "TechCrunch", url: "https://techcrunch.com" },
  { name: "Wired", url: "https://www.wired.com" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com" },
  { name: "Numerama", url: "https://www.numerama.com" },
  { name: "L’Usine Digitale", url: "https://www.usine-digitale.fr" },
  { name: "ZDNet FR", url: "https://www.zdnet.fr" },
  { name: "The Register", url: "https://www.theregister.com" },
  { name: "LWN.net (kernel)", url: "https://lwn.net" },
  { name: "Cloudflare Blog", url: "https://blog.cloudflare.com" },
  { name: "OpenAI Blog", url: "https://openai.com/blog" },
  { name: "Google AI Blog", url: "https://ai.googleblog.com" },
  { name: "Meta AI", url: "https://ai.meta.com/blog/" },
  { name: "Microsoft Security", url: "https://www.microsoft.com/security/blog/" },
  { name: "BleepingComputer (sec)", url: "https://www.bleepingcomputer.com" },
  { name: "The Record (sec)", url: "https://therecord.media" },
];

const PEOPLE = [
  { name: "Guillermo Rauch", handle: "@rauchg", role: "CEO", company: "Vercel", url: "https://x.com/rauchg" },
  { name: "Dan Abramov", handle: "@dan_abramov", role: "Core", company: "React", url: "https://x.com/dan_abramov" },
  { name: "Mitchell Hashimoto", handle: "@mitchellh", role: "Co-founder", company: "HashiCorp", url: "https://x.com/mitchellh" },
  { name: "Bret Taylor", handle: "@btaylor", role: "Chairman", company: "OpenAI", url: "https://x.com/btaylor" },
  { name: "Troy Hunt", handle: "@troyhunt", role: "Security Researcher", company: "Have I Been Pwned", url: "https://x.com/troyhunt" },
  { name: "Katie Moussouris", handle: "@k8em0", role: "CEO", company: "Luta Security", url: "https://x.com/k8em0" },
  { name: "Thomas Kurian", handle: "@thomaskurian", role: "CEO", company: "Google Cloud", url: "https://x.com/thomaskurian" },
  { name: "Patrick Collison", handle: "@patrickc", role: "CEO", company: "Stripe", url: "https://x.com/patrickc" },
  { name: "Sundar Pichai", handle: "@sundarpichai", role: "CEO", company: "Google", url: "https://x.com/sundarpichai" },
  { name: "Satya Nadella", handle: "@satyanadella", role: "CEO", company: "Microsoft", url: "https://x.com/satyanadella" },
  { name: "Jensen Huang", handle: "", role: "CEO", company: "NVIDIA", url: "https://www.nvidia.com" },
  { name: "Linus Torvalds", handle: "", role: "Creator", company: "Linux", url: "https://www.kernel.org" },
  { name: "Nat Friedman", handle: "@natfriedman", role: "Ex-CEO", company: "GitHub", url: "https://x.com/natfriedman" },
  { name: "Lea Verou", handle: "@LeaVerou", role: "W3C", company: "CSS/Standards", url: "https://x.com/LeaVerou" },
  { name: "Corey Quinn", handle: "@QuinnyPig", role: "Analyst", company: "Duckbill Group", url: "https://x.com/QuinnyPig" },
  { name: "Ian Coldwater", handle: "@IanColdwater", role: "Security", company: "Kubernetes", url: "https://x.com/IanColdwater" },
  { name: "Tanel Poder", handle: "@tanelpoder", role: "Perf Eng", company: "Databases", url: "https://x.com/tanelpoder" },
  { name: "Andrej Karpathy", handle: "@karpathy", role: "AI Research", company: "Independent", url: "https://x.com/karpathy" },
  { name: "François Chollet", handle: "@fchollet", role: "AI Research", company: "Google", url: "https://x.com/fchollet" },
  { name: "Lex Fridman", handle: "@lexfridman", role: "Researcher", company: "MIT", url: "https://x.com/lexfridman" },
];

/* ============================
   Fetch helpers
   ============================ */
async function jfetch(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* --- Hacker News --- */
async function fetchHNTop(limit = 20) {
  const ids = await jfetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const top = ids.slice(0, limit);
  const items = await Promise.all(
    top.map((id) => jfetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
  );
  return items.filter(Boolean);
}

/* --- GitHub Trending-like --- */
function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
async function fetchGitHubTrending(limit = 20) {
  const since = isoDaysAgo(7);
  const url =
    `https://api.github.com/search/repositories` +
    `?q=created:>${since}&sort=stars&order=desc&per_page=${Math.min(limit, 30)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 403) throw new Error("Rate limit GitHub. Réessaie plus tard.");
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

/* --- CoinGecko (spot) --- */
async function fetchCoinGeckoPrices(ids, vs = "usd") {
  const url =
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=${vs}`;
  const headers = CG_KEY ? { "x-cg-demo-api-key": CG_KEY } : {};
  return jfetch(url, headers);
}

/* ============================
   Primitives UI
   ============================ */
function SectionHeader({ title, subtitle, tip }) {
  return (
    <div className="mb-[1.0rem] flex flex-col md:flex-row md:items-end md:justify-between gap-[0.618rem]">
      <div>
        <h2
          className="font-extrabold tracking-tight"
          style={{
            fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
            fontSize: `${1.618 * PHI}rem`,
            lineHeight: 1.0 + INV,
            color: THEME.text,
          }}
        >
          {title}
        </h2>
        {subtitle && <p className="text-slate-400 text-[0.95rem]">{subtitle}</p>}
      </div>
      {tip && <div className="text-xs text-slate-400">{tip}</div>}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="px-2 py-1 text-xs border rounded-full bg-white/5 border-white/10">
      {children}
    </span>
  );
}

function Panel({ title, children, right, bodyClass = "" }) {
  return (
    <section
      className="relative rounded-[1.0rem] border backdrop-blur-xl shadow-xl overflow-hidden"
      style={{
        borderColor: THEME.border,
        background: THEME.card,
        boxShadow: "0 0.618rem 1.618rem rgba(0,0,0,.35)",
      }}
    >
      {/* halo très discret animé */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(140% 100% at 0% 0%, transparent 0%, black 50%, black 100%)",
          background:
            `conic-gradient(from 0deg, ${THEME.brandFrom}, ${THEME.brandTo}, ${THEME.brandFrom})`,
          opacity: 0.06,
          animation: "spin-slow 18s linear infinite",
        }}
      />
      <header
        className="relative flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ gap: `${0.382 * PHI}rem` }}
      >
        <h3
          className="font-extrabold tracking-tight"
          style={{
            fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
            fontSize: `${1.0 * PHI}rem`,
            color: THEME.text,
          }}
        >
          {title}
        </h3>
        {right}
      </header>
      <div className={`relative p-4 ${bodyClass}`}>{children}</div>
      <div className="h-[0.236rem] w-full" style={{ background: THEME.glowLine }} />
    </section>
  );
}

/* ============================
   Widgets
   ============================ */

/* --- HN (liste scrollable) --- */
function HNWidget() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchHNTop(30)
      .then((data) => setItems(data))
      .catch((e) => setErr(e.message || "Erreur HN"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Panel
      title="Actus dev — Hacker News"
      right={
        <div className="flex items-center gap-2">
          <Pill>live</Pill>
          <button
            className="px-2 py-1 text-xs border rounded-md border-white/10 hover:bg-white/10"
            onClick={load}
            title="Rafraîchir"
          >
            ↻ Refresh
          </button>
        </div>
      }
      bodyClass="h-[24rem] overflow-y-auto pr-1"
    >
      {err && <div className="mb-2 text-sm text-rose-300">⚠ {err}</div>}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="transition border rounded-md group border-white/10 bg-slate-800/50 hover:bg-slate-800/70">
              <a
                href={it.url || `https://news.ycombinator.com/item?id=${it.id}`}
                target="_blank"
                rel="noreferrer"
                className="block px-3 pt-2 font-semibold text-slate-100 group-hover:underline line-clamp-2"
                title={it.title}
              >
                {it.title}
              </a>
              <div className="flex items-center gap-3 px-3 pb-2 text-xs text-slate-400">
                <span>▲ {it.score}</span>
                <span>by {it.by}</span>
                <span>{Math.max(1, Math.round((Date.now()/1000 - it.time) / 3600))}h</span>
                <a
                  className="ml-auto underline hover:no-underline"
                  href={`https://news.ycombinator.com/item?id=${it.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Fil HN
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* --- GitHub (liste scrollable) --- */
function GitHubWidget() {
  const [repos, setRepos] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchGitHubTrending(30)
      .then((data) => setRepos(data))
      .catch((e) => setErr(e.message || "Erreur GitHub"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Panel
      title="Tendances GitHub (7 jours)"
      right={
        <div className="flex items-center gap-2">
          <Pill>live</Pill>
          <button
            className="px-2 py-1 text-xs border rounded-md border-white/10 hover:bg-white/10"
            onClick={load}
            title="Rafraîchir"
          >
            ↻ Refresh
          </button>
        </div>
      }
      bodyClass="h-[24rem] overflow-y-auto pr-1"
    >
      {err && <div className="mb-2 text-sm text-rose-300">⚠ {err}</div>}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {repos.map((r) => (
            <li key={r.id} className="transition border rounded-md group border-white/10 bg-slate-800/50 hover:bg-slate-800/70">
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="block px-3 pt-2 font-semibold text-slate-100 group-hover:underline line-clamp-1"
                title={r.full_name}
              >
                {r.full_name}
              </a>
              <div className="flex items-center gap-3 px-3 pb-2 text-xs text-slate-400">
                <span>⭐ {r.stargazers_count}</span>
                {r.language && <span>{r.language}</span>}
                <span>upd: {new Date(r.updated_at).toLocaleDateString()}</span>
                <span className="truncate">{r.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* --- People (liste scrollable enrichie) --- */
function PeopleWidget() {
  return (
    <Panel title="People à suivre" bodyClass="h-[24rem] overflow-y-auto pr-1">
      <ul className="space-y-2">
        {PEOPLE.map((p) => {
          const initials = p.name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
          return (
            <li key={p.name} className="flex items-center gap-3 p-2 border rounded-md border-white/10 bg-slate-800/50">
              <div
                className="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${THEME.brandFrom}, ${THEME.brandTo})`,
                  color: "white",
                }}
                aria-hidden
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-tight truncate text-slate-100">
                  {p.name} <span className="font-normal text-slate-400">{p.handle}</span>
                </div>
                <div className="text-xs truncate text-slate-400">{p.role} — {p.company}</div>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 ml-auto text-xs border rounded-md border-white/10 hover:bg-white/10"
                title="Ouvrir le profil"
              >
                ↗ Lien
              </a>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* --- Sites (liste scrollable) --- */
function SitesWidget() {
  return (
    <Panel title="Sites de référence" bodyClass="h-[24rem] overflow-y-auto pr-1">
      <ul className="space-y-2">
        {TOP_SITES.map((x) => (
          <li key={x.url} className="transition border rounded-md group border-white/10 bg-slate-800/50 hover:bg-slate-800/70">
            <a
              href={x.url}
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 text-sm truncate text-slate-200 group-hover:underline"
            >
              {x.name}
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* --- Outils IA pour Dev (liste scrollable + pricing) --- */
const AI_TOOLS = [
  // Code completion / pair programming
  { name: "GitHub Copilot", price: "Payant", url: "https://github.com/features/copilot", tags: ["codegen","IDE"], desc: "Autocomplétion & chat dans l’IDE (VS Code, JetBrains)." },
  { name: "Amazon CodeWhisperer", price: "Freemium", url: "https://aws.amazon.com/codewhisperer/", tags: ["codegen","AWS"], desc: "Autocomplétion multi-langages. Gratuit pour usage individuel." },
  { name: "JetBrains AI Assistant", price: "Payant", url: "https://www.jetbrains.com/ai/", tags: ["IDE","codegen"], desc: "Chat contextuel + refactors dans l’écosystème JetBrains." },
  { name: "Tabnine", price: "Freemium", url: "https://www.tabnine.com/", tags: ["codegen","IDE"], desc: "Modèles propriétaires + OSS. Contrôle de confidentialité." },
  { name: "Codeium", price: "Gratuit", url: "https://codeium.com/", tags: ["codegen","IDE"], desc: "Autocomplétion + chat illimités pour particuliers." },
  { name: "Cody (Sourcegraph)", price: "Freemium", url: "https://sourcegraph.com/cody", tags: ["codegen","context"], desc: "Contexte repo (embeddings), navigation monorepo." },
  { name: "Supermaven", price: "Freemium", url: "https://supermaven.com/", tags: ["codegen"], desc: "Complétions rapides et agressives." },
  { name: "Cursor IDE", price: "Freemium", url: "https://cursor.sh/", tags: ["IDE","codegen"], desc: "Fork VS Code orienté IA : edits structurés, chat puissant." },
  { name: "Phind", price: "Freemium", url: "https://www.phind.com/", tags: ["search","codegen"], desc: "Recherche dev + génération de code." },
  { name: "Aider", price: "Gratuit", url: "https://aider.chat/", tags: ["CLI","codegen"], desc: "Assistant CLI qui édite tes fichiers proprement (git-aware)." },
  { name: "Continue.dev", price: "Gratuit", url: "https://continue.dev/", tags: ["IDE","open-source"], desc: "Copilote open-source pour VS Code/JetBrains (BYO model)." },
  { name: "Replit Ghostwriter", price: "Payant", url: "https://replit.com/site/ghostwriter", tags: ["codegen","fullstack"], desc: "Génération de code sur Replit." },

  // Génération d’applis / UI / Agents
  { name: "v0 by Vercel", price: "Freemium", url: "https://v0.dev/", tags: ["UI","React","design"], desc: "Génère des interfaces React/Tailwind depuis prompts." },
  { name: "bolt.new", price: "Gratuit", url: "https://bolt.new/", tags: ["fullstack","rapid"], desc: "Boot d’apps full-stack dans le navigateur." },
  { name: "GPT Pilot", price: "Gratuit", url: "https://github.com/Pythagora-io/gpt-pilot", tags: ["agent","open-source"], desc: "Agent de dev open-source end-to-end." },

  // Tests, review, refactor
  { name: "CodiumAI", price: "Freemium", url: "https://www.codium.ai/", tags: ["tests","review"], desc: "Génère tests & reviews." },
  { name: "Sourcery", price: "Freemium", url: "https://sourcery.ai/", tags: ["refactor","python"], desc: "Refactoring automatique (surtout Python)." },
  { name: "CodeRabbit", price: "Freemium", url: "https://coderabbit.ai/", tags: ["review","GitHub"], desc: "Commentaires automatiques de PR." },

  // Docs / knowledge / QA
  { name: "Mintlify", price: "Freemium", url: "https://mintlify.com/", tags: ["docs","AI"], desc: "Docs élégantes + génération IA intégrée au repo." },
  { name: "Readme.com AI", price: "Payant", url: "https://readme.com", tags: ["docs","API"], desc: "Portails API avec aide IA (search/QA)." },
  { name: "Danswer", price: "Gratuit", url: "https://github.com/danswer-ai/danswer", tags: ["RAG","open-source"], desc: "Search/QA unifié (Slack, GDrive, GitHub) avec RAG." },

  // Data / LLM tooling
  { name: "LangChain", price: "Gratuit", url: "https://langchain.com/", tags: ["framework","LLM"], desc: "Chaînage LLM, agents, outils." },
  { name: "LlamaIndex", price: "Freemium", url: "https://www.llamaindex.ai/", tags: ["RAG","LLM"], desc: "Pipelines RAG, ingestion multi-sources." },
  { name: "OpenRouter", price: "Freemium", url: "https://openrouter.ai/", tags: ["gateway","multi-LLM"], desc: "Passerelle multi-modèles (pay-as-you-go)." },
  { name: "Hugging Face Inference", price: "Freemium", url: "https://huggingface.co/inference-endpoints", tags: ["hosting","models"], desc: "Déploiement de modèles, endpoints managés." },

  // Sécurité IA / gouvernance
  { name: "Lakera Guard", price: "Freemium", url: "https://www.lakera.ai/guard", tags: ["security","prompt"], desc: "Protection contre injections de prompt et fuites." },
  { name: "Protect AI", price: "Freemium", url: "https://protectai.com/", tags: ["security","MLOps"], desc: "Sécurité MLOps (supply chain IA)." },

  // Modèles & OSS utiles
  { name: "StarCoder2 (BigCode)", price: "Gratuit", url: "https://huggingface.co/bigcode", tags: ["model","code"], desc: "Modèle open-source orienté code." },
  { name: "Code Llama (Meta)", price: "Gratuit", url: "https://ai.meta.com/research/publications/code-llama/", tags: ["model","code"], desc: "Famille de modèles pour code/infilling." },
  { name: "Codestral (Mistral)", price: "Freemium", url: "https://mistral.ai/news/codestral/", tags: ["model","code"], desc: "Modèle code Mistral, bon en complétion/édition." },
];

const PRICE_BADGE = {
  "Gratuit":   { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25" },
  "Freemium":  { cls: "bg-amber-500/15 text-amber-300 border-amber-400/25" },
  "Payant":    { cls: "bg-rose-500/15 text-rose-300 border-rose-400/25" },
};

function AIToolsWidget() {
  return (
    <Panel
      title="Outils IA pour les développeurs"
      right={<Pill>curated</Pill>}
      bodyClass="h-[24rem] overflow-y-auto pr-1"
    >
      <ul className="space-y-2">
        {AI_TOOLS.map((t) => {
          const badge = PRICE_BADGE[t.price] || PRICE_BADGE["Freemium"];
          return (
            <li key={t.name} className="p-3 transition border rounded-md border-white/10 bg-slate-800/50 hover:bg-slate-800/70">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-slate-100">{t.name}</div>
                <span className={`text-[0.7rem] px-2 py-0.5 rounded-full border ${badge.cls}`}>{t.price}</span>
                <div className="flex items-center gap-2 ml-auto">
                  {t.tags?.slice(0,3).map(tag => (
                    <span key={tag} className="text-[0.7rem] px-2 py-0.5 rounded-full border border-white/10 text-slate-300">#{tag}</span>
                  ))}
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 text-xs border rounded-md border-white/10 hover:bg-white/10"
                    title="Ouvrir"
                  >
                    ↗ Lien
                  </a>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t.desc}</p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/* --- Crypto (beaucoup de coins, scrollable) --- */
const COIN_LIST = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "binancecoin", symbol: "BNB" },
  { id: "ripple", symbol: "XRP" },
  { id: "cardano", symbol: "ADA" },
  { id: "avalanche-2", symbol: "AVAX" },
  { id: "dogecoin", symbol: "DOGE" },
  { id: "polygon-pos", symbol: "MATIC" },
  { id: "polkadot", symbol: "DOT" },
  { id: "chainlink", symbol: "LINK" },
  { id: "litecoin", symbol: "LTC" },
  { id: "tron", symbol: "TRX" },
  { id: "stellar", symbol: "XLM" },
  { id: "cosmos", symbol: "ATOM" },
  { id: "uniswap", symbol: "UNI" },
  { id: "near", symbol: "NEAR" },
  { id: "arbitrum", symbol: "ARB" },
  { id: "optimism", symbol: "OP" },
  { id: "filecoin", symbol: "FIL" },
  { id: "algorand", symbol: "ALGO" },
  { id: "vechain", symbol: "VET" },
  { id: "aptos", symbol: "APT" },
  { id: "the-graph", symbol: "GRT" },
  { id: "render-token", symbol: "RNDR" },
  { id: "internet-computer", symbol: "ICP" },
  { id: "hedera-hashgraph", symbol: "HBAR" },
  { id: "fantom", symbol: "FTM" },
];

// ajoute ceci si tu ne l'as pas déjà
function coinExternalUrl(id) {
  return `https://www.coingecko.com/en/coins/${id}`;
}

// REMPLACE uniquement CryptoWidget par cette version
function CryptoWidget() {
  const [prices, setPrices] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setErr("");
    const ids = COIN_LIST.map((c) => c.id);
    fetchCoinGeckoPrices(ids, "usd")
      .then((d) => setPrices(d))
      .catch((e) => setErr(e.message || "Erreur crypto"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Panel
      title="Crypto — Spot (tech majors)"
      right={
        <div className="flex items-center gap-2">
          <Pill>live</Pill>
          <button
            className="px-2 py-1 text-xs border rounded-md border-white/10 hover:bg-white/10"
            onClick={load}
            title="Rafraîchir"
            disabled={loading}
          >
            {loading ? "…" : "↻ Refresh"}
          </button>
        </div>
      }
      bodyClass="h-[24rem] overflow-y-auto pr-1"
    >
      {err && <div className="mb-2 text-sm text-rose-300">⚠ {err}</div>}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 rounded-md border border-white/10 bg-white/[.06] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COIN_LIST.map((c) => {
            const val = prices?.[c.id]?.usd;
            return (
              <a
                key={c.id}
                href={coinExternalUrl(c.id)}
                target="_blank"
                rel="noreferrer"
                className="p-3 transition border rounded-md border-white/10 bg-slate-800/60 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                title={`Ouvrir ${c.symbol} sur CoinGecko`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{c.symbol}</span>
                  <span className="opacity-70">↗</span>
                </div>
                <div className="mt-1 text-lg font-bold text-slate-100">
                  {val != null ? `$${Number(val).toLocaleString()}` : "—"}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </Panel>
  );
}


/* ============================
   Section principale
   ============================ */
export default function VeilleSection() {
  return (
    <section
      id="veille"
      className="min-h-screen px-4 py-12 snap-center text-slate-100"
      style={{
        ["--phi"]: PHI,
        background:
        "radial-gradient(60% 60% at 30% 20%, rgba(212,175,55,.05), transparent 62%), radial-gradient(40% 40% at 80% 70%, rgba(147,51,234,.04), transparent 62%), rgba(8,12,24,0.25)",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        /* scrollbars subtils */
        #veille ::-webkit-scrollbar { width: 8px; height: 8px; }
        #veille ::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 999px; }
        #veille ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div
        className="w-full mx-auto"
        style={{
          maxWidth: `${56 * PHI}rem`,
          padding: `${(INV * PHI) * PHI}rem ${1.0 * PHI}rem`,
        }}
      >
        <SectionHeader
          title="Veille technologique"
          subtitle="Dashboard live : dev, sécurité, IA — disposition claire, sobre, et scroll interne."
          tip={<>//</>}
        />

        {/* GRID : 3 colonnes desktop, 1 mobile */}
        <div className="grid grid-cols-1 gap-[1.0rem] lg:grid-cols-3">
          {/* Col 1 */}
          <div className="space-y-[1.0rem]">
            <HNWidget />
            <SitesWidget />
          </div>

          {/* Col 2 */}
          <div className="space-y-[1.0rem]">
            <GitHubWidget />
            <PeopleWidget />
          </div>

          {/* Col 3 */}
          <div className="space-y-[1.0rem]">
            <AIToolsWidget />
            <CryptoWidget />
          </div>
        </div>

        <div className="mt-[1.0rem] text-center text-[0.8rem] text-slate-500">
          Besoin d’un proxy RSS ou d’un filtre par tags (AI / Cloud / Security) ? Je peux l’ajouter sans casser la mise en page.
        </div>
      </div>
    </section>
  );
}
