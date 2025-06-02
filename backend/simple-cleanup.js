const fs = require('fs');
const path = require('path');

// Read the current sessions file
const sessionsPath = path.join(__dirname, 'sessions.json');
const data = fs.readFileSync(sessionsPath, 'utf8');
const sessions = JSON.parse(data);

console.log('Processing', sessions.length, 'sessions...');

let totalDuplicatesRemoved = 0;

// Process each session
sessions.forEach((session, index) => {
  if (!session.messages || !Array.isArray(session.messages)) {
    return;
  }

  const originalCount = session.messages.length;
  const seenIds = new Set();
  const uniqueMessages = [];
  
  session.messages.forEach((message) => {
    if (!seenIds.has(message.id)) {
      seenIds.add(message.id);
      uniqueMessages.push(message);
    } else {
      totalDuplicatesRemoved++;
      console.log(`Removing duplicate in session "${session.title}": ${message.id}`);
    }
  });
  
  session.messages = uniqueMessages;
  
  if (originalCount !== uniqueMessages.length) {
    console.log(`Session ${index + 1} "${session.title}": ${originalCount} -> ${uniqueMessages.length} messages`);
  }
});

console.log(`\nTotal duplicates removed: ${totalDuplicatesRemoved}`);

// Create backup
const backupPath = `${sessionsPath}.backup-${Date.now()}`;
fs.copyFileSync(sessionsPath, backupPath);
console.log(`Created backup: ${backupPath}`);

// Save cleaned data
fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));
console.log('✅ Cleanup complete!');
