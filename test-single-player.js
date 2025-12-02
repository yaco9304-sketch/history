const { chromium } = require('playwright');

async function testSinglePlayerTeamMode() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();

  try {
    console.log('1. Opening landing page...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    console.log('2. Taking screenshot of landing page...');
    await page.screenshot({ path: 'screenshots/01-landing.png', fullPage: true });

    console.log('3. Clicking single player button...');
    await page.click('text=싱글 플레이');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/02-mode-select.png', fullPage: true });

    console.log('4. Clicking team mode start button...');
    const teamModeButton = await page.locator('text=팀 모드 시작').first();
    if (await teamModeButton.isVisible()) {
      console.log('   ✓ Team mode start button found');
      await teamModeButton.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/03-team-setup.png', fullPage: true });
    } else {
      console.log('   ✗ Team mode start button not found');
      const html = await page.content();
      console.log('Page content:', html.substring(0, 500));
    }

    console.log('5. Waiting for nation selection page...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/04-nation-select.png', fullPage: true });

    console.log('6. Selecting a nation (백제)...');
    const baekjeButton = await page.locator('text=백제').first();
    if (await baekjeButton.isVisible()) {
      await baekjeButton.click();
      await page.waitForTimeout(2000);
    }

    console.log('6.5. Checking AI player count slider...');
    const aiSlider = await page.locator('input[type="range"]').first();
    if (await aiSlider.isVisible()) {
      console.log('   ✓ AI player count slider found');
      const currentValue = await aiSlider.getAttribute('value');
      console.log(`   Current AI count: ${currentValue}`);

      // 슬라이더를 4명으로 변경해보기
      await aiSlider.fill('4');
      await page.waitForTimeout(500);
      const newValue = await aiSlider.getAttribute('value');
      console.log(`   Changed AI count to: ${newValue}`);
      await page.screenshot({ path: 'screenshots/04b-ai-slider.png', fullPage: true });
    } else {
      console.log('   ✗ AI player count slider not found');
    }

    console.log('7. Entering player name...');
    await page.fill('input[type="text"]', '테스트플레이어');
    await page.waitForTimeout(1000);

    console.log('8. Clicking join button...');
    await page.click('text=팀으로 입장');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'screenshots/05-lobby.png', fullPage: true });

    console.log('9. Checking lobby page for AI players...');
    const pageContent = await page.textContent('body');

    if (pageContent.includes('(AI)')) {
      console.log('   ✓ AI players found in lobby!');
    } else {
      console.log('   ✗ AI players NOT found in lobby');
    }

    console.log('10. Clicking ready button...');
    // 버튼 요소만 선택 (텍스트 표시 제외)
    const readyButton = await page.locator('button:has-text("준비 완료")').last();
    if (await readyButton.isVisible()) {
      console.log('   ✓ Ready button found, clicking...');
      await readyButton.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/06-after-ready.png', fullPage: true });

      // 준비 상태 확인
      const afterReadyContent = await page.textContent('body');
      if (afterReadyContent.includes('준비 취소')) {
        console.log('   ✓ Player is now ready (button changed to 준비 취소)');
      } else {
        console.log('   ✗ Player ready state not changed');
      }
    } else {
      console.log('   ✗ Ready button not found');
    }

    console.log('11. Checking if game started...');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'screenshots/07-game-started.png', fullPage: true });

    const gameContent = await page.textContent('body');
    if (gameContent.includes('라운드') || gameContent.includes('턴') || gameContent.includes('Round')) {
      console.log('   ✓ Game successfully started!');
    } else {
      console.log('   ✗ Game did not start');
      console.log('   Current page content preview:', gameContent.substring(0, 300));
    }

    console.log('12. Clicking on first choice (Option A)...');
    await page.waitForTimeout(2000);
    const choiceA = await page.locator('text=불교를 공인하고 절을 짓는다').first();
    if (await choiceA.isVisible()) {
      console.log('   ✓ Found choice A, clicking...');
      await choiceA.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/08-after-vote.png', fullPage: true });
    }

    console.log('13. Waiting to see if turn advances...');
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'screenshots/09-next-turn.png', fullPage: true });

    const finalContent = await page.textContent('body');
    if (finalContent.includes('373년') || finalContent.includes('374년')) {
      console.log('   ✓ Turn advanced! Year changed');
    } else {
      console.log('   ? Turn may not have advanced or still at 372년');
    }

  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ path: 'screenshots/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

testSinglePlayerTeamMode();
