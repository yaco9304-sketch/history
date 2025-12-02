/**
 * 멀티플레이 자동 시연 스크립트
 * Playwright를 사용하여 여러 플레이어가 동시에 게임에 참여하는 시나리오를 시연합니다.
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:5173';
const PLAYERS = [
  { name: '고구려왕', nation: 'goguryeo' },
  { name: '백제왕', nation: 'baekje' },
  { name: '신라왕', nation: 'silla' },
];

async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // 추가 안정화 시간
}

async function selectNation(page, player) {
  console.log(`[${player.name}] 국가 선택 페이지로 이동...`);
  
  // 국가 선택 페이지에서 국가 클릭
  const nationSelectors = {
    goguryeo: 'text=고구려',
    baekje: 'text=백제',
    silla: 'text=신라',
  };
  
  const nationSelector = nationSelectors[player.nation] || nationSelectors.goguryeo;
  
  try {
    // 국가 카드 클릭
    await page.click(nationSelector);
    console.log(`[${player.name}] ${player.nation} 선택`);
    await page.waitForTimeout(500);
    
    // 닉네임 입력
    await page.fill('input[type="text"][placeholder*="닉네임"]', player.name);
    console.log(`[${player.name}] 닉네임 입력: ${player.name}`);
    await page.waitForTimeout(500);
    
    // 입장 버튼 클릭
    const joinButton = page.locator('button:has-text("팀으로 입장")').or(page.locator('button:has-text("입장")'));
    await joinButton.click();
    console.log(`[${player.name}] 입장 버튼 클릭`);
    
    // 로비 페이지로 이동할 때까지 대기
    await page.waitForURL(/\/game\/.*\/lobby/, { timeout: 10000 });
    console.log(`[${player.name}] 로비 페이지 도착!`);
    
    return true;
  } catch (error) {
    console.error(`[${player.name}] 국가 선택 실패:`, error.message);
    return false;
  }
}

async function waitAndStartGame(page, playerName, isHost) {
  if (!isHost) {
    // 호스트가 아니면 게임 시작을 기다림
    console.log(`[${playerName}] 게임 시작 대기 중...`);
    
    // 게임 페이지로 이동할 때까지 대기 (최대 60초)
    try {
      await page.waitForURL(/\/game\/.*\/play/, { timeout: 60000 });
      console.log(`[${playerName}] 게임 시작!`);
      return true;
    } catch (error) {
      console.error(`[${playerName}] 게임 시작 대기 시간 초과`);
      return false;
    }
  }
  
  // 호스트인 경우: 모든 플레이어가 준비될 때까지 대기 후 5초 후 게임 시작
  console.log(`[${playerName}] 호스트로 게임 시작 준비 중...`);
  
  // 모든 플레이어가 준비될 때까지 대기 (최대 30초)
  let allReady = false;
  const maxWaitTime = 30000; // 30초
  const startTime = Date.now();
  
  while (!allReady && (Date.now() - startTime) < maxWaitTime) {
    try {
      // 준비 완료 상태 확인
      const readyInfo = await page.locator('text=/\\d+\\/\\d+/').first().textContent();
      if (readyInfo) {
        const [ready, total] = readyInfo.split('/').map(n => parseInt(n.trim()));
        console.log(`[${playerName}] 준비 상태: ${ready}/${total}`);
        
        if (ready === total && total > 0 && total >= 3) { // 최소 3명 필요
          allReady = true;
          break;
        }
      }
      
      // 게임 시작 버튼이 활성화되었는지 확인
      const startButton = page.locator('button:has-text("게임 시작")');
      if (await startButton.count() > 0) {
        const isDisabled = await startButton.isDisabled();
        if (!isDisabled) {
          allReady = true;
          break;
        }
      }
      
      await page.waitForTimeout(1000); // 1초 대기
    } catch (error) {
      console.error(`[${playerName}] 준비 상태 확인 오류:`, error.message);
      await page.waitForTimeout(1000);
    }
  }
  
  if (!allReady) {
    console.error(`[${playerName}] 모든 플레이어가 준비되지 않았습니다.`);
    return false;
  }
  
  // 모든 플레이어 준비 완료! 5초 대기 후 게임 시작
  console.log(`[${playerName}] 모든 플레이어가 준비되었습니다. 5초 후 게임을 시작합니다...`);
  await page.waitForTimeout(5000); // 5초 대기
  
  // 게임 시작 버튼 클릭
  try {
    console.log(`[${playerName}] 게임 시작 버튼 클릭...`);
    const startButton = page.locator('button:has-text("게임 시작")');
    await startButton.click();
    console.log(`[${playerName}] 게임 시작!`);
    
    // 게임 페이지로 이동할 때까지 대기
    await page.waitForURL(/\/game\/.*\/play/, { timeout: 10000 });
    console.log(`[${playerName}] 게임 페이지 도착!`);
    
    return true;
  } catch (error) {
    console.error(`[${playerName}] 게임 시작 실패:`, error.message);
    return false;
  }
}

async function setupPlayer(browser, player, delay = 0, isHost = false) {
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log(`\n🎮 [${player.name}] 시연 시작...`);
    
    // 랜딩 페이지로 이동
    await page.goto(BASE_URL);
    await waitForPageLoad(page);
    console.log(`[${player.name}] 랜딩 페이지 로드 완료`);
    
    // 멀티플레이 버튼 클릭
    await page.click('button:has-text("멀티플레이")');
    console.log(`[${player.name}] 멀티플레이 버튼 클릭`);
    await waitForPageLoad(page);
    
    // 국가 선택 및 입장
    const success = await selectNation(page, player);
    
    if (success) {
      console.log(`✅ [${player.name}] 성공적으로 로비에 입장했습니다!`);
      
      // 로비에서 준비 상태 표시
      await page.waitForTimeout(2000);
      
      // Ready 버튼이 있으면 클릭
      const readyButton = page.locator('button:has-text("준비")').or(page.locator('button:has-text("Ready")'));
      if (await readyButton.count() > 0) {
        await readyButton.click();
        console.log(`[${player.name}] 준비 완료!`);
        await page.waitForTimeout(1000);
      }
      
      // 호스트인 경우 게임 시작 대기 및 실행, 아닌 경우 대기만
      if (isHost) {
        await waitAndStartGame(page, player.name, true);
      } else {
        // 호스트가 아니면 게임 시작 대기만 (비동기로 백그라운드 실행)
        waitAndStartGame(page, player.name, false).catch(err => {
          console.error(`[${player.name}] 게임 시작 대기 오류:`, err.message);
        });
      }
    }
    
    return { page, context, success };
  } catch (error) {
    console.error(`❌ [${player.name}] 오류 발생:`, error.message);
    await context.close();
    return { page: null, context: null, success: false };
  }
}

async function runDemo() {
  console.log('🚀 멀티플레이 자동 시연을 시작합니다...\n');
  console.log(`📍 서버 주소: ${BASE_URL}`);
  console.log(`👥 플레이어 수: ${PLAYERS.length}명\n`);
  
  // 서버가 실행 중인지 확인
  const http = require('http');
  try {
    const checkServer = () => {
      return new Promise((resolve, reject) => {
        const req = http.get(BASE_URL, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => reject(false));
        req.setTimeout(3000, () => {
          req.destroy();
          reject(false);
        });
      });
    };
    
    await checkServer();
    console.log('✅ 클라이언트 서버가 실행 중입니다.\n');
  } catch (error) {
    console.error('❌ 클라이언트 서버에 연결할 수 없습니다.');
    console.error(`   ${BASE_URL}에서 서버가 실행 중인지 확인해주세요.`);
    console.error('   터미널에서 다음 명령어를 실행하세요:');
    console.error('   cd client && npm run dev\n');
    process.exit(1);
  }
  
  // 브라우저 시작
  const browser = await chromium.launch({
    headless: false, // 브라우저를 보이게 함
    slowMo: 100, // 동작을 천천히 (시연 시 가독성 향상)
  });
  
  const players = [];
  const contexts = [];
  
  try {
    // 각 플레이어를 순차적으로 설정 (약간의 지연을 두고)
    for (let i = 0; i < PLAYERS.length; i++) {
      const delay = i * 2000; // 2초 간격으로 플레이어 입장
      const isHost = i === 0; // 첫 번째 플레이어가 호스트
      const result = await setupPlayer(browser, PLAYERS[i], delay, isHost);
      
      if (result.success) {
        players.push(result);
        contexts.push(result.context);
      }
    }
    
    console.log(`\n✨ 모든 플레이어(${players.length}명)가 로비에 입장했습니다!`);
    console.log('\n📋 시연 안내:');
    console.log('   - 브라우저 창을 확인하여 멀티플레이 상태를 확인하세요.');
    console.log('   - 로비에서 다른 플레이어들을 볼 수 있어야 합니다.');
    console.log('   - 모든 플레이어가 준비되면 게임이 자동으로 시작됩니다.');
    console.log('   - 브라우저 창은 계속 열려있습니다.');
    console.log('   - 시연을 종료하려면 Ctrl+C를 누르거나 브라우저를 닫으세요.\n');
    
    // 브라우저를 계속 열어두고 사용자가 확인할 수 있도록 함
    console.log('⏳ 게임 진행 중... (종료하려면 Ctrl+C를 누르세요)\n');
    
    // 무한 대기 (사용자가 Ctrl+C로 종료)
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 시연 중 오류 발생:', error);
  } finally {
    console.log('\n🛑 시연을 종료합니다...');
    
    // 모든 브라우저 컨텍스트 닫기
    for (const ctx of contexts) {
      if (ctx) {
        await ctx.close().catch(() => {});
      }
    }
    
    await browser.close();
    console.log('✅ 브라우저가 닫혔습니다.\n');
  }
}

// 스크립트 실행
runDemo().catch(console.error);

