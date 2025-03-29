import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const EXCUSES = {
  "running": [
    "my shoes are having an existential crisis",
    "I saw a weather forecast from a parallel universe where it's raining",
    "I'm saving my energy for professional couch surfing",
  ],
  "weightlifting": [
    "the weights looked at me funny",
    "my muscles are on a meditation retreat",
    "gravity is particularly strong today",
  ],
  "yoga": [
    "my chakras are already perfectly aligned... probably",
    "my yoga mat is practicing social distancing",
    "my zen is at maximum capacity",
  ],
  "swimming": [
    "the water molecules requested a day off",
    "my swimsuit is attending a fashion show",
    "I'm allergic to chlorine today only",
  ],
  "cycling": [
    "my bike is having a quarter-life crisis",
    "the wind is too aerodynamic today",
    "my pedals are practicing mindfulness",
  ],
  "HIIT": [
    "my intervals need a interval",
    "my high intensity is feeling rather low",
    "my burpees have burped their last",
  ]
};

const COUNTER_MOTIVATIONS = [
  "those endorphins won't release themselves",
  "your future self is sending eye rolls from tomorrow",
  "your workout playlist is feeling neglected",
  "that post-workout glow doesn't come from Netflix",
  "your muscles are plotting their revenge",
  "the gym misses your awkward selfies",
];

app.post('/generate-excuse', (req, res) => {
  const { workout_type, duration, intensity } = req.body;

  // Validate input
  if (!workout_type || !EXCUSES[workout_type]) {
    return res.status(400).json({ error: 'Invalid workout type' });
  }
  if (!duration || duration < 1 || duration > 180) {
    return res.status(400).json({ error: 'Duration must be between 1 and 180 minutes' });
  }
  if (!intensity || !['light', 'moderate', 'intense'].includes(intensity)) {
    return res.status(400).json({ error: 'Invalid intensity level' });
  }

  const excuse = EXCUSES[workout_type][Math.floor(Math.random() * EXCUSES[workout_type].length)];
  const counter_motivation = COUNTER_MOTIVATIONS[Math.floor(Math.random() * COUNTER_MOTIVATIONS.length)];

  res.json({
    excuse: `I can't do ${workout_type} today because ${excuse}`,
    counter_motivation: `But remember: ${counter_motivation}`,
    workout_details: {
      workout_type,
      duration_minutes: duration,
      intensity
    }
  });
});

// Serve index.html for all other routes to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});