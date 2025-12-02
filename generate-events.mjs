// story.md 파일을 읽어서 events.ts 파일을 자동 생성하는 스크립트
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storyPath = path.join(__dirname, 'story.md');
const outputPath = path.join(__dirname, 'server/src/events.ts');

console.log('📖 Reading story.md...');
const content = fs.readFileSync(storyPath, 'utf-8');

// 이벤트 데이터 파싱
const events = [];

// 각 국가별로 이벤트 파싱
const nations = {
  goguryeo: '고구려',
  baekje: '백제',
  silla: '신라'
};

Object.entries(nations).forEach(([nationKey, nationName]) => {
  console.log(`\n🏛️  Parsing ${nationName} events...`);

  // 해당 국가의 상세 이벤트 섹션 찾기
  const sectionRegex = new RegExp(`## 📖 ${nationName} 상세 이벤트([\\s\\S]*?)(?=## 📖|## 📊|$)`, 'g');
  const sectionMatch = content.match(sectionRegex);

  if (!sectionMatch) {
    console.log(`  ⚠️  No events found for ${nationName}`);
    return;
  }

  const section = sectionMatch[0];

  // 개별 이벤트 파싱 (### X. 제목 (연도) 패턴)
  const eventRegex = /### (\d+)\. (.+?) \((\d+)년\)([\s\S]*?)(?=###|---)/g;
  let match;

  while ((match = eventRegex.exec(section)) !== null) {
    const [_, number, title, year, eventContent] = match;

    // 분류 추출
    const categoryMatch = eventContent.match(/\*\*분류\*\*: (.+)/);
    const category = categoryMatch ? categoryMatch[1].trim() : 'culture';

    // 난이도 추출
    const difficultyMatch = eventContent.match(/\*\*난이도\*\*: (.+)/);
    const difficulty = difficultyMatch ? difficultyMatch[1].trim() : '보통';

    // 설명 추출
    const descMatch = eventContent.match(/\*\*설명\*\*: (.+?)(?=\n\*\*)/s);
    const description = descMatch ? descMatch[1].trim() : '';

    // 역사적 배경 추출
    const contextMatch = eventContent.match(/\*\*역사적 배경\*\*: (.+?)(?=\n\*\*)/s);
    const historicalContext = contextMatch ? contextMatch[1].trim() : '';

    // 선택지 추출
    const choicesSection = eventContent.match(/\*\*선택지\*\*:([\s\S]*?)(?=---|$)/);
    const choices = [];

    if (choicesSection) {
      const choiceRegex = /- ([A-C])\) (.+?) \((.+?)\)( ✓ 역사적 선택)?/g;
      let choiceMatch;

      while ((choiceMatch = choiceRegex.exec(choicesSection[1])) !== null) {
        const [__, id, text, effects, isHistorical] = choiceMatch;

        // effects 파싱 (예: "군사력 +35, 경제력 +20, 재화 -300")
        const effectsObj = {};
        const effectParts = effects.split(',').map(e => e.trim());

        effectParts.forEach(part => {
          if (part.includes('군사력')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.military = value;
          } else if (part.includes('경제력')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.economy = value;
          } else if (part.includes('외교력')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.diplomacy = value;
          } else if (part.includes('문화력')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.culture = value;
          } else if (part.includes('재화')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.gold = value;
          } else if (part.includes('민심')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.morale = value;
          } else if (part.includes('인구')) {
            const value = parseInt(part.match(/([-+]\d+)/)?.[1] || '0');
            effectsObj.population = value;
          }
        });

        choices.push({
          id,
          text: text.trim(),
          effects: effectsObj,
          isHistorical: !!isHistorical,
          tooltip: isHistorical ? `${title} 역사적 선택` : '역사와 다른 선택입니다',
          risk: isHistorical ? 'safe' : 'normal'
        });
      }
    }

    // 카테고리 매핑
    const categoryMap = {
      '군사': 'military',
      '문화': 'culture',
      '외교': 'diplomacy',
      '경제': 'economy',
      '정치': 'politics'
    };

    // 난이도 매핑
    const difficultyMap = {
      '쉬움': 'easy',
      '보통': 'normal',
      '어려움': 'hard',
      '매우 어려움': 'hard'
    };

    const event = {
      id: `${nationKey}_${title.replace(/\s+/g, '_').toLowerCase()}_${year}`,
      year: parseInt(year),
      targetNation: nationKey,
      title,
      description,
      historicalContext,
      choices,
      difficulty: difficultyMap[difficulty] || 'normal',
      category: categoryMap[category] || 'culture'
    };

    events.push(event);
    console.log(`  ✅ ${number}. ${title} (${year})`);
  }
});

console.log(`\n📝 Generating events.ts with ${events.length} events...`);

// TypeScript 파일 생성
const tsContent = `import { HistoricalEvent } from './types';

export const SAMPLE_EVENTS: HistoricalEvent[] = ${JSON.stringify(events, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`✅ Generated ${outputPath}`);
console.log(`📊 Total events: ${events.length}`);
