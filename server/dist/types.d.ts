export type Nation = 'goguryeo' | 'baekje' | 'silla';
export type VictoryType = 'military' | 'cultural' | 'diplomatic' | 'technological' | 'score';
export interface VictoryCondition {
    type: VictoryType;
    name: string;
    description: string;
    icon: string;
    requirement: {
        military?: {
            conqueredNations: number;
        };
        cultural?: {
            culturePoints: number;
        };
        diplomatic?: {
            alliances: number;
            peaceTurns: number;
        };
        technological?: {
            completedTechs: number;
        };
        score?: {
            minTurns: number;
        };
    };
}
export interface VictoryProgress {
    military: {
        conqueredNations: string[];
        progress: number;
    };
    cultural: {
        culturePoints: number;
        progress: number;
    };
    diplomatic: {
        alliances: number;
        peaceTurns: number;
        progress: number;
    };
    technological: {
        completedTechs: string[];
        progress: number;
    };
    score: {
        totalScore: number;
        progress: number;
    };
}
export declare const VICTORY_CONDITIONS: VictoryCondition[];
export interface NationStats {
    military: number;
    economy: number;
    diplomacy: number;
    culture: number;
    gold: number;
    population: number;
    morale: number;
    culturePoints: number;
    techProgress: number;
    peaceTurns: number;
    [key: string]: number;
}
export interface Player {
    id: string;
    socketId: string;
    name: string;
    team: Nation | null;
    role?: 'king' | 'general' | 'minister';
    isReady: boolean;
    isOnline: boolean;
    joinedAt: number;
    isAI?: boolean;
    aiDifficulty?: 'easy' | 'normal' | 'hard';
}
export interface EventHistory {
    turn: number;
    year: number;
    eventId: string;
    eventTitle: string;
    choiceId: string;
    choiceText: string;
    isHistorical: boolean;
    timestamp: number;
}
export interface Team {
    nation: Nation;
    players: string[];
    stats: NationStats;
    allies: Nation[];
    enemies: Nation[];
    eventHistory: EventHistory[];
    conqueredBy?: Nation;
    isEliminated: boolean;
    victoryProgress: VictoryProgress;
}
export interface Choice {
    id: string;
    text: string;
    effects: Partial<NationStats>;
    isHistorical: boolean;
    tooltip: string;
    risk: 'safe' | 'normal' | 'risky';
}
export interface HistoricalEvent {
    id: string;
    year: number;
    targetNation: Nation | 'all';
    title: string;
    description: string;
    historicalContext: string;
    choices: Choice[];
    difficulty: 'easy' | 'normal' | 'hard';
    category: 'military' | 'economy' | 'diplomacy' | 'culture' | 'politics';
}
export interface Vote {
    eventId: string;
    votes: Record<string, string>;
    deadline: number;
    result?: string;
}
export type GameStatus = 'waiting' | 'countdown' | 'playing' | 'discussion' | 'voting' | 'finished';
export interface GameSettings {
    maxTurns: number;
    turnDuration: number;
    discussionDuration: number;
    voteDuration: number;
    maxPlayersPerTeam: number;
    difficulty: 'easy' | 'normal' | 'hard';
}
export interface GameRoom {
    id: string;
    code: string;
    hostId: string;
    hostName: string;
    className: string;
    status: GameStatus;
    currentTurn: number;
    currentYear: number;
    teams: Record<Nation, Team>;
    players: Record<string, Player>;
    settings: GameSettings;
    currentEvent?: HistoricalEvent;
    currentVotes: Record<Nation, Vote>;
    turnDeadline?: number;
    createdAt: number;
    startedAt?: number;
    chatMessages: ChatMessage[];
    isSinglePlayerAI?: boolean;
    victoryConditions: VictoryCondition[];
    winner?: {
        nation: Nation;
        victoryType: VictoryType;
        turn: number;
    };
}
export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    team: Nation;
    message: string;
    type: 'team' | 'public' | 'diplomacy' | 'system';
    target?: Nation;
    timestamp: number;
}
export interface ServerToClientEvents {
    roomCreated: (room: GameRoom) => void;
    roomJoined: (room: GameRoom, player: Player) => void;
    roomUpdated: (room: GameRoom) => void;
    playerJoined: (player: Player) => void;
    playerLeft: (playerId: string) => void;
    playerUpdated: (player: Player) => void;
    gameStarting: (countdown: number) => void;
    gameStarted: (room: GameRoom) => void;
    turnStarted: (turn: number, year: number, deadline: number) => void;
    eventTriggered: (event: HistoricalEvent, deadline: number) => void;
    voteReceived: (nation: Nation, playerId: string, choiceId: string) => void;
    voteResult: (nation: Nation, choiceId: string, effects: Partial<NationStats>) => void;
    turnEnded: (room: GameRoom) => void;
    gameEnded: (room: GameRoom, winner: Nation | null, reason: string) => void;
    victoryProgress: (nation: Nation, progress: VictoryProgress) => void;
    victoryAchieved: (nation: Nation, victoryType: VictoryType, victoryName: string) => void;
    nationEliminated: (nation: Nation, conqueror: Nation) => void;
    chatMessage: (message: ChatMessage) => void;
    allianceProposed: (fromNation: Nation, toNation: Nation) => void;
    allianceAccepted: (nation1: Nation, nation2: Nation) => void;
    allianceBroken: (nation1: Nation, nation2: Nation) => void;
    warDeclared: (attackerNation: Nation, defenderNation: Nation) => void;
    warEnded: (nation1: Nation, nation2: Nation) => void;
    battleProposed: (attackerNation: Nation, defenderNation: Nation, battleId: string) => void;
    battleResult: (result: {
        winner: Nation;
        attackerNation: Nation;
        defenderNation: Nation;
        attackerLosses: Partial<NationStats>;
        defenderLosses: Partial<NationStats>;
        allySupport: Record<Nation, number>;
    }) => void;
    error: (message: string) => void;
}
export interface ClientToServerEvents {
    createRoom: (data: {
        hostName: string;
        className: string;
        settings?: Partial<GameSettings>;
    }) => void;
    joinRoom: (data: {
        code: string;
        playerName: string;
        playerId?: string;
    }) => void;
    leaveRoom: () => void;
    selectTeam: (nation: Nation) => void;
    toggleReady: () => void;
    kickPlayer: (playerId: string) => void;
    startGame: () => void;
    submitVote: (choiceId: string) => void;
    sendChat: (data: {
        message: string;
        type: 'team' | 'public' | 'diplomacy';
        target?: Nation;
    }) => void;
    proposeAlliance: (targetNation: Nation) => void;
    acceptAlliance: (proposerNation: Nation) => void;
    breakAlliance: (targetNation: Nation) => void;
    declareWar: (targetNation: Nation) => void;
    endWar: (targetNation: Nation) => void;
    initiateBattle: (defenderNation: Nation) => void;
    acceptBattle: (battleId: string) => void;
    rejectBattle: (battleId: string) => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    roomId?: string;
    playerId?: string;
}
//# sourceMappingURL=types.d.ts.map