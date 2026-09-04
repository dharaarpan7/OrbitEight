/**
 * PreToolUse hook: block Read/Edit/Write on sensitive files.
 *
 * Claude Code pipes one JSON object to stdin — { tool_name, tool_input } —
 * and honors exit code 2 + a stderr message as a hard block. This backs the
 * permissions.deny list in .claude/settings.json with a runtime check, so
 * env files, SSH keys, and certificates stay off-limits even if an allow
 * rule drifts or a path arrives in an unexpected form.
 *
 * Run standalone to sanity-check: echo '{"tool_input":{"file_path":".env"}}' | node .claude/hooks/block-env-access.mjs
 */

/** Filename patterns that never belong in an agent conversation. */
const SENSITIVE_PATTERNS = [
  // .env, .env.local, .env.production — at start of path or after a separator.
  /(^|[\\/])\.env(\.[^\\/]*)?$/i,
  // SSH private keys: id_rsa, id_ed25519, and friends.
  /(^|[\\/])id_(rsa|dsa|ecdsa|ed25519)(\.[^\\/]*)?$/i,
  // Certificates and key material by extension.
  /\.pem$/i,
  /\.key$/i,
  // The whole .ssh directory.
  /(^|[\\/])\.ssh([\\/]|$)/i,
];

/**
 * True when the path points at env/secret material. Pure — exported for
 * unit tests in scripts/agent-config.test.mjs.
 * @param {unknown} input
 * @returns {boolean}
 */
export function isSensitivePath(input) {
  if (typeof input !== "string" || input === "") return false;
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(input));
}

async function main() {
  const stdin = await new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

  let payload;
  try {
    // Strip a UTF-8 BOM if present — harmless with clean input, and it keeps
    // the hook testable from PowerShell pipes, which prepend one.
    payload = JSON.parse(stdin.replace(/^﻿/, ""));
  } catch {
    // Unparseable input is never a reason to block a tool call.
    process.exit(0);
  }

  const target = payload?.tool_input?.file_path ?? payload?.tool_input?.path;
  if (isSensitivePath(target)) {
    console.error(
      `Blocked: "${target}" looks like env/secret material (env file, SSH key, or certificate). ` +
        "It is denied by this project's permission settings."
    );
    process.exit(2);
  }
  process.exit(0);
}

// Run only when executed directly, not when imported by the tests.
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  main();
}
