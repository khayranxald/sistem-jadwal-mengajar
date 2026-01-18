// Performance testing config using Lighthouse CI
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5173/", "http://localhost:5173/login", "http://localhost:5173/admin/dashboard"],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Performance metrics
        "first-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],

        // Best practices
        "uses-https": "off",
        "uses-http2": "off",
        "no-vulnerable-libraries": "error",

        // Accessibility
        "color-contrast": "error",
        "image-alt": "error",
        label: "error",
        "valid-lang": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
