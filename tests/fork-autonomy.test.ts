import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const FORK = "iamsupersocks";
const FORK_URL = `https://github.com/${FORK}/opencodex`;

/** Upstream handles that must never appear anywhere in fork governance. */
const UPSTREAM_HANDLES = ["lidge-jun", "Ingwannu", "Wibias"];

function read(file: string): string {
  return readFileSync(new URL(file, `file://${repoRoot}`), "utf8");
}

/**
 * The fork's governance and live links must point only at iamsupersocks and
 * must not retain any upstream maintainer/owner/contact. This guards the fork
 * against a future merge or bot edit reintroducing the upstream governance.
 */
describe("fork autonomy", () => {
  test("MAINTAINERS.md lists only the fork owner as maintainer/contact", () => {
    const content = read("MAINTAINERS.md");
    // Sole maintainer row is the fork owner.
    expect(content).toContain(`[@${FORK}](https://github.com/${FORK})`);
    expect(content).toContain("| Project owner |");
    // No upstream handles anywhere in the governance document.
    for (const handle of UPSTREAM_HANDLES) {
      expect(content.toLowerCase()).not.toContain(handle.toLowerCase());
    }
  });

  test(".github/CODEOWNERS names only the fork owner", () => {
    const content = read(".github/CODEOWNERS");
    for (const handle of UPSTREAM_HANDLES) {
      expect(content.toLowerCase()).not.toContain(handle.toLowerCase());
    }
    // Every owner line resolves to the fork owner; no other @handle appears.
    const owners = new Set<string>();
    for (const line of content.split("\n")) {
      for (const tok of line.split(/\s+/)) {
        if (tok.startsWith("@")) owners.add(tok);
      }
    }
    expect(owners.size).toBeGreaterThan(0);
    for (const owner of owners) {
      expect(owner).toBe(`@${FORK}`);
    }
  });

  test("SECURITY.md points at the fork advisories with no upstream contact", () => {
    const content = read("SECURITY.md");
    expect(content).toContain(
      `https://github.com/${FORK}/opencodex/security/advisories/new`,
    );
    for (const handle of UPSTREAM_HANDLES) {
      expect(content.toLowerCase()).not.toContain(handle.toLowerCase());
    }
  });

  test("package.json live links point at the fork", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.repository.url).toBe(`git+${FORK_URL}.git`);
    expect(pkg.homepage).toBe(FORK_URL);
    expect(pkg.bugs.url).toBe(`${FORK_URL}/issues`);
    for (const handle of UPSTREAM_HANDLES) {
      expect(
        JSON.stringify([pkg.repository.url, pkg.homepage, pkg.bugs.url]).toLowerCase(),
      ).not.toContain(handle.toLowerCase());
    }
  });

  test("docs-site/astro.config.mjs social and edit links point at the fork", () => {
    const content = read("docs-site/astro.config.mjs");
    // Social GitHub link.
    expect(content).toContain(`href: "${FORK_URL}"`);
    // Edit-link base URL.
    expect(content).toContain(`baseUrl: "${FORK_URL}/edit/main/docs-site/"`);
    // Site URL/domain unchanged.
    expect(content).toContain('const SITE_URL = "https://opencodex.me"');
    for (const handle of UPSTREAM_HANDLES) {
      expect(content.toLowerCase()).not.toContain(handle.toLowerCase());
    }
  });
});
