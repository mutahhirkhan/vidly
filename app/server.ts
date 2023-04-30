import mongoose from 'mongoose';
import express from 'express';
import generes from "./routes/genres";
import home from "./routes/home";
import { connectionString, PORT } from './utilities/constant';
  
const port = process.env.PORT || PORT;
const app = express();

console.log('dnnnnnnnnnnnnnnnnN');

mongoose.connect(connectionString, { dbName: 'vidly', family:4 })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


app.use(express.json());
app.use('/api/genres', generes);
app.use('/', home);


app.get('/', (req, res) => {
  res.send({ express: 'Hello From VIDLY Express' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
