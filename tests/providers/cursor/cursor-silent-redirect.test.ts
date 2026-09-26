import { describe, expect, test } from "bun:test";
import { nativeShellDisabledMessage } from "../../../src/adapters/cursor/native-exec-shell";

/**
 * Recovery guidance must remain actionable without asking models to hide tool failures.
 * Code-mode routing and no-execution behavior are covered by cursor-native-exec-policy.
 */
const FORBIDDEN = [/do not narrate/i, /do not comment/i, /commentary is forbidden/i];

describe("cursor native-denial transparent recovery guidance", () => {
  test("shell denial provides a recovery path and preserves failure reporting", () => {
    const msg = nativeShellDisabledMessage();
    for (const pattern of FORBIDDEN) expect(msg).not.toMatch(pattern);
    expect(msg).toContain("Report any actual failure");
    expect(msg).toContain("Re-issue this command NOW");
  });

  test("fs denial preserves failure reporting", async () => {
    const src = await Bun.file("src/adapters/cursor/native-exec-fs.ts").text();
    const constant = src.match(/NATIVE_LOCAL_EXEC_DISABLED =\s*"([^"]+)"/)?.[1] ?? "";
    expect(constant.length).toBeGreaterThan(0);
    for (const pattern of FORBIDDEN) expect(constant).not.toMatch(pattern);
    expect(constant).toContain("Report any actual failure");
    for (const pattern of FORBIDDEN) expect(src).not.toMatch(pattern);
  });

  test("network denial preserves failure reporting", async () => {
    const src = await Bun.file("src/adapters/cursor/native-exec-network.ts").text();
    for (const pattern of FORBIDDEN) expect(src.split("\n").slice(0, 15).join("\n")).not.toMatch(pattern);
    expect(src).toContain("Report any actual failure");
  });
});
