/**
 * 채팅 메시지에 욕설/비속어가 포함되어 있는지 확인
 * @param message 원본 메시지
 * @returns 필터링이 필요한 경우 true
 */
export declare const containsProfanity: (message: string) => boolean;
/**
 * 채팅 메시지를 필터링
 * @param message 원본 메시지
 * @returns 필터링된 메시지 (욕설이 포함된 경우 대체 메시지)
 */
export declare const filterChatMessage: (message: string) => string;
/**
 * 메시지 길이 검증 (과도하게 긴 메시지 방지)
 * @param message 메시지
 * @returns 유효한 길이인지 여부
 */
export declare const isValidMessageLength: (message: string) => boolean;
/**
 * 메시지 유효성 검증
 * @param message 메시지
 * @returns { isValid: boolean, filteredMessage: string, error?: string }
 */
export declare const validateChatMessage: (message: string) => {
    isValid: boolean;
    filteredMessage: string;
    error?: string;
};
//# sourceMappingURL=chatFilter.d.ts.map