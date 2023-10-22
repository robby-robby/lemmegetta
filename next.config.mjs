/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  //Profiler
  // webpack(config) {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     "react-dom$": "react-dom/profiling",
  //     "scheduler/tracing": "scheduler/tracing-profiling",
  //   };

  //   return config;
  // },
};

export default config;

// module.exports = {
// };
