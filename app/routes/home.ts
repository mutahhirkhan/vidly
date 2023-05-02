//import express and add base route which returns a string 'Welcome to VIDLY'
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  try {
    throw new Error('Something failed');
    res.send('Welcome to VIDLY');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})
export default router;