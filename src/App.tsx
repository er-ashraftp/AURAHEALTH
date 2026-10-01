import React from 'react';
import {
  Home,
  Activity,
  Bot,
  Sparkles,
  User,
  ShieldAlert,
  HeartPulse
} from 'lucide-react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Header } from './components/common/Header';
import { EmergencyModal } from './components/common/EmergencyModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { CreateUserModal } from './components/common/CreateUserModal';
import { EditProfileModal } from './components/common/EditProfileModal';
import { FitnessDeviceSyncModal } from './components/common/FitnessDeviceSyncModal';
import { FloatingAIAssistant } from './components/common/FloatingAIAssistant';
import { HomeDashboard } from './components/views/HomeDashboard';
import { HealthView } from './components/views/HealthView';
import { AIDoctorView } from './components/views/AIDoctorView';
import { InsightsView } from './components/views/InsightsView';
import { ProfileView } from './components/views/ProfileView';

const MainLayout: React.FC = () => {
  const { currentTab, setCurrentTab } = useHealth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {/* Desktop Primary Navigation Bar */}
        <div className="hidden md:flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'home', label: 'Home Snapshot', icon: Home },
              { id: 'health', label: 'Health Hub & Labs', icon: Activity },
              { id: 'ai-doctor', label: 'AI Doctor & Assistant', icon: Bot, isHighlighted: true },
              { id: 'insights', label: 'Insights & Doctor Prep', icon: Sparkles },
              { id: 'profile', label: 'Profile & Documents', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.isHighlighted && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pr-2 text-xs text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Companion Online
            </span>
          </div>
        </div>

        {/* View Routing */}
        {currentTab === 'home' && <HomeDashboard />}
        {currentTab === 'health' && <HealthView />}
        {currentTab === 'ai-doctor' && <AIDoctorView />}
        {currentTab === 'insights' && <InsightsView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'health', label: 'Health', icon: Activity },
          { id: 'ai-doctor', label: 'AI Doctor', icon: Bot, highlight: true },
          { id: 'insights', label: 'Insights', icon: Sparkles },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-cyan-600 dark:text-cyan-400' : ''}`} />
                {tab.highlight && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Interactive Assistant */}
      <FloatingAIAssistant />

      {/* Modals */}
      <EmergencyModal />
      <GlobalSearchModal />
      <OnboardingModal />
      <CreateUserModal />
      <EditProfileModal />
      <FitnessDeviceSyncModal />

      {/* Global Safety Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-400 px-4">
        <p className="max-w-2xl mx-auto">
          <strong>AuraHealth AI Companion</strong> • Built with Google Gemini Multimodal Intelligence.
          This software is an educational support tool. Never disregard professional clinical advice or delay seeking it because of information presented here.
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainLayout />
    </HealthProvider>
  );
}
