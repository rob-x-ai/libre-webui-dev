#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sessionsPath = path.join(__dirname, 'sessions.json');

console.log('Script started, checking sessions file...');

function cleanupDuplicateMessages() {
  try {
    // Read the sessions file
    const sessionsData = fs.readFileSync(sessionsPath, 'utf8');
    const sessions = JSON.parse(sessionsData);
    
    let totalDuplicatesRemoved = 0;
    
    // Process each session
    sessions.forEach((session, sessionIndex) => {
      if (!session.messages || !Array.isArray(session.messages)) {
        return;
      }
      
      const uniqueMessages = [];
      const seenMessageIds = new Set();
      let sessionDuplicatesRemoved = 0;
      
      session.messages.forEach((message, messageIndex) => {
        // Create a unique key for this message based on ID, role, and content
        const messageKey = `${message.id}_${message.role}_${message.content?.substring(0, 50)}`;
        
        if (!seenMessageIds.has(messageKey)) {
          // First occurrence - keep it
          seenMessageIds.add(messageKey);
          uniqueMessages.push(message);
        } else {
          // Duplicate found - skip it
          sessionDuplicatesRemoved++;
          console.log(`  Removing duplicate message in session "${session.title}" (ID: ${message.id})`);
        }
      });
      
      // Update the session messages
      session.messages = uniqueMessages;
      totalDuplicatesRemoved += sessionDuplicatesRemoved;
      
      if (sessionDuplicatesRemoved > 0) {
        console.log(`Session "${session.title}": Removed ${sessionDuplicatesRemoved} duplicate messages`);
      }
    });
    
    if (totalDuplicatesRemoved > 0) {
      // Create backup of original file
      const backupPath = `${sessionsPath}.backup-${Date.now()}`;
      fs.copyFileSync(sessionsPath, backupPath);
      console.log(`\nCreated backup at: ${backupPath}`);
      
      // Write cleaned sessions back to file
      fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));
      console.log(`\n✅ Successfully cleaned up ${totalDuplicatesRemoved} duplicate messages!`);
      console.log(`📁 Updated sessions.json with clean data`);
    } else {
      console.log('\n✅ No duplicate messages found - sessions.json is already clean!');
    }
    
  } catch (error) {
    console.error('❌ Error cleaning up duplicate messages:', error.message);
    process.exit(1);
  }
}

console.log('🧹 Starting duplicate message cleanup...\n');
cleanupDuplicateMessages();
