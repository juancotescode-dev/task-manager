const router = require('express').Router();
const c = require('../controllers/tasks.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/stats', c.getStats);
router.get('/', c.getAll);
router.post('/', c.create);
router.patch('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;