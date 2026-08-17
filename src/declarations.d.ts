/* ─────────────────────────────────────────────────────────────
   zyrn-ui — ambient type declarations
   Tells TypeScript to accept side-effect CSS imports without
   error TS2882 ("Cannot find module or type declarations…").
   tsup handles the actual CSS bundling at build time.
───────────────────────────────────────────────────────────── */

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}
