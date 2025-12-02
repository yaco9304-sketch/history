// ============================================
// 채팅 메시지 필터링 (욕설/비속어 차단)
// ============================================
// 욕설/비속어 키워드 목록
// 교육용 환경이므로 일반적인 비속어와 부적절한 표현 포함
const PROFANITY_WORDS = [
    // 욕설 (일부만 예시, 실제로는 더 포괄적으로 필요)
    '바보', '멍청이', '씨발', '개새끼', '병신', '좆', '지랄', '미친', '미친놈',
    '미친년', '닥쳐', '꺼져', '시발', '좆나', '개같은', '새끼', '죽어', '죽여',
    '쓰레기', '인간쓰레기', '등신', '호로새끼', '개돼지', '돼지새끼', '존나',
    // 비속어
    '젠장', '젠장할', '빌어먹을', '제기할', '엿', '빌어먹을', '개', '개같은',
    // 부적절한 표현
    'Fuck', 'fuck', 'FUCK', 'Shit', 'shit', 'SHIT', 'Damn', 'damn', 'DAMN',
    'Bitch', 'bitch', 'BITCH', 'Asshole', 'asshole', 'ASShole',
    // 기타 부적절한 표현 (부분 일치 방지용 변형 포함)
    /[씨시]발/, /[바뱌]보/, /[병벼]신/, /[미밍]친/, /[새쎄]끼/, /[개게]새끼/,
];
// 특수문자로 우회 시도 방지를 위한 정규화 함수
const normalizeText = (text) => {
    return text
        .toLowerCase()
        // 공백 제거
        .replace(/\s+/g, '')
        // 특수문자를 일반 문자로 변환 (숫자나 기호로 우회 방지)
        .replace(/[0-9]/g, '')
        .replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g, '')
        // 자모 분리 방지 (한글 초성/중성/종성 분리)
        .normalize('NFC');
};
// 필터링된 메시지 생성
const FILTERED_MESSAGE = '[부적절한 표현이 포함된 메시지입니다]';
/**
 * 채팅 메시지에 욕설/비속어가 포함되어 있는지 확인
 * @param message 원본 메시지
 * @returns 필터링이 필요한 경우 true
 */
export const containsProfanity = (message) => {
    const normalized = normalizeText(message);
    const original = message.toLowerCase();
    // 단어 단위 검사
    for (const word of PROFANITY_WORDS) {
        if (typeof word === 'string') {
            // 정확한 단어 일치
            if (normalized.includes(word.toLowerCase()) || original.includes(word.toLowerCase())) {
                return true;
            }
        }
        else if (word instanceof RegExp) {
            // 정규식 패턴 일치
            if (word.test(message) || word.test(normalized) || word.test(original)) {
                return true;
            }
        }
    }
    return false;
};
/**
 * 채팅 메시지를 필터링
 * @param message 원본 메시지
 * @returns 필터링된 메시지 (욕설이 포함된 경우 대체 메시지)
 */
export const filterChatMessage = (message) => {
    if (containsProfanity(message)) {
        return FILTERED_MESSAGE;
    }
    return message;
};
/**
 * 메시지 길이 검증 (과도하게 긴 메시지 방지)
 * @param message 메시지
 * @returns 유효한 길이인지 여부
 */
export const isValidMessageLength = (message) => {
    // 최대 200자
    return message.trim().length > 0 && message.trim().length <= 200;
};
/**
 * 메시지 유효성 검증
 * @param message 메시지
 * @returns { isValid: boolean, filteredMessage: string, error?: string }
 */
export const validateChatMessage = (message) => {
    // 빈 메시지 체크
    if (!message || !message.trim()) {
        return {
            isValid: false,
            filteredMessage: '',
            error: '메시지를 입력해주세요.',
        };
    }
    // 길이 체크
    if (!isValidMessageLength(message)) {
        return {
            isValid: false,
            filteredMessage: '',
            error: '메시지는 1자 이상 200자 이하여야 합니다.',
        };
    }
    // 욕설 필터링
    if (containsProfanity(message)) {
        return {
            isValid: true,
            filteredMessage: FILTERED_MESSAGE,
        };
    }
    return {
        isValid: true,
        filteredMessage: message.trim(),
    };
};
//# sourceMappingURL=chatFilter.js.map