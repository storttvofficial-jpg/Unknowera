
### `server/routes/execute.js`

```javascript
import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sanitizeCommand } from '../utils/sanitizer.js';

const router = express.Router();
const execAsync = promisify(exec);

router.post('/', async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: 'Command required' });

  if (!sanitizeCommand(command)) {
    return res.status(403).json({ error: 'Command not allowed' });
  }

  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    res.json({ output: stdout || stderr });
  } catch (error) {
    res.status(500).json({ error: error.message, output: error.stdout || error.stderr });
  }
});

export default router;
