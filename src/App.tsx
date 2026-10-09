import { useState } from 'react';
import { Header } from './components/Header';
import { InputScreen } from './components/InputScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { AppStatesPreview } from './components/AppStatesPreview';
import { AuthScreen } from './components/AuthScreen';
import { AccountProfileScreen } from './components/AccountProfileScreen';
import { PrivacyModal } from './components/PrivacyModal';
import { ProfileModal } from './components/ProfileModal';
import { analyzeConversation } from './utils/analyzer';
import { parseChatTranscript } from './utils/parser';
import {
  SAMPLE_COLLEGE_SPRINT,
  SampleConversation,
} from './utils/samples';
import { AnalysisResult, UserAccount } from './types';
import {
  getSessionUser,
  setSessionUser,
  getStoredUsers,
} from './utils/userDatabase';
import {
  MessageSquare,
  Zap,
  Layers,
  Shield,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'input' | 'dashboard' | 'states' | 'auth'>('input');
  const [transcript, setTranscript] = useState<string>(SAMPLE_COLLEGE_SPRINT.transcript);
  
  // Current Authenticated User state loaded from local database session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const session = getSessionUser();
    if (session) return session;
    const users = getStoredUsers();
    return users[0] || null;
  });

  const [userName, setUserName] = useState<string>(() => currentUser?.name || 'Alex Rivera');
  const [aliases, setAliases] = useState<string[]>(() => currentUser?.aliases || ['Alex', 'Alex Rivera', '@Alex', '@arivera']);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() => {
    // Initial analysis on sample sprint
    return analyzeConversation(SAMPLE_COLLEGE_SPRINT.transcript, userName, aliases);
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Perform Analysis
  const handleAnalyze = () => {
    setErrorMessage(null);
    const trimmed = transcript.trim();
    if (!trimmed) {
      setErrorMessage('Please paste or type a conversation transcript before analyzing.');
      return;
    }

    const parsedMessages = parseChatTranscript(trimmed);
    if (parsedMessages.length < 2) {
      setErrorMessage(
        'Insufficient conversation dialogue. MissedIt AI requires at least 2 messages with recognizable speakers or timestamps to extract insights.'
      );
      return;
    }

    setIsAnalyzing(true);
    // Simulate lightweight UI micro-feedback (350ms) to let users feel the scan
    setTimeout(() => {
      const res = analyzeConversation(trimmed, userName, aliases);
      setAnalysisResult(res);
      setIsAnalyzing(false);
      setCurrentTab('dashboard');
    }, 400);
  };

  // Load a sample
  const handleSelectSample = (sample: SampleConversation) => {
    setTranscript(sample.transcript);
    setUserName(sample.defaultUserName);
    setAliases(sample.defaultAliases);
    setErrorMessage(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeConversation(sample.transcript, sample.defaultUserName, sample.defaultAliases);
      setAnalysisResult(res);
      setIsAnalyzing(false);
      setCurrentTab('dashboard');
    }, 300);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    if (!analysisResult) return;
    const updateTasks = (tasks: typeof analysisResult.allTasks) =>
      tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              isCompleted: !t.isCompleted,
              status: (!t.isCompleted ? 'completed' : 'pending') as 'completed' | 'pending',
            }
          : t
      );

    setAnalysisResult({
      ...analysisResult,
      allTasks: updateTasks(analysisResult.allTasks),
      urgentItems: updateTasks(analysisResult.urgentItems),
      userTasks: updateTasks(analysisResult.userTasks),
      teamTasks: updateTasks(analysisResult.teamTasks),
    });
  };

  // Clear in-memory conversation
  const handleClearChat = () => {
    setTranscript('');
    setAnalysisResult(null);
    setErrorMessage(null);
    setCurrentTab('input');
  };

  // Handle Authentication Success
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setUserName(user.name);
    setAliases(user.aliases);
    setShowAuthModal(false);
    
    // Re-run analysis with authenticated identity if transcript is loaded
    if (transcript.trim()) {
      const res = analyzeConversation(transcript, user.name, user.aliases);
      setAnalysisResult(res);
    }
    // Navigate user to their account page so they immediately see all their account information!
    setCurrentTab('auth');
  };

  // Handle Logout
  const handleLogout = () => {
    setSessionUser(null);
    setCurrentUser(null);
    setUserName('Guest User');
    setAliases([]);
    setShowProfileModal(false);
    if (transcript.trim()) {
      const res = analyzeConversation(transcript, 'Guest User', []);
      setAnalysisResult(res);
    }
    // Direct user to Sign-Up / Login screen
    setCurrentTab('auth');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body antialiased selection:bg-primary-container selection:text-on-primary-container pb-20">
      {/* Fixed Header */}
      <Header
        currentUser={currentUser}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenProfile={() => setCurrentTab('auth')}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16">
        {/* Account / Auth Tab View */}
        {currentTab === 'auth' && (
          currentUser ? (
            /* User is logged in: Show all user information & account profile */
            <AccountProfileScreen
              user={currentUser}
              onLogout={handleLogout}
              onSwitchAccount={() => setShowAuthModal(true)}
              onUpdateAliases={(newAliases) => {
                setAliases(newAliases);
                if (currentUser) {
                  const updated = { ...currentUser, aliases: newAliases };
                  setCurrentUser(updated);
                  setSessionUser(updated as any);
                }
              }}
            />
          ) : (
            /* User is logged out: Show Sign-Up / Login screen */
            <AuthScreen
              onAuthSuccess={handleAuthSuccess}
              onCancel={() => setCurrentTab('input')}
              initialMode="login"
            />
          )
        )}

        {/* Input / Workspace View */}
        {currentTab === 'input' && (
          <InputScreen
            transcript={transcript}
            onChangeTranscript={setTranscript}
            userName={userName}
            onChangeUserName={setUserName}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onSelectSample={handleSelectSample}
            errorMessage={errorMessage}
          />
        )}

        {/* Dashboard View */}
        {currentTab === 'dashboard' && analysisResult && (
          <>
            {analysisResult.isAllClear ? (
              // Casual Chat All Clear View
              <div className="flex flex-col w-full max-w-xl mx-auto px-4 py-8 animate-fade-in text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center mb-4 relative shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-25" />
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(78,222,163,0.5)]">
                    <CheckCircle2 className="w-8 h-8 text-on-primary" />
                  </div>
                </div>

                <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">
                  All Clear! Zero Blockers
                </h2>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
                  {analysisResult.summary.conciseOverview}
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low border border-surface-container-high rounded-xl mb-6">
                  <div className="flex flex-col items-center p-1">
                    <span className="font-headline font-bold text-lg text-primary">0</span>
                    <span className="text-[11px] text-on-surface-variant">Urgent Items</span>
                  </div>
                  <div className="flex flex-col items-center p-1">
                    <span className="font-headline font-bold text-lg text-on-surface">
                      {analysisResult.summary.totalMessages}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Messages Read</span>
                  </div>
                  <div className="flex flex-col items-center p-1">
                    <span className="font-headline font-bold text-lg text-secondary">
                      {analysisResult.summary.totalSpeakers}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Participants</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentTab('input')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                  >
                    Edit / Switch Chat
                  </button>
                  <button
                    onClick={() => handleSelectSample(SAMPLE_COLLEGE_SPRINT)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-fixed text-xs font-semibold text-on-primary transition-colors cursor-pointer"
                  >
                    Try College Sprint Chat
                  </button>
                </div>
              </div>
            ) : (
              <DashboardScreen
                result={analysisResult}
                userName={userName}
                onSwitchChat={() => setCurrentTab('input')}
                onClearChat={handleClearChat}
                onToggleTask={handleToggleTask}
              />
            )}
          </>
        )}

        {currentTab === 'dashboard' && !analysisResult && (
          <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
            <p className="text-sm text-on-surface-variant">
              No conversation analyzed yet. Paste transcript in the workspace to get started.
            </p>
            <button
              onClick={() => setCurrentTab('input')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-fixed transition-colors cursor-pointer"
            >
              Go to Workspace
            </button>
          </div>
        )}

        {/* Edge States Preview */}
        {currentTab === 'states' && (
          <AppStatesPreview
            onLoadSample={handleSelectSample}
            onGoToInput={() => setCurrentTab('input')}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
        <div className="h-16 flex items-center justify-around max-w-lg mx-auto px-2 sm:px-4">
          {/* Tab 1: Stream / Workspace */}
          <button
            type="button"
            onClick={() => setCurrentTab('input')}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-colors cursor-pointer ${
              currentTab === 'input'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Workspace</span>
          </button>

          {/* Tab 2: Dashboard / Urgent */}
          <button
            type="button"
            onClick={() => {
              if (!analysisResult && transcript.trim()) {
                handleAnalyze();
              } else {
                setCurrentTab('dashboard');
              }
            }}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-colors cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Briefing</span>
          </button>

          {/* Tab 3: States Explorer */}
          <button
            type="button"
            onClick={() => setCurrentTab('states')}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-colors cursor-pointer ${
              currentTab === 'states'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Edge States</span>
          </button>

          {/* Tab 4: Account / Profile */}
          <button
            type="button"
            onClick={() => setCurrentTab('auth')}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 transition-colors cursor-pointer ${
              currentTab === 'auth'
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">
              {currentUser ? 'Account' : 'Sign In'}
            </span>
          </button>

          {/* Tab 5: Privacy Vault */}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="flex flex-col items-center justify-center min-w-[50px] py-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Privacy</span>
          </button>
        </div>
      </nav>

      {/* Modal Popup Auth View if triggered from header / switch account */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-auto">
            <AuthScreen
              onAuthSuccess={handleAuthSuccess}
              onCancel={() => setShowAuthModal(false)}
              initialMode="signup"
            />
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        networkRequestsCount={0}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        userName={userName}
        onUpdateUserName={setUserName}
        aliases={aliases}
        onUpdateAliases={setAliases}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setShowProfileModal(false);
          setShowAuthModal(true);
        }}
      />
    </div>
  );
}

export default App;
