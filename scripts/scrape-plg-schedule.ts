import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

type TeamInfo = {
  name_en: string;
  logo: string;
};

type TeamWithLogo = {
  name: string;
  logo: string;
};

type ScheduleGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  away_score?: number;
  home_score?: number;
  away_team: TeamWithLogo;
  home_team: TeamWithLogo;
};

type ScrapedImage = {
  src: string;
  alt: string;
  context: string;
};

type ScrapedPayload = {
  title: string;
  scheduleText: string;
  images: ScrapedImage[];
};

const DEFAULT_SEASON = "2025-26";
const DEFAULT_URL = "https://pleagueofficial.com/schedule-regular-season/2025-26";
const DEFAULT_OUTPUT = path.join(process.cwd(), "data", "plg_schedule_2025_26.json");

const TEAM_ALIASES: Record<string, { aliases: string[]; name_en: string }> = {
  勇士: {
    aliases: ["勇士", "臺北富邦勇士", "台北富邦勇士", "Taipei Fubon Braves"],
    name_en: "Taipei Fubon Braves",
  },
  領航猿: {
    aliases: ["領航猿", "桃園璞園領航猿", "Taoyuan Pauian Pilots"],
    name_en: "Taoyuan Pauian Pilots",
  },
  獵鷹: {
    aliases: ["獵鷹", "台鋼獵鷹", "TSG Ghosthawks"],
    name_en: "TSG Ghosthawks",
  },
  洋基工程: {
    aliases: ["洋基工程", "Yankey Ark Professional Basketball Team"],
    name_en: "Yankey Ark Professional Basketball Team",
  },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function withRetry<T>(task: () => Promise<T>, retries = 3, delayMs = 1500): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        break;
      }

      console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
      console.warn(formatError(error));
      await sleep(delayMs);
    }
  }

  throw lastError;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)));
}

function normalizeLine(value: string) {
  return normalizeWhitespace(value);
}

function htmlToLines(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gis, "\n")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gis, "\n")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gis, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "\n"),
  )
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
}

function stripHtml(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gis, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gis, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gis, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|li|ul|ol|h1|h2|h3|h4|h5|h6|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
}

function extractTitleFromHtml(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return normalizeWhitespace(decodeHtmlEntities(match?.[1] ?? ""));
}

function extractImagesFromHtml(html: string, pageUrl: string) {
  const images: ScrapedImage[] = [];
  const imageTagPattern = /<img\b[^>]*>/gi;

  for (const match of html.matchAll(imageTagPattern)) {
    const tag = match[0];
    const srcMatch = tag.match(/\b(?:src|data-src)=["']([^"']*upload\/p_team\/logo_[^"']+)["']/i);
    if (!srcMatch) {
      continue;
    }

    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
    const matchIndex = match.index ?? 0;
    const contextWindow = html.slice(Math.max(0, matchIndex - 500), Math.min(html.length, matchIndex + 500));

    images.push({
      src: new URL(decodeHtmlEntities(srcMatch[1]), pageUrl).href,
      alt: decodeHtmlEntities(altMatch?.[1] ?? ""),
      context: normalizeWhitespace(stripHtml(contextWindow)),
    });
  }

  return images;
}

function extractPayloadFromHtml(html: string, pageUrl: string): ScrapedPayload {
  const text = htmlToLines(html).join("\n");
  const startIndex = text.indexOf("例行賽賽程");
  const scheduleText = startIndex >= 0 ? text.slice(startIndex) : text;

  return {
    title: extractTitleFromHtml(html),
    scheduleText,
    images: extractImagesFromHtml(html, pageUrl),
  };
}

function isAsciiLine(value: string) {
  return /^[A-Za-z0-9 .'+&()-]+$/.test(value);
}

function isScoreLine(value: string) {
  return /^\d{1,3}$/.test(value);
}

function isTicketLine(value: string) {
  return /^\d[\d,]*\s*\/\s*\d[\d,]*$/.test(value);
}

function isDateLine(value: string) {
  return /^\d{2}\/\d{2}$/.test(value);
}

function isGameIdLine(value: string) {
  return /^G\d{2,3}$/.test(value);
}

function isWeekdayLine(value: string) {
  return /^\([一二三四五六日]\)$/.test(value);
}

function dedupeRepeatedWords(value: string) {
  const parts = value.split(" ").filter(Boolean);

  if (parts.length === 2 && parts[0] === parts[1]) {
    return parts[0];
  }

  if (parts.length % 2 === 0) {
    const half = parts.length / 2;
    const firstHalf = parts.slice(0, half).join(" ");
    const secondHalf = parts.slice(half).join(" ");
    if (firstHalf === secondHalf) {
      return firstHalf;
    }
  }

  return value;
}

function normalizeTeamName(value: string) {
  const cleaned = dedupeRepeatedWords(value);

  for (const [canonicalName, team] of Object.entries(TEAM_ALIASES)) {
    if (team.aliases.some((alias) => cleaned.includes(alias))) {
      return canonicalName;
    }
  }

  return cleaned;
}

function buildIsoDate(monthDay: string, season: string) {
  const [startYear] = season.split("-").map((value) => Number.parseInt(value, 10));
  const [month, day] = monthDay.split("/").map((value) => Number.parseInt(value, 10));
  const year = month >= 7 ? startYear : startYear + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getLastScore(lines: string[]) {
  const scores = lines.filter(isScoreLine);
  if (scores.length === 0) {
    return undefined;
  }

  const value = Number.parseInt(scores[scores.length - 1], 10);
  return value === 0 ? undefined : value;
}

function extractTeamName(lines: string[]) {
  for (const line of lines) {
    if (isAsciiLine(line) || isScoreLine(line) || isTicketLine(line)) {
      continue;
    }

    if (line === "客隊" || line === "主隊" || line === "數據" || line === "售票" || line === "追蹤賽事" || line === "LIVE") {
      continue;
    }

    return normalizeTeamName(line);
  }

  throw new Error(`Unable to find team name from lines: ${lines.join(" | ")}`);
}

function extractEnglishName(lines: string[], fallbackTeamName: string) {
  for (const line of lines) {
    if (isAsciiLine(line) && /[A-Za-z]/.test(line)) {
      return line;
    }
  }

  return TEAM_ALIASES[fallbackTeamName]?.name_en ?? fallbackTeamName;
}

function parseGames(scheduleText: string, season: string) {
  const rawLines = scheduleText
    .split("\n")
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  const lines = rawLines.filter(
    (line) =>
      line !== "全部" &&
      !/^\d{2}月$/.test(line) &&
      !/^(UPCOMING|RESULTS)/.test(line) &&
      !/^(熱身賽|例行賽|季後賽|總冠軍賽)$/.test(line),
  );

  const games: ScheduleGame[] = [];
  let index = 0;

  while (index < lines.length) {
    const current = lines[index];

    if (!isDateLine(current)) {
      index += 1;
      continue;
    }

    const monthDay = current;
    const nextWeekday = lines[index + 1];
    const nextTime = lines[index + 2];

    if (!isWeekdayLine(nextWeekday) || !/^\d{2}:\d{2}$/.test(nextTime)) {
      index += 1;
      continue;
    }

    let cursor = index + 3;

    while (cursor < lines.length && lines[cursor] !== "客隊") {
      cursor += 1;
    }

    if (cursor >= lines.length) {
      break;
    }

    const awayStart = cursor + 1;
    let gameIdIndex = awayStart;
    while (gameIdIndex < lines.length && !isGameIdLine(lines[gameIdIndex])) {
      gameIdIndex += 1;
    }

    if (gameIdIndex >= lines.length) {
      break;
    }

    const awayBlock = lines.slice(awayStart, gameIdIndex);
    const gameId = lines[gameIdIndex];

    let venueIndex = gameIdIndex + 1;
    while (
      venueIndex < lines.length &&
      (lines[venueIndex] === "追蹤賽事" || lines[venueIndex] === "LIVE" || isTicketLine(lines[venueIndex]))
    ) {
      venueIndex += 1;
    }

    const venue = lines[venueIndex];
    let homeScoreStart = venueIndex + 1;
    while (
      homeScoreStart < lines.length &&
      (lines[homeScoreStart] === "追蹤賽事" ||
        lines[homeScoreStart] === "LIVE" ||
        isTicketLine(lines[homeScoreStart]))
    ) {
      homeScoreStart += 1;
    }

    let homeMarkerIndex = homeScoreStart;
    while (homeMarkerIndex < lines.length && lines[homeMarkerIndex] !== "主隊") {
      homeMarkerIndex += 1;
    }

    if (homeMarkerIndex >= lines.length) {
      break;
    }

    const homeScoreBlock = lines.slice(homeScoreStart, homeMarkerIndex);
    const homeStart = homeMarkerIndex + 1;
    let nextDateIndex = homeStart;
    while (nextDateIndex < lines.length && !isDateLine(lines[nextDateIndex])) {
      nextDateIndex += 1;
    }

    const homeBlock = lines.slice(homeStart, nextDateIndex);
    const awayTeamName = extractTeamName(awayBlock);
    const homeTeamName = extractTeamName(homeBlock);
    const awayEnglishName = extractEnglishName(awayBlock, awayTeamName);
    const homeEnglishName = extractEnglishName(homeBlock, homeTeamName);
    const awayScore = getLastScore(awayBlock);
    const homeScore = getLastScore(homeScoreBlock);

    games.push({
      game_id: gameId,
      date: buildIsoDate(monthDay, season),
      time: nextTime,
      venue,
      matchup: `${awayTeamName} vs ${homeTeamName}`,
      ...(awayScore !== undefined ? { away_score: awayScore } : {}),
      ...(homeScore !== undefined ? { home_score: homeScore } : {}),
      away_team: {
        name: awayTeamName,
        logo: "",
      },
      home_team: {
        name: homeTeamName,
        logo: "",
      },
    });

    TEAM_ALIASES[awayTeamName] = {
      aliases: [...new Set([awayTeamName, awayEnglishName, ...TEAM_ALIASES[awayTeamName].aliases])],
      name_en: awayEnglishName,
    };
    TEAM_ALIASES[homeTeamName] = {
      aliases: [...new Set([homeTeamName, homeEnglishName, ...TEAM_ALIASES[homeTeamName].aliases])],
      name_en: homeEnglishName,
    };

    index = nextDateIndex;
  }

  return games;
}

function buildTeamLogos(images: ScrapedImage[], teamNames: string[]) {
  const teamLogos: Record<string, TeamInfo> = {};

  for (const canonicalName of teamNames) {
    const team = TEAM_ALIASES[canonicalName];
    if (!team) {
      continue;
    }

    const matchedImage = images.find((image) => {
      const haystack = `${image.alt} ${image.context}`;
      return team.aliases.some((alias) => haystack.includes(alias));
    });

    teamLogos[canonicalName] = {
      name_en: team.name_en,
      logo: matchedImage?.src ?? "",
    };
  }

  return teamLogos;
}

async function scrapeSchedule(url: string): Promise<ScrapedPayload> {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    return extractPayloadFromHtml(html, url);
  } catch (fetchError) {
    console.warn("Fetch-based scrape failed. Falling back to Playwright.");
    console.warn(formatError(fetchError));
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 2000 });

    await withRetry(async () => {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
      await page.waitForFunction(
        () => document.body.innerText.includes("例行賽賽程") && document.body.innerText.includes("G01"),
        { timeout: 15_000 },
      );
    });

    return page.evaluate(() => {
      const text = document.body.innerText.replace(/\u00a0/g, " ");
      const startIndex = text.indexOf("例行賽賽程");
      const scheduleText = startIndex >= 0 ? text.slice(startIndex) : text;

      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>('img[src*="upload/p_team/logo_"]'),
      ).map((image) => {
        const container =
          image.closest("article, section, li, a, div") ?? image.parentElement ?? document.body;

        return {
          src: image.src,
          alt: image.alt ?? "",
          context: (container?.textContent ?? "").replace(/\s+/g, " ").trim(),
        };
      });

      return {
        title: document.title,
        scheduleText,
        images,
      };
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const season = process.env.PLG_SEASON ?? DEFAULT_SEASON;
  const url = process.env.PLG_SCHEDULE_URL ?? DEFAULT_URL;
  const outputPath = process.env.PLG_OUTPUT_PATH ?? DEFAULT_OUTPUT;

  try {
    const payload = await withRetry(() => scrapeSchedule(url), 3, 2000);
    const games = parseGames(payload.scheduleText, season);

    if (games.length === 0) {
      const debugPath = path.join(process.cwd(), "data", "plg_schedule_debug.txt");
      await mkdir(path.dirname(debugPath), { recursive: true });
      await writeFile(debugPath, `${payload.scheduleText}\n`, "utf8");
      throw new Error(`No PLG games parsed from ${payload.title}`);
    }

    const teamNames = [...new Set(games.flatMap((game) => [game.away_team.name, game.home_team.name]))];
    const teams = buildTeamLogos(payload.images, teamNames);
    for (const game of games) {
      const awayTeam = teams[game.away_team.name];
      const homeTeam = teams[game.home_team.name];

      if (awayTeam) {
        game.away_team.logo = awayTeam.logo;
      }

      if (homeTeam) {
        game.home_team.logo = homeTeam.logo;
      }
    }

    const output = {
      season,
      league: "P. LEAGUE+",
      source: url,
      updated_at: new Date().toISOString().slice(0, 10),
      teams,
      games,
    };

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

    console.log(`Saved ${games.length} games to ${outputPath}`);
  } catch (error) {
    console.error("Failed to scrape PLG schedule.");
    if (error instanceof Error && error.message.includes("libnspr4.so")) {
      console.error(
        "Playwright Chromium is installed, but this WSL/Linux environment is missing required shared libraries. Install the Playwright Linux dependencies first, then rerun the scraper.",
      );
    }
    console.error(error);
    process.exitCode = 1;
  }
}

void main();
