/**
 * database.js — lightweight JSON flat-file store
 * Drop-in replacement for better-sqlite3 with zero native deps.
 * Data is persisted in server/data/*.json files.
 */
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// ─── Generic collection helpers ───────────────────────────────────────────────

function collectionPath(name) {
  return path.join(DATA_DIR, `_${name}.json`);
}

function readCollection(name) {
  const file = collectionPath(name);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeCollection(name, data) {
  fs.writeFileSync(collectionPath(name), JSON.stringify(data, null, 2), 'utf8');
}

function insertOne(collection, record) {
  const data = readCollection(collection);
  data.push(record);
  writeCollection(collection, data);
  return record;
}

function findAll(collection) {
  return readCollection(collection);
}

function findBy(collection, predicate) {
  return readCollection(collection).find(predicate) || null;
}

function filterBy(collection, predicate) {
  return readCollection(collection).filter(predicate);
}

function updateWhere(collection, predicate, updater) {
  const data = readCollection(collection);
  let updated = null;
  const next = data.map(r => {
    if (predicate(r)) { updated = { ...r, ...updater(r) }; return updated; }
    return r;
  });
  writeCollection(collection, next);
  return updated;
}

function deleteWhere(collection, predicate) {
  const data = readCollection(collection);
  const next = data.filter(r => !predicate(r));
  writeCollection(collection, next);
}

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
console.log('✅ JSON database ready at', DATA_DIR);

// ─── Dummy getDb (kept for compatibility) ────────────────────────────────────
function getDb() { return {}; }

// ─── Users ────────────────────────────────────────────────────────────────────

function createUser(id, name, email, hashedPassword) {
  return insertOne('users', {
    id, name, email, password: hashedPassword,
    created_at: new Date().toISOString()
  });
}

function getUserByEmail(email) {
  return findBy('users', u => u.email === email.toLowerCase());
}

function getUserById(id) {
  const u = findBy('users', u => u.id === id);
  if (!u) return null;
  const { password: _, ...safe } = u;   // never return the hash
  return safe;
}

// ─── Itineraries ──────────────────────────────────────────────────────────────

function saveItinerary(it, userId) {
  return insertOne('itineraries', {
    id:                  it.id,
    user_id:             userId || null,
    destination_name:    it.destination.name,
    destination_country: it.destination.country,
    num_days:            it.preferences.numDays,
    travelers:           it.preferences.travelers,
    budget:              it.preferences.budget,
    data:                it,                         // store full object
    created_at:          new Date().toISOString()
  });
}

function getItineraryById(id) {
  return findBy('itineraries', r => r.id === id);
}

function listItinerariesByUser(userId) {
  return filterBy('itineraries', r => r.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(({ id, destination_name, destination_country, num_days, travelers, budget, created_at }) =>
      ({ id, destination_name, destination_country, num_days, travelers, budget, created_at }));
}

function listAllItineraries() {
  return findAll('itineraries')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(({ id, destination_name, destination_country, num_days, travelers, budget, created_at }) =>
      ({ id, destination_name, destination_country, num_days, travelers, budget, created_at }));
}

function deleteItinerary(id) {
  deleteWhere('itineraries', r => r.id === id);
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

function saveBooking(b, userId) {
  return insertOne('bookings', {
    id:               b.id,
    user_id:          userId || null,
    itinerary_id:     b.itineraryId || null,
    type:             b.type,
    item_id:          b.itemId,
    item_name:        b.itemName,
    travelers:        b.travelers,
    price_per_person: b.pricePerPerson,
    total_price:      b.totalPrice,
    date:             b.date || null,
    guest_name:       b.guestName || null,
    guest_email:      b.guestEmail || null,
    status:           b.status,
    confirmation_code: b.confirmationCode,
    booked_at:        new Date().toISOString()
  });
}

function getBookingById(id) {
  return findBy('bookings', r => r.id === id);
}

function listBookingsByUser(userId) {
  return filterBy('bookings', r => r.user_id === userId)
    .sort((a, b) => b.booked_at.localeCompare(a.booked_at));
}

function listAllBookings() {
  return findAll('bookings')
    .sort((a, b) => b.booked_at.localeCompare(a.booked_at));
}

function updateBookingStatus(id, status) {
  return updateWhere('bookings', r => r.id === id, () => ({ status }));
}

module.exports = {
  getDb, createUser, getUserByEmail, getUserById,
  saveItinerary, getItineraryById, listItinerariesByUser, listAllItineraries, deleteItinerary,
  saveBooking, getBookingById, listBookingsByUser, listAllBookings, updateBookingStatus
};
