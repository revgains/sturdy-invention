require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const Boss = require('./models/boss');
const Zone = require('./models/zone');
const cors = require('cors');

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('wow-bestiary-database');
});

app.post('/api/bosses', (req, res) => {
  const body = req.body;
  console.log(body);

  const trimmedZone = body.zone
    .toLowerCase()
    .trim()
    .replace(/\s/g, '_');

  const boss = new Boss({
    name: body.name,
    baseHp: body.baseHp,
    spells: [],
    affectedBy: body.affectedBy,
    zone: trimmedZone
  });

  boss.spells = body.spells.map(spell => spell);

  boss.save().then(savedBoss => {
    res.json(savedBoss.toJSON());
  });
});

app.post('/api/zones', (req, res) => {
  const body = req.body;

  const trimmedName = body.name
    .toLowerCase()
    .trim()
    .replace(/\s/g, '_');

  const zone = new Zone({
    name: trimmedName,
    zone: body.zone,
    background: body.background
  });

  zone.save().then(savedZone => {
    res.json(savedZone.toJSON());
  });
});

app.get('/api/bosses', (req, res) => {
  Boss.find({}).then(boss => {
    res.send(boss);
  });
});

app.get('/api/zones', (req, res) => {
  Zone.find({}).then(zone => {
    res.send(zone);
  });
});

app.get('/api/bosses/:zone', (req, res) => {
  const zone = req.params.zone;

  const trimmedZone = zone
    .toLowerCase()
    .trim()
    .replace(/\s/g, '_');

  Boss.find({ zone: `${trimmedZone}` }).then(boss => {
    res.send(boss);
  });
});

app.listen(PORT, () => console.log(`server running in port ${PORT}`));
