const Event = require('../models/eventModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

let eventTypes = ['football', 'concert'];

const eventController = {
  // Retrieve all events split into standard events and Nile League matches
  getEvents: async (req, res) => {
    try {
      const allEvents = await Event.find({});
      
      // Seed default events if MongoDB collection is empty
      if (allEvents.length === 0) {
        const defaultEvents = [
          { id: '#EV-001', name: 'Champions Final', date: '2026-10-24', type: 'football', venue: 'Wembley Stadium', status: 'Active', subevents: [], featured: true },
          { id: '#EV-002', name: 'Derby Clash', date: '2026-11-02', type: 'football', venue: 'Anfield', status: 'Active', subevents: [], featured: true },
          { id: '#EV-003', name: 'Neon Lights Tour', date: '2026-12-15', type: 'concert', venue: 'O2 Arena', status: 'Active', subevents: [], featured: true, price: 60, description: 'Join us for an unforgettable neon light music festival experience!' },
          { id: 'MATCH-001', homeTeam: 'Al Ahly FC', homeTeamLogo: 'egypt_al-ahly.football-logos.cc.svg', awayTeam: 'Pyramids FC', awayTeamLogo: 'egypt_pyramids.football-logos.cc.svg', date: 'Sun 20 Jul 2026', time: '08:00 PM', stadium: 'Cairo Stadium', city: 'Cairo, Egypt', matchNo: 1, status: 'available', featured: false, type: 'football', name: 'Al Ahly FC vs Pyramids FC', venue: 'Cairo Stadium' },
          { id: 'MATCH-002', homeTeam: 'Zamalek SC', homeTeamLogo: 'egypt_zamalek.football-logos.cc (2).svg', awayTeam: 'Al Masry SC', awayTeamLogo: 'egypt_al-masry.football-logos.cc.svg', date: 'Mon 21 Jul 2026', time: '09:00 PM', stadium: 'Borg El Arab', city: 'Alexandria, Egypt', matchNo: 2, status: 'available', featured: false, type: 'football', name: 'Zamalek SC vs Al Masry SC', venue: 'Borg El Arab' },
          { id: 'MATCH-003', homeTeam: 'Al Ittihad Alexandria', homeTeamLogo: 'egypt_al-ittihad-alexandria.football-logos.cc.svg', awayTeam: 'Al Mokawloon Al Arab', awayTeamLogo: 'egypt_al-mokawloon-al-arab.football-logos.cc.svg', date: 'Tue 22 Jul 2026', time: '06:00 PM', stadium: 'Borg El Arab', city: 'Alexandria, Egypt', matchNo: 3, status: 'closed', featured: false, type: 'football', name: 'Al Ittihad Alexandria vs Al Mokawloon Al Arab', venue: 'Borg El Arab' },
          { id: 'MATCH-004', homeTeam: 'Ismaily SC', homeTeamLogo: 'egypt_ismaily.football-logos.cc.svg', awayTeam: 'Ceramica Cleopatra', awayTeamLogo: 'egypt_ceramica-cleopatra.football-logos.cc.svg', date: 'Wed 23 Jul 2026', time: '05:00 PM', stadium: 'Ismailia Stadium', city: 'Ismailia, Egypt', matchNo: 4, status: 'available', featured: false, type: 'football', name: 'Ismaily SC vs Ceramica Cleopatra', venue: 'Ismailia Stadium' },
          { id: 'MATCH-005', homeTeam: 'ENPPI', homeTeamLogo: 'egypt_enppi.football-logos.cc.svg', awayTeam: 'Petrojet FC', awayTeamLogo: 'egypt_petrojet.football-logos.cc.svg', date: 'Thu 24 Jul 2026', time: '07:00 PM', stadium: 'Petro Sport Stadium', city: 'Cairo, Egypt', matchNo: 5, status: 'available', featured: false, type: 'football', name: 'ENPPI vs Petrojet FC', venue: 'Petro Sport Stadium' }
        ];
        
        await Event.insertMany(defaultEvents);
        const seededEvents = await Event.find({});
        const events = seededEvents.filter(e => e.type !== 'football' || e.id.startsWith('#'));
        const matches = seededEvents.filter(e => e.type === 'football' && !e.id.startsWith('#'));
        return res.status(200).json({ success: true, events, matches });
      }

      const events = allEvents.filter(e => e.type !== 'football' || e.id.startsWith('#'));
      const matches = allEvents.filter(e => e.type === 'football' && !e.id.startsWith('#'));
      return res.status(200).json({ success: true, events, matches });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Save a new entertainment event to MongoDB
  createEvent: async (req, res) => {
    const { name, type, date, venue, price, description, mapUrl, featured } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Event name is required.' });
    if (!type || !type.trim()) return res.status(400).json({ success: false, message: 'Event type is required.' });
    if (!date || !date.trim()) return res.status(400).json({ success: false, message: 'Event date is required.' });
    if (!venue || !venue.trim()) return res.status(400).json({ success: false, message: 'Event venue is required.' });

    // 2. Validate price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
    }

    // 3. Validate Google Maps URL (External HTTP/HTTPS link)
    if (mapUrl && mapUrl.trim()) {
      try {
        const parsedUrl = new URL(mapUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          return res.status(400).json({ success: false, message: 'Google Maps link must use HTTP or HTTPS protocol.' });
        }
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Google Maps link must be a valid URL format.' });
      }
    }

    // 4. Extract uploaded files
    let headerPath = '';
    if (req.files && req.files['headerImage'] && req.files['headerImage'][0]) {
      headerPath = '/uploads/' + req.files['headerImage'][0].filename;
    }

    let galleryPaths = [];
    if (req.files && req.files['galleryImages']) {
      galleryPaths = req.files['galleryImages'].map(file => '/uploads/' + file.filename);
    }

    try {
      const newEvent = new Event({
        id: '#EV-' + Math.floor(100 + Math.random() * 900),
        name: name.trim(),
        type: type.trim().toLowerCase(),
        date: date.trim(),
        venue: venue.trim(),
        price: parsedPrice,
        description: description ? description.trim() : '',
        mapUrl: mapUrl ? mapUrl.trim() : '',
        headerImage: headerPath,
        galleryImages: galleryPaths,
        featured: featured === 'true' || featured === true,
        status: 'Active',
        subevents: []
      });

      await newEvent.save();
      return res.status(201).json({ success: true, event: newEvent });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Save a new football match fixture to MongoDB
  createMatch: async (req, res) => {
    const { homeTeam, homeTeamLogo, awayTeam, awayTeamLogo, date, time, stadium, city, matchNo, status, featured } = req.body;

    // 1. Validate required fields
    if (!homeTeam || !homeTeam.trim()) return res.status(400).json({ success: false, message: 'Home team name is required.' });
    if (!awayTeam || !awayTeam.trim()) return res.status(400).json({ success: false, message: 'Away team name is required.' });
    if (!date || !date.trim()) return res.status(400).json({ success: false, message: 'Match date is required.' });
    if (!time || !time.trim()) return res.status(400).json({ success: false, message: 'Match time is required.' });
    if (!stadium || !stadium.trim()) return res.status(400).json({ success: false, message: 'Match stadium is required.' });
    if (!city || !city.trim()) return res.status(400).json({ success: false, message: 'Match city is required.' });
    if (matchNo === undefined || isNaN(parseInt(matchNo)) || parseInt(matchNo) <= 0) {
      return res.status(400).json({ success: false, message: 'Match number must be a valid positive integer.' });
    }

    if (homeTeam.trim().toLowerCase() === awayTeam.trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: 'A team cannot play against itself' });
    }

    try {
      const newMatch = new Event({
        id: 'MATCH-' + Math.floor(100 + Math.random() * 900),
        name: `${homeTeam.trim()} vs ${awayTeam.trim()}`,
        type: 'football',
        date: date.trim(),
        time: time.trim(),
        venue: stadium.trim(),
        stadium: stadium.trim(),
        city: city.trim(),
        matchNo: parseInt(matchNo) || 1,
        status: status || 'available',
        featured: featured === 'true' || featured === true,
        homeTeam: homeTeam.trim(),
        homeTeamLogo,
        awayTeam: awayTeam.trim(),
        awayTeamLogo
      });

      await newMatch.save();
      return res.status(201).json({ success: true, match: newMatch });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete an event by ID and cancel associated tickets
  deleteEvent: async (req, res) => {
    const { id } = req.params;

    try {
      const event = await Event.findOne({ id: id });
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const eventName = event.name;
      await Event.findOneAndDelete({ id: id });

      // Cancel matching tickets in user records
      await User.updateMany(
        { 'tickets.event': eventName },
        { $set: { 'tickets.$[t].status': 'cancelled' } },
        { arrayFilters: [{ 't.event': eventName }] }
      );

      // Cancel matching bookings
      await Booking.updateMany({ event: eventName }, { $set: { status: 'cancelled' } });

      return res.status(200).json({ success: true, message: 'Event deleted & matching tickets cancelled' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete a football match by ID and cancel associated tickets
  deleteMatch: async (req, res) => {
    const { id } = req.params;

    try {
      const match = await Event.findOne({ id: id });
      if (!match) {
        return res.status(404).json({ success: false, message: 'Football match not found' });
      }

      const matchName = `${match.homeTeam} vs ${match.awayTeam}`;
      await Event.findOneAndDelete({ id: id });

      // Cancel matching tickets in user records
      await User.updateMany(
        { 'tickets.event': matchName },
        { $set: { 'tickets.$[t].status': 'cancelled' } },
        { arrayFilters: [{ 't.event': matchName }] }
      );

      // Cancel matching bookings
      await Booking.updateMany({ event: matchName }, { $set: { status: 'cancelled' } });

      return res.status(200).json({ success: true, message: 'Match deleted & matching tickets cancelled' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Toggle featured state of an entertainment event
  toggleEventFeatured: async (req, res) => {
    const { id } = req.params;

    try {
      const event = await Event.findOne({ id: id });
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      event.featured = !event.featured;
      await event.save();
      return res.status(200).json({ success: true, event });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Toggle featured state of a match
  toggleMatchFeatured: async (req, res) => {
    const { id } = req.params;

    try {
      const match = await Event.findOne({ id: id });
      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      match.featured = !match.featured;
      await match.save();
      return res.status(200).json({ success: true, match });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get all event types
  getEventTypes: async (req, res) => {
    return res.status(200).json({ success: true, eventTypes });
  },

  // Add an event type
  addEventType: async (req, res) => {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, message: 'Event type required' });
    }

    const lowerType = type.trim().toLowerCase();
    if (eventTypes.includes(lowerType)) {
      return res.status(400).json({ success: false, message: 'Event type already exists' });
    }

    eventTypes.push(lowerType);
    return res.status(201).json({ success: true, eventTypes });
  },

  // Rename an event type
  editEventType: async (req, res) => {
    const { oldType, newType } = req.body;
    const lowerOld = oldType.trim().toLowerCase();
    const lowerNew = newType.trim().toLowerCase();

    const idx = eventTypes.indexOf(lowerOld);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Event type not found' });
    }

    if (eventTypes.includes(lowerNew) && lowerNew !== lowerOld) {
      return res.status(400).json({ success: false, message: 'New event type name already exists' });
    }

    eventTypes[idx] = lowerNew;

    // Update all matching events in MongoDB to point to the new type
    await Event.updateMany({ type: lowerOld }, { $set: { type: lowerNew } });

    return res.status(200).json({ success: true, eventTypes });
  },

  // Delete an event type
  deleteEventType: async (req, res) => {
    const { type } = req.params;
    const lowerType = type.trim().toLowerCase();

    if (lowerType === 'football') {
      return res.status(400).json({ success: false, message: 'Cannot delete the core football category' });
    }

    eventTypes = eventTypes.filter(t => t !== lowerType);
    return res.status(200).json({ success: true, eventTypes });
  },

  // Edit an existing entertainment event
  editEvent: async (req, res) => {
    const { id } = req.params;
    const { name, type, date, venue, price, description, mapUrl, featured, existingHeaderImage, existingGalleryImages } = req.body;

    // 1. Validate inputs if they are provided
    if (name !== undefined && !name.trim()) return res.status(400).json({ success: false, message: 'Event name cannot be empty.' });
    if (type !== undefined && !type.trim()) return res.status(400).json({ success: false, message: 'Event type cannot be empty.' });
    if (date !== undefined && !date.trim()) return res.status(400).json({ success: false, message: 'Event date cannot be empty.' });
    if (venue !== undefined && !venue.trim()) return res.status(400).json({ success: false, message: 'Event venue cannot be empty.' });

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
      }
    }

    if (mapUrl && mapUrl.trim()) {
      try {
        const parsedUrl = new URL(mapUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          return res.status(400).json({ success: false, message: 'Google Maps link must use HTTP or HTTPS protocol.' });
        }
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Google Maps link must be a valid URL format.' });
      }
    }

    try {
      const event = await Event.findOne({ id: id });
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (name) event.name = name.trim();
      if (type) event.type = type.trim().toLowerCase();
      if (date) event.date = date.trim();
      if (venue) event.venue = venue.trim();
      if (price !== undefined) event.price = parseFloat(price);
      if (description !== undefined) event.description = description.trim();
      if (mapUrl !== undefined) event.mapUrl = mapUrl.trim();

      // Handle Header Image
      if (req.files && req.files['headerImage'] && req.files['headerImage'][0]) {
        event.headerImage = '/uploads/' + req.files['headerImage'][0].filename;
      } else if (existingHeaderImage !== undefined) {
        event.headerImage = existingHeaderImage;
      }

      // Handle Gallery Images (Merge existing and new)
      let parsedExistingGallery = [];
      if (existingGalleryImages) {
        try {
          parsedExistingGallery = JSON.parse(existingGalleryImages);
        } catch (e) {
          parsedExistingGallery = [];
        }
      }
      let newGalleryPaths = [];
      if (req.files && req.files['galleryImages']) {
        newGalleryPaths = req.files['galleryImages'].map(file => '/uploads/' + file.filename);
      }
      event.galleryImages = [...parsedExistingGallery, ...newGalleryPaths];

      if (featured !== undefined) {
        event.featured = featured === 'true' || featured === true;
      }

      await event.save();
      return res.status(200).json({ success: true, event });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // Edit an existing football match
  editMatch: async (req, res) => {
    const { id } = req.params;
    const { homeTeam, homeTeamLogo, awayTeam, awayTeamLogo, date, time, stadium, city, matchNo, status, featured } = req.body;

    // Validate if fields are empty
    if (homeTeam !== undefined && !homeTeam.trim()) return res.status(400).json({ success: false, message: 'Home team name cannot be empty.' });
    if (awayTeam !== undefined && !awayTeam.trim()) return res.status(400).json({ success: false, message: 'Away team name cannot be empty.' });
    if (date !== undefined && !date.trim()) return res.status(400).json({ success: false, message: 'Match date cannot be empty.' });
    if (time !== undefined && !time.trim()) return res.status(400).json({ success: false, message: 'Match time cannot be empty.' });
    if (stadium !== undefined && !stadium.trim()) return res.status(400).json({ success: false, message: 'Match stadium cannot be empty.' });
    if (city !== undefined && !city.trim()) return res.status(400).json({ success: false, message: 'Match city cannot be empty.' });
    
    if (matchNo !== undefined && (isNaN(parseInt(matchNo)) || parseInt(matchNo) <= 0)) {
      return res.status(400).json({ success: false, message: 'Match number must be a valid positive integer.' });
    }

    const checkHome = homeTeam || '';
    const checkAway = awayTeam || '';
    if (checkHome && checkAway && checkHome.trim().toLowerCase() === checkAway.trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: 'A team cannot play against itself' });
    }

    try {
      const match = await Event.findOne({ id: id });
      if (!match) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      if (homeTeam) match.homeTeam = homeTeam.trim();
      if (homeTeamLogo) match.homeTeamLogo = homeTeamLogo;
      if (awayTeam) match.awayTeam = awayTeam.trim();
      if (awayTeamLogo) match.awayTeamLogo = awayTeamLogo;
      if (homeTeam || awayTeam) {
        // Ensure self-match check handles cases where only one team is updated
        if (match.homeTeam.toLowerCase() === match.awayTeam.toLowerCase()) {
          return res.status(400).json({ success: false, message: 'A team cannot play against itself' });
        }
        match.name = `${match.homeTeam} vs ${match.awayTeam}`;
      }
      if (date) match.date = date.trim();
      if (time) match.time = time.trim();
      if (stadium) {
        match.venue = stadium.trim();
        match.stadium = stadium.trim();
      }
      if (city) match.city = city.trim();
      if (matchNo !== undefined) match.matchNo = parseInt(matchNo) || 1;
      if (status) match.status = status;
      if (featured !== undefined) {
        match.featured = featured === 'true' || featured === true;
      }

      await match.save();
      return res.status(200).json({ success: true, match });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};

// Aliases and additional methods for compatibility
eventController.getAllEvents = eventController.getEvents;
eventController.getEventById = async (req, res) => {
  const id = req.params.id || req.query.id;
  try {
    const event = await Event.findOne({ id: id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
    if (acceptsHtml) {
      return res.render('event_details', { event });
    }
    return res.status(200).json({ success: true, event });
  } catch (err) {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.status(500).send(err.message);
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};
eventController.getEventDetails = eventController.getEventById;

module.exports = eventController;
