// The page Form Filler's old address shows since the move (2026-11-21). It finds what an earlier version kept in this
// browser at this address: keys starting "ff:" in its storage (your details, a saved signature, remembered forms and
// settings, all in plain text), the copy kept for offline use and the handwriting model in its cache storage, and the
// service worker that kept them. It shows your details only when you ask, and removes all of it only when you ask.
// It sends nothing anywhere and keeps nothing. What it reads from storage is shown as text only, never as markup.
'use strict';
const $ = id => document.getElementById(id);
const LABELS = { fullName: 'Full name', firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone',
  address: 'Street address', city: 'City', state: 'State', zip: 'ZIP code', birthDate: 'Date of birth', dateStyle: 'Dates written as' };
const label = key => LABELS[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, letter => letter.toUpperCase());

function keptKeys() { try { return Object.keys(localStorage).filter(key => key.startsWith('ff:')); } catch { return []; } }
function readKept(key) { try { return JSON.parse(localStorage.getItem('ff:' + key)); } catch { return null; } }
function details() {
  const profile = readKept('profile');
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) return [];
  return Object.entries(profile).filter(([, value]) => typeof value === 'string' && value.trim());
}
async function cacheNames() { try { return 'caches' in self ? await caches.keys() : []; } catch { return []; } }
async function workers() { try { return 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistrations() : []; } catch { return []; } }

async function look() {
  const keys = keptKeys(), names = await cacheNames(), registrations = await workers(), fields = details(), found = [];
  if (fields.length) found.push('your details (' + fields.length + (fields.length === 1 ? ' entry' : ' entries') + '), in plain text');
  if (readKept('signature')) found.push('a saved signature, in plain text');
  const forms = keys.filter(key => key.startsWith('ff:template:')).length;
  if (forms) found.push(forms === 1 ? '1 remembered form, with the file name it came from' : forms + ' remembered forms, with the file names they came from');
  if (keys.some(key => !/^ff:(profile|signature|template:)/.test(key))) found.push('its settings');
  if (names.some(name => name.startsWith('form-filler-'))) found.push('the copy of the old version kept for offline use');
  if (names.some(name => !name.startsWith('form-filler-'))) found.push('the handwriting model, if it was downloaded');
  const list = $('what');
  list.replaceChildren(...found.map(text => Object.assign(document.createElement('li'), { textContent: text })));
  $('show').hidden = !fields.length;
  const any = found.length > 0 || registrations.length > 0;
  $('left').hidden = !any;
  $('none').hidden = any || !$('removed').hidden;
  return { keys, names, registrations };
}

function show() {
  const box = $('fields');
  box.replaceChildren(...details().flatMap(([key, value]) => [
    Object.assign(document.createElement('dt'), { textContent: label(key) }),
    Object.assign(document.createElement('dd'), { textContent: value })]));
  $('details').hidden = false;
  $('show').hidden = true;
}

async function removeAll() {
  $('remove').disabled = true;
  const problems = [];
  for (const key of keptKeys()) { try { localStorage.removeItem(key); } catch { problems.push('storage'); } }
  for (const name of await cacheNames()) { try { await caches.delete(name); } catch { problems.push('cache'); } }
  try { for (const database of (indexedDB.databases ? await indexedDB.databases() : [])) if (database.name) indexedDB.deleteDatabase(database.name); } catch { /* none kept */ }
  for (const registration of await workers()) { try { await registration.unregister(); } catch { problems.push('offline copy'); } }
  $('details').hidden = true;
  $('fields').replaceChildren();
  const left = await look();
  if (problems.length || left.keys.length || left.names.length) {
    $('failed').textContent = 'Not everything could be removed. Clear this browser’s stored data for swixixle.github.io in its settings.';
    $('failed').hidden = false;
    $('remove').disabled = false;
    return;
  }
  $('left').hidden = true;
  $('none').hidden = true;
  $('removed').hidden = false;
}

$('show').addEventListener('click', show);
$('remove').addEventListener('click', () => { void removeAll(); });
void look();
