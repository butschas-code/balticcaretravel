#!/usr/bin/env node
/**
 * Prints values for Supabase → Authentication → URL configuration.
 * Production host for this project: https://balticcaretravel.vercel.app
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

var PRODUCTION_ORIGIN = 'https://balticcaretravel.vercel.app';

var __dirname = dirname(fileURLToPath(import.meta.url));
var root = resolve(__dirname, '..');
var envPath = resolve(root, '.env');

function parseEnv(text) {
  var out = {};
  text.split(/\r?\n/).forEach(function (line) {
    var m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) return;
    var v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  });
  return out;
}

var env = {};
if (existsSync(envPath)) {
  try {
    env = parseEnv(readFileSync(envPath, 'utf8'));
  } catch (_) {}
}

var supabaseUrl = env.VITE_SUPABASE_URL || '';
var hasAnon = !!(
  env.VITE_SUPABASE_ANON_KEY &&
  !/^your_anon|^YOUR_/i.test(env.VITE_SUPABASE_ANON_KEY)
);

var refMatch = supabaseUrl.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co\/?/i);
var projectRef = refMatch ? refMatch[1] : null;

console.log('');
console.log('=== Supabase → Authentication → URL configuration (copy-paste) ===');
console.log('');
console.log('Site URL:');
console.log('  ' + PRODUCTION_ORIGIN);
console.log('');
console.log('Redirect URLs — add each line (Authentication → URL configuration):');
console.log('  ' + PRODUCTION_ORIGIN + '/login.html');
console.log('  http://localhost:3000/login.html');
console.log('  http://127.0.0.1:3000/login.html');
console.log('  http://localhost:4173/login.html');
console.log('');
console.log('Optional — if you use Vercel *branch* preview URLs (different hostnames):');
console.log('  https://*.vercel.app/**');
console.log('');
console.log('=== .env (project root, not committed) ===');
console.log('');
if (!existsSync(envPath)) {
  console.log('Create .env from .env.example and set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY');
  console.log('(Supabase → Project Settings → API).');
} else {
  console.log('.env: ' + envPath);
  console.log('  VITE_SUPABASE_URL:      ' + (supabaseUrl ? 'set' : 'MISSING'));
  console.log('  VITE_SUPABASE_ANON_KEY: ' + (hasAnon ? 'set' : 'MISSING'));
}
console.log('');
console.log('On Vercel: add the same two variables in Project → Settings → Environment Variables');
console.log('(Production + Preview), then redeploy.');
console.log('');

if (projectRef) {
  var dash =
    'https://supabase.com/dashboard/project/' + projectRef + '/auth/url-configuration';
  console.log('Opening: ' + dash);
  try {
    if (process.platform === 'darwin') {
      execSync('open ' + JSON.stringify(dash), { stdio: 'inherit' });
    } else if (process.platform === 'win32') {
      execSync('start "" ' + JSON.stringify(dash), { shell: true, stdio: 'inherit' });
    } else {
      execSync('xdg-open ' + JSON.stringify(dash), { stdio: 'inherit' });
    }
  } catch (_) {
    console.log('Open that link manually in your browser.');
  }
} else {
  console.log(
    'Set VITE_SUPABASE_URL in .env, then run this again to open the right Supabase page.'
  );
}
console.log('');
