// Test script to verify Baekje event selection
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

console.log('🧪 Testing Baekje event selection...\n');

socket.on('connect', () => {
  console.log('✅ Connected to server');

  // Create single-player team mode room
  socket.emit('createRoom', {
    hostName: 'TestPlayer',
    className: 'TestClass',
    settings: {
      gameMode: 'team',
      maxPlayersPerTeam: 3,
      turnTimeLimit: 60,
      eventCount: 10,
    }
  });
});

socket.on('roomCreated', (room) => {
  console.log(`✅ Room created: ${room.code}`);
  console.log(`   Room ID: ${room.id}\n`);

  const roomCode = room.code;

  // Join Baekje team
  socket.emit('selectTeam', 'baekje');
  console.log('📍 Selected team: Baekje');

  // Add AI players to other teams
  setTimeout(async () => {
    try {
      // Add AI to Goguryeo
      await fetch('http://localhost:3001/api/ai/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, nation: 'goguryeo', difficulty: 'normal' }),
      });
      console.log('✅ Added AI to Goguryeo');

      // Add AI to Silla
      await fetch('http://localhost:3001/api/ai/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, nation: 'silla', difficulty: 'normal' }),
      });
      console.log('✅ Added AI to Silla\n');

      // Mark player as ready and start game
      setTimeout(() => {
        socket.emit('toggleReady');
        console.log('✅ Player ready');

        setTimeout(() => {
          socket.emit('startGame', { roomCode });
          console.log('🎮 Starting game...\n');
        }, 500);
      }, 500);
    } catch (error) {
      console.error('❌ Failed to add AI players:', error);
      socket.disconnect();
      process.exit(1);
    }
  }, 1000);
});

socket.on('gameStarted', (data) => {
  console.log('✅ Game started!');
  console.log(`   Current Turn: ${data.room.currentTurn}`);
  console.log(`   Game Phase: ${data.room.gamePhase}\n`);
});

socket.on('eventPresented', (data) => {
  console.log('📜 Event Presented:');
  console.log(`   Title: ${data.event.title}`);
  console.log(`   Target Nation: ${data.event.targetNation}`);
  console.log(`   Description: ${data.event.description.substring(0, 50)}...`);
  console.log(`   Turn: ${data.turn}\n`);

  // Check if the event is for Baekje or 'all'
  if (data.event.targetNation === 'baekje') {
    console.log('✅ SUCCESS: Baekje event shown for Baekje player!');
  } else if (data.event.targetNation === 'all') {
    console.log('ℹ️  INFO: Universal event (targetNation: all)');
  } else {
    console.log(`❌ FAIL: Wrong nation event! Expected 'baekje' or 'all', got '${data.event.targetNation}'`);
  }

  // Disconnect after verification
  setTimeout(() => {
    socket.disconnect();
    process.exit(data.event.targetNation === 'baekje' || data.event.targetNation === 'all' ? 0 : 1);
  }, 1000);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
  socket.disconnect();
  process.exit(1);
});

socket.on('disconnect', () => {
  console.log('\n🔌 Disconnected from server');
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Test timeout!');
  socket.disconnect();
  process.exit(1);
}, 10000);
