"use client";

import Image from "next/image";
import Link from "next/link";
import { Map, Overlay, ZoomControl } from "pigeon-maps";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type DealStrategy = "Wholesale" | "Section 8" | "Fix & Flip" | "Standard Rental";
type Structure = "Single Family" | "Multi Family";
type DealStatus = "Hot" | "New" | "Underwriting" | "Ready";

type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  price: number;
  arv: number;
  strategy: DealStrategy;
  structure: Structure;
  beds: number;
  baths: number;
  sqft: number;
  lat: number;
  lng: number;
  status: DealStatus;
  rent?: number;
};

const properties: Property[] = [
  {
    id: 1,
    address: "1430 Willow St",
    city: "Dallas",
    state: "TX",
    price: 218000,
    arv: 305000,
    strategy: "Wholesale",
    structure: "Single Family",
    beds: 3,
    baths: 2,
    sqft: 1680,
    lat: 32.7767,
    lng: -96.797,
    status: "Hot",
  },
  {
    id: 2,
    address: "8825 Magnolia Cir",
    city: "Atlanta",
    state: "GA",
    price: 189000,
    arv: 265000,
    strategy: "Section 8",
    structure: "Single Family",
    beds: 4,
    baths: 2,
    sqft: 1560,
    lat: 33.749,
    lng: -84.388,
    rent: 2350,
    status: "Ready",
  },
  {
    id: 3,
    address: "4129 Oak Crest Dr",
    city: "Phoenix",
    state: "AZ",
    price: 335000,
    arv: 465000,
    strategy: "Fix & Flip",
    structure: "Single Family",
    beds: 4,
    baths: 3,
    sqft: 2100,
    lat: 33.4484,
    lng: -112.074,
    status: "Underwriting",
  },
  {
    id: 4,
    address: "97 Harbor View",
    city: "Tampa",
    state: "FL",
    price: 412000,
    arv: 575000,
    strategy: "Fix & Flip",
    structure: "Single Family",
    beds: 5,
    baths: 3,
    sqft: 2480,
    lat: 27.9506,
    lng: -82.4572,
    status: "New",
  },
  {
    id: 5,
    address: "607 Parkside Ave",
    city: "Chicago",
    state: "IL",
    price: 260000,
    arv: 355000,
    strategy: "Wholesale",
    structure: "Multi Family",
    beds: 6,
    baths: 3,
    sqft: 3200,
    lat: 41.8781,
    lng: -87.6298,
    status: "Hot",
  },
  {
    id: 6,
    address: "210 Alder Row",
    city: "Cleveland",
    state: "OH",
    price: 142000,
    arv: 205000,
    strategy: "Standard Rental",
    structure: "Single Family",
    beds: 3,
    baths: 1,
    sqft: 1260,
    lat: 41.4993,
    lng: -81.6944,
    rent: 1650,
    status: "Ready",
  },
  {
    id: 7,
    address: "55 Grove Place",
    city: "Indianapolis",
    state: "IN",
    price: 178000,
    arv: 245000,
    strategy: "Section 8",
    structure: "Multi Family",
    beds: 4,
    baths: 2,
    sqft: 1850,
    lat: 39.7684,
    lng: -86.1581,
    rent: 2600,
    status: "Underwriting",
  },
  {
    id: 8,
    address: "994 Lakehurst Rd",
    city: "Charlotte",
    state: "NC",
    price: 322000,
    arv: 438000,
    strategy: "Standard Rental",
    structure: "Single Family",
    beds: 4,
    baths: 2,
    sqft: 2100,
    lat: 35.2271,
    lng: -80.8431,
    rent: 2700,
    status: "New",
  },
];

const strategies: Array<DealStrategy | "All"> = [
  "All",
  "Wholesale",
  "Section 8",
  "Fix & Flip",
  "Standard Rental",
];

const structures: Array<Structure | "All"> = [
  "All",
  "Single Family",
  "Multi Family",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const searchParams = useSearchParams();
  const forceAuthed = searchParams.get("authed") === "1";
  const [isAuthed, setIsAuthed] = useState(forceAuthed);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [strategyFilter, setStrategyFilter] = useState<DealStrategy | "All">(
    "All",
  );
  const [structureFilter, setStructureFilter] = useState<Structure | "All">(
    "All",
  );
  const [search, setSearch] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    39.5,
    -98.35,
  ]);
  const [mapZoom, setMapZoom] = useState(4);
  const [animateDash, setAnimateDash] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const [showHook, setShowHook] = useState(false);
  const hookText =
    "Most investors are fighting over the same 1% of public listings, but the real wealth is hidden in the other 99%. Arkhived was built to give you a direct line to off-market opportunities before they ever hit the mainstream—it’s real estate’s best-kept secrets, Arkhived for you.";
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const darkTiles = useMemo(() => {
    if (!mapTilerKey) return null;
    return (x: number, y: number, z: number, dpr?: number) =>
      `https://api.maptiler.com/maps/basic-v2-dark/256/${z}/${x}/${y}${
        dpr && dpr >= 2 ? "@2x" : ""
      }.png?key=${mapTilerKey}`;
  }, [mapTilerKey]);

  const authed = isAuthed || forceAuthed;

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesStrategy =
        strategyFilter === "All" || property.strategy === strategyFilter;
      const matchesStructure =
        structureFilter === "All" || property.structure === structureFilter;
      const matchesSearch =
        `${property.address} ${property.city} ${property.state}`
          .toLowerCase()
          .includes(search.toLowerCase().trim());
      return matchesStrategy && matchesStructure && matchesSearch;
    });
  }, [strategyFilter, structureFilter, search]);

  const hotDeals = filteredProperties.filter((p) => p.status === "Hot").length;
  const avgSpread =
    filteredProperties.reduce((sum, p) => sum + (p.arv - p.price), 0) /
    Math.max(filteredProperties.length, 1);
  const rentals = filteredProperties.filter(
    (p) => p.strategy === "Standard Rental" || p.strategy === "Section 8",
  );
  const avgRent =
    rentals.reduce((sum, p) => sum + (p.rent ?? 0), 0) /
    Math.max(rentals.length, 1);

  const activePropertyId = useMemo(() => {
    if (
      selectedPropertyId &&
      filteredProperties.some((p) => p.id === selectedPropertyId)
    ) {
      return selectedPropertyId;
    }
    return filteredProperties[0]?.id ?? null;
  }, [filteredProperties, selectedPropertyId]);

  const selectedProperty =
    filteredProperties.find((p) => p.id === activePropertyId) ?? null;

  const handleSelectProperty = (property: Property) => {
    setSelectedPropertyId(property.id);
    setMapCenter([property.lat, property.lng]);
    setMapZoom(8);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError("Enter your email and password to continue.");
      return;
    }
    setAuthError("");
    setIsAuthed(true);
    setAnimateDash(true);
    setTimeout(() => setAnimateDash(false), 800);
    const firstProperty = properties[0];
    if (firstProperty) {
      setSelectedPropertyId(firstProperty.id);
      setMapCenter([firstProperty.lat, firstProperty.lng]);
      setMapZoom(6);
    }
  };

  const resetSession = () => {
    setIsAuthed(false);
    setPassword("");
  };

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
      {authed ? (
        <>
          <header className="relative z-30 mx-4 mt-1 md:mx-6 md:mt-2">
            <div className="flex items-center justify-between gap-3 px-1 py-1">
              <div className="flex flex-1 justify-left">
                <Image
                  src="/Dispo.png"
                  alt="Dispositioning logo"
                  width={420}
                  height={130}
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
            className={`fixed inset-0 z-30 bg-black/50 transition duration-300 ${
              sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
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
                  resetSession();
                }}
                className="w-full rounded-xl border border-emerald-500/30 bg-white/5 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/60 hover:bg-white/10"
              >
                Sign out
              </button>
              <p className="text-[11px] text-emerald-200/70">
                Swipe or tap to open. Routes include Off-Market and Pricing; extend
                as you add more pages.
              </p>
            </div>
          </aside>
        </>
      ) : null}

      <main
        className={`relative z-10 mx-auto flex min-h-screen ${
          isAuthed
            ? "max-w-7xl flex-col gap-8 px-6 pb-12 pt-8 md:px-10 lg:px-12"
            : "max-w-5xl flex-col items-center justify-center gap-8 px-6 py-20 md:px-10 lg:px-12"
        }`}
      >
        {!isAuthed ? (
          <section className="fade-in page-transition grid w-full max-w-5xl gap-10 rounded-3xl border border-emerald-500/20 bg-emerald-950/40 p-8 shadow-[0_25px_60px_-30px_rgba(15,118,110,0.6)] backdrop-blur-lg md:grid-cols-2 md:p-12">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-100/80">
                Pipeline-first design
              </p>
              <h2 className="text-3xl font-semibold leading-tight">
                Minimal, focused dashboard for off-market deals.
              </h2>
              <p className="text-emerald-100/80">
                Log in to see live disposition boards with spreads, rental yield,
                and a clean glide from login to deal cards.
              </p>
              <div className="grid gap-3 text-sm text-emerald-100/80">
                {[
                  "Track wholesale, Section 8, flip, and rental opportunities.",
                  "Surface spreads, cashflow, and deal-ready status at a glance.",
                  "Snappy transitions with glass panels and subtle motion.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-white/5 px-4 py-3"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-surface/70 p-6 shadow-[0_20px_60px_-30px_rgba(74,222,128,0.45)] backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                    Login
                  </p>
                  <p className="text-lg font-semibold">Disposition access</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-50">
                  Mock only
                </span>
              </div>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-sm text-emerald-100/80">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-emerald-500/30 bg-white/5 px-4 py-3 text-emerald-50 outline-none transition focus:-translate-y-[1px] focus:border-emerald-400/70 focus:bg-white/10"
                    placeholder="you@dispo.co"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-emerald-100/80">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-emerald-500/30 bg-white/5 px-4 py-3 text-emerald-50 outline-none transition focus:-translate-y-[1px] focus:border-emerald-400/70 focus:bg-white/10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                {authError ? (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                    {authError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:-translate-y-[1px] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  Enter dashboard
                </button>
              </form>
              <p className="mt-6 text-xs text-emerald-200/70">
                Auth is mocked for now. When ready, this can hook into your
                dispositioning system&apos;s login route.
              </p>
            </div>
          </section>
        ) : (
          <section className={`fade-in space-y-6 ${animateDash ? "page-transition" : "page-transition"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Map Room
                </p>
                <h2 className="text-2xl font-semibold">
                  Pan the U.S. map and open properties from markers
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/5 px-4 py-2 text-sm text-emerald-100/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Live mock data
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/5 px-4 py-2 text-sm text-emerald-100/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  Styled map + pop cards
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-emerald-500/25 bg-white/5 p-4 backdrop-blur md:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-card transition hover:-translate-y-1 hover:border-emerald-400/40">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Active deals
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {filteredProperties.length}
                </p>
                <p className="text-sm text-emerald-100/70">
                  Filtered and ready to push
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/5 p-4 shadow-card transition hover:-translate-y-1 hover:border-emerald-400/40">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Avg spread
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(avgSpread)}
                </p>
                <p className="text-sm text-emerald-100/70">
                  ARV minus purchase
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/5 p-4 shadow-card transition hover:-translate-y-1 hover:border-emerald-400/40">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Hot deals
                </p>
                <p className="mt-2 text-2xl font-semibold">{hotDeals}</p>
                <p className="text-sm text-emerald-100/70">
                  Move first on these
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/5 p-4 shadow-card transition hover:-translate-y-1 hover:border-emerald-400/40">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Avg rent (rentals)
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {avgRent > 0 ? formatCurrency(avgRent) : "—"}
                </p>
                <p className="text-sm text-emerald-100/70">Section 8 + rentals</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-emerald-950/40 shadow-[0_28px_80px_-40px_rgba(16,185,129,0.8)] backdrop-blur">
              <Map
                height={720}
                defaultCenter={[39.5, -98.35]}
                defaultZoom={4}
                center={mapCenter}
                zoom={mapZoom}
                provider={darkTiles ?? undefined}
                onBoundsChanged={({
                  center,
                  zoom,
                }: {
                  center: [number, number];
                  zoom: number;
                }) => {
                  setMapCenter(center);
                  setMapZoom(zoom);
                }}
                animate
              >
                <ZoomControl />
                {filteredProperties.map((property) => {
                  const isSelected = activePropertyId === property.id;
                  return (
                    <Overlay
                      key={property.id}
                      anchor={[property.lat, property.lng]}
                      offset={[0, 36]}
                    >
                      <button
                        onClick={() => handleSelectProperty(property)}
                        className={`group relative flex flex-col items-center gap-2 text-xs font-medium transition ${
                          isSelected ? "scale-[1.03]" : "opacity-90"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full border bg-emerald-900/80 text-emerald-50 shadow-[0_10px_30px_-12px_rgba(34,197,94,0.7)] ring-1 ring-emerald-500/60 transition ${
                            isSelected
                              ? "border-emerald-300 bg-emerald-500/20"
                              : "border-emerald-500/40"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isSelected ? "bg-emerald-300" : "bg-emerald-100"
                            }`}
                          />
                        </span>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-900/85 px-2 py-1 text-[11px] text-emerald-50 shadow-sm backdrop-blur">
                          {property.city}, {property.state}
                        </span>
                      </button>
                    </Overlay>
                  );
                })}
              </Map>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(74,222,128,0.08),transparent_38%),radial-gradient(circle_at_80%_10%,rgba(52,211,153,0.12),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(52,211,153,0.08),transparent_35%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-emerald-500/20" />

              <div className="absolute left-4 top-4 z-10 flex flex-col gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-950/80 p-4 text-sm text-emerald-50 shadow-card backdrop-blur">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-emerald-200/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Filters
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
                    Strategy
                    <select
                      value={strategyFilter}
                      onChange={(e) =>
                        setStrategyFilter(e.target.value as DealStrategy | "All")
                      }
                      className="rounded-full bg-transparent text-emerald-50 outline-none"
                    >
                      {strategies.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-emerald-900 text-emerald-50"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/5 px-4 py-2 text-xs text-emerald-100">
                    Structure
                    <select
                      value={structureFilter}
                      onChange={(e) =>
                        setStructureFilter(e.target.value as Structure | "All")
                      }
                      className="rounded-full bg-transparent text-emerald-50 outline-none"
                    >
                      {structures.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-emerald-900 text-emerald-50"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex w-full items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-full border border-emerald-500/30 bg-white/5 px-4 py-2 text-xs text-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search city, state, or address"
                      className="w-full bg-transparent text-emerald-50 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSearch("");
                      setStrategyFilter("All");
                      setStructureFilter("All");
                    }}
                    className="rounded-full border border-emerald-500/30 bg-white/5 px-3 py-2 text-xs text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/50 hover:bg-white/10"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                {filteredProperties.length} markers active
              </div>

              {selectedProperty ? (
                <div className="absolute bottom-4 left-4 z-10 w-full max-w-[380px] rounded-2xl border border-emerald-500/30 bg-emerald-950/85 p-4 text-emerald-50 shadow-[0_22px_60px_-30px_rgba(34,197,94,0.8)] backdrop-blur">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-emerald-200/70">
                        {selectedProperty.strategy}
                      </p>
                      <p className="text-xl font-semibold">
                        {selectedProperty.address}
                      </p>
                      <p className="text-sm text-emerald-100/70">
                        {selectedProperty.city}, {selectedProperty.state} ·{" "}
                        {selectedProperty.structure}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-50">
                      {selectedProperty.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-emerald-100/80">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                        Purchase
                      </p>
                      <p className="text-base font-semibold text-emerald-50">
                        {formatCurrency(selectedProperty.price)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                        ARV
                      </p>
                      <p className="text-base font-semibold text-emerald-50">
                        {formatCurrency(selectedProperty.arv)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                        Spread
                      </p>
                      <p className="text-base font-semibold text-emerald-50">
                        {formatCurrency(
                          selectedProperty.arv - selectedProperty.price,
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-200/70">
                        Beds / Baths
                      </p>
                      <p className="text-base font-semibold text-emerald-50">
                        {selectedProperty.beds} bd · {selectedProperty.baths} ba
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-100/80">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span>Ready for offers</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-emerald-500/25 bg-white/5 px-3 py-2 text-sm font-medium text-emerald-100 transition hover:-translate-y-[1px] hover:border-emerald-400/40 hover:bg-white/10">
                        View comps
                      </button>
                      <button className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:-translate-y-[1px] hover:bg-emerald-400">
                        Start offer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 z-10 rounded-2xl border border-emerald-500/20 bg-emerald-950/80 px-4 py-3 text-sm text-emerald-100/80 backdrop-blur">
                  No properties match this filter yet. Clear filters to see all.
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
