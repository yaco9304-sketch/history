#!/bin/bash

# 멀티플레이 빠른 시연 스크립트
# 여러 브라우저 창을 자동으로 열어 멀티플레이를 시연합니다.

BASE_URL="http://localhost:5173"

echo "🚀 멀티플레이 시연을 시작합니다..."
echo ""

# 서버와 클라이언트 상태 확인
echo "📡 서버 상태 확인 중..."
if ! lsof -i :3001 | grep -q LISTEN; then
    echo "⚠️  서버(포트 3001)가 실행 중이 아닙니다."
    echo "   다음 명령어로 서버를 시작하세요:"
    echo "   cd server && npm run dev"
    echo ""
fi

if ! lsof -i :5173 | grep -q LISTEN; then
    echo "⚠️  클라이언트(포트 5173)가 실행 중이 아닙니다."
    echo "   다음 명령어로 클라이언트를 시작하세요:"
    echo "   cd client && npm run dev"
    echo ""
fi

echo "🌐 브라우저 창을 열고 있습니다..."
echo ""

# macOS에서 브라우저 열기
if [[ "$OSTYPE" == "darwin"* ]]; then
    # 일반 모드와 시크릿 모드로 여러 창 열기
    open -a "Google Chrome" "$BASE_URL"
    sleep 1
    open -na "Google Chrome" --args --incognito "$BASE_URL"
    sleep 1
    open -a "Safari" "$BASE_URL" 2>/dev/null || echo "Safari를 사용할 수 없습니다"
    
    echo "✅ 브라우저 창이 열렸습니다!"
    echo ""
    echo "📋 시연 가이드:"
    echo "   1. 각 브라우저 창에서 '멀티플레이' 버튼 클릭"
    echo "   2. 서로 다른 국가 선택 (고구려, 백제, 신라)"
    echo "   3. 각각 다른 닉네임 입력"
    echo "   4. 입장 후 로비에서 모든 플레이어 확인"
    echo ""
else
    echo "⚠️  이 스크립트는 macOS용입니다."
    echo "   수동으로 여러 브라우저를 열어주세요:"
    echo "   - $BASE_URL"
    echo ""
fi

















