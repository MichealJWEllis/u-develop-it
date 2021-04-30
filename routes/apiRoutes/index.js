const express = require('express')
const router = express.Router()

router.use(require('./canidateRoutes'))
router.use(require('./partyRoutes'))
router.use(require('./voterRoutes'))

module.exports = router