"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$79/mo",
    blurb: "For lean dispo teams running a few deals a month.",
    features: [
      "Up to 50 active properties",
      "Basic comps and notes",
      "Email support",
      "1 workspace",
    ],
  },
  {
    name: "Pro",
    price: "$149/mo",
    blurb: "For teams pushing steady deal volume with collaboration.",
    features: [
      "Up to 200 active properties",
      "Advanced comps & tags",
      "Team comments",
      "Role-based access",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Let’s talk",
    blurb: "High-volume dispo with custom workflows and SLAs.",
    features: [
      "Unlimited properties",
      "Custom reporting",
      "SSO & audit logs",
      "API access",
      "Dedicated CSM",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-emerald-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.14),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(21,128,61,0.16),transparent_38%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.08),transparent_40%)] opacity-90" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 md:px-10 lg:px-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
            Pricing
          </p>
          <h1 className="text-3xl font-semibold">Choose your disposition tier</h1>
          <p className="max-w-2xl text-emerald-100/80">
            Keep the same minimal, glassy aesthetic—whether you&apos;re ramping up
            off-market deals or scaling a full team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-2xl border border-emerald-500/25 bg-white/5 p-6 shadow-[0_22px_60px_-34px_rgba(34,197,94,0.6)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/40 ${
                plan.highlight
                  ? "border-emerald-400/50 bg-emerald-900/20"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.highlight ? (
                  <span className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-50">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <p className="mt-1 text-sm text-emerald-100/80">{plan.blurb}</p>
              <ul className="mt-4 space-y-3 text-sm text-emerald-100/85">
                {plan.features.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-white/5 px-3 py-2"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <button className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:-translate-y-[1px] hover:bg-emerald-400">
                Get started
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
            Need something else?
          </p>
          <p className="mt-2 text-lg font-semibold">Custom enterprise</p>
          <p className="mt-1 max-w-3xl text-sm text-emerald-100/80">
            Connect your existing disposition workflows, CRMs, and comps engines.
            We can price by volume, seats, or performance.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-emerald-500/20"
          >
            Talk to us
          </Link>
        </div>
      </main>
    </div>
  );
}
