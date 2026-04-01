import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

/** Copy global site scripts into dist so login.html (and any page that references them) does not 404 after build. */
function copyRootSiteScripts() {
  return {
    name: 'copy-root-site-scripts',
    closeBundle() {
      var outDir = resolve(__dirname, 'dist');
      ['i18n.js', 'script.js', 'clinic-page.js', 'clinics-directory.js'].forEach(function (name) {
        var from = resolve(__dirname, name);
        if (existsSync(from)) copyFileSync(from, resolve(outDir, name));
      });
    },
  };
}

export default defineConfig({
  // Relative asset URLs work from subfolders, file preview, and static hosts without root `/assets/`.
  base: './',
  plugins: [copyRootSiteScripts()],
  // Multi-page app: every HTML file is a separate entry point
  build: {
    rollupOptions: {
      input: {
        main:               resolve(__dirname, 'index.html'),
        about:              resolve(__dirname, 'about.html'),
        contact:            resolve(__dirname, 'contact.html'),
        treatments:         resolve(__dirname, 'treatments.html'),
        treatmentDental:    resolve(__dirname, 'treatment-dental.html'),
        treatmentOrtho:     resolve(__dirname, 'treatment-orthopedic.html'),
        treatmentFertility: resolve(__dirname, 'treatment-fertility.html'),
        treatmentPlastic:   resolve(__dirname, 'treatment-plastic.html'),
        clinics:            resolve(__dirname, 'clinics.html'),
        clinic:             resolve(__dirname, 'clinic.html'),
        howItWorks:         resolve(__dirname, 'how-it-works.html'),
        prices:             resolve(__dirname, 'prices.html'),
        patientStories:     resolve(__dirname, 'patient-stories.html'),
        faq:                resolve(__dirname, 'faq.html'),
        impressum:          resolve(__dirname, 'legal/impressum.html'),
        privacy:            resolve(__dirname, 'legal/privacy.html'),
        terms:              resolve(__dirname, 'legal/terms.html'),
        login:              resolve(__dirname, 'login.html'),
      },
    },
  },

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    // Security headers for the dev server
    headers: {
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Prevent MIME-type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Control referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Restrict browser features
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      // Content Security Policy:
      // - default-src: only self
      // - script-src: only self (no inline scripts, no eval)
      // - style-src: self + Google Fonts stylesheet
      // - font-src: Google Fonts CDN
      // - img-src: self + data URIs (for inline images)
      // - connect-src: self (form submissions and fetch calls)
      // - frame-ancestors: none (blocks embedding)
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        // 'unsafe-inline' for styles is safe: CSS cannot execute scripts in modern browsers
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://lh3.googleusercontent.com",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  },

  preview: {
    port: 4173,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        // 'unsafe-inline' for styles is safe: CSS cannot execute scripts in modern browsers
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://lh3.googleusercontent.com",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  },
});
