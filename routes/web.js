const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../authMiddleware');
const upload = require('../middleware/upload');

// ==========================================
// EJS WEB PAGE RENDER ROUTINGS
// ==========================================

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/booking', (req, res) => {
  res.render('booking');
});

router.get('/events', (req, res) => {
  res.render('events');
});

router.get('/user', (req, res) => {
  res.render('user');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/categories', (req, res) => {
  res.render('categories');
});

router.get('/sports', (req, res) => {
  res.render('sports');
});

router.get('/event-details', (req, res) => {
  res.render('event_details');
});

router.get('/payment', (req, res) => {
  res.render('payment');
});

router.get('/confirmation', (req, res) => {
  res.render('confirmation');
});

// ==========================================
// API EVENT & MATCH ROUTINGS
// ==========================================

router.get('/api/events', eventController.getEvents);
router.post('/api/events', upload.fields([{ name: 'headerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), eventController.createEvent);
router.post('/api/matches', eventController.createMatch);
router.delete('/api/events/:id', eventController.deleteEvent);
router.delete('/api/matches/:id', eventController.deleteMatch);
router.post('/api/events/toggle-featured/:id', eventController.toggleEventFeatured);
router.post('/api/matches/toggle-featured/:id', eventController.toggleMatchFeatured);
router.post('/api/events/edit/:id', upload.fields([{ name: 'headerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), eventController.editEvent);
router.post('/api/matches/edit/:id', eventController.editMatch);

// Event Types API
router.get('/api/event-types', eventController.getEventTypes);
router.post('/api/event-types', eventController.addEventType);
router.post('/api/event-types/edit', eventController.editEventType);
router.delete('/api/event-types/:type', eventController.deleteEventType);

// 404 Route
router.get('/404', (req, res) => {
  res.status(404).render('404');
});

module.exports = router;
