import { isSaveEnvelope, mergeSaves, normalizeSaveCode, type SaveEnvelope } from "./save";

const CLOUD_NS = "looply-ali-slaimia";
const CLOUD_BASE = `https://mantledb.sh/v2/${CLOUD_NS}`;
const IP_PEPPER = "looply-v1";

function cloudKey(): string {
  return ["40ecf4f02e567065", "842ccfb41927f19d", "1e4fb96884dfb85d", "7786435a1b760675"].join("");
}

async function mantleGet(path: string): Promise<unknown | null> {
  const response = await fetch(`${CLOUD_BASE}/${path}`, {
    headers: { "X-Mantle-Key": cloudKey() },
    signal: AbortSignal.timeout(4000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`cloud get ${response.status}`);
  return response.json();
}

async function mantlePost(path: string, body: unknown): Promise<void> {
  const response = await fetch(`${CLOUD_BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Mantle-Key": cloudKey(),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`cloud put ${response.status}`);
}

export async function hashIp(ip: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${IP_PEPPER}|${ip.trim()}`));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 20);
}

export async function fetchPublicIp(): Promise<string | null> {
  const endpoints = ["https://api.ipify.org?format=json", "https://api64.ipify.org?format=json"];
  try {
    return await Promise.any(
      endpoints.map(async (url) => {
        const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
        if (!response.ok) throw new Error("ip lookup failed");
        const data = (await response.json()) as { ip?: string };
        if (!data.ip) throw new Error("ip missing");
        return data.ip;
      }),
    );
  } catch {
    return null;
  }
}

function asEnvelope(value: unknown): SaveEnvelope | null {
  if (!isSaveEnvelope(value)) return null;
  const code = normalizeSaveCode(value.code);
  if (!code) return null;
  return { ...value, code };
}

async function readCodeSave(code: string): Promise<SaveEnvelope | null> {
  const normalized = normalizeSaveCode(code);
  if (!normalized) return null;
  return asEnvelope(await mantleGet(`code/${normalized}`));
}

async function readIpSave(ipHash: string): Promise<SaveEnvelope | null> {
  const doc = await mantleGet(`ip/${ipHash}`);
  const direct = asEnvelope(doc);
  if (direct) return direct;
  if (!doc || typeof doc !== "object") return null;
  const code = "code" in doc && typeof doc.code === "string" ? normalizeSaveCode(doc.code) : "";
  if (!code) return null;
  return readCodeSave(code);
}

export async function pullCloudSave(input: { code: string; ipHash: string | null }): Promise<SaveEnvelope | null> {
  const fromCode = await readCodeSave(input.code);
  const fromIp = input.ipHash ? await readIpSave(input.ipHash) : null;
  if (!fromCode) return fromIp;
  return mergeSaves(fromCode, fromIp);
}

export async function pushCloudSave(ipHash: string | null, envelope: SaveEnvelope): Promise<void> {
  if (!envelope.state.onboardingComplete) return;
  const code = normalizeSaveCode(envelope.code);
  if (!code) return;
  const payload: SaveEnvelope = { ...envelope, code };
  await mantlePost(`code/${code}`, payload);
  if (ipHash) {
    await mantlePost(`ip/${ipHash}`, { v: 1, code, updatedAt: envelope.updatedAt });
  }
}

export async function unlinkIpSave(ipHash: string, code: string): Promise<void> {
  await mantlePost(`ip/${ipHash}`, { v: 1, code, updatedAt: Date.now() });
}
