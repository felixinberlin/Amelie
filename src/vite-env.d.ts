/// <reference types="vite/client" />

// Fallback declaration so tsc compiles cleanly in local/CI environments
declare module 'leaflet' {
  const L: any;
  export default L;
  export = L;
}
