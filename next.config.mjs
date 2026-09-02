/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // NASA/ESA public-domain mission imagery used for editorial visuals.
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "esawebbmedia.net" },
      { protocol: "https", hostname: "www.esa.int" },
      { protocol: "https", hostname: "cdn.spacetelescope.org" },
    ],
  },
  turbopack: {
    resolveAlias: {
      // @splinetool/runtime's build references wasm companions by names that
      // don't match the shipped files (its output targets Vite/CDN, not
      // bundlers). Redirect each unresolvable `new URL(..., import.meta.url)`
      // request to a real file. The Draco decoder files aren't shipped in
      // the npm package at all — they're only fetched by scenes that use
      // Draco geometry compression (none of ours do), so pointing those at
      // any existing asset is safe.
      "boolean_wasm_bg.wasm":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
      "../libs/draco/draco_decoder.js":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
      "../libs/draco/draco_decoder.wasm":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
      "../libs/draco/draco_wasm_wrapper.js":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
      "../libs/draco/gltf/draco_decoder.wasm":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
      "../libs/draco/gltf/draco_wasm_wrapper.js":
        "./node_modules/@splinetool/runtime/build/boolean.wasm",
    },
  },
};

export default nextConfig;
