// src/pages/Contact.jsx
import React, { useMemo, useState, useCallback } from "react";
import PageClose from "@/scenes/ui/PageClose.jsx";

const EMAIL = "s.mir.p293@gmail.com";
const PHONE = "+33 6 21 87 78 87";
const LINKEDIN = "https://www.linkedin.com/in/mir-sagar/";
const GITHUB = "https://github.com/smir75";
const DISCORD = "https://discord.gg/GZ59cJg5vR";

const TEMPLATES = [
  {
    key: "collab",
    label: "Collaboration projet",
    subject: "Collab dev — idée/projet à co-construire",
    body: `Bonjour Sagar,

Je te contacte pour une idée/projet sur lequel j’aimerais collaborer avec toi.

Contexte :
- Domaine :
- Objectifs :
- Stack envisagée :
- Périmètre / contraintes :

Serais-tu dispo pour un rapide échange (15–20 min) ?

Merci !
Signature`,
  },
  {
    key: "help",
    label: "Aide / Debug",
    subject: "Besoin d’un coup de main (debug / optimisation)",
    body: `Hello Sagar,

J’aurais besoin d’aide sur :
- Repo / lien :
- Problème :
- Erreurs/logs :
- Déjà tenté :

Si tu as un créneau, on peut checker ensemble (screen share). Merci !

Signature`,
  },
  {
    key: "alt",
    label: "Alternance / Stage",
    subject: "Alternance/Stage • BTS SIO SLAM (proposition)",
    body: `Bonjour Sagar,

Nous avons une opportunité d’alternance/stage qui pourrait t’intéresser.

Infos :
- Entreprise :
- Missions :
- Stack :
- Dates & rythme :

Souhaites-tu échanger ?

Cordialement,
Signature`,
  },
  {
    key: "quote",
    label: "Demande de devis",
    subject: "Demande de devis (site/app/API)",
    body: `Bonjour Sagar,

J’aimerais un devis pour :
- Type de projet (site vitrine, e-commerce, app, API, etc.) :
- Fonctionnalités clés :
- Délais / budget :
- Hébergement / infra :

Peux-tu me proposer une estimation et un phasage ?

Merci,
Signature`,
  },
  {
    key: "interview",
    label: "Invitation entretien",
    subject: "Invitation à un entretien",
    body: `Bonjour Sagar,

Nous souhaitons te proposer un entretien pour discuter de ton profil.

Propositions de créneaux :
-

Format : visio / sur site
Lieu (si sur site) :

Bien à toi,
Signature`,
  },
  {
    key: "support",
    label: "Support / Bug (portfolio)",
    subject: "Bug détecté sur ton portfolio",
    body: `Hello Sagar,

J’ai remarqué un problème sur ton site :
- Page/Section :
- Étapes pour reproduire :
- Message d’erreur / console :
- Capture d’écran (si possible) :

Je te laisse checker quand tu peux ;)

Merci,
Signature`,
  },
  {
    key: "hello",
    label: "Prise de contact rapide",
    subject: "Hello 👋",
    body: `Salut Sagar,

Je découvre ton travail et j’aimerais échanger rapidement.

Dispo(s) :
Canal préféré (tel/Discord/visio) :

À bientôt,
Signature`,
  },
];

// ---------------- Icons (SVG inline) ----------------
const Ic = {
  Phone: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C11.85 21 3 12.15 3 1a1 1 0 011-1h3.49a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.02L6.6 10.8z" />
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.32-2.47 4.78-2.47C22.6 7.73 24 10.1 24 14.07V24h-5v-8.64c0-2.06-.04-4.71-2.87-4.71-2.87 0-3.31 2.24-3.31 4.56V24H8z" />
    </svg>
  ),
  GitHub: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M12 .5A11.5 11.5 0 000 12a11.5 11.5 0 008 10.95c.59.11.8-.26.8-.57v-2c-3.25.71-3.94-1.4-3.94-1.4-.54-1.37-1.33-1.73-1.33-1.73-1.09-.75.08-.74.08-.74 1.21.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.6-.3-5.33-1.31-5.33-5.85 0-1.29.46-2.35 1.22-3.18-.12-.3-.53-1.51.12-3.16 0 0 1-.32 3.28 1.21a11.3 11.3 0 015.97 0c2.27-1.53 3.27-1.21 3.27-1.21.65 1.65.24 2.86.12 3.16.77.83 1.22 1.9 1.22 3.18 0 4.55-2.74 5.55-5.35 5.85.44.38.82 1.12.82 2.27v3.37c0 .31.21.68.81.57A11.5 11.5 0 0024 12 11.5 11.5 0 0012 .5z" />
    </svg>
  ),
  Discord: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M20.3 4.4A19 19 0 0016.9 3l-.2.4a17 17 0 00-9.5 0L7 3A19 19 0 003.6 4.5C1.8 7.2 1.1 9.9 1.3 12.6c1.6 1.2 3.1 1.9 4.6 2.4l.9-1.6c-.5-.2-.9-.5-1.3-.8.3.2.6.3.9.5 2 1 4.1 1.5 6.2 1.5s4.2-.5 6.2-1.5c.3-.1.6-.3.9-.5-.4.3-.8.6-1.3.8l.9 1.6c1.5-.5 3.1-1.2 4.6-2.4.2-2.9-.5-5.6-2.4-8.2zM8.9 13.2c-.8 0-1.5-.7-1.5-1.6 0-.8.7-1.6 1.5-1.6.9 0 1.5.7 1.5 1.6s-.6 1.6-1.5 1.6zm6.2 0c-.8 0-1.5-.7-1.5-1.6 0-.8.7-1.6 1.5-1.6.9 0 1.5.7 1.5 1.6s-.6 1.6-1.5 1.6z" />
    </svg>
  ),
  Gmail: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M20 18V7.3l-8 5.7-8-5.7V18h4V9.7l4 2.9 4-2.9V18h4zM20 6h-1l-7 5-7-5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4V12l4 3 4-3v10h4c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  Outlook: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M2 5.5A2.5 2.5 0 014.5 3H15v4H4.5A2.5 2.5 0 012 4.5v1zM15 7h5.5A1.5 1.5 0 0122 8.5v10A1.5 1.5 0 0120.5 20H15V7zM2 7.5v10A2.5 2.5 0 004.5 20H15V9H4.5A2.5 2.5 0 012 6.5v1z" />
      <path d="M8.25 11A3.25 3.25 0 1011.5 14.25 3.25 3.25 0 008.25 11zm0 1.5A1.75 1.75 0 1110 14.25 1.75 1.75 0 018.25 12.5z" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M20 4H4a2 2 0 00-2 2v.4l10 6.25L22 6.4V6a2 2 0 00-2-2zm2 5.2l-9.4 5.9a1 1 0 01-1.2 0L2 9.2V18a2 2 0 002 2h16a2 2 0 002-2V9.2z" />
    </svg>
  ),
};

// ---------------- Helpers ----------------
const enc = encodeURIComponent;

function mailtoHref(to, subject, body) {
  return `mailto:${to}?subject=${enc(subject)}&body=${enc(body)}`;
}
function gmailHref(to, subject, body) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(
    subject
  )}&body=${enc(body)}`;
}
function outlookHref(to, subject, body) {
  // Outlook Web / Office 365 deeplink
  return `https://outlook.office.com/mail/deeplink/compose?to=${enc(
    to
  )}&subject=${enc(subject)}&body=${enc(body)}`;
}

const Button = ({ className = "", ...p }) => (
  <button
    className={`px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-100 hover:bg-slate-800/70 transition ${className}`}
    {...p}
  />
);

export default function Contact() {
  const [activeKey, setActiveKey] = useState(TEMPLATES[0].key);
  const activeTemplate = useMemo(
    () => TEMPLATES.find((t) => t.key === activeKey) ?? TEMPLATES[0],
    [activeKey]
  );
  const [subject, setSubject] = useState(activeTemplate.subject);
  const [message, setMessage] = useState(activeTemplate.body);

  // Sync quand on change de template
  const onPick = useCallback((k) => {
    const t = TEMPLATES.find((x) => x.key === k) ?? TEMPLATES[0];
    setActiveKey(k);
    setSubject(t.subject);
    setMessage(t.body);
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${message}`);
    } catch {
      const tmp = document.createElement("textarea");
      tmp.value = `${subject}\n\n${message}`;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
  }, [subject, message]);

  const hrefs = useMemo(
    () => ({
      gmail: gmailHref(EMAIL, subject, message),
      outlook: outlookHref(EMAIL, subject, message),
      mailto: mailtoHref(EMAIL, subject, message),
    }),
    [subject, message]
  );

  return (
    <div className="page-glass">
      {/* Header */}
      <header className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-orbitron holo-title">Contact</h2>
            <p className="text-sm text-slate-400">
              Choisis un template, personnalise le message, puis envoie avec ton client favori.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PageClose />
          </div>
        </div>

        {/* Choix du provider d’envoi */}
        <div className="flex flex-wrap gap-2 mt-3">
          <a
            href={hrefs.gmail}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 transition"
            title="Ouvrir Gmail Compose"
          >
            <Ic.Gmail /> Gmail
          </a>
          <a
            href={hrefs.outlook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/20 transition"
            title="Ouvrir Outlook Web"
          >
            <Ic.Outlook /> Outlook Web
          </a>
          <a
            href={hrefs.mailto}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/70 transition"
            title="Ouvrir le client mail par défaut"
          >
            <Ic.Mail /> Client par défaut
          </a>
          <Button onClick={onCopy}>Copier le message</Button>
        </div>

        {/* Coordonnées rapides */}
        <div className="grid gap-3 mt-4 md:grid-cols-4">
          <a
            href={`tel:${PHONE.replace(/\s+/g, "")}`}
            className="p-3 transition border rounded-2xl border-slate-700/60 bg-slate-900/50 hover:bg-slate-800/60"
            title="Appeler"
          >
            <div className="flex items-center gap-2">
              <Ic.Phone />
              <div>
                <div className="text-sm opacity-80">Téléphone</div>
                <div className="mt-0.5 text-slate-200">{PHONE}</div>
              </div>
            </div>
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="p-3 transition border rounded-2xl border-slate-700/60 bg-slate-900/50 hover:bg-slate-800/60"
            title="LinkedIn"
          >
            <div className="flex items-center gap-2">
              <Ic.LinkedIn />
              <div>
                <div className="text-sm opacity-80">LinkedIn</div>
                <div className="mt-0.5 text-slate-200 break-all">{LINKEDIN}</div>
              </div>
            </div>
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="p-3 transition border rounded-2xl border-slate-700/60 bg-slate-900/50 hover:bg-slate-800/60"
            title="GitHub"
          >
            <div className="flex items-center gap-2">
              <Ic.GitHub />
              <div>
                <div className="text-sm opacity-80">GitHub</div>
                <div className="mt-0.5 text-slate-200 break-all">{GITHUB}</div>
              </div>
            </div>
          </a>
          <a
            href={DISCORD}
            target="_blank"
            rel="noreferrer"
            className="p-3 transition border rounded-2xl border-slate-700/60 bg-slate-900/50 hover:bg-slate-800/60"
            title="Discord (contact rapide)"
          >
            <div className="flex items-center gap-2">
              <Ic.Discord />
              <div>
                <div className="text-sm opacity-80">Discord</div>
                <div className="mt-0.5 text-slate-200 break-all">{DISCORD}</div>
              </div>
            </div>
          </a>
        </div>
      </header>

      {/* Editeur + Templates */}
      <section className="p-4 pt-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <Button
              key={t.key}
              className={t.key === activeKey ? "holo-chip" : ""}
              onClick={() => onPick(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2 md:col-span-1">
            <label className="block text-xs text-slate-400">Sujet</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-slate-700/60 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              placeholder="Sujet de l'email"
            />
            <div className="text-xs text-slate-500">
              Astuce : tu peux modifier sujet + message avant d’ouvrir Gmail/Outlook.
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-400">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-slate-700/60 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              placeholder="Ton message…"
            />
            <p className="mt-2 text-xs text-slate-500">
              Les retours à la ligne sont conservés dans Gmail/Outlook. Si l’appli mail native s’ouvre, c’est normal : tu as cliqué sur « client par défaut ».
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
