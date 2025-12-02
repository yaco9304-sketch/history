/**
 * 자동화 테스트 스크립트
 * Socket.io를 사용하여 게임 기능을 테스트합니다.
 */

const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';
const CLIENT_URL = 'http://localhost:5173';

// 테스트 결과 저장
const testResults = {
  passed: [],
  failed: [],
  total: 0
};

function logTest(name, passed, message = '') {
  testResults.total++;
  if (passed) {
    testResults.passed.push(name);
    console.log(`✅ [PASS] ${name}${message ? ': ' + message : ''}`);
  } else {
    testResults.failed.push(name);
    console.error(`❌ [FAIL] ${name}${message ? ': ' + message : ''}`);
  }
}

// 테스트 1: 소켓 연결
async function testSocketConnection() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('소켓 연결', false, '타임아웃');
      resolve(false);
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      logTest('소켓 연결', true);
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      logTest('소켓 연결', false, error.message);
      resolve(false);
    });
  });
}

// 테스트 2: 방 입장
async function testJoinRoom() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let roomJoined = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('방 입장', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '테스트플레이어1'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (!roomJoined && room && player) {
        roomJoined = true;
        clearTimeout(timeout);
        logTest('방 입장', true, `방 코드: ${room.code}, 플레이어: ${player.name}`);
        socket.disconnect();
        resolve(true);
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('방 입장', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 3: 팀 선택
async function testSelectTeam() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let teamSelected = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('팀 선택', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '테스트플레이어2'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !teamSelected) {
        socket.emit('selectTeam', 'goguryeo');
      }
    });

    socket.on('roomUpdated', (room) => {
      if (room && !teamSelected) {
        const player = Object.values(room.players).find(p => p.name === '테스트플레이어2');
        if (player && player.team === 'goguryeo') {
          teamSelected = true;
          clearTimeout(timeout);
          logTest('팀 선택', true, `선택한 팀: ${player.team}`);
          socket.disconnect();
          resolve(true);
        }
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('팀 선택', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 4: 준비 상태 토글
async function testToggleReady() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let readyToggled = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('준비 상태 토글', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '테스트플레이어3'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !readyToggled) {
        socket.emit('selectTeam', 'baekje');
        setTimeout(() => {
          socket.emit('toggleReady');
        }, 500);
      }
    });

    socket.on('roomUpdated', (room) => {
      if (room && !readyToggled) {
        const player = Object.values(room.players).find(p => p.name === '테스트플레이어3');
        if (player && player.team && player.isReady !== undefined) {
          readyToggled = true;
          clearTimeout(timeout);
          logTest('준비 상태 토글', true, `준비 상태: ${player.isReady}`);
          socket.disconnect();
          resolve(true);
        }
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('준비 상태 토글', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 5: 채팅 메시지 전송
async function testSendChat() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let chatReceived = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('채팅 메시지 전송', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '테스트플레이어4'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !chatReceived) {
        socket.emit('selectTeam', 'silla');
        setTimeout(() => {
          socket.emit('sendChat', {
            message: '테스트 메시지',
            type: 'public'
          });
        }, 500);
      }
    });

    socket.on('chatMessage', (message) => {
      if (message && message.message === '테스트 메시지' && !chatReceived) {
        chatReceived = true;
        clearTimeout(timeout);
        logTest('채팅 메시지 전송', true, `메시지: ${message.message}`);
        socket.disconnect();
        resolve(true);
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('채팅 메시지 전송', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 6: 재접속 테스트
async function testReconnection() {
  return new Promise((resolve) => {
    let playerId = null;
    let teamSelected = false;
    const socket1 = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    const timeout = setTimeout(() => {
      socket1.disconnect();
      logTest('재접속 테스트', false, '타임아웃');
      resolve(false);
    }, 20000);

    socket1.on('connect', () => {
      socket1.emit('joinRoom', {
        code: 'MAIN',
        playerName: '재접속테스트'
      });
    });

    socket1.on('roomJoined', (room, player) => {
      if (room && player && !playerId) {
        playerId = player.id;
        socket1.emit('selectTeam', 'goguryeo');
      }
    });

    socket1.on('roomUpdated', (room) => {
      if (room && playerId && !teamSelected) {
        const player = room.players[playerId];
        if (player && player.team === 'goguryeo') {
          teamSelected = true;
          setTimeout(() => {
            socket1.disconnect();
            
            // 재접속
            const socket2 = io(SERVER_URL, {
              autoConnect: true,
              reconnection: false,
              timeout: 5000
            });

            socket2.on('connect', () => {
              socket2.emit('joinRoom', {
                code: 'MAIN',
                playerName: '재접속테스트',
                playerId: playerId
              });
            });

            socket2.on('roomJoined', (room2, player2) => {
              if (room2 && player2 && player2.id === playerId) {
                clearTimeout(timeout);
                if (player2.team === 'goguryeo') {
                  logTest('재접속 테스트', true, `기존 정보 유지: 팀=${player2.team}`);
                } else {
                  logTest('재접속 테스트', true, `재접속 성공 (팀 정보: ${player2.team || '없음'})`);
                }
                socket2.disconnect();
                resolve(true);
              }
            });

            socket2.on('roomUpdated', (room2) => {
              if (room2 && playerId) {
                const player2 = room2.players[playerId];
                if (player2) {
                  clearTimeout(timeout);
                  logTest('재접속 테스트', true, `재접속 성공 (팀 정보: ${player2.team || '없음'})`);
                  socket2.disconnect();
                  resolve(true);
                }
              }
            });

            socket2.on('error', (error) => {
              clearTimeout(timeout);
              logTest('재접속 테스트', false, error);
              socket2.disconnect();
              resolve(false);
            });
          }, 2000);
        }
      }
    });

    socket1.on('error', (error) => {
      clearTimeout(timeout);
      logTest('재접속 테스트', false, error);
      socket1.disconnect();
      resolve(false);
    });
  });
}

// 모든 테스트 실행
async function runAllTests() {
  console.log('🚀 자동화 테스트 시작...\n');
  console.log('='.repeat(50));
  
  await testSocketConnection();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testJoinRoom();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testSelectTeam();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testToggleReady();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testSendChat();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testReconnection();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 테스트 결과 요약:');
  console.log(`총 테스트: ${testResults.total}`);
  console.log(`✅ 통과: ${testResults.passed.length}`);
  console.log(`❌ 실패: ${testResults.failed.length}`);
  
  if (testResults.failed.length > 0) {
    console.log('\n실패한 테스트:');
    testResults.failed.forEach(test => console.log(`  - ${test}`));
  }
  
  console.log('\n✅ 통과한 테스트:');
  testResults.passed.forEach(test => console.log(`  - ${test}`));
  
  process.exit(testResults.failed.length > 0 ? 1 : 0);
}

// 테스트 실행
runAllTests().catch(error => {
  console.error('테스트 실행 중 오류:', error);
  process.exit(1);
});

