#!/usr/bin/env node

/**
 * CLI client for watching real-time order updates via SSE.
 *
 * Usage:
 *   npx tsx cli/watch.ts                       # defaults to http://localhost:3000
 *   npx tsx cli/watch.ts http://localhost:3000  # explicit URL
 *   npx tsx cli/watch.ts https://your-app.vercel.app
 */

import { EventSource } from "eventsource";

const BASE_URL = process.argv[2] || "http://localhost:3000";
const STREAM_URL = `${BASE_URL}/api/orders/stream`;

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgRed: "\x1b[41m",
  bgBlue: "\x1b[44m",
};

function formatTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function printBanner() {
  console.log(`
${COLORS.cyan}${COLORS.bold}  Ripple - Order Watcher${COLORS.reset}
${COLORS.dim}  Connecting to: ${STREAM_URL}${COLORS.reset}
`);
}

function printEvent(type: string, data: Record<string, unknown>) {
  const time = formatTimestamp();
  const record = data.record as Record<string, unknown>;

  let typeColor: string;
  let typeIcon: string;
  let typeBg: string;

  switch (type) {
    case "INSERT":
      typeColor = COLORS.green;
      typeIcon = "+";
      typeBg = COLORS.bgGreen;
      break;
    case "UPDATE":
      typeColor = COLORS.blue;
      typeIcon = "~";
      typeBg = COLORS.bgBlue;
      break;
    case "DELETE":
      typeColor = COLORS.red;
      typeIcon = "x";
      typeBg = COLORS.bgRed;
      break;
    default:
      typeColor = COLORS.white;
      typeIcon = "*";
      typeBg = "";
  }

  console.log(
    `${COLORS.dim}${time}${COLORS.reset}  ` +
      `${typeBg}${COLORS.bold} ${typeIcon} ${type.padEnd(6)} ${COLORS.reset}  ` +
      `${COLORS.bold}${record.customer_name}${COLORS.reset}  ` +
      `${COLORS.dim}${record.item} x${record.quantity}${COLORS.reset}  ` +
      `${typeColor}[${record.status}]${COLORS.reset}`
  );

  if (type === "UPDATE" && data.old_record) {
    const oldRecord = data.old_record as Record<string, unknown>;
    if (oldRecord.status !== record.status) {
      console.log(
        `           ${COLORS.dim}Status: ${oldRecord.status} -> ${COLORS.reset}${typeColor}${record.status}${COLORS.reset}`
      );
    }
  }
}

// --- Main ---

printBanner();

const es = new EventSource(STREAM_URL);

es.onopen = () => {
  console.log(
    `${COLORS.green}${COLORS.bold}OK Connected${COLORS.reset} ${COLORS.dim}-- listening for order events...${COLORS.reset}\n`
  );
};

es.onerror = (err) => {
  const detail = err as Event & { status?: number };
  console.error(
    `${COLORS.red}ERR Connection error${COLORS.reset}`,
    detail.status ? `(status: ${detail.status})` : ""
  );
  console.log(`${COLORS.dim}  Reconnecting...${COLORS.reset}`);
};

for (const eventType of ["INSERT", "UPDATE", "DELETE"]) {
  es.addEventListener(eventType, ((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      printEvent(eventType, data);
    } catch {
      console.error(`${COLORS.red}Failed to parse event data${COLORS.reset}`);
    }
  }) as EventListener);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log(`\n${COLORS.dim}Disconnecting...${COLORS.reset}`);
  es.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  es.close();
  process.exit(0);
});
