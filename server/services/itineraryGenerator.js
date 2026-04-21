const destinations = require('../data/destinations.json');
const hotels = require('../data/hotels.json');
const activities = require('../data/activities.json');
const transport = require('../data/transport.json');
// Simple UUID v4 generator (no dependency needed)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ─── Scoring helpers ────────────────────────────────────────────────────────

function budgetScore(dest, budget) {
  const levels = { low: 1, medium: 2, high: 3, luxury: 4 };
  const destLevel = levels[dest.budgetLevel] || 2;
  if (budget < 1000)  return destLevel === 1 ? 10 : destLevel === 2 ? 6 : 2;
  if (budget < 3000)  return destLevel === 2 ? 10 : destLevel === 1 ? 8 : destLevel === 3 ? 6 : 2;
  if (budget < 7000)  return destLevel === 3 ? 10 : destLevel === 2 ? 7 : destLevel === 4 ? 8 : 4;
  return destLevel === 4 ? 10 : destLevel === 3 ? 8 : 5;
}

function interestScore(dest, interests) {
  if (!interests || interests.length === 0) return 5;
  const matches = interests.filter(i => dest.tags.includes(i.toLowerCase())).length;
  return Math.min(10, matches * 3 + 2);
}

function seasonScore(dest, startDate) {
  const month = new Date(startDate).getMonth() + 1;
  return dest.bestMonths.includes(month) ? 10 : 5;
}

function travelStyleScore(dest, style) {
  const styleMap = {
    adventure:   ['adventure', 'hiking', 'nature', 'wildlife'],
    relaxation:  ['beach', 'relaxation', 'luxury', 'spa'],
    culture:     ['culture', 'history', 'art', 'spiritual'],
    food:        ['food', 'wine'],
    nightlife:   ['nightlife', 'shopping'],
    romantic:    ['romantic', 'beach', 'luxury']
  };
  const relevantTags = styleMap[style] || [];
  const matches = relevantTags.filter(t => dest.tags.includes(t)).length;
  return Math.min(10, matches * 2.5 + 2);
}

// ─── Destination Ranking ────────────────────────────────────────────────────

function rankDestinations(preferences) {
  const { budget, interests, startDate, travelStyle, travelers } = preferences;
  const totalBudget = budget / (travelers || 1);

  return destinations
    .map(dest => {
      const score =
        budgetScore(dest, totalBudget) * 0.30 +
        interestScore(dest, interests) * 0.30 +
        seasonScore(dest, startDate) * 0.20 +
        travelStyleScore(dest, travelStyle) * 0.20;
      return { ...dest, matchScore: Math.round(score * 10) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

// ─── Hotel selection ─────────────────────────────────────────────────────────

function selectHotel(destinationId, budget, nights, travelers) {
  const destHotels = hotels.filter(h => h.destinationId === destinationId);
  if (!destHotels.length) return null;

  const totalHotelBudget = budget * 0.35;
  const perNightBudget = totalHotelBudget / nights / travelers;

  // find best hotel within budget
  const affordable = destHotels
    .filter(h => h.pricePerNight <= perNightBudget * 1.3)
    .sort((a, b) => b.rating - a.rating);

  return affordable.length > 0 ? affordable[0] : destHotels.sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
}

// ─── Transport selection ──────────────────────────────────────────────────────

function selectTransport(destinationId, budget) {
  const options = transport.filter(t => t.destinationId === destinationId);
  if (!options.length) return null;

  const transportBudget = budget * 0.25;
  const affordable = options
    .filter(t => t.priceUSD <= transportBudget)
    .sort((a, b) => b.rating - a.rating);

  return affordable.length > 0 ? affordable[0] : options.sort((a, b) => a.priceUSD - b.priceUSD)[0];
}

// ─── Daily itinerary builder ──────────────────────────────────────────────────

function buildDailyPlans(destinationId, numDays, interests, travelStyle) {
  const destActivities = activities.filter(a => a.destinationId === destinationId);
  if (!destActivities.length) return [];

  // Score activities by interest match
  const scoredActivities = destActivities.map(a => {
    let score = a.rating;
    if (interests && interests.some(i => a.category.toLowerCase().includes(i.toLowerCase()))) score += 2;
    const styleActivityMap = {
      adventure: ['adventure','outdoor','hiking','water sports','wildlife'],
      relaxation: ['experience','beach'],
      culture: ['culture','history','sightseeing','walking'],
      food: ['food'],
      romantic: ['experience','sightseeing'],
    };
    const preferredCats = styleActivityMap[travelStyle] || [];
    if (preferredCats.includes(a.category)) score += 1.5;
    return { ...a, score };
  }).sort((a, b) => b.score - a.score);

  const days = [];
  const used = new Set();

  for (let day = 1; day <= numDays; day++) {
    const dayActivities = [];
    let hoursUsed = 0;
    const maxHours = day === 1 ? 6 : day === numDays ? 5 : 9;

    for (const act of scoredActivities) {
      if (used.has(act.id)) continue;
      if (act.duration > 48) continue; // skip multi-day treks for daily plan
      if (hoursUsed + act.duration <= maxHours) {
        dayActivities.push(act);
        used.add(act.id);
        hoursUsed += act.duration;
      }
      if (dayActivities.length >= 3) break;
    }

    const dayLabels = ['Arrival & Exploration', 'Deep Dive', 'Adventure Day', 'Culture & Cuisine', 'Relaxation Day', 'Hidden Gems', 'Farewell Day'];
    days.push({
      day,
      title: day === 1 ? 'Arrival & First Impressions'
           : day === numDays ? 'Final Day & Departure'
           : dayLabels[day % dayLabels.length],
      activities: dayActivities,
      estimatedCost: dayActivities.reduce((sum, a) => sum + a.priceUSD, 0)
    });
  }

  return days;
}

// ─── Budget breakdown ─────────────────────────────────────────────────────────

function buildBudgetBreakdown(hotel, transport, dailyPlans, nights, travelers) {
  const hotelTotal = hotel ? hotel.pricePerNight * nights * travelers : 0;
  const transportTotal = transport ? transport.priceUSD * travelers : 0;
  const activitiesTotal = dailyPlans.reduce((sum, d) => sum + d.estimatedCost, 0) * travelers;
  const foodEstimate = nights * 50 * travelers;
  const miscEstimate = nights * 20 * travelers;
  const total = hotelTotal + transportTotal + activitiesTotal + foodEstimate + miscEstimate;

  return {
    accommodation: Math.round(hotelTotal),
    transportation: Math.round(transportTotal),
    activities: Math.round(activitiesTotal),
    food: Math.round(foodEstimate),
    miscellaneous: Math.round(miscEstimate),
    total: Math.round(total)
  };
}

// ─── Main generator ───────────────────────────────────────────────────────────

function generateItinerary(preferences) {
  const {
    budget = 3000,
    startDate,
    endDate,
    travelers = 1,
    interests = [],
    travelStyle = 'culture',
    preferredDestination
  } = preferences;

  // Calculate trip duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numDays = Math.max(3, Math.round((end - start) / (1000 * 60 * 60 * 24)));

  // Rank & pick destination
  const ranked = rankDestinations(preferences);
  let destination;

  if (preferredDestination) {
    destination = destinations.find(d =>
      d.name.toLowerCase().includes(preferredDestination.toLowerCase()) ||
      d.country.toLowerCase().includes(preferredDestination.toLowerCase())
    ) || ranked[0];
  } else {
    destination = ranked[0];
  }

  const alternativeDestinations = ranked.slice(1, 4);

  // Build components
  const hotel = selectHotel(destination.id, budget, numDays, travelers);
  const transportOption = selectTransport(destination.id, budget / travelers);
  const dailyPlans = buildDailyPlans(destination.id, numDays, interests, travelStyle);
  const budgetBreakdown = buildBudgetBreakdown(hotel, transportOption, dailyPlans, numDays, travelers);

  // Build packing tips
  const packingTips = buildPackingTips(destination, startDate);

  // Travel tips
  const travelTips = buildTravelTips(destination);

  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    destination,
    alternativeDestinations,
    preferences: { ...preferences, numDays },
    hotel,
    transport: transportOption,
    dailyPlans,
    budgetBreakdown,
    packingTips,
    travelTips,
    matchScore: destination.matchScore,
    summary: buildSummary(destination, numDays, travelers, travelStyle)
  };
}

function buildPackingTips(destination, startDate) {
  const month = new Date(startDate).getMonth() + 1;
  const isSummer = [6,7,8].includes(month);
  const isWinter = [12,1,2].includes(month);
  const base = ['Passport & travel docs', 'Travel insurance documents', 'Universal power adapter', 'Reusable water bottle', 'First aid kit'];

  if (destination.climate === 'tropical') return [...base, 'Lightweight clothing', 'Sunscreen SPF 50+', 'Insect repellent', 'Rain jacket', 'Sandals & flip-flops'];
  if (destination.climate === 'desert') return [...base, 'Light, loose-fitting clothes', 'High-SPF sunscreen', 'Hat & sunglasses', 'Scarf/shawl for temples', 'Hydration pack'];
  if (destination.climate === 'subpolar') return [...base, 'Waterproof hiking boots', 'Thermal base layers', 'Fleece mid-layer', 'Waterproof outer shell', 'Merino wool socks'];
  if (isWinter) return [...base, 'Warm coat', 'Thermal layers', 'Waterproof boots', 'Gloves & hat', 'Scarf'];
  if (isSummer) return [...base, 'Sunscreen', 'Sunglasses', 'Hat', 'Light breathable clothing', 'Comfortable walking shoes'];
  return [...base, 'Layerable clothing', 'Light jacket', 'Comfortable shoes', 'Umbrella/rain jacket', 'Camera'];
}

function buildTravelTips(destination) {
  const tips = [
    `📋 Entry: Check visa requirements for ${destination.country} before booking.`,
    `💰 Currency: Local currency is ${destination.currency}. Carry some cash for small vendors.`,
    `📱 Connectivity: Buy a local SIM or activate international roaming on arrival.`,
    `🏥 Health: Check if any vaccinations are recommended for ${destination.country}.`,
    `🌐 Language: Primary language(s): ${destination.languages.join(', ')}. Learning a few phrases goes a long way!`
  ];

  if (destination.climate === 'tropical') tips.push('🌧️ Weather: Pack a light rain jacket — afternoon showers are common.');
  if (destination.avgDailyCostUSD < 80) tips.push('💵 Budget: Haggling is expected in local markets — start at 50% of the asking price.');
  if (destination.continent === 'Asia') tips.push('🙏 Culture: Dress modestly when visiting temples and remove shoes at the entrance.');
  if (destination.budgetLevel === 'luxury') tips.push('✨ Tip: Book restaurants and experiences well in advance — demand is high.');

  return tips;
}

function buildSummary(destination, numDays, travelers, travelStyle) {
  const styleDesc = {
    adventure: 'action-packed adventure',
    relaxation: 'deeply relaxing escape',
    culture: 'rich cultural immersion',
    food: 'delicious culinary journey',
    romantic: 'romantic getaway',
    nightlife: 'vibrant social experience'
  };
  return `A ${numDays}-day ${styleDesc[travelStyle] || 'wonderful journey'} to ${destination.name}, ${destination.country} for ${travelers} traveler${travelers > 1 ? 's' : ''}. ${destination.description}`;
}

module.exports = { generateItinerary, rankDestinations };
