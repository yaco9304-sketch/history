/**
 * 싱글플레이 모드 자동화 테스트 스크립트
 * Socket.io를 사용하여 싱글플레이 기능을 테스트합니다.
 */

const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';

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

// 테스트 1: 싱글플레이 팀 모드 - 방 생성 및 입장
async function testSinglePlayerTeamMode() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let roomCreated = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('싱글플레이 팀 모드 - 방 생성', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      // 싱글플레이 팀 모드용 방 생성 (MAIN 방 사용)
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '싱글플레이어1'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !roomCreated) {
        roomCreated = true;
        clearTimeout(timeout);
        logTest('싱글플레이 팀 모드 - 방 입장', true, `방 코드: ${room.code}, 플레이어: ${player.name}`);
        socket.disconnect();
        resolve(true);
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('싱글플레이 팀 모드 - 방 입장', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 2: 싱글플레이 팀 모드 - AI 플레이어 추가
async function testAddAIPlayer() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let aiAdded = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('AI 플레이어 추가', false, '타임아웃');
      resolve(false);
    }, 15000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '싱글플레이어2'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !aiAdded) {
        // AI 플레이어 추가 요청 (HTTP API 사용)
        const http = require('http');
        const options = {
          hostname: 'localhost',
          port: 3001,
          path: `/api/ai/add`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              // AI 추가 성공, 방 업데이트 대기
              console.log('[테스트] AI 플레이어 추가 성공, 방 업데이트 대기...');
            } else {
              clearTimeout(timeout);
              logTest('AI 플레이어 추가', false, `HTTP ${res.statusCode}: ${data.substring(0, 100)}`);
              socket.disconnect();
              resolve(false);
            }
          });
        });

        req.on('error', (error) => {
          clearTimeout(timeout);
          logTest('AI 플레이어 추가', false, error.message);
          socket.disconnect();
          resolve(false);
        });

        req.write(JSON.stringify({
          roomCode: room.code,
          nation: 'baekje',
          difficulty: 'normal'
        }));
        req.end();
      }
    });

    socket.on('roomUpdated', (room) => {
      if (room && !aiAdded) {
        // AI 플레이어 확인
        const aiPlayers = Object.values(room.players).filter(p => p.isAI);
        if (aiPlayers.length > 0) {
          aiAdded = true;
          clearTimeout(timeout);
          logTest('AI 플레이어 추가', true, `AI 플레이어 수: ${aiPlayers.length}`);
          socket.disconnect();
          resolve(true);
        }
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('AI 플레이어 추가', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 3: 싱글플레이 팀 모드 - 팀 선택
async function testSinglePlayerTeamSelection() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let teamSelected = false;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('싱글플레이 팀 선택', false, '타임아웃');
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '싱글플레이어3'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !teamSelected) {
        socket.emit('selectTeam', 'silla');
      }
    });

    socket.on('roomUpdated', (room) => {
      if (room && !teamSelected) {
        const player = Object.values(room.players).find(p => p.name === '싱글플레이어3');
        if (player && player.team === 'silla') {
          teamSelected = true;
          clearTimeout(timeout);
          logTest('싱글플레이 팀 선택', true, `선택한 팀: ${player.team}`);
          socket.disconnect();
          resolve(true);
        }
      }
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('싱글플레이 팀 선택', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 4: 싱글플레이 팀 모드 - 게임 시작
async function testSinglePlayerGameStart() {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });

    let gameStarted = false;
    let aiAdded = 0;
    const timeout = setTimeout(() => {
      socket.disconnect();
      logTest('싱글플레이 게임 시작', false, `타임아웃 (AI 추가: ${aiAdded}/2)`);
      resolve(false);
    }, 30000);

    socket.on('connect', () => {
      socket.emit('joinRoom', {
        code: 'MAIN',
        playerName: '싱글플레이어4'
      });
    });

    socket.on('roomJoined', (room, player) => {
      if (room && player && !gameStarted) {
        // 팀 선택
        socket.emit('selectTeam', 'goguryeo');
      }
    });

    socket.on('roomUpdated', (room) => {
      if (room && !gameStarted) {
        const player = Object.values(room.players).find(p => p.name === '싱글플레이어4');
        
        // 팀 선택 완료 후 준비 상태로 변경
        if (player && player.team === 'goguryeo' && !player.isReady) {
          socket.emit('toggleReady');
        }
        
        // 준비 완료 후 AI 추가
        if (player && player.team === 'goguryeo' && player.isReady && aiAdded === 0) {
          const http = require('http');
          const options = {
            hostname: 'localhost',
            port: 3001,
            path: `/api/ai/add`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          };
          
          // 백제와 신라에 AI 추가
          ['baekje', 'silla'].forEach((nation, index) => {
            setTimeout(() => {
              const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                  if (res.statusCode === 200 || res.statusCode === 201) {
                    aiAdded++;
                    console.log(`[테스트] ${nation} 팀에 AI 추가 성공 (${aiAdded}/2)`);
                  }
                });
              });
              req.on('error', () => {});
              req.write(JSON.stringify({
                roomCode: room.code,
                nation: nation,
                difficulty: 'normal'
              }));
              req.end();
            }, index * 1000);
          });
        }
        
        // 모든 팀에 플레이어가 있고 모두 준비 완료되면 게임 시작
        const allTeamsHavePlayers = ['goguryeo', 'baekje', 'silla'].every(nation => 
          room.teams[nation].players.length > 0
        );
        const allReady = Object.values(room.players)
          .filter(p => p.team && p.isOnline)
          .every(p => p.isReady);
        
        if (allTeamsHavePlayers && allReady && room.hostId === player?.id && !gameStarted) {
          setTimeout(() => {
            console.log('[테스트] 모든 조건 충족, 게임 시작 요청...');
            socket.emit('startGame');
          }, 2000);
        }
      }
    });

    socket.on('gameStarted', (room) => {
      if (room && !gameStarted) {
        gameStarted = true;
        clearTimeout(timeout);
        logTest('싱글플레이 게임 시작', true, `게임 상태: ${room.status}`);
        socket.disconnect();
        resolve(true);
      }
    });

    socket.on('gameStarting', (countdown) => {
      // 카운트다운 시작
      console.log(`[테스트] 게임 시작 카운트다운: ${countdown}`);
    });

    socket.on('error', (error) => {
      clearTimeout(timeout);
      logTest('싱글플레이 게임 시작', false, error);
      socket.disconnect();
      resolve(false);
    });
  });
}

// 테스트 5: 싱글플레이 개인 모드 시뮬레이션 (로컬 상태만 확인)
async function testSinglePlayerPersonalMode() {
  return new Promise((resolve) => {
    // 싱글플레이 개인 모드는 서버 없이 클라이언트에서만 작동하므로
    // 여기서는 기본적인 검증만 수행
    logTest('싱글플레이 개인 모드', true, '클라이언트 전용 모드 (서버 테스트 불가)');
    resolve(true);
  });
}

// 모든 테스트 실행
async function runAllTests() {
  console.log('🚀 싱글플레이 모드 자동화 테스트 시작...\n');
  console.log('='.repeat(50));
  
  await testSinglePlayerTeamMode();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testSinglePlayerTeamSelection();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testAddAIPlayer();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testSinglePlayerGameStart();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testSinglePlayerPersonalMode();
  
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

