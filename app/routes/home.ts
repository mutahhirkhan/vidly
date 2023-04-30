//import express and add base route which returns a string 'Welcome to VIDLY'
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  res.send('Welcome to VIDLY');
})
export default router;