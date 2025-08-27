// Place next to your component: ./color-palette.generator.ts
export class ColorPaletteGenerator {
  /** Generate a harmonious palette of length `count` (includes black + gray) */
  public static generate(count: number, seed: number = Date.now()): string[] {
    const neutrals = ['#000000', '#666666']; // required defaults
    const needed = Math.max(0, count - neutrals.length);

    const golden = 137.50776405003785; // golden angle (deg)

    // Seeded PRNG (LCG)
    let state = (seed >>> 0) || 1;
    const rand = (): number => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 0x100000000;
    };

    let hue = rand() * 360;
    const colors: string[] = [];

    for (let i = 0; i < needed; i++) {
      hue = (hue + golden) % 360;
      // Vibrant but friendly bands
      const s = 0.62 + 0.16 * rand(); // 62–78%
      const l = 0.46 + 0.14 * rand(); // 46–60%
      colors.push(this.hslToHex(hue, s, l));
    }

    const palette = [...neutrals, ...colors].slice(0, count);
    // Dedup (rare) and top-up if needed
    const dedup = Array.from(new Set(palette));
    while (dedup.length < count) {
      const base = colors[(dedup.length - neutrals.length) % Math.max(colors.length, 1)] || '#4F46E5';
      dedup.push(this.nudgeLightness(base, 0.03 + 0.05 * rand()));
    }
    return dedup;
  }

  // ── internals ──────────────────────────────────────────────────────────────
  private static hslToHex(h: number, s: number, l: number): string {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r = 0, g = 0, b = 0;

    if (0 <= hp && hp < 1) [r, g, b] = [c, x, 0];
    else if (1 <= hp && hp < 2) [r, g, b] = [x, c, 0];
    else if (2 <= hp && hp < 3) [r, g, b] = [0, c, x];
    else if (3 <= hp && hp < 4) [r, g, b] = [0, x, c];
    else if (4 <= hp && hp < 5) [r, g, b] = [x, 0, c];
    else if (5 <= hp && hp < 6) [r, g, b] = [c, 0, x];

    const m = l - c / 2;
    const R = Math.round((r + m) * 255);
    const G = Math.round((g + m) * 255);
    const B = Math.round((b + m) * 255);

    return `#${this.toHex(R)}${this.toHex(G)}${this.toHex(B)}`;
  }

  private static toHex(n: number): string {
    const s = n.toString(16).toUpperCase();
    return s.length === 1 ? '0' + s : s;
  }

  private static nudgeLightness(hex: string, delta: number): string {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let s = 0, h = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }

    const l2 = Math.max(0, Math.min(1, l + delta));
    return this.hslToHex(h, s, l2);
  }
}
