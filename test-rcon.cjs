const Rcon = require('rcon-srcds');

async function test() {
  console.log('Creating RCON client...');
  const rcon = new Rcon({
    host: 'localhost',
    port: 27015,
    password: 'test123',
    timeout: 5000
  });

  try {
    console.log('Authenticating...');
    await rcon.authenticate('test123');
    console.log('✓ Connected!');
    
    console.log('Executing /time command...');
    const result = await rcon.execute('/time');
    console.log('✓ Result:', result);
    
    console.log('Disconnecting...');
    await rcon.disconnect();
    console.log('✓ Done!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
