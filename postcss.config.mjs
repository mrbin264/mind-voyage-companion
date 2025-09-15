const config = {
  plugins: {
    /**
     * Tailwind CSS v4 PostCSS plugin. We log here so verification script / CI can assert it's loaded.
     */
    "@tailwindcss/postcss": {
      /** debug hook: Next will instantiate the plugin; this side effect log helps confirm discovery */
    },
  },
};

// Debug: print once when config is imported
if (process.env.NODE_ENV !== 'production') {
  // Using stderr so it stands out in Next build logs
  // (grep friendly: TAILWIND_POSTCSS_PLUGIN_LOADED)
  console.error('[TAILWIND_POSTCSS_PLUGIN_LOADED] postcss.config.mjs loaded');
}

export default config;
