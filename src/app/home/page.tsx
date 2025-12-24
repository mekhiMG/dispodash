"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const stats = [
  { label: "Active deals", value: "8", sub: "Filtered and ready to push" },
  { label: "Hot deals", value: "2", sub: "Move first on these" },
  { label: "Avg spread", value: "$99,625", sub: "ARV minus purchase" },
];

const featured = {
  title: "1430 Willow St",
  location: "Dallas, TX · Single Family",
  purchase: "$218,000",
  arv: "$305,000",
  spread: "$87,000",
};

const activity = [
  "Offer submitted on Phoenix, AZ",
  "Comps viewed for Indianapolis, IN",
  "New off-market added: Charlotte, NC",
  "Section 8 rental updated: Cleveland, OH",
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHook, setShowHook] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hookText =
    "Most investors are fighting over the same 1% of public listings, but the real wealth is hidden in the other 99%. Arkhived was built to give you a direct line to off-market opportunities before they ever hit the mainstream—it’s real estate’s best-kept secrets, Arkhived for you.";

  const stopTyping = () => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
  };

  const startTyping = () => {
    stopTyping();
    setTypedText("");
    setShowHook(true);
    let idx = 0;
    typingRef.current = setInterval(() => {
      idx += 1;
      setTypedText(hookText.slice(0, idx));
      if (idx >= hookText.length) {
        stopTyping();
      }
    }, 12);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-emerald-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,158,77,0.1),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(15,20,28,0.55),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(30,158,77,0.06),transparent_40%)] opacity-80" />
      <header className="relative z-30 mx-4 mt-1 md:mx-6 md:mt-2">
        <div className="flex items-center justify-between gap-3 px-1 py-1">
          <div className="flex flex-1 justify-center">
            <Image
              src="/chrome.PNG"
              alt="Arkhived logo"
              width={500}
              height={210}
              priority
              className="h-12 w-auto origin-left scale-[1.5]"
            />
          </div>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-emerald-500/20"
            aria-label="Toggle menu"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-30 bg-black/50 transition duration-300 ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-72 max-w-[80vw] flex-col gap-4 bg-black/90 p-5 text-emerald-50 shadow-[0_18px_48px_-28px_rgba(16,185,129,0.8)] backdrop-blur transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end">
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-emerald-500/20"
            aria-label="Close menu"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
              <span className="block h-0.5 w-4 rounded bg-emerald-100" />
            </span>
          </button>
        </div>
        <nav className="mt-2 space-y-2">
          <Link
            href="/home"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-black/30 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-black/40"
          >
            Home
          </Link>
          <Link
            href="/arkhived"
            onClick={() => setSidebarOpen(false)}
            onMouseEnter={startTyping}
            onMouseLeave={() => {
              stopTyping();
              setTypedText("");
              setShowHook(false);
            }}
            className="relative flex items-center justify-between rounded-xl border border-emerald-500/20 bg-black/30 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-black/40"
          >
            Arkhived
            <div
              className={`pointer-events-none absolute top-1/2 right-full mr-3 w-80 max-w-[70vw] -translate-y-1/2 overflow-hidden rounded-xl border border-emerald-500/20 bg-black/80 p-3 shadow-[0_18px_48px_-32px_rgba(16,185,129,0.8)] backdrop-blur transition duration-300 ${
                showHook ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">
                Control Center
              </p>
              <div className="mt-2 font-mono text-xs leading-relaxed text-emerald-100">
                {typedText}
                {showHook && typedText.length < hookText.length ? (
                  <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-emerald-200 align-middle" />
                ) : null}
              </div>
            </div>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-black/30 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-black/40"
          >
            Pricing
          </Link>
        </nav>
        <div className="mt-auto space-y-2">
          <button
            onClick={() => {
              setSidebarOpen(false);
              // hook up sign-out if available
            }}
            className="w-full rounded-xl border border-emerald-500/30 bg-white/5 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/60 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-14 pt-24 md:px-10 lg:px-12">
        <header className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/25 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-emerald-100/80">
            Arkhived Overview
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Your off-market command intro
          </h1>
          <p className="max-w-3xl text-emerald-100/80">
            Start here, then jump into the Control Center to work deals or view pricing for your team. No extra workflows—just a clear entry point.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/arkhived"
              className="rounded-full border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-[0_12px_30px_-16px_rgba(16,185,129,0.8)] transition hover:-translate-y-[1px] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Enter Arkhived
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-emerald-500/25 bg-white/5 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>
        </header>

        <section className="grid gap-4 rounded-2xl border border-emerald-500/20 bg-white/5 p-4 backdrop-blur md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-card transition hover:-translate-y-1 hover:border-emerald-400/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-emerald-100/70">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-6 shadow-[0_22px_60px_-34px_rgba(34,197,94,0.6)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
              Featured deal
            </p>
            <h3 className="mt-2 text-xl font-semibold">{featured.title}</h3>
            <p className="text-sm text-emerald-100/70">{featured.location}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-emerald-100/80">
              <div className="rounded-lg border border-emerald-500/25 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                  Purchase
                </p>
                <p className="text-base font-semibold text-emerald-50">
                  {featured.purchase}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/25 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                  ARV
                </p>
                <p className="text-base font-semibold text-emerald-50">
                  {featured.arv}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/25 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                  Spread
                </p>
                <p className="text-base font-semibold text-emerald-50">
                  {featured.spread}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/25 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                  Action
                </p>
                <Link
                  href="/arkhived"
                  className="text-sm font-semibold text-emerald-200 underline underline-offset-4"
                >
                  Open in Arkhived
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-6 shadow-[0_22px_60px_-34px_rgba(34,197,94,0.6)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
              Recent activity
            </p>
            <ul className="mt-3 space-y-3 text-sm text-emerald-100/85">
              {activity.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-white/5 px-3 py-2"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
