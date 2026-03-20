import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LandingPage,
  CreateGamePage,
  NationSelectPage,
  LobbyPage,
  GamePage,
  ResultPage,
  SinglePlayerPage,
  SinglePlayerModeSelectPage,
  SinglePlayerAISetupPage,
  TutorialPage,
  TeacherDashboardPage,
  MultiplayerCreatePage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Home */}
        <Route path="/" element={<LandingPage />} />

        {/* Single Player */}
        <Route path="/single" element={<SinglePlayerModeSelectPage />} />
        <Route path="/single/personal" element={<SinglePlayerPage />} />
        <Route path="/single/ai/setup" element={<SinglePlayerAISetupPage />} />
        <Route path="/single/ai/select" element={<NationSelectPage mode="singleplayer" backPath="/single" />} />

        {/* Tutorial */}
        <Route path="/tutorial" element={<TutorialPage />} />

        {/* Create Game (Teacher) - 리다이렉트 */}
        <Route path="/create" element={<CreateGamePage />} />

        {/* Teacher Dashboard */}
        <Route path="/teacher/:roomCode/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />

        {/* Multiplayer */}
        <Route path="/multiplayer/create" element={<MultiplayerCreatePage />} />

        {/* Join Game - Nation Selection */}
        <Route path="/select" element={<NationSelectPage mode="multiplayer" backPath="/" />} />

        {/* Game Lobby - Waiting Room */}
        <Route path="/lobby/:roomCode" element={<LobbyPage />} />
        <Route path="/game/:roomCode/lobby" element={<LobbyPage />} />

        {/* Main Game */}
        <Route path="/game/:roomCode/play" element={<GamePage />} />

        {/* Game Result */}
        <Route path="/game/:roomCode/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
