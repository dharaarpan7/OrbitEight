import { describe, it, expect } from "vitest";
import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { userInfo } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

/**
 * Agent-config security invariants — one describe block per AgentShield
 * finding from the 2026-09-04 scan (grade A, 92/100, 3 high + 1 medium).
 * These tests are the regression net: the properties they pin must hold
 * on this machine and (for the project-settings blocks) for anyone who
 * clones the repo.
 *
 * Findings covered:
 *   1. HIGH  CLAUDE.md reported world-writable (0o666)
 *   2. HIGH  No deny list configured
 *   3. HIGH  Stale one-off allow rules linger in settings.local.json
 *   4. MED   No PreToolUse security hooks configured
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const claudeMd = path.join(root, "CLAUDE.md");
const projectSettingsPath = path.join(root, ".claude", "settings.json");
const localSettingsPath = path.join(root, ".claude", "settings.local.json");
const hookCliPath = path.join(root, ".claude", "hooks", "block-env-access.mjs");

/* --- Finding 1: CLAUDE.md is owner-writable only ------------------------ */

describe("AgentShield finding 1: CLAUDE.md is owner-writable only", () => {
  it("grants no write access beyond the owner, Administrators, and SYSTEM", () => {
    if (process.platform === "win32") {
      // Windows ACLs are the real gate; Node's 0o666 stat bits are an
      // artifact on this platform. Parse icacls output instead.
      const out = execSync(`icacls "${claudeMd}"`, { encoding: "utf8" });

      // No broad principal may hold any access at all.
      for (const forbidden of ["Everyone", "Authenticated Users", "BUILTIN\\Users"]) {
        expect(
          out.includes(forbidden),
          `icacls grants access to ${forbidden}:\n${out}`
        ).toBe(false);
      }

      // Every write-capable grant (F/M/W) must be owner or machine admin.
      // icacls prints "«path» PRINCIPAL:(perms) …" — drop the path so the
      // parser can't glue it onto the first principal.
      const aceText = out.replaceAll(claudeMd, "");
      const allowed = new Set(["builtin\\administrators", "nt authority\\system"]);
      const me = userInfo().username.toLowerCase();
      const grantRe = /([A-Za-z0-9 .\-\\]+?):((?:\([A-Z+]{1,4}\))+)/g;
      const violations = [];
      for (const m of aceText.matchAll(grantRe)) {
        const principal = m[1].trim().toLowerCase();
        const grants = m[2];
        if (!/[FMW]/.test(grants)) continue; // read-only is fine
        const ok =
          allowed.has(principal) || principal === me || principal.endsWith("\\" + me);
        if (!ok) violations.push(`${principal} -> ${grants}`);
      }
      expect(violations, `unexpected write grants:\n${out}`).toEqual([]);
    } else {
      // POSIX: group/other write bits must be clear.
      expect(statSync(claudeMd).mode & 0o022).toBe(0);
    }
  });
});

/* --- Finding 2: project settings carry a deny list ----------------------- */

describe("AgentShield finding 2: project settings carry a deny list", () => {
  it("has permissions.deny covering env files and key material", () => {
    const settings = JSON.parse(readFileSync(projectSettingsPath, "utf8"));
    const deny = settings.permissions?.deny ?? [];
    expect(deny.length, "deny list must not be empty").toBeGreaterThan(0);
    expect(
      deny.some((rule) => rule.includes(".env")),
      "deny list must cover .env files"
    ).toBe(true);
    expect(
      deny.some((rule) => /pem|id_rsa|\.key/.test(rule)),
      "deny list must cover key/cert material"
    ).toBe(true);
    // Destructive shell patterns flagged by AgentShield's second pass.
    expect(
      deny.some((rule) => rule.includes("rm -rf")),
      "deny list must cover recursive force delete"
    ).toBe(true);
    expect(
      deny.some((rule) => rule.includes("sudo")),
      "deny list must cover privilege escalation"
    ).toBe(true);
    expect(
      deny.some((rule) => rule.includes("chmod 777")),
      "deny list must cover world-writable chmod"
    ).toBe(true);
  });
});

/* --- Finding 3: local allow list holds no stale one-off grants ----------- */

describe("AgentShield finding 3: local allow list holds no stale one-off grants", () => {
  it.skipIf(!existsSync(localSettingsPath))(
    "contains no external downloads, signed tokens, or dev-loop probes",
    () => {
      const allow =
        JSON.parse(readFileSync(localSettingsPath, "utf8")).permissions?.allow ?? [];
      const stale = allow.filter(
        (rule) =>
          rule.includes("Invoke-WebRequest") ||
          rule.includes("UCloudPublicKey") ||
          rule.includes("findstr :3000") ||
          rule.includes("Get-Content node_modules") ||
          rule.includes("maas-log-prod")
      );
      expect(stale, `stale allow rules still present: ${JSON.stringify(stale)}`).toEqual(
        []
      );
    }
  );
});

/* --- Finding 4: a PreToolUse hook blocks sensitive-file access ----------- */

describe("AgentShield finding 4: a PreToolUse hook blocks sensitive-file access", () => {
  it("registers the hook in project settings for Read/Edit/Write", () => {
    const settings = JSON.parse(readFileSync(projectSettingsPath, "utf8"));
    const hooks = settings.hooks?.PreToolUse ?? [];
    expect(hooks.length, "PreToolUse must be configured").toBeGreaterThan(0);
    expect(
      hooks.some((h) => /Read|Edit|Write/.test(h.matcher ?? "")),
      "hook must match Read/Edit/Write"
    ).toBe(true);
  });

  it("blocks env files, SSH keys, and certs; passes normal source files", async () => {
    // pathToFileURL + @vite-ignore keeps Vite from resolving the hook module
    // at transform time — a missing hook must fail THIS test with ENOENT,
    // not prevent the whole suite from loading.
    const hookPath = path.join(root, ".claude", "hooks", "block-env-access.mjs");
    const { isSensitivePath } = await import(/* @vite-ignore */ pathToFileURL(hookPath).href);
    // Sensitive — must be blocked.
    expect(isSensitivePath(".env")).toBe(true);
    expect(isSensitivePath(".env.local")).toBe(true);
    expect(isSensitivePath(".env.production")).toBe(true);
    expect(isSensitivePath("D:\\proj\\.env.production")).toBe(true);
    expect(isSensitivePath("/home/u/.ssh/id_rsa")).toBe(true);
    expect(isSensitivePath("certs/server.pem")).toBe(true);
    // Normal source — must pass through.
    expect(isSensitivePath("D:\\AI\\OrbitEight\\lib\\site.ts")).toBe(false);
    expect(isSensitivePath("components/env-card.tsx")).toBe(false); // "env" in a name is not .env
    expect(isSensitivePath(".env-card.tsx")).toBe(false); // dotfile prefix must match exactly
    expect(isSensitivePath("deploy/terraform.tfkey")).toBe(false); // .tfkey is not .key — no overreach
  });

  /** Run the hook exactly as Claude Code would: node script, JSON on stdin. */
  function runHook(stdinText) {
    return spawnSync(process.execPath, [hookCliPath], {
      input: stdinText,
      encoding: "utf8",
    });
  }

  it("exits 2 with a stderr message when the tool targets a sensitive file", () => {
    const result = runHook(
      JSON.stringify({ tool_name: "Read", tool_input: { file_path: ".env.local" } })
    );
    expect(result.status).toBe(2);
    expect(result.stderr).toMatch(/Blocked/);
  });

  it("exits 0 for normal files and fails open on unparseable stdin", () => {
    const allowed = runHook(
      JSON.stringify({ tool_name: "Edit", tool_input: { file_path: "lib/site.ts" } })
    );
    expect(allowed.status).toBe(0);
    expect(allowed.stderr).toBe("");

    const unparseable = runHook("this is not json");
    expect(unparseable.status).toBe(0);
  });
});
