import React, { useState } from 'react';
import {
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  Users,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  UserPlus,
  Edit3,
  Plus,
  Smartphone
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const Header: React.FC = () => {
  const {
    patient,
    darkMode,
    setDarkMode,
    setIsEmergencyModalOpen,
    setIsSearchModalOpen,
    setIsCreateUserModalOpen,
    setIsEditProfileModalOpen,
    setIsFitnessSyncModalOpen,
    familyProfiles,
    activeProfileId,
    switchProfile,
    setCurrentTab
  } = useHealth();

  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Lab Follow-up Recommended',
      text: 'Lipid panel scheduled with Dr. Sarah Jenkins on Oct 12.',
      time: '2 hours ago',
      unread: true,
      category: 'appointment'
    },
    {
      id: 'notif-2',
      title: 'Medication Refill Alert',
      text: 'Atorvastatin 10mg has 24 pills remaining. Refill soon.',
      time: 'Yesterday',
      unread: true,
      category: 'medication'
    },
    {
      id: 'notif-3',
      title: 'Daily Hydration Goal Met',
      text: 'You reached 2.1L today! Keep the healthy habit going.',
      time: '3 hours ago',
      unread: false,
      category: 'wellness'
    }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-800 dark:from-white dark:via-cyan-100 dark:to-teal-300 bg-clip-text text-transparent">
                AuraHealth
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/50">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              Clinical Intelligence & Wellness
            </p>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-all shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Search labs, symptoms, medications, vitals...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Pair Phone Button */}
          <button
            onClick={() => setIsFitnessSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 transition-all font-semibold text-xs shadow-xs"
            title="Pair Phone or Fitness Tracker"
          >
            <Smartphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Pair Phone</span>
          </button>

          {/* Emergency Mode Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 transition-all font-semibold text-xs shadow-xs"
            title="Emergency Medical Info"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-bounce" />
            <span className="hidden sm:inline">Emergency Mode</span>
            <span className="sm:hidden">ICE</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsFamilyDropdownOpen(false);
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Health Alerts & Reminders
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-medium">
                    2 New
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Family Profiles Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFamilyDropdownOpen(!isFamilyDropdownOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700/60"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-cyan-500">
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {patient.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {patient.bloodType} • {patient.age}y
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isFamilyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-600" /> Family Profiles
                  </p>
                  <p className="text-[10px] text-slate-400">Switch profile with isolated records</p>
                </div>
                <div className="space-y-1">
                  {familyProfiles.map((fp) => (
                    <button
                      key={fp.id}
                      onClick={() => {
                        switchProfile(fp.id);
                        setIsFamilyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        activeProfileId === fp.id
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs">{fp.name}</p>
                        <p className="text-[10px] text-slate-400">{fp.relationship} • {fp.age} yrs</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        Score {fp.recentHealthScore}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setIsFamilyDropdownOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Edit Profile Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFamilyDropdownOpen(false);
                      setIsCreateUserModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Create New User / Profile</span>
                  </button>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800 px-2 py-1 text-center">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" /> HIPAA/GDPR Privacy Partitioned
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
