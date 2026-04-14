const router = require('express').Router();
const c = require('../controllers/categories.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', c.getAll);
router.post('/', c.create);
router.delete('/:id', c.remove);

module.exports = router;