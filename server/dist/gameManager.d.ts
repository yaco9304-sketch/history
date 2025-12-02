import { GameRoom, GameSettings, Player, Nation, NationStats, HistoricalEvent, ChatMessage } from './types.js';
export declare class GameManager {
    private rooms;
    private codeToRoomId;
    private playerToRoom;
    private generateRoomCode;
    createRoom(hostId: string, hostName: string, className: string, settings?: Partial<GameSettings>, code?: string): GameRoom;
    getRoomByCode(code: string): GameRoom | null;
    getRoom(roomId: string): GameRoom | null;
    getPlayerRoom(playerId: string): GameRoom | null;
    joinRoom(roomId: string, playerId: string, socketId: string, playerName: string): Player | null;
    leaveRoom(playerId: string): {
        room: GameRoom;
        player: Player;
    } | null;
    selectTeam(playerId: string, nation: Nation): boolean;
    toggleReady(playerId: string): boolean;
    canStartGame(roomId: string): {
        canStart: boolean;
        reason?: string;
    };
    startGame(roomId: string): boolean;
    advanceTurn(roomId: string): {
        room: GameRoom;
        isGameOver: boolean;
        winner?: Nation;
    } | null;
    triggerEvent(roomId: string, event: HistoricalEvent): boolean;
    submitVote(playerId: string, choiceId: string): {
        room: GameRoom;
        nation: Nation;
    } | null;
    calculateVoteResult(roomId: string, nation: Nation): {
        choiceId: string;
        effects: Partial<NationStats>;
    } | null;
    checkGameOver(room: GameRoom): {
        isOver: boolean;
        winner?: Nation;
        reason?: string;
    };
    private getWinnerByScore;
    createChatMessage(roomId: string, playerId: string, message: string, type: 'team' | 'public' | 'diplomacy' | 'system', target?: Nation): ChatMessage | null;
    proposeAlliance(roomId: string, proposerNation: Nation, targetNation: Nation): boolean;
    acceptAlliance(roomId: string, proposerNation: Nation, acceptorNation: Nation): boolean;
    breakAlliance(roomId: string, nation1: Nation, nation2: Nation): boolean;
    declareWar(roomId: string, declarerNation: Nation, targetNation: Nation): boolean;
    endWar(roomId: string, nation1: Nation, nation2: Nation): boolean;
    initiateBattle(roomId: string, attackerNation: Nation, defenderNation: Nation): {
        room: GameRoom;
        battleId: string;
    } | null;
    calculateBattleResult(roomId: string, attackerNation: Nation, defenderNation: Nation): {
        winner: Nation;
        attackerLosses: Partial<NationStats>;
        defenderLosses: Partial<NationStats>;
        allySupport: Record<Nation, number>;
    } | null;
    applyBattleResult(roomId: string, attackerNation: Nation, defenderNation: Nation, result: {
        winner: Nation;
        attackerLosses: Partial<NationStats>;
        defenderLosses: Partial<NationStats>;
    }): boolean;
    getAllRooms(): GameRoom[];
}
export declare const gameManager: GameManager;
//# sourceMappingURL=gameManager.d.ts.map