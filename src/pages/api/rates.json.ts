import type { APIRoute } from "astro";

const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUIRED_CURRENCIES = ["USD", "CAD", "GBP", "EUR", "SGD", "AED", "PHP"] as const;

type RatesPayload = {
  base: "USD";
  updatedAt: string;
  source: string;
  rates: Record<string, number>;
};

let cache: { expiresAt: number; payload: RatesPayload } | null = null;

const fallbackPayload: RatesPayload = {
  base: "USD",
  updatedAt: new Date().toISOString(),
  source: "fallback-static",
  rates: {
    USD: 1,
    CAD: 1.35,
    GBP: 0.77,
    EUR: 0.92,
    SGD: 1.34,
    AED: 3.67,
    PHP: 56.2,
  },
};

const pickRequiredRates = (rates: Record<string, number>): Record<string, number> => {
  const picked: Record<string, number> = {};

  REQUIRED_CURRENCIES.forEach((currency) => {
    if (currency === "USD") {
      picked[currency] = 1;
      return;
    }

    const rate = rates[currency];
    if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
      picked[currency] = rate;
    }
  });

  return picked;
};

const hasAllRequiredRates = (rates: Record<string, number>) =>
  REQUIRED_CURRENCIES.every((currency) => typeof rates[currency] === "number" && Number.isFinite(rates[currency]));

const fetchFromOpenErApi = async (): Promise<RatesPayload> => {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`open.er-api status ${response.status}`);
  }

  const payload = (await response.json()) as {
    result?: string;
    rates?: Record<string, number>;
    time_last_update_unix?: number;
  };

  if (payload.result !== "success" || !payload.rates) {
    throw new Error("open.er-api returned unexpected payload");
  }

  const rates = pickRequiredRates(payload.rates);
  if (!hasAllRequiredRates(rates)) {
    throw new Error("open.er-api missing one or more required currencies");
  }

  return {
    base: "USD",
    rates,
    updatedAt:
      typeof payload.time_last_update_unix === "number"
        ? new Date(payload.time_last_update_unix * 1000).toISOString()
        : new Date().toISOString(),
    source: "open.er-api",
  };
};

const fetchFromExchangeRateHost = async (): Promise<RatesPayload> => {
  const response = await fetch(
    "https://api.exchangerate.host/latest?base=USD&symbols=CAD,GBP,EUR,SGD,AED,PHP",
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`exchangerate.host status ${response.status}`);
  }

  const payload = (await response.json()) as {
    success?: boolean;
    rates?: Record<string, number>;
    date?: string;
  };

  if (!payload.rates) {
    throw new Error("exchangerate.host returned unexpected payload");
  }

  const rates = pickRequiredRates(payload.rates);
  if (!hasAllRequiredRates(rates)) {
    throw new Error("exchangerate.host missing one or more required currencies");
  }

  return {
    base: "USD",
    rates,
    updatedAt: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
    source: "exchangerate.host",
  };
};

const withCacheHeaders = (payload: RatesPayload) =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });

export const GET: APIRoute = async () => {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return withCacheHeaders(cache.payload);
  }

  const loaders = [fetchFromOpenErApi, fetchFromExchangeRateHost];

  for (const loadRates of loaders) {
    try {
      const payload = await loadRates();
      cache = {
        payload,
        expiresAt: now + CACHE_TTL_MS,
      };
      return withCacheHeaders(payload);
    } catch {
      // try next provider
    }
  }

  const fallback = {
    ...fallbackPayload,
    updatedAt: new Date().toISOString(),
  };

  cache = {
    payload: fallback,
    expiresAt: now + CACHE_TTL_MS,
  };

  return withCacheHeaders(fallback);
};
