import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Sparkles, Loader2, Filter, Rocket, BookOpen, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Mail, Shield, FileText, Lock, Unlock, Briefcase, TrendingUp, Award, Eye, EyeOff, Send, UserPlus, Settings, Star, Zap, Edit, Trash2, Plus, X, Calendar, Music, Users, Globe, Download, Clock, Mic, Sliders, PenTool, Disc, Megaphone, Building2, Heart, CheckCircle, XCircle, Info, MessageSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import './index.css';

const supabaseUrl = 'https://xiljhvtsanncqpjaydor.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DEBUG: Log environment variable status
console.log('🔍 DEBUG: VITE_SUPABASE_ANON_KEY exists:', !!supabaseKey);
console.log('🔍 DEBUG: Key length:', supabaseKey?.length || 0);

// Initialize Supabase only if key exists
let supabase = null;
try {
  if (supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ DEBUG: Supabase initialized successfully');
  } else {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY not found. Profile saving will be disabled.');
  }
} catch (error) {
  console.error('❌ DEBUG: Failed to initialize Supabase:', error);
}

// DEBUG: Final Supabase status
console.log('🔍 DEBUG: Supabase client status:', supabase ? 'INITIALIZED' : 'NULL');

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

// View states
const VIEWS = {
  INTRO: 'intro', // Introduction/onboarding page
  AUTH_CHOICE: 'auth_choice', // Initial page: choose Sign In or Sign Up
  LOGIN: 'login',
  SIGNUP: 'signup',
  SUCCESS: 'success',
  BROWSE: 'browse',
  PROFILE_DETAIL: 'profile_detail',
  OPPORTUNITIES: 'opportunities',
  MY_OPPORTUNITIES: 'my_opportunities',
  CREATE_OPPORTUNITY: 'create_opportunity',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  INBOX: 'inbox',
  HELP: 'help'
};

// Space-themed avatar collection
const SPACE_AVATARS = [
  // Planets & Celestial Bodies
  { emoji: '🪐', name: 'Saturn', gradient: 'from-yellow-400 to-orange-500' },
  { emoji: '🌍', name: 'Earth', gradient: 'from-blue-400 to-green-500' },
  { emoji: '🌎', name: 'Earth Americas', gradient: 'from-blue-500 to-cyan-400' },
  { emoji: '🌏', name: 'Earth Asia', gradient: 'from-green-400 to-blue-500' },
  { emoji: '🌕', name: 'Full Moon', gradient: 'from-gray-200 to-gray-400' },
  { emoji: '🌙', name: 'Crescent Moon', gradient: 'from-yellow-200 to-blue-300' },

  // Stars & Cosmic Phenomena
  { emoji: '⭐', name: 'Star', gradient: 'from-yellow-300 to-amber-400' },
  { emoji: '🌟', name: 'Glowing Star', gradient: 'from-yellow-400 to-orange-400' },
  { emoji: '✨', name: 'Sparkles', gradient: 'from-pink-300 to-purple-400' },
  { emoji: '💫', name: 'Dizzy', gradient: 'from-purple-400 to-pink-400' },
  { emoji: '🌠', name: 'Shooting Star', gradient: 'from-blue-400 to-purple-500' },
  { emoji: '🌌', name: 'Milky Way', gradient: 'from-purple-600 to-pink-600' },

  // Space Objects & Vehicles
  { emoji: '🚀', name: 'Rocket', gradient: 'from-red-400 to-orange-500' },
  { emoji: '🛸', name: 'Flying Saucer', gradient: 'from-cyan-400 to-blue-500' },
  { emoji: '🛰️', name: 'Satellite', gradient: 'from-gray-400 to-blue-400' },
  { emoji: '☄️', name: 'Comet', gradient: 'from-orange-400 to-yellow-500' },

  // Aliens & Cosmic Beings
  { emoji: '👽', name: 'Alien', gradient: 'from-green-400 to-lime-500' },
  { emoji: '👾', name: 'Space Invader', gradient: 'from-purple-500 to-pink-500' },
  { emoji: '🤖', name: 'Robot', gradient: 'from-gray-500 to-blue-500' },

  // Mystical & Energy
  { emoji: '🔮', name: 'Crystal Ball', gradient: 'from-purple-500 to-blue-600' },
  { emoji: '⚡', name: 'Lightning', gradient: 'from-yellow-400 to-orange-600' },
  { emoji: '🌈', name: 'Rainbow', gradient: 'from-pink-400 via-purple-400 to-blue-400' },
  { emoji: '🎇', name: 'Sparkler', gradient: 'from-orange-400 to-red-500' },

  // Additional Cosmic Objects
  { emoji: '☀️', name: 'Sun', gradient: 'from-yellow-300 to-orange-400' },
  { emoji: '🌞', name: 'Sun with Face', gradient: 'from-yellow-400 to-amber-500' },
  { emoji: '🔥', name: 'Fire', gradient: 'from-orange-500 to-red-600' },
  { emoji: '❄️', name: 'Snowflake', gradient: 'from-cyan-300 to-blue-400' },
  { emoji: '💎', name: 'Gem', gradient: 'from-blue-400 to-purple-600' },
  { emoji: '🌀', name: 'Cyclone', gradient: 'from-blue-500 to-cyan-600' },
];

// Get random space avatar
const getRandomSpaceAvatar = () => {
  const randomIndex = Math.floor(Math.random() * SPACE_AVATARS.length);
  return SPACE_AVATARS[randomIndex];
};

// Get avatar by emoji (for displaying saved avatar)
const getAvatarByEmoji = (emoji) => {
  return SPACE_AVATARS.find(avatar => avatar.emoji === emoji) || SPACE_AVATARS[0];
};

const FIELDS = [
  "email", "name", "role", "bio", "genres_raw", "location", "availability",
  "skills_raw", "experience_level", "collab_type", "social_links"
];

const QUESTIONS = {
  email: "What's your email? *",
  name: "What's your full name? *",
  role: "What's your role? *",
  bio: "Tell us about yourself (min. 20 characters) *",
  genres_raw: "List your genres (comma-separated) *",
  location: "What city and country are you based in? *",
  availability: "Your availability? *",
  skills_raw: "List your skills (comma-separated) *",
  experience_level: "Experience level? *",
  collab_type: "Preferred collab type? *",
  social_links: "Drop your social links (Optional)"
};

const PLACEHOLDERS = {
  email: "you@example.com",
  name: "Alex Rivera",
  role: "producer, songwriter, artist...",
  bio: "I love making music and playing guitar. Influenced by The Weeknd, Frank Ocean, and SZA. I also enjoy hiking and photography in my free time.",
  genres_raw: "afrobeats, hip-hop, r&b",
  location: "Toronto, Canada",
  availability: "full-time, part-time, weekends, remote-only",
  skills_raw: "mixing, mastering, vocal production",
  experience_level: "beginner, intermediate, professional",
  collab_type: "paid, free, revenue-split, feature-swap",
  social_links: "https://instagram.com/you, https://soundcloud.com/you"
};

const OPTIONS = {
  role: ["artist", "producer", "songwriter", "dj", "promoter", "pr", "fan"],
  availability: ["full-time", "part-time", "weekends", "remote-only"],
  experience_level: ["beginner", "intermediate", "professional"],
  collab_type: ["paid", "free", "revenue-split", "feature-swap"]
};

// Social media platform options
const SOCIAL_PLATFORMS = [
  { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
  { value: 'apple', label: 'Apple Music', placeholder: 'https://music.apple.com/...' },
  { value: 'audiomack', label: 'Audiomack', placeholder: 'https://audiomack.com/...' },
  { value: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/...' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { value: 'custom', label: 'Custom URL', placeholder: 'https://yourwebsite.com' }
];

// Role Icons Mapping - unique icon for each user role
const ROLE_ICONS = {
  artist: Mic,           // Microphone - represents performing artists/vocalists
  producer: Sliders,     // Mixing console - represents music production
  songwriter: PenTool,   // Pen - represents writing/composition
  dj: Disc,             // Vinyl record - represents DJ culture
  promoter: Megaphone,  // Megaphone - represents promotion/marketing
  pr: Building2,        // Corporate building - represents PR agency
  fan: Heart            // Heart - represents fan love/support
};

// Helper component to render role icon
const RoleIcon = ({ role, className = "w-5 h-5" }) => {
  const IconComponent = ROLE_ICONS[role?.toLowerCase()] || Users; // fallback to Users icon
  return <IconComponent className={className} />;
};

// SpaceBackground component with animated stars and cosmic effects
const SpaceBackground = () => {
  const [shootingStars, setShootingStars] = useState([]);
  const [musicParticles, setMusicParticles] = useState([]);

  // Generate shooting stars
  useEffect(() => {
    const createShootingStar = () => {
      const id = Math.random();
      const top = Math.random() * 50; // Random starting position in top half
      const left = Math.random() * 100;
      const duration = 2 + Math.random() * 2; // 2-4 seconds

      setShootingStars(prev => [...prev, { id, top, left, duration }]);

      // Remove after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      }, duration * 1000);
    };

    // Create shooting stars at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance every interval
        createShootingStar();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate music particles
  useEffect(() => {
    const createMusicParticle = () => {
      const id = Math.random();
      const left = Math.random() * 100;
      const size = 4 + Math.random() * 8; // 4-12px
      const duration = 15 + Math.random() * 10; // 15-25 seconds
      const colors = [
        'rgba(167, 139, 250, 0.3)', // purple
        'rgba(236, 72, 153, 0.3)',  // pink
        'rgba(251, 191, 36, 0.3)',  // amber
        'rgba(59, 130, 246, 0.3)',  // blue
        'rgba(16, 185, 129, 0.3)'   // green
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      setMusicParticles(prev => [...prev, { id, left, size, duration, color }]);

      // Remove after animation completes
      setTimeout(() => {
        setMusicParticles(prev => prev.filter(particle => particle.id !== id));
      }, duration * 1000);
    };

    // Create music particles at intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance
        createMusicParticle();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-background">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>

      {/* Shooting stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}

      {/* Music vibe particles */}
      {musicParticles.map(particle => (
        <div
          key={particle.id}
          className="music-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// User Avatar Component - displays space-themed avatars with gradient backgrounds
const UserAvatar = ({ user, size = 'md', showName = false, className = '' }) => {
  if (!user) return null;

  const avatar = getAvatarByEmoji(user.avatar || '🚀');

  const sizeClasses = {
    xs: 'w-8 h-8 text-xl',
    sm: 'w-10 h-10 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-5xl',
    '2xl': 'w-24 h-24 text-6xl',
    '3xl': 'w-32 h-32 text-7xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          bg-gradient-to-br ${avatar.gradient}
          rounded-full
          flex items-center justify-center
          shadow-lg
          border-2 border-white/20
          transform hover:scale-110 transition-transform duration-200
        `}
        title={avatar.name}
      >
        <span className="filter drop-shadow-lg">{avatar.emoji}</span>
      </div>
      {showName && user.name && (
        <span className="text-white font-semibold">{user.name}</span>
      )}
    </div>
  );
};

export default function App() {
  // Check if user has seen intro before and get last view
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  const lastView = localStorage.getItem('lastView');
  const savedProfileIdFromStorage = localStorage.getItem('savedProfileId');
  const authIntentFromStorage = localStorage.getItem('authIntent');

  // Initialize view based on authentication state
  const getInitialView = () => {
    // Check if there's persisted signup state - if so, restore signup view
    // This takes priority over everything else to ensure users don't lose progress
    const hasSignupState = localStorage.getItem('signupCurrentStep') ||
                           localStorage.getItem('signupProfile') ||
                           localStorage.getItem('signupInProgress');
    if (hasSignupState) {
      console.log('Persisted signup state found, restoring signup view');
      return VIEWS.SIGNUP;
    }

    // If there's an auth intent (OAuth redirect in progress), show auth choice
    // This prevents showing intro while OAuth login is processing
    if (authIntentFromStorage === 'signin' || authIntentFromStorage === 'signup') {
      console.log('Auth intent found in localStorage, showing auth choice while loading...');
      return VIEWS.AUTH_CHOICE;
    }
    // If user has a saved profile, restore their last view or go to dashboard
    if (savedProfileIdFromStorage) {
      // Check if there's a saved view from before the page refresh
      if (lastView) {
        // Don't restore auth-related views, redirect to dashboard instead
        const authViews = [VIEWS.INTRO, VIEWS.AUTH_CHOICE, VIEWS.LOGIN, VIEWS.SIGNUP, VIEWS.SUCCESS];
        if (!authViews.includes(lastView)) {
          console.log('Restoring last view on page load:', lastView);
          return lastView;
        }
      }
      // Default to dashboard if no valid saved view
      console.log('No saved view found, defaulting to dashboard');
      return VIEWS.DASHBOARD;
    }

    // If there's a saved view but no profile (e.g., after cache clear), only restore non-protected views
    // Protected views like INBOX, DASHBOARD, MY_OPPORTUNITIES require authentication
    if (lastView) {
      const protectedViews = [VIEWS.INBOX, VIEWS.DASHBOARD, VIEWS.MY_OPPORTUNITIES, VIEWS.SETTINGS, VIEWS.CREATE_OPPORTUNITY];
      const authViews = [VIEWS.INTRO, VIEWS.AUTH_CHOICE, VIEWS.LOGIN, VIEWS.SIGNUP, VIEWS.SUCCESS];
      if (!protectedViews.includes(lastView) && !authViews.includes(lastView)) {
        console.log('Restoring non-protected view without profile:', lastView);
        return lastView;
      }
    }

    // Non-authenticated users always see intro first
    return VIEWS.INTRO;
  };

  const [currentView, setCurrentView] = useState(getInitialView());
  const [authUser, setAuthUser] = useState(null); // Supabase auth user
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authIntent, setAuthIntent] = useState(null); // 'signin' or 'signup'
  const [isOAuthSignup, setIsOAuthSignup] = useState(false); // Track if OAuth signup to skip email
  // Initialize signup state from localStorage if available
  const getInitialSignupStep = () => {
    const savedStep = localStorage.getItem('signupCurrentStep');
    return savedStep ? parseInt(savedStep, 10) : 0;
  };

  const getInitialSignupProfile = () => {
    const savedProfile = localStorage.getItem('signupProfile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error('Error parsing saved signup profile:', e);
        return {};
      }
    }
    return {};
  };

  const [currentStep, setCurrentStep] = useState(getInitialSignupStep());
  const [profile, setProfile] = useState(getInitialSignupProfile());
  const [currentInput, setCurrentInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState(savedProfileIdFromStorage);
  const [matches, setMatches] = useState(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // Social links state - array of {platform: string, url: string}
  const getInitialSocialLinks = () => {
    const savedLinks = localStorage.getItem('signupSocialLinks');
    if (savedLinks) {
      try {
        return JSON.parse(savedLinks);
      } catch (e) {
        console.error('Error parsing saved social links:', e);
        return [];
      }
    }
    return [];
  };

  const [socialLinks, setSocialLinks] = useState(getInitialSocialLinks());
  const [currentLinkPlatform, setCurrentLinkPlatform] = useState('spotify');
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type, removing: false };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      // Trigger exit animation
      setToasts(prev => prev.map(toast =>
        toast.id === id ? { ...toast, removing: true } : toast
      ));
      // Remove after animation completes (300ms)
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    }, 4000);
  };

  const removeToast = (id) => {
    // Trigger exit animation
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, removing: true } : toast
    ));
    // Remove after animation completes (300ms)
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  // Intro/onboarding slide state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Browse page state
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    genre: '',
    experience_level: '',
    collab_type: ''
  });
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [browseScrollPosition, setBrowseScrollPosition] = useState(0);
  const [opportunitiesScrollPosition, setOpportunitiesScrollPosition] = useState(0);
  const [previousView, setPreviousView] = useState(null);
  const PROFILES_PER_PAGE = 10;

  // Math CAPTCHA state
  const [mathQuestion, setMathQuestion] = useState({ question: '', answer: 0 });
  const [mathAnswer, setMathAnswer] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  // Profile detail state
  const getInitialSelectedProfile = () => {
    // Only restore selected profile if we're on profile detail view
    if (lastView === VIEWS.PROFILE_DETAIL) {
      const savedProfile = localStorage.getItem('selectedProfile');
      if (savedProfile) {
        try {
          return JSON.parse(savedProfile);
        } catch (e) {
          console.error('Error parsing saved profile:', e);
          return null;
        }
      }
    }
    return null;
  };

  const [selectedProfile, setSelectedProfile] = useState(getInitialSelectedProfile());

  // Opportunities state
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [starredOpportunities, setStarredOpportunities] = useState([]); // IDs of starred opportunities
  const [starredOpportunitiesData, setStarredOpportunitiesData] = useState([]); // Full data of starred opportunities
  const [selectedStarredOpportunity, setSelectedStarredOpportunity] = useState(null); // Selected opportunity for detail view in inbox
  const [starredOppsSliderIndex, setStarredOppsSliderIndex] = useState(0); // Current position in starred opportunities slider
  const [opportunityForm, setOpportunityForm] = useState({
    looking_for_role: '',
    location: '',
    description: '',
    genres: '',
    collab_type: ''
  });
  const [editingOpportunityId, setEditingOpportunityId] = useState(null);
  const [opportunityFilters, setOpportunityFilters] = useState({
    role: '',
    location: '',
    genres: '',
    collab_type: ''
  });

  // Dashboard/Current user state
  const [currentUser, setCurrentUser] = useState(null);
  const [myInvitations, setMyInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [invitationsError, setInvitationsError] = useState(null);
  const [collaborations, setCollaborations] = useState([]);
  const [isLoadingCollaborations, setIsLoadingCollaborations] = useState(false);
  const [collaborationsError, setCollaborationsError] = useState(null);
  const [hasViewedInbox, setHasViewedInbox] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('hasViewedInbox') === 'true';
  });
  const [lastViewedInvitationCount, setLastViewedInvitationCount] = useState(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('lastViewedInvitationCount');
    return stored ? parseInt(stored, 10) : 0;
  });

  // Toggle states for invitations
  const [showReceivedInvitations, setShowReceivedInvitations] = useState(true);
  const [showSentInvitations, setShowSentInvitations] = useState(true);

  // Filter states for invitations
  const [invitationDateFilter, setInvitationDateFilter] = useState('all'); // all, today, week, month

  // Pagination states for invitations
  const [receivedInvitationsPage, setReceivedInvitationsPage] = useState(1);
  const [sentInvitationsPage, setSentInvitationsPage] = useState(1);
  const INVITATIONS_PER_PAGE = 10;

  // Filter states for collaborations
  const [collabGenreFilter, setCollabGenreFilter] = useState('');
  const [collabLocationFilter, setCollabLocationFilter] = useState('');

  // Pagination states for collaborations
  const [collaborationsPage, setCollaborationsPage] = useState(1);
  const COLLABORATIONS_PER_PAGE = 10;

  // Custom groups/albums for collaborators
  const [customGroups, setCustomGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState(null);
  const [selectedCollabsForGroup, setSelectedCollabsForGroup] = useState([]);

  // Help page state
  const [helpSubpage, setHelpSubpage] = useState('main'); // main, how-to-use, privacy, terms, contact

  // Auth state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    genres_raw: '',
    location: '',
    skills_raw: '',
    experience_level: '',
    availability: '',
    collab_type: '',
    social_links: ''
  });

  const currentField = FIELDS[currentStep];

  // Save current view to localStorage whenever it changes (for persistence on refresh)
  useEffect(() => {
    if (currentView) {
      localStorage.setItem('lastView', currentView);

      // When entering SIGNUP view, immediately mark that signup is in progress
      if (currentView === VIEWS.SIGNUP) {
        localStorage.setItem('signupInProgress', 'true');
      }
    }
  }, [currentView]);

  // Save savedProfileId to localStorage whenever it changes
  useEffect(() => {
    if (savedProfileId) {
      localStorage.setItem('savedProfileId', savedProfileId);
    } else {
      // Clear localStorage when logged out
      localStorage.removeItem('savedProfileId');
      localStorage.removeItem('lastView');
      localStorage.removeItem('selectedProfile');
    }
  }, [savedProfileId]);

  // Save selectedProfile to localStorage whenever it changes (for profile detail page persistence)
  useEffect(() => {
    if (selectedProfile && currentView === VIEWS.PROFILE_DETAIL) {
      localStorage.setItem('selectedProfile', JSON.stringify(selectedProfile));
    } else if (!selectedProfile || currentView !== VIEWS.PROFILE_DETAIL) {
      // Clear saved profile when leaving profile detail view or when selectedProfile is null
      localStorage.removeItem('selectedProfile');
    }
  }, [selectedProfile, currentView]);

  // Save signup currentStep to localStorage whenever it changes (only during signup)
  useEffect(() => {
    if (currentView === VIEWS.SIGNUP) {
      localStorage.setItem('signupCurrentStep', currentStep.toString());
    }
  }, [currentStep, currentView]);

  // Save signup profile data to localStorage whenever it changes (only during signup)
  useEffect(() => {
    if (currentView === VIEWS.SIGNUP) {
      localStorage.setItem('signupProfile', JSON.stringify(profile));
    }
  }, [profile, currentView]);

  // Save signup social links to localStorage whenever they change (only during signup)
  useEffect(() => {
    if (currentView === VIEWS.SIGNUP) {
      localStorage.setItem('signupSocialLinks', JSON.stringify(socialLinks));
    }
  }, [socialLinks, currentView]);

  // Initialize auth state listener
  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    // Check current session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        console.log('Existing session found on page load, loading profile...');
        // Load user profile from database
        // Note: This will handle redirect logic based on authIntent if present
        loadUserProfile(session.user.id, session.user.email);
      } else {
        setIsAuthLoading(false);
      }
    });

    // Listen for auth changes (including OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      setAuthUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in via OAuth, loading profile...');
        setIsAuthLoading(false);
        setIsAuthProcessing(false);
        loadUserProfile(session.user.id, session.user.email);
      } else if (session?.user) {
        loadUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setSavedProfileId(null);
        setIsAuthLoading(false);
        setIsAuthProcessing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // DEBUG: Log Google button state
  useEffect(() => {
    console.log('🔍 DEBUG: Google Button State Check:');
    console.log('  - isAuthProcessing:', isAuthProcessing);
    console.log('  - supabase exists:', !!supabase);
    console.log('  - Button disabled:', isAuthProcessing || !supabase);
  }, [isAuthProcessing]);

  // Load dashboard data when view changes to DASHBOARD
  useEffect(() => {
    if (currentView === VIEWS.DASHBOARD && savedProfileId) {
      console.log('Dashboard useEffect triggered - loading data for profile:', savedProfileId);
      console.log('Current user before load:', currentUser);
      loadCurrentUser();
      loadInvitations();
      loadCollaborations();
    }
  }, [currentView, savedProfileId]);

  // Pre-populate form data when entering Settings view
  useEffect(() => {
    if (currentView === VIEWS.SETTINGS && currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        bio: currentUser.bio || '',
        genres_raw: currentUser.genres_raw || '',
        location: currentUser.location || '',
        skills_raw: currentUser.skills_raw || '',
        experience_level: currentUser.experience_level || '',
        availability: currentUser.availability || '',
        collab_type: currentUser.collab_type || '',
        social_links: currentUser.social_links || ''
      });
    }
  }, [currentView, currentUser]);

  // Load opportunities when entering Opportunities view
  useEffect(() => {
    if (currentView === VIEWS.OPPORTUNITIES) {
      loadOpportunities();
      loadStarredOpportunities(); // Also load starred opportunities for star/unstar functionality
      // Load invitations and collaborations for pending/connected status
      if (savedProfileId && supabase) {
        loadInvitations();
        loadCollaborations();
      }
    }
  }, [currentView, savedProfileId, supabase]);

  // Load profiles when entering Browse view
  useEffect(() => {
    if (currentView === VIEWS.BROWSE) {
      loadProfiles();
      // Load invitations and collaborations for pending/connected status
      if (savedProfileId && supabase) {
        loadInvitations();
        loadCollaborations();
      }
    }
  }, [currentView, savedProfileId, supabase]);

  // Load starred opportunities when entering Dashboard view or when savedProfileId changes
  useEffect(() => {
    if (currentView === VIEWS.DASHBOARD && savedProfileId && supabase) {
      loadStarredOpportunities();
    }
  }, [currentView, savedProfileId, supabase]);

  // Load collaborations and invitations when entering Inbox view
  useEffect(() => {
    if (currentView === VIEWS.INBOX) {
      if (savedProfileId && supabase) {
        console.log('Inbox view: Loading data for profile:', savedProfileId);
        // Load current user first, then load inbox data
        loadCurrentUser();
        loadCollaborations();
        loadInvitations();
        loadStarredOpportunities(); // Also load starred opportunities for inbox
      } else if (!savedProfileId) {
        console.warn('Inbox view opened but no savedProfileId available');
      } else if (!supabase) {
        console.warn('Inbox view opened but supabase not initialized');
      }
    }
  }, [currentView, savedProfileId, supabase]);

  // Restore scroll position when returning to browse page
  useEffect(() => {
    if (currentView === VIEWS.BROWSE && browseScrollPosition > 0) {
      // Use setTimeout to ensure DOM is fully rendered before scrolling
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: browseScrollPosition,
          behavior: 'smooth'
        });
      }, 100);

      // Cleanup timeout if component unmounts or view changes
      return () => clearTimeout(timeoutId);
    }
  }, [currentView, browseScrollPosition]);

  // Restore scroll position when returning to opportunities page
  useEffect(() => {
    if (currentView === VIEWS.OPPORTUNITIES && opportunitiesScrollPosition > 0) {
      // Use setTimeout to ensure DOM is fully rendered before scrolling
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: opportunitiesScrollPosition,
          behavior: 'smooth'
        });
      }, 100);

      // Cleanup timeout if component unmounts or view changes
      return () => clearTimeout(timeoutId);
    }
  }, [currentView, opportunitiesScrollPosition]);

  // Auto-redirect from SUCCESS view to DASHBOARD after profile completion
  useEffect(() => {
    if (currentView === VIEWS.SUCCESS && savedProfileId) {
      console.log('Profile creation successful, auto-redirecting to dashboard in 3 seconds...');
      const redirectTimeout = setTimeout(() => {
        console.log('Redirecting to DASHBOARD');
        setCurrentView(VIEWS.DASHBOARD);
      }, 3000); // 3 second delay to let user see success message

      return () => clearTimeout(redirectTimeout);
    }
  }, [currentView, savedProfileId]);

  // Load user profile from database using auth user ID
  const loadUserProfile = async (userId, userEmail) => {
    if (!supabase) return;

    // Check if user has persisted signup state - if so, don't redirect them away
    const hasSignupState = localStorage.getItem('signupCurrentStep') ||
                           localStorage.getItem('signupProfile') ||
                           localStorage.getItem('signupInProgress');
    if (hasSignupState) {
      console.log('User has persisted signup state, keeping them on SIGNUP view');
      setIsAuthLoading(false);
      setIsAuthProcessing(false);
      return; // Don't redirect, user is in middle of signup
    }

    // Read auth intent from localStorage (persists across OAuth redirect)
    const storedIntent = localStorage.getItem('authIntent');
    const intent = storedIntent || authIntent;

    console.log('Loading profile with intent:', intent, 'from storage:', storedIntent);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // PGRST116 means no rows found - this is expected for new users
        if (error.code === 'PGRST116') {
          console.log('No profile found, intent:', intent);

          // If user clicked Sign In but has no profile, they have an auth account
          // but never completed their profile. Redirect them to complete it.
          if (intent === 'signin') {
            console.log('User has auth account but no profile, redirecting to complete profile');
            setIsOAuthSignup(true);
            setProfile({ email: userEmail });
            setCurrentStep(1); // Skip email question (index 0), start at name (index 1)
            setCurrentView(VIEWS.SIGNUP);
            setIsAuthLoading(false);
            setIsAuthProcessing(false);
            localStorage.removeItem('authIntent'); // Clean up
            return;
          }

          // If user clicked Sign Up, direct to signup flow
          if (intent === 'signup') {
            console.log('New user signing up, starting profile creation');
            setIsOAuthSignup(true);
            // Pre-populate email from OAuth
            setProfile({ email: userEmail });
            setCurrentStep(1); // Skip email question (index 0), start at name (index 1)
            setCurrentView(VIEWS.SIGNUP);
            setIsAuthLoading(false);
            setIsAuthProcessing(false);
            localStorage.removeItem('authIntent'); // Clean up
            return;
          }

          // Fallback if no auth intent set - user has auth but no profile
          // This can happen if localStorage was cleared or user is on different device
          console.log('No auth intent but user has auth account without profile, redirecting to complete profile');
          setIsOAuthSignup(true);
          setProfile({ email: userEmail });
          setCurrentStep(1); // Skip email question, start at name
          setCurrentView(VIEWS.SIGNUP);
          setIsAuthLoading(false);
          setIsAuthProcessing(false);
          localStorage.removeItem('authIntent'); // Clean up
          return;
        }
        // Other errors
        console.error('Error loading user profile:', error);
        setAuthError('Error loading profile. Please try again.');
        setCurrentView(VIEWS.INTRO);
        localStorage.removeItem('authIntent'); // Clean up
        return;
      }

      if (data) {
        console.log('Profile loaded successfully:', data.email, 'intent:', intent);

        // Check if profile is complete (has all required fields filled)
        const requiredFields = ['email', 'name', 'role', 'bio', 'genres_raw', 'location', 'availability', 'skills_raw', 'experience_level', 'collab_type'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

        // If profile is incomplete (e.g., auto-created by trigger), direct to signup
        if (missingFields.length > 0) {
          console.log('Profile exists but is incomplete (missing:', missingFields.join(', '), '), directing to complete signup');
          setIsOAuthSignup(true);
          setProfile({
            email: data.email,
            ...data // Pre-populate any existing fields
          });
          setCurrentStep(1); // Skip email question, start at name
          setCurrentView(VIEWS.SIGNUP);
          setIsAuthLoading(false);
          setIsAuthProcessing(false);
          localStorage.removeItem('authIntent'); // Clean up
          return;
        }

        // Profile is complete, proceed with normal flow
        setCurrentUser(data);
        setSavedProfileId(data.id);

        // If user explicitly signed in (via OAuth or other auth), always redirect to dashboard
        if (intent === 'signin') {
          console.log('Redirecting to DASHBOARD (reason: explicit sign-in with intent:', intent, ')');
          setCurrentView(VIEWS.DASHBOARD);
          localStorage.removeItem('authIntent');
          setIsAuthLoading(false);
          setIsAuthProcessing(false);
          return;
        }

        // For other cases, check if we should redirect based on current view
        const currentSavedView = localStorage.getItem('lastView');
        const shouldRedirect = !currentSavedView ||
                               currentSavedView === VIEWS.AUTH_CHOICE ||
                               currentSavedView === VIEWS.INTRO ||
                               currentSavedView === VIEWS.LOGIN ||
                               currentSavedView === VIEWS.SIGNUP;

        if (shouldRedirect) {
          console.log('Redirecting to DASHBOARD (reason: no saved view or auth view)');
          setCurrentView(VIEWS.DASHBOARD);
        } else {
          console.log('Keeping current view:', currentSavedView, '(user returning to tab)');
          // Don't change the view, user is already on a page
        }

        // Clean up localStorage after successful redirect
        localStorage.removeItem('authIntent');
        setIsAuthLoading(false);
        setIsAuthProcessing(false);
      } else {
        // No data but no error either - treat as new user
        console.log('No profile data, directing to intro');
        setCurrentView(VIEWS.INTRO);
        localStorage.removeItem('authIntent'); // Clean up
      }
    } catch (error) {
      console.error('Unexpected error loading user profile:', error);
      setAuthError('Unexpected error. Please try again.');
      setCurrentView(VIEWS.INTRO);
      localStorage.removeItem('authIntent'); // Clean up
    }
  };

  // Handle email/password signup
  const handleEmailSignup = async (email, password) => {
    if (!supabase) {
      setAuthError('Authentication service not available');
      return;
    }

    // Store auth intent in localStorage and state
    localStorage.setItem('authIntent', 'signup');
    setAuthIntent('signup');
    setIsAuthProcessing(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Pre-populate email in profile since they already provided it
        setProfile({ email: email });
        setCurrentStep(1); // Skip email question, start at name
        setAuthSuccess('Account created! Starting profile setup...');
        // User will be redirected to SIGNUP view by auth state listener
      }
    } catch (error) {
      setAuthError(error.message || 'Failed to create account');
      localStorage.removeItem('authIntent'); // Clean up on error
    } finally {
      setIsAuthProcessing(false);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (email, password) => {
    if (!supabase) {
      setAuthError('Authentication service not available');
      return;
    }

    // Store auth intent in localStorage and state
    localStorage.setItem('authIntent', 'signin');
    setAuthIntent('signin');
    setIsAuthProcessing(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // User will be loaded automatically by auth state listener
        setAuthSuccess('Login successful!');
      }
    } catch (error) {
      setAuthError(error.message || 'Failed to login');
      localStorage.removeItem('authIntent'); // Clean up on error
    } finally {
      setIsAuthProcessing(false);
    }
  };

  // Handle OAuth login (Google, Microsoft)
  const handleOAuthLogin = async (provider, intent) => {
    if (!supabase) {
      setAuthError('Authentication service not available');
      return;
    }

    // Store auth intent in localStorage (persists across OAuth redirect)
    localStorage.setItem('authIntent', intent); // 'signin' or 'signup'
    setAuthIntent(intent);
    setIsAuthProcessing(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider, // 'google' or 'azure' (Microsoft)
        options: {
          redirectTo: SITE_URL
        }
      });

      if (error) throw error;
    } catch (error) {
      setAuthError(error.message || `Failed to login with ${provider}`);
      setIsAuthProcessing(false);
      localStorage.removeItem('authIntent'); // Clean up on error
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSavedProfileId(null);
      setAuthUser(null);

      // Clear all auth-related localStorage items
      localStorage.removeItem('authIntent');
      localStorage.removeItem('savedProfileId');
      localStorage.removeItem('lastView');
      localStorage.removeItem('selectedProfile');

      setCurrentView(VIEWS.INTRO);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!supabase || !currentUser) return;

    try {
      // Delete profile from database via backend API
      const response = await fetch(`${API_URL}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: authUser?.id || currentUser.id,
          email: currentUser.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Delete auth user from Supabase
      await supabase.auth.signOut();

      // Clear all local storage
      localStorage.clear();

      // Reset all state
      setCurrentUser(null);
      setSavedProfileId(null);
      setAuthUser(null);
      setShowDeleteModal(false);

      // Show success message
      showToast('Account deleted successfully', 'success');

      // Redirect to intro page
      setTimeout(() => {
        setCurrentView(VIEWS.INTRO);
      }, 1000);
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Failed to delete account. Please try again.', 'error');
    }
  };

  // Generate random math question
  const generateMathQuestion = () => {
    const operations = [
      { type: 'add', symbol: '+', range: [1, 50] },
      { type: 'subtract', symbol: '-', range: [10, 100] },
      { type: 'multiply', symbol: '×', range: [1, 12] }
    ];

    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    if (operation.type === 'add') {
      num1 = Math.floor(Math.random() * operation.range[1]) + operation.range[0];
      num2 = Math.floor(Math.random() * operation.range[1]) + operation.range[0];
      answer = num1 + num2;
    } else if (operation.type === 'subtract') {
      num1 = Math.floor(Math.random() * (operation.range[1] - operation.range[0])) + operation.range[0];
      num2 = Math.floor(Math.random() * num1); // Ensure result is positive
      answer = num1 - num2;
    } else { // multiply
      num1 = Math.floor(Math.random() * operation.range[1]) + 1;
      num2 = Math.floor(Math.random() * operation.range[1]) + 1;
      answer = num1 * num2;
    }

    setMathQuestion({
      question: `${num1} ${operation.symbol} ${num2}`,
      answer: answer
    });
  };

  // Handle input change for Settings form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateField = async (fieldName, value) => {
    try {
      const response = await fetch(`${API_URL}/validate-field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_name: fieldName, value })
      });

      if (!response.ok) throw new Error('Validation failed');

      const result = await response.json();

      // For email and name validation, try to parse JSON response
      if (fieldName === 'email' || fieldName === 'name') {
        try {
          const validationData = JSON.parse(result.validation);
          if (validationData.valid === false) {
            setValidationMessage(`❌ ${validationData.message || 'Invalid input. Please try again.'}`);
            return false;
          } else {
            setValidationMessage(`✅ ${validationData.message || 'Looks good!'}`);
            return true;
          }
        } catch (e) {
          // If JSON parse fails, treat as informational message
          setValidationMessage(result.validation);
          return true;
        }
      } else {
        // For other fields, just show the validation message
        setValidationMessage(result.validation);
        return result.valid;
      }
    } catch (error) {
      console.error('Validation error:', error);
      return true;
    }
  };

  // Helper function to validate URL format
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Add a social link
  const addSocialLink = () => {
    if (!currentLinkUrl.trim()) {
      setValidationMessage('❌ Please enter a URL');
      return;
    }

    // Ensure URL has protocol
    let url = currentLinkUrl.trim();
    if (!url.match(/^https?:\/\//i)) {
      url = `https://${url}`;
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      setValidationMessage('❌ Please enter a valid URL');
      return;
    }

    // Check if this platform already exists
    const existingIndex = socialLinks.findIndex(link => link.platform === currentLinkPlatform);
    if (existingIndex >= 0) {
      // Update existing link
      const updatedLinks = [...socialLinks];
      updatedLinks[existingIndex] = { platform: currentLinkPlatform, url };
      setSocialLinks(updatedLinks);
      setValidationMessage(`✅ Updated ${SOCIAL_PLATFORMS.find(p => p.value === currentLinkPlatform)?.label}`);
    } else {
      // Add new link
      setSocialLinks([...socialLinks, { platform: currentLinkPlatform, url }]);
      setValidationMessage(`✅ Added ${SOCIAL_PLATFORMS.find(p => p.value === currentLinkPlatform)?.label}`);
    }

    // Clear input
    setCurrentLinkUrl('');
  };

  // Remove a social link
  const removeSocialLink = (platform) => {
    setSocialLinks(socialLinks.filter(link => link.platform !== platform));
    setValidationMessage(`Removed ${SOCIAL_PLATFORMS.find(p => p.value === platform)?.label}`);
  };

  // Convert social links array to comma-separated string format for backend
  const socialLinksToString = (links) => {
    return links.map(link => `${link.platform}:${link.url}`).join(',');
  };

  // Parse social links string to array
  const parseSocialLinks = (linksString) => {
    if (!linksString) return [];
    return linksString.split(',').map(link => {
      const trimmed = link.trim();
      if (!trimmed) return null;

      // Check if it's in platform:url format (but not a URL protocol like https:)
      // A valid platform prefix should be a word followed by : but not followed by //
      const platformMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9_-]*):(.+)$/);
      if (platformMatch && !platformMatch[2].startsWith('//')) {
        // This is platform:url format
        const [, platform, url] = platformMatch;
        return { platform, url: url.trim() };
      }

      // Otherwise treat the whole thing as a URL (legacy format or plain URL)
      return { platform: 'custom', url: trimmed };
    }).filter(link => link !== null && link.url); // Filter out empty entries
  };

  // Get platform label and detect platform from URL
  const getPlatformInfo = (link) => {
    if (link.platform && link.platform !== 'custom') {
      const platformData = SOCIAL_PLATFORMS.find(p => p.value === link.platform);
      return {
        label: platformData?.label || link.platform,
        color: 'from-purple-500 to-pink-500'
      };
    }

    // Try to detect platform from URL for legacy links
    const url = link.url.toLowerCase();
    if (url.includes('spotify')) return { label: 'Spotify', color: 'from-green-500 to-emerald-500' };
    if (url.includes('apple') || url.includes('music.apple')) return { label: 'Apple Music', color: 'from-red-500 to-pink-500' };
    if (url.includes('audiomack')) return { label: 'Audiomack', color: 'from-orange-500 to-amber-500' };
    if (url.includes('soundcloud')) return { label: 'SoundCloud', color: 'from-orange-400 to-red-400' };
    if (url.includes('youtube')) return { label: 'YouTube', color: 'from-red-600 to-red-500' };
    if (url.includes('instagram')) return { label: 'Instagram', color: 'from-pink-500 to-purple-500' };

    return { label: 'Link', color: 'from-blue-500 to-cyan-500' };
  };

  const handleNext = async () => {
    // Special handling for social_links field (OPTIONAL)
    if (currentField === 'social_links') {
      // Convert social links array to string format and save
      const linksString = socialLinksToString(socialLinks);
      setProfile({ ...profile, social_links: linksString });
      setValidationMessage("");

      if (currentStep === FIELDS.length - 1) {
        setShowCaptcha(true);
        generateMathQuestion();
      } else {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    // For all other fields, require input (ALL FIELDS ARE MANDATORY)
    if (!currentInput.trim() && !profile[currentField]) {
      setValidationMessage("❌ This field is required. Please provide your information.");
      return;
    }

    const value = currentInput.trim();

    // Minimum length requirements for text fields
    const minLengthRequirements = {
      name: 2,
      bio: 20,
      location: 3,
      genres_raw: 3,
      skills_raw: 3
    };

    // Check minimum length for text fields
    if (minLengthRequirements[currentField] && value.length < minLengthRequirements[currentField]) {
      setValidationMessage(`❌ Please provide at least ${minLengthRequirements[currentField]} characters.`);
      return;
    }

    // Validate specific fields before proceeding
    if (['email', 'name', 'bio', 'location', 'genres_raw', 'skills_raw'].includes(currentField)) {
      setIsValidating(true);
      setValidationMessage("");
      const isValid = await validateField(currentField, value);
      setIsValidating(false);

      // For email and name, prevent proceeding if validation explicitly returns false
      if ((currentField === 'email' || currentField === 'name') && isValid === false) {
        return; // Don't proceed to next step
      }
    }

    setProfile({ ...profile, [currentField]: value });
    setCurrentInput("");
    setValidationMessage("");

    if (currentStep === FIELDS.length - 1) {
      // Show CAPTCHA before completing signup
      setShowCaptcha(true);
      generateMathQuestion();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Verify CAPTCHA and proceed to save profile
  const verifyCaptcha = async () => {
    const userAnswer = parseInt(mathAnswer);
    if (userAnswer === mathQuestion.answer) {
      setCaptchaError('');
      setShowCaptcha(false);
      // Save the profile first, then show success
      const success = await handleSubmit();
      // Only show success view if save was successful
      if (success) {
        // Clear persisted signup state from localStorage
        localStorage.removeItem('signupCurrentStep');
        localStorage.removeItem('signupProfile');
        localStorage.removeItem('signupSocialLinks');
        localStorage.removeItem('signupInProgress');
        setCurrentView(VIEWS.SUCCESS);
      } else {
        // handleSubmit failed, user should stay on signup or be redirected
        // The error handling in handleSubmit will take care of showing messages
      }
    } else {
      setCaptchaError('Incorrect answer. Please try again.');
      // Generate new question
      generateMathQuestion();
      setMathAnswer('');
    }
  };

  // Shuffle array for random display
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load all profiles for browse page
  const loadProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      // Check if Supabase is initialized
      if (!supabase) {
        throw new Error('Supabase not initialized. Please set VITE_SUPABASE_ANON_KEY environment variable.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out current user's own profile
      const filteredData = (data || []).filter(profile => profile.id !== savedProfileId);

      setAllProfiles(filteredData);

      // Show 10 random profiles initially
      const shuffled = shuffleArray(filteredData);
      setFilteredProfiles(shuffled);
      setDisplayedProfiles(shuffled.slice(0, PROFILES_PER_PAGE));
      setCurrentPage(1);
      setHasFiltered(false);
    } catch (error) {
      console.error('Error loading profiles:', error);
      showToast(`Error loading profiles: ${error.message}`, 'error');
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  // Apply filters to profiles
  const applyFilters = () => {
    let filtered = [...allProfiles];

    const hasActiveFilters = filters.location || filters.genre || filters.experience_level || filters.collab_type;

    if (filters.location) {
      filtered = filtered.filter(p =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.genre) {
      filtered = filtered.filter(p =>
        p.genres_raw?.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    if (filters.experience_level) {
      filtered = filtered.filter(p =>
        p.experience_level?.toLowerCase() === filters.experience_level.toLowerCase()
      );
    }

    if (filters.collab_type) {
      filtered = filtered.filter(p =>
        p.collab_type?.toLowerCase() === filters.collab_type.toLowerCase()
      );
    }

    setFilteredProfiles(filtered);
    setHasFiltered(hasActiveFilters);
    setCurrentPage(1);

    // Update displayed profiles for first page
    setDisplayedProfiles(filtered.slice(0, PROFILES_PER_PAGE));
  };

  // Update displayed profiles when page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
    const endIndex = startIndex + PROFILES_PER_PAGE;
    setDisplayedProfiles(filteredProfiles.slice(startIndex, endIndex));
  }, [currentPage, filteredProfiles]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    if (allProfiles.length > 0) {
      applyFilters();
    }
  }, [filters, allProfiles]);

  // Load user data when viewing dashboard
  useEffect(() => {
    if (currentView === VIEWS.DASHBOARD && savedProfileId) {
      loadCurrentUser();
      loadInvitations();
    }
  }, [currentView, savedProfileId]);

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      console.log('Saving profile to Supabase:', profile);

      // Check if Supabase is initialized
      if (!supabase) {
        throw new Error('Supabase not initialized. Please set VITE_SUPABASE_ANON_KEY environment variable.');
      }

      // Check if user is authenticated
      if (!authUser) {
        throw new Error('You must be logged in to create a profile.');
      }

      // Validate profile completion - ensure all required fields are filled
      const requiredFields = ['email', 'name', 'role', 'bio', 'genres_raw', 'location', 'availability', 'skills_raw', 'experience_level', 'collab_type'];
      const missingFields = requiredFields.filter(field => !profile[field] || profile[field].trim() === '');

      if (missingFields.length > 0) {
        throw new Error(`Please complete all required fields: ${missingFields.join(', ').replace(/_/g, ' ')}`);
      }

      // Validate minimum lengths
      if (profile.bio && profile.bio.length < 20) {
        throw new Error('Bio must be at least 20 characters long.');
      }
      if (profile.name && profile.name.length < 2) {
        throw new Error('Name must be at least 2 characters long.');
      }

      // First check if user already has a profile with their ID
      const { data: existingUserProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (userProfileError && userProfileError.code !== 'PGRST116') {
        console.error('Error checking for existing profile:', userProfileError);
        throw new Error(`Failed to check existing profile: ${userProfileError.message}`);
      }

      // If profile already exists, check if it's complete
      if (existingUserProfile) {
        console.log('Profile already exists for this user, checking if complete...');

        // Check if the existing profile has all required fields filled
        const existingProfileMissingFields = requiredFields.filter(
          field => !existingUserProfile[field] || existingUserProfile[field].trim() === ''
        );

        // If existing profile is complete, redirect to dashboard
        if (existingProfileMissingFields.length === 0) {
          console.log('Existing profile is complete, redirecting to dashboard');
          setSavedProfileId(existingUserProfile.id);
          setCurrentUser(existingUserProfile);
          setIsAuthLoading(false);
          setIsAuthProcessing(false);

          // Clear signup state
          localStorage.removeItem('signupCurrentStep');
          localStorage.removeItem('signupProfile');
          localStorage.removeItem('signupSocialLinks');
          localStorage.removeItem('signupInProgress');

          // Redirect to dashboard
          setTimeout(() => setCurrentView(VIEWS.DASHBOARD), 100);
          return true;
        }

        // If incomplete, we'll update it with upsert below
        console.log('Existing profile is incomplete, will update with new data');
      }

      // Check if a profile exists with this email for a DIFFERENT user (data inconsistency)
      const { data: emailProfile, error: emailCheckError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('email', authUser.email)
        .neq('id', authUser.id) // Different user ID
        .maybeSingle();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        console.error('Error checking for email profile:', emailCheckError);
        // Continue anyway - let upsert handle conflicts
      }

      // If email exists for a different user, there's a data inconsistency
      if (emailProfile) {
        console.error('Data inconsistency: Email exists for different user ID', {
          emailProfileId: emailProfile.id,
          authUserId: authUser.id,
          email: authUser.email
        });

        // Check if the conflicting profile is incomplete (likely auto-created but abandoned)
        const isConflictingProfileIncomplete = !emailProfile.name || emailProfile.name.trim() === '';

        if (isConflictingProfileIncomplete) {
          // This is likely an auto-created profile that was never completed
          // We can safely try to delete it as it has no user data
          try {
            console.log('Attempting to clean up incomplete orphaned profile...');

            // First, try to delete any related data with CASCADE
            const { error: deleteError } = await supabase
              .from('profiles')
              .delete()
              .eq('id', emailProfile.id);

            if (deleteError) {
              console.error('Could not delete conflicting profile:', deleteError);
              // If delete fails, it might be due to RLS or constraints
              // In this case, show a helpful error message
              throw new Error(
                'Unable to complete signup: Your email is associated with an incomplete account. ' +
                'Please try signing in first, or contact support for assistance.'
              );
            }
            console.log('Conflicting incomplete profile deleted successfully');
          } catch (cleanupError) {
            console.error('Cleanup failed:', cleanupError);
            throw cleanupError; // Re-throw to show the error message
          }
        } else {
          // This is a complete profile for another user - should not happen in normal flow
          throw new Error(
            'This email is already registered to another account. ' +
            'Please use a different email or contact support if you believe this is an error.'
          );
        }
      }

      // Prepare profile data with auth user ID and assign random space avatar
      const randomAvatar = getRandomSpaceAvatar();
      const profileData = {
        ...profile,
        id: authUser.id, // Use auth user ID as profile ID
        email: authUser.email || profile.email,
        avatar: randomAvatar.emoji // Assign random space-themed avatar
      };

      // Save directly to Supabase using upsert to handle both insert and update
      // This will work whether the profile exists (incomplete) or doesn't exist yet
      const { data, error } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase error:', error);

        // Check if it's a unique constraint violation on email
        if (error.code === '23505' && error.message.includes('email')) {
          throw new Error(
            'This email address is already registered. ' +
            'Please try signing in instead, or contact support if you need assistance.'
          );
        }

        throw new Error(`Failed to save profile: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase');
      }

      console.log('Profile saved successfully:', data[0]);
      setSavedProfileId(data[0].id);
      setCurrentUser(data[0]);

      // Try to find matches using API if available, otherwise skip
      setIsLoadingMatches(true);
      try {
        const matchResponse = await fetch(`${API_URL}/find-matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: data[0].id }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (matchResponse.ok) {
          const matchData = await matchResponse.json();
          setMatches(JSON.parse(matchData.matches));
        }
      } catch (matchError) {
        console.warn('Could not fetch matches (API may be offline):', matchError);
        // Continue without matches - not a critical error
      }

      setIsLoadingMatches(false);

      // Clear signup state before returning
      localStorage.removeItem('signupCurrentStep');
      localStorage.removeItem('signupProfile');
      localStorage.removeItem('signupSocialLinks');
      localStorage.removeItem('signupInProgress');

      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error saving profile:', error);
      setShowCaptcha(false); // Close captcha modal on error
      setAuthError(error.message || 'Failed to save profile');
      showToast(`Error saving profile: ${error.message}`, 'error');
      return false; // Return false to indicate failure
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log('Updating profile in Supabase:', formData);

      // Check if Supabase is initialized
      if (!supabase) {
        throw new Error('Supabase not initialized. Please set VITE_SUPABASE_ANON_KEY environment variable.');
      }

      // Check if email is being changed and if it already exists for a different user
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', formData.email)
        .neq('id', savedProfileId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for duplicate email:', checkError);
        throw new Error(`Failed to validate email: ${checkError.message}`);
      }

      if (existingProfile) {
        throw new Error(`This email address is already registered to another account. Please use a different email.`);
      }

      // Update the profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          bio: formData.bio,
          genres_raw: formData.genres_raw,
          location: formData.location,
          skills_raw: formData.skills_raw,
          experience_level: formData.experience_level,
          availability: formData.availability,
          collab_type: formData.collab_type,
          social_links: formData.social_links
        })
        .eq('id', savedProfileId)
        .select();

      if (error) {
        console.error('Supabase error:', error);

        // Check if it's a unique constraint violation
        if (error.code === '23505' && error.message.includes('email')) {
          throw new Error('This email address is already registered. Please use a different email.');
        }

        throw new Error(`Failed to update profile: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase');
      }

      console.log('Profile updated successfully:', data[0]);
      setCurrentUser(data[0]); // Update the current user state

      // Go back to dashboard
      showToast('Profile updated successfully!', 'success');
      setCurrentView(VIEWS.DASHBOARD);

    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(`Error updating profile: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptionSelect = (value) => {
    setCurrentInput(value);
  };

  // Load opportunities
  const loadOpportunities = async () => {
    if (!supabase) return;
    setIsLoadingOpportunities(true);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, profiles(name, role, genres_raw)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading opportunities:', error);
        // If the table doesn't exist, just set empty array
        if (error.message && error.message.includes('opportunities')) {
          setOpportunities([]);
          return;
        }
        throw error;
      }
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      setOpportunities([]);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  // Load starred opportunities for current user
  const loadStarredOpportunities = async () => {
    if (!supabase || !savedProfileId) return;

    try {
      // Get list of starred opportunity IDs with created_at timestamp
      const { data: starredData, error: starredError } = await supabase
        .from('starred_opportunities')
        .select('opportunity_id, created_at')
        .eq('user_id', savedProfileId)
        .order('created_at', { ascending: false }); // Most recent first

      if (starredError) {
        console.error('Error loading starred opportunities:', starredError);
        return;
      }

      const starredIds = starredData?.map(s => s.opportunity_id) || [];
      setStarredOpportunities(starredIds);

      // If there are starred opportunities, load their full data
      if (starredIds.length > 0) {
        const { data: opportunitiesData, error: oppError } = await supabase
          .from('opportunities')
          .select('*, profiles(id, name, role, genres_raw, email, bio)')
          .in('id', starredIds)
          .eq('status', 'active');

        if (oppError) {
          console.error('Error loading starred opportunities data:', oppError);
          return;
        }

        // Sort opportunities to match the order of starredIds (which is already sorted by created_at)
        const sortedOpportunities = starredIds
          .map(id => opportunitiesData?.find(opp => opp.id === id))
          .filter(Boolean); // Remove any undefined values

        setStarredOpportunitiesData(sortedOpportunities);
      } else {
        setStarredOpportunitiesData([]);
      }
    } catch (error) {
      console.error('Error loading starred opportunities:', error);
    }
  };

  // Star an opportunity
  const starOpportunity = async (opportunityId) => {
    if (!supabase || !savedProfileId) {
      showToast('Please log in to star opportunities', 'info');
      return;
    }

    try {
      const { error } = await supabase
        .from('starred_opportunities')
        .insert({ user_id: savedProfileId, opportunity_id: opportunityId });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          showToast('You have already starred this opportunity', 'info');
        } else if (error.message && error.message.includes('starred_opportunities')) {
          showToast('Starred opportunities feature is not available yet', 'error');
        } else {
          console.error('Error starring opportunity:', error);
          showToast('Failed to star opportunity', 'error');
        }
        return;
      }

      // Update local state
      setStarredOpportunities([...starredOpportunities, opportunityId]);

      // Reload starred opportunities data
      loadStarredOpportunities();

      showToast('Opportunity starred! View it on your dashboard.', 'success');
    } catch (error) {
      console.error('Error starring opportunity:', error);
      showToast('Failed to star opportunity', 'error');
    }
  };

  // Unstar an opportunity
  const unstarOpportunity = async (opportunityId) => {
    if (!supabase || !savedProfileId) return;

    try {
      const { error } = await supabase
        .from('starred_opportunities')
        .delete()
        .eq('user_id', savedProfileId)
        .eq('opportunity_id', opportunityId);

      if (error) {
        console.error('Error unstarring opportunity:', error);
        showToast('Failed to unstar opportunity', 'error');
        return;
      }

      // Update local state
      setStarredOpportunities(starredOpportunities.filter(id => id !== opportunityId));
      setStarredOpportunitiesData(starredOpportunitiesData.filter(opp => opp.id !== opportunityId));

      showToast('Opportunity unstarred', 'success');
    } catch (error) {
      console.error('Error unstarring opportunity:', error);
      showToast('Failed to unstar opportunity', 'error');
    }
  };

  // Create new opportunity
  const createOpportunity = async () => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    if (!savedProfileId) {
      showToast('Please log in or create a profile first to post opportunities', 'info');
      return;
    }

    // Validate required fields
    if (!opportunityForm.looking_for_role || !opportunityForm.location) {
      showToast('Please fill in all required fields (role and location)', 'error');
      return;
    }

    try {
      // Check how many opportunities the user has posted
      const { data: existingOpportunities, error: countError } = await supabase
        .from('opportunities')
        .select('id')
        .eq('user_id', savedProfileId)
        .eq('status', 'active');

      if (countError) {
        console.error('Error checking opportunity count:', countError);

        // Check if the error is about the table not existing
        if (countError.message && countError.message.includes('opportunities')) {
          showToast('Opportunities feature is not available yet. Please contact the administrator.', 'error');
          return;
        }

        throw new Error(`Failed to verify opportunity limit: ${countError.message}`);
      }

      // Limit to 2 opportunities per user
      if (existingOpportunities && existingOpportunities.length >= 2) {
        showToast('You have reached the maximum limit of 2 active opportunities. Please delete an existing opportunity first.', 'info');
        return;
      }

      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          user_id: savedProfileId,
          looking_for_role: opportunityForm.looking_for_role,
          location: opportunityForm.location,
          description: opportunityForm.description || '',
          genres: opportunityForm.genres || '',
          collab_type: opportunityForm.collab_type || '',
          status: 'active'
        }])
        .select();

      if (error) {
        console.error('Error inserting opportunity:', error);

        // Check if the error is about the table not existing
        if (error.message && error.message.includes('opportunities')) {
          showToast('Opportunities feature is not available yet. Please contact the administrator.', 'error');
          return;
        }

        throw error;
      }

      const remainingSlots = 2 - (existingOpportunities ? existingOpportunities.length : 0) - 1;
      showToast(`Opportunity posted successfully! You have ${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} remaining.`, 'success');
      setCurrentView(VIEWS.OPPORTUNITIES);
      loadOpportunities();
      setOpportunityForm({ looking_for_role: '', location: '', description: '', genres: '', collab_type: '' });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      showToast(`Failed to create opportunity: ${error.message}`, 'error');
    }
  };

  // Edit opportunity
  const updateOpportunity = async () => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    if (!editingOpportunityId) {
      showToast('No opportunity selected for editing', 'error');
      return;
    }

    // Validate required fields
    if (!opportunityForm.looking_for_role || !opportunityForm.location) {
      showToast('Please fill in all required fields (role and location)', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          looking_for_role: opportunityForm.looking_for_role,
          location: opportunityForm.location,
          description: opportunityForm.description || '',
          genres: opportunityForm.genres || '',
          collab_type: opportunityForm.collab_type || ''
        })
        .eq('id', editingOpportunityId)
        .eq('user_id', savedProfileId); // Security: ensure user owns this opportunity

      if (error) {
        console.error('Error updating opportunity:', error);
        throw error;
      }

      showToast('Opportunity updated successfully!', 'success');
      setEditingOpportunityId(null);
      setCurrentView(VIEWS.OPPORTUNITIES);
      loadOpportunities();
      setOpportunityForm({ looking_for_role: '', location: '', description: '', genres: '', collab_type: '' });
    } catch (error) {
      console.error('Error updating opportunity:', error);
      showToast(`Failed to update opportunity: ${error.message}`, 'error');
    }
  };

  // Delete opportunity
  const deleteOpportunity = async (opportunityId) => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this opportunity? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId)
        .eq('user_id', savedProfileId); // Security: ensure user owns this opportunity

      if (error) {
        console.error('Error deleting opportunity:', error);
        throw error;
      }

      showToast('Opportunity deleted successfully!', 'success');
      loadOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      showToast(`Failed to delete opportunity: ${error.message}`, 'error');
    }
  };

  // Start editing opportunity
  const startEditOpportunity = (opportunity) => {
    setEditingOpportunityId(opportunity.id);
    setOpportunityForm({
      looking_for_role: opportunity.looking_for_role,
      location: opportunity.location,
      description: opportunity.description || '',
      genres: opportunity.genres || '',
      collab_type: opportunity.collab_type || ''
    });
    setCurrentView(VIEWS.CREATE_OPPORTUNITY);
  };

  // View full profile of a connected user
  const viewConnectedUserProfile = async (userId) => {
    if (!supabase || !userId) return;

    try {
      // Save scroll position and previous view before navigating away
      if (currentView === VIEWS.BROWSE) {
        setBrowseScrollPosition(window.scrollY);
        setPreviousView(VIEWS.BROWSE);
      } else if (currentView === VIEWS.OPPORTUNITIES) {
        setOpportunitiesScrollPosition(window.scrollY);
        setPreviousView(VIEWS.OPPORTUNITIES);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile', 'error');
        return;
      }

      setSelectedProfile(data);
      incrementProfileViews(userId);
      setCurrentView(VIEWS.PROFILE_DETAIL);
    } catch (error) {
      console.error('Error viewing profile:', error);
      showToast('Failed to view profile', 'error');
    }
  };

  // Send collaboration invitation
  const sendInvitation = async (opportunityId, toUserId) => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    if (!savedProfileId) {
      showToast('Please log in or create a profile first to apply for opportunities', 'info');
      return;
    }

    try {
      // Check if there's ANY invitation between these two users (in either direction)
      // This prevents duplicate invitations regardless of opportunity or who sent first
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .or(`and(from_user_id.eq.${savedProfileId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${savedProfileId})`)
        .order('created_at', { ascending: false });

      if (checkError) {
        console.error('Error checking existing invitations:', checkError);

        // Check if the error is about the table not existing
        if (checkError.message && checkError.message.includes('invitations')) {
          showToast('Invitations feature is not available yet. Please contact the administrator.', 'error');
          return;
        }

        throw checkError;
      }

      // Check all invitations between these users
      if (existingInvitations && existingInvitations.length > 0) {
        // First check for accepted invitations
        const acceptedInvite = existingInvitations.find(inv => inv.status === 'accepted');
        if (acceptedInvite) {
          showToast('You already have an accepted collaboration with this user! Check your Inbox to see the collaboration details.', 'info');
          return;
        }

        // Check for pending invitations
        const pendingInvite = existingInvitations.find(inv => inv.status === 'pending');
        if (pendingInvite) {
          if (pendingInvite.from_user_id === savedProfileId) {
            if (pendingInvite.opportunity_id === opportunityId) {
              showToast('You already have a pending invitation for this opportunity. Please wait for the opportunity poster to respond.', 'info');
            } else {
              showToast('You already have a pending collaboration request with this user. Please wait for them to respond.', 'info');
            }
          } else {
            showToast('This user has already sent you a collaboration request! Check your Inbox to accept or decline it.', 'info');
          }
          return;
        }

        // Check for declined invitations for this specific opportunity
        const declinedInvite = existingInvitations.find(
          inv => inv.status === 'declined' &&
                 inv.from_user_id === savedProfileId &&
                 inv.opportunity_id === opportunityId
        );
        if (declinedInvite) {
          showToast('Your invitation for this opportunity was declined. You cannot send another invitation for this opportunity.', 'info');
          return;
        }
      }

      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          opportunity_id: opportunityId,
          from_user_id: savedProfileId,
          to_user_id: toUserId,
          status: 'pending',
          message: 'I would like to collaborate on this opportunity!'
        }])
        .select();

      if (error) {
        console.error('Error sending invitation:', error);
        throw error;
      }

      showToast('Collaboration request sent successfully! The opportunity poster will see your request in their "Received Invitations".', 'success');

      // Reload invitations to update UI with pending state
      loadInvitations();

      // Navigate back to opportunities view after sending
      setTimeout(() => {
        setCurrentView(VIEWS.OPPORTUNITIES);
      }, 1500);
    } catch (error) {
      console.error('Error sending invitation:', error);
      showToast(`Failed to send collaboration request: ${error.message}`, 'error');
    }
  };

  // Send direct collaboration request (not tied to an opportunity)
  const sendDirectCollabRequest = async (toUserId) => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    if (!savedProfileId) {
      showToast('Please log in or create a profile first to send collaboration requests', 'info');
      setCurrentView(VIEWS.LOGIN);
      return;
    }

    // Don't allow sending requests to yourself
    if (savedProfileId === toUserId) {
      showToast('You cannot send a collaboration request to yourself', 'info');
      return;
    }

    try {
      // Check if there's ANY invitation between these two users (in either direction)
      // This prevents duplicate invitations regardless of who sent first
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .or(`and(from_user_id.eq.${savedProfileId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${savedProfileId})`)
        .order('created_at', { ascending: false });

      if (checkError) {
        console.error('Error checking existing invitations:', checkError);
        throw checkError;
      }

      // Check all invitations between these users
      if (existingInvitations && existingInvitations.length > 0) {
        // Check for any pending or accepted invitation
        const pendingInvite = existingInvitations.find(inv => inv.status === 'pending');
        const acceptedInvite = existingInvitations.find(inv => inv.status === 'accepted');

        if (acceptedInvite) {
          showToast('You already have an accepted collaboration with this user! Check your Inbox to see the collaboration details.', 'info');
          return;
        }

        if (pendingInvite) {
          // Check who sent it
          if (pendingInvite.from_user_id === savedProfileId) {
            showToast('You already have a pending collaboration request with this user. Please wait for them to respond.', 'info');
          } else {
            showToast('This user has already sent you a collaboration request! Check your Inbox to accept or decline it.', 'info');
          }
          return;
        }

        // Check if user was declined before
        const declinedInvite = existingInvitations.find(
          inv => inv.status === 'declined' && inv.from_user_id === savedProfileId
        );
        if (declinedInvite) {
          showToast('Your previous collaboration request was declined by this user. You cannot send another request to this user.', 'info');
          return;
        }
      }

      // No existing invitation, proceed to send new one
      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          opportunity_id: null, // No opportunity, direct request
          from_user_id: savedProfileId,
          to_user_id: toUserId,
          status: 'pending',
          message: 'I would like to collaborate with you!'
        }])
        .select();

      if (error) {
        console.error('Error sending collaboration request:', error);

        // Check if the error is about the table not existing
        if (error.message && error.message.includes('invitations')) {
          showToast('Invitations feature is not available yet. Please contact the administrator.', 'error');
          return;
        }

        throw error;
      }

      showToast('Collaboration request sent successfully! The user will see your request in their "Received Invitations".', 'success');

      // Reload invitations to update UI with pending state
      loadInvitations();

      // Navigate back to browse or previous view after sending
      setTimeout(() => {
        if (previousView && previousView !== VIEWS.PROFILE_DETAIL) {
          setCurrentView(previousView);
        } else {
          setCurrentView(VIEWS.BROWSE);
        }
      }, 1500);
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      showToast(`Failed to send collaboration request: ${error.message}`, 'error');
    }
  };

  // Ensure URL has proper protocol (http:// or https://)
  const ensureUrlProtocol = (url) => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';

    // Check if URL already has a protocol
    if (trimmedUrl.match(/^https?:\/\//i)) {
      return trimmedUrl;
    }

    // Handle malformed URLs like "//example.com" by removing leading slashes
    const cleanedUrl = trimmedUrl.replace(/^\/+/, '');
    if (!cleanedUrl) return '';

    // Add https:// as default protocol
    return `https://${cleanedUrl}`;
  };

  // Check if current user is connected to another user
  // Connected means: has an accepted collaboration or accepted invitation
  const isConnectedToUser = (profileId, context = null) => {
    if (!currentUser || !profileId) return false;

    // Users can always see their own full profile
    if (currentUser.id === profileId) return true;

    // Check if viewing from invitation context (user sent invitation to current user)
    if (context?.type === 'invitation' && context?.fromUserId === profileId) {
      return true;
    }

    // Check if they have an accepted collaboration
    const hasCollaboration = collaborations.some(
      collab =>
        (collab.user1_id === profileId && collab.user2_id === currentUser.id) ||
        (collab.user2_id === profileId && collab.user1_id === currentUser.id)
    );
    if (hasCollaboration) return true;

    // Check if they have an ACCEPTED invitation between them (not pending)
    const hasAcceptedInvitation =
      myInvitations.some(
        inv => inv.from_user_id === profileId && inv.status === 'accepted'
      ) ||
      sentInvitations.some(
        inv => inv.to_user_id === profileId && inv.status === 'accepted'
      );

    return hasAcceptedInvitation;
  };

  // Check if profile is unlocked
  const isProfileUnlocked = (profile) => {
    if (!profile) return false;
    // Profile is unlocked if:
    // 1. Not in private mode, OR
    // 2. Current user is connected to this profile
    if (!profile.private_mode) return true;
    return isConnectedToUser(profile.id);
  };

  // Check if current user can see another user's email
  // Email is only visible after collaboration request is accepted
  const canSeeUserEmail = (profileId) => {
    if (!currentUser || !profileId) return false;

    // Users can always see their own email
    if (currentUser.id === profileId) return true;

    // Check if they have an ACCEPTED collaboration
    const hasAcceptedCollaboration = collaborations.some(
      collab =>
        (collab.user1_id === profileId && collab.user2_id === currentUser.id) ||
        (collab.user2_id === profileId && collab.user1_id === currentUser.id)
    );
    if (hasAcceptedCollaboration) return true;

    // Check if they have an ACCEPTED invitation (not pending)
    const hasAcceptedInvitation =
      myInvitations.some(
        inv => inv.from_user_id === profileId && inv.status === 'accepted'
      ) ||
      sentInvitations.some(
        inv => inv.to_user_id === profileId && inv.status === 'accepted'
      );

    return hasAcceptedInvitation;
  };

  // Check if current user can see another user's social links
  // Social links are visible after sending a collaboration request (including pending)
  const canSeeSocialLinks = (profileId) => {
    if (!currentUser || !profileId) return false;

    // Users can always see their own social links
    if (currentUser.id === profileId) return true;

    // Check if they have an accepted collaboration
    const hasAcceptedCollaboration = collaborations.some(
      collab =>
        (collab.user1_id === profileId && collab.user2_id === currentUser.id) ||
        (collab.user2_id === profileId && collab.user1_id === currentUser.id)
    );
    if (hasAcceptedCollaboration) return true;

    // Check if they have any invitation between them (pending or accepted)
    // Social links become visible when current user sends a request
    const hasSentInvitation = sentInvitations.some(
      inv => inv.to_user_id === profileId &&
             (inv.status === 'pending' || inv.status === 'accepted')
    );
    if (hasSentInvitation) return true;

    // Also check if they received an invitation (for symmetry)
    const hasReceivedInvitation = myInvitations.some(
      inv => inv.from_user_id === profileId &&
             (inv.status === 'pending' || inv.status === 'accepted')
    );

    return hasReceivedInvitation;
  };

  // Get collaboration badge based on accepted collabs count
  const getCollabBadge = (collabCount) => {
    if (collabCount >= 40) {
      return {
        level: 'Orange',
        color: 'from-orange-400 to-red-500',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-400/50',
        bgColor: 'bg-orange-500/20',
        icon: Award
      };
    } else if (collabCount >= 20) {
      return {
        level: 'Gold',
        color: 'from-yellow-400 to-amber-500',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-400/50',
        bgColor: 'bg-yellow-500/20',
        icon: Award
      };
    } else if (collabCount >= 10) {
      return {
        level: 'Purple',
        color: 'from-purple-400 to-violet-500',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-400/50',
        bgColor: 'bg-purple-500/20',
        icon: Award
      };
    } else if (collabCount >= 4) {
      return {
        level: 'Blue',
        color: 'from-blue-400 to-cyan-500',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-400/50',
        bgColor: 'bg-blue-500/20',
        icon: Award
      };
    }
    return null;
  };

  // Calculate membership duration
  const getMembershipDuration = (createdAt) => {
    if (!createdAt) return null;

    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate years, months, and days
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    // Return appropriate format based on duration
    if (years > 0) {
      if (years === 1) {
        return `${years} year${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
      }
      return `${years} years`;
    } else if (months > 0) {
      if (months === 1) {
        return `${months} month${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
      }
      return `${months} months`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // Filter invitations by date
  const filterInvitationsByDate = (invitations) => {
    if (invitationDateFilter === 'all') return invitations;

    const now = new Date();
    const filtered = invitations.filter(inv => {
      const invDate = new Date(inv.created_at);
      const diffTime = Math.abs(now - invDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (invitationDateFilter === 'today') return diffDays <= 1;
      if (invitationDateFilter === 'week') return diffDays <= 7;
      if (invitationDateFilter === 'month') return diffDays <= 30;

      return true;
    });

    return filtered;
  };

  // Paginate invitations
  const paginateInvitations = (invitations, page) => {
    const startIndex = (page - 1) * INVITATIONS_PER_PAGE;
    const endIndex = startIndex + INVITATIONS_PER_PAGE;
    return invitations.slice(startIndex, endIndex);
  };

  // Get total pages for invitations
  const getTotalPages = (invitations) => {
    return Math.ceil(invitations.length / INVITATIONS_PER_PAGE);
  };

  // Filter collaborations by genre and location (with safety checks)
  const filterCollaborations = (collabs) => {
    let filtered = collabs;

    if (collabGenreFilter) {
      filtered = filtered.filter(collab => {
        // Safety check: ensure collab and users exist
        if (!collab || !collab.user1 || !collab.user2) return false;
        const otherUser = collab.user1_id === savedProfileId ? collab.user2 : collab.user1;
        // Safety check: ensure otherUser exists and has genres_raw
        if (!otherUser || !otherUser.genres_raw) return false;
        return otherUser.genres_raw.toLowerCase().includes(collabGenreFilter.toLowerCase());
      });
    }

    if (collabLocationFilter) {
      filtered = filtered.filter(collab => {
        // Safety check: ensure collab and users exist
        if (!collab || !collab.user1 || !collab.user2) return false;
        const otherUser = collab.user1_id === savedProfileId ? collab.user2 : collab.user1;
        // Safety check: ensure otherUser exists and has location
        if (!otherUser || !otherUser.location) return false;
        return otherUser.location.toLowerCase().includes(collabLocationFilter.toLowerCase());
      });
    }

    return filtered;
  };

  // Custom group management functions
  const addCustomGroup = (name) => {
    const newGroup = {
      id: Date.now().toString(),
      name: name,
      collaborators: []
    };
    setCustomGroups([...customGroups, newGroup]);
    setNewGroupName('');
  };

  const deleteCustomGroup = (groupId) => {
    setCustomGroups(customGroups.filter(g => g.id !== groupId));
  };

  const addCollabToGroup = (groupId, collabId) => {
    setCustomGroups(customGroups.map(group => {
      if (group.id === groupId) {
        if (!group.collaborators.includes(collabId)) {
          return { ...group, collaborators: [...group.collaborators, collabId] };
        }
      }
      return group;
    }));
  };

  const removeCollabFromGroup = (groupId, collabId) => {
    setCustomGroups(customGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, collaborators: group.collaborators.filter(id => id !== collabId) };
      }
      return group;
    }));
  };

  // Export group collaborators to text file
  const exportGroupToFile = (group) => {
    // Get all collaborators in this group
    const groupCollabs = (collaborations || []).filter(collab =>
      group.collaborators.includes(collab.id)
    );

    if (groupCollabs.length === 0) {
      showToast('This group has no collaborators to export', 'info');
      return;
    }

    // Build the text content
    let textContent = `CollabX - ${group.name}\n`;
    textContent += `=`.repeat(50) + `\n\n`;
    textContent += `Exported on: ${new Date().toLocaleString()}\n`;
    textContent += `Total Collaborators: ${groupCollabs.length}\n\n`;
    textContent += `=`.repeat(50) + `\n\n`;

    groupCollabs.forEach((collab, index) => {
      const otherUser = collab.user1_id === savedProfileId ? collab.user2 : collab.user1;

      textContent += `${index + 1}. ${otherUser.name}\n`;
      textContent += `-`.repeat(50) + `\n`;
      textContent += `Role: ${otherUser.role || 'N/A'}\n`;
      textContent += `Email: ${otherUser.email || 'N/A'}\n`;
      textContent += `Location: ${otherUser.location || 'N/A'}\n`;
      textContent += `Genres: ${otherUser.genres_raw || 'N/A'}\n`;

      if (otherUser.skills_raw) {
        textContent += `Skills: ${otherUser.skills_raw}\n`;
      }

      if (otherUser.experience_level) {
        textContent += `Experience: ${otherUser.experience_level}\n`;
      }

      if (otherUser.collab_type) {
        textContent += `Collaboration Type: ${otherUser.collab_type}\n`;
      }

      if (otherUser.social_links) {
        textContent += `Social Links: ${otherUser.social_links}\n`;
      }

      textContent += `\n`;
    });

    textContent += `=`.repeat(50) + `\n`;
    textContent += `End of ${group.name} - Generated by CollabX\n`;

    // Create and download the file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CollabX_${group.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Load user's current profile
  const loadCurrentUser = async () => {
    if (!supabase || !savedProfileId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', savedProfileId)
        .single();

      if (error) throw error;
      setCurrentUser(data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  // Load invitations
  const loadInvitations = async () => {
    if (!supabase || !savedProfileId) {
      console.log('loadInvitations: Missing supabase or savedProfileId');
      return;
    }
    setIsLoadingInvitations(true);
    setInvitationsError(null);
    console.log('Loading invitations for profile:', savedProfileId);

    try {
      // Load received invitations
      const { data: received, error: receivedError } = await supabase
        .from('invitations')
        .select('*, from_user:profiles!invitations_from_user_id_fkey(name, role, genres_raw, bio), opportunity:opportunities(looking_for_role, location)')
        .eq('to_user_id', savedProfileId)
        .order('created_at', { ascending: false });

      if (receivedError) {
        console.error('Error loading received invitations:', receivedError);
        console.error('Error details:', {
          message: receivedError.message,
          details: receivedError.details,
          hint: receivedError.hint,
          code: receivedError.code
        });
        setInvitationsError(`Failed to load invitations: ${receivedError.message}`);
        // Set to empty array on error to prevent rendering issues
        setMyInvitations([]);
      } else {
        console.log('Loaded received invitations:', received?.length || 0);
        setMyInvitations(received || []);
      }

      // Load sent invitations
      const { data: sent, error: sentError } = await supabase
        .from('invitations')
        .select('*, to_user:profiles!invitations_to_user_id_fkey(name, role, bio), opportunity:opportunities(looking_for_role, location)')
        .eq('from_user_id', savedProfileId)
        .order('created_at', { ascending: false });

      if (sentError) {
        console.error('Error loading sent invitations:', sentError);
        console.error('Error details:', {
          message: sentError.message,
          details: sentError.details,
          hint: sentError.hint,
          code: sentError.code
        });
        setInvitationsError(`Failed to load sent invitations: ${sentError.message}`);
        // Set to empty array on error to prevent rendering issues
        setSentInvitations([]);
      } else {
        console.log('Loaded sent invitations:', sent?.length || 0);
        setSentInvitations(sent || []);
      }
    } catch (error) {
      console.error('Error loading invitations (catch block):', error);
      setInvitationsError(`Unexpected error loading invitations: ${error.message}`);
      // Ensure arrays are set even on unexpected errors
      setMyInvitations([]);
      setSentInvitations([]);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  // Load collaborations (accepted invitations with user info)
  const loadCollaborations = async () => {
    if (!supabase || !savedProfileId) {
      console.log('loadCollaborations: Missing supabase or savedProfileId');
      return;
    }
    setIsLoadingCollaborations(true);
    setCollaborationsError(null);
    console.log('Loading collaborations for profile:', savedProfileId);

    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          user1:profiles!collaborations_user1_id_fkey(id, name, role, email, genres_raw, location, skills_raw, experience_level, collab_type, social_links, bio),
          user2:profiles!collaborations_user2_id_fkey(id, name, role, email, genres_raw, location, skills_raw, experience_level, collab_type, social_links, bio),
          invitation:invitations(opportunity_id, message, created_at)
        `)
        .or(`user1_id.eq.${savedProfileId},user2_id.eq.${savedProfileId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading collaborations:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setCollaborationsError(`Failed to load collaborations: ${error.message}`);
        // Set to empty array on any error to prevent rendering issues
        setCollaborations([]);
      } else {
        console.log('Loaded collaborations:', data?.length || 0);
        setCollaborations(data || []);
      }
    } catch (error) {
      console.error('Error loading collaborations (catch block):', error);
      setCollaborationsError(`Unexpected error loading collaborations: ${error.message}`);
      setCollaborations([]);
    } finally {
      setIsLoadingCollaborations(false);
    }
  };

  // Check if user has a pending invitation for an opportunity
  const hasPendingInvitationForOpportunity = (opportunityId, toUserId) => {
    return sentInvitations.some(
      inv => inv.opportunity_id === opportunityId &&
             inv.to_user_id === toUserId &&
             inv.status === 'pending'
    );
  };

  // Check if user has a pending direct collaboration request (no opportunity)
  const hasPendingDirectCollabRequest = (toUserId) => {
    return sentInvitations.some(
      inv => !inv.opportunity_id &&
             inv.to_user_id === toUserId &&
             inv.status === 'pending'
    );
  };

  // Check if two users are already connected (have accepted invitation or active collaboration)
  const areUsersConnected = (userId) => {
    if (!savedProfileId || !userId) return false;

    // Check if they have an accepted invitation
    const hasAcceptedInvitation = [...myInvitations, ...sentInvitations].some(
      inv => ((inv.from_user_id === savedProfileId && inv.to_user_id === userId) ||
              (inv.to_user_id === savedProfileId && inv.from_user_id === userId)) &&
             inv.status === 'accepted'
    );

    // Check if they have an active collaboration
    const hasCollaboration = collaborations.some(
      collab => (collab.user1_id === userId || collab.user2_id === userId)
    );

    return hasAcceptedInvitation || hasCollaboration;
  };

  // Get collaboration status for a starred opportunity
  const getCollaborationStatusForOpportunity = (opportunity) => {
    if (!opportunity) return { status: 'none', message: 'No collaboration yet' };

    const opportunityOwnerId = opportunity.user_id;

    // Check sent invitations (user applied to this opportunity)
    const sentInvitation = sentInvitations.find(
      inv => inv.opportunity_id === opportunity.id
    );

    // Check received invitations (opportunity owner invited user)
    const receivedInvitation = myInvitations.find(
      inv => inv.opportunity_id === opportunity.id
    );

    // Check if there's an active collaboration with the opportunity owner
    const activeCollaboration = collaborations.find(
      collab =>
        (collab.user1_id === savedProfileId && collab.user2_id === opportunityOwnerId) ||
        (collab.user2_id === savedProfileId && collab.user1_id === opportunityOwnerId)
    );

    if (activeCollaboration) {
      return { status: 'collaborated', message: 'Active collaboration', collaboration: activeCollaboration };
    }

    if (sentInvitation) {
      if (sentInvitation.status === 'pending') {
        return { status: 'pending_sent', message: 'Your application is pending', invitation: sentInvitation };
      } else if (sentInvitation.status === 'accepted') {
        return { status: 'accepted', message: 'Your application was accepted', invitation: sentInvitation };
      } else if (sentInvitation.status === 'rejected') {
        return { status: 'rejected', message: 'Your application was not accepted', invitation: sentInvitation };
      }
    }

    if (receivedInvitation) {
      if (receivedInvitation.status === 'pending') {
        return { status: 'pending_received', message: 'You have a pending invitation', invitation: receivedInvitation };
      } else if (receivedInvitation.status === 'accepted') {
        return { status: 'accepted', message: 'You accepted this invitation', invitation: receivedInvitation };
      } else if (receivedInvitation.status === 'rejected') {
        return { status: 'rejected', message: 'You declined this invitation', invitation: receivedInvitation };
      }
    }

    return { status: 'none', message: 'No collaboration yet' };
  };

  // Toggle private mode
  const togglePrivateMode = async () => {
    if (!supabase) {
      showToast('Database connection not available', 'error');
      return;
    }

    if (!savedProfileId || !currentUser) {
      showToast('Please log in to change privacy settings', 'info');
      return;
    }

    try {
      // Ensure private_mode has a boolean value (default to false if undefined)
      const currentPrivateMode = currentUser.private_mode === true;
      const newPrivateMode = !currentPrivateMode;

      const { error } = await supabase
        .from('profiles')
        .update({ private_mode: newPrivateMode })
        .eq('id', savedProfileId);

      if (error) {
        console.error('Error toggling private mode:', error);

        // Check if the error is about the column not existing
        if (error.message && error.message.includes('private_mode')) {
          showToast('Private mode feature is not available yet. Please contact the administrator.', 'error');
          return;
        }

        throw error;
      }

      setCurrentUser({ ...currentUser, private_mode: newPrivateMode });
      showToast(`Private mode ${newPrivateMode ? 'enabled' : 'disabled'}!`, 'success');

      // Reload current user to ensure state is synced
      await loadCurrentUser();
    } catch (error) {
      console.error('Error toggling private mode:', error);
      showToast(`Failed to update privacy settings: ${error.message}`, 'error');
    }
  };

  // Increment profile views when someone clicks to view a profile
  const incrementProfileViews = async (profileId) => {
    if (!supabase || !profileId) return;

    // Don't increment views for viewing your own profile
    if (profileId === savedProfileId) return;

    try {
      // Get current profile views count
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('profile_views')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        // If profile_views column doesn't exist, silently fail
        if (fetchError.message && fetchError.message.includes('profile_views')) {
          console.log('Profile views tracking not available (extended schema not applied)');
          return;
        }
        throw fetchError;
      }

      // Increment the count
      const newCount = (profile.profile_views || 0) + 1;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_views: newCount })
        .eq('id', profileId);

      if (updateError) {
        console.error('Error incrementing profile views:', updateError);
      }
    } catch (error) {
      console.error('Error tracking profile view:', error);
      // Fail silently - don't disrupt user experience
    }
  };

  // Accept invitation
  const acceptInvitation = async (invitationId, fromUserId) => {
    if (!supabase || !savedProfileId) return;

    try {
      console.log('Accepting invitation:', invitationId, 'from user:', fromUserId);

      // Update invitation status
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Error updating invitation status:', updateError);
        throw updateError;
      }

      console.log('Invitation status updated to accepted');

      // Create collaboration record
      const { error: collabError } = await supabase
        .from('collaborations')
        .insert([{
          invitation_id: invitationId,
          user1_id: fromUserId,
          user2_id: savedProfileId,
          verified: false,
          completed: false
        }]);

      if (collabError) {
        console.error('Error creating collaboration:', collabError);
        throw collabError;
      }

      console.log('Collaboration record created');

      // Increment accepted_collabs for both users
      try {
        await supabase.rpc('increment_accepted_collabs', { user_id: fromUserId });
        await supabase.rpc('increment_accepted_collabs', { user_id: savedProfileId });
        console.log('Accepted collabs incremented for both users');
      } catch (rpcError) {
        console.warn('Error incrementing accepted_collabs (non-critical):', rpcError);
        // Continue even if RPC fails - not critical
      }

      showToast('Invitation accepted! Check your Inbox to see the collaborator\'s full information.', 'success');

      // Reload data to reflect changes
      console.log('Reloading invitations and collaborations...');
      await Promise.all([
        loadInvitations(),
        loadCollaborations(),
        loadCurrentUser()
      ]);

      console.log('Data reloaded successfully');

      // Navigate to inbox to see the accepted collaboration if not already there
      if (currentView !== VIEWS.INBOX) {
        console.log('Navigating to INBOX view');
        setCurrentView(VIEWS.INBOX);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      showToast('Failed to accept invitation. Please try again.', 'error');
    }
  };

  // Reject invitation (updates status to declined so sender can see)
  const rejectInvitation = async (invitationId, fromUserId) => {
    if (!supabase) return;

    try {
      // Update invitation status to 'declined' instead of deleting
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;

      showToast('Invitation declined. The sender has been notified.', 'success');
      loadInvitations();

      // Navigate to inbox if not already there
      if (currentView !== VIEWS.INBOX) {
        setTimeout(() => {
          setCurrentView(VIEWS.INBOX);
        }, 1000);
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      showToast('Failed to decline invitation. Please try again.', 'error');
    }
  };

  // Filter opportunities
  const applyOpportunityFilters = () => {
    let filtered = [...opportunities];

    // Filter out user's own opportunities from browse view
    if (savedProfileId) {
      filtered = filtered.filter(opp => opp.user_id !== savedProfileId);
    }

    if (opportunityFilters.role) {
      filtered = filtered.filter(opp =>
        opp.looking_for_role?.toLowerCase().includes(opportunityFilters.role.toLowerCase())
      );
    }

    if (opportunityFilters.location) {
      filtered = filtered.filter(opp =>
        opp.location?.toLowerCase().includes(opportunityFilters.location.toLowerCase())
      );
    }

    if (opportunityFilters.genres) {
      filtered = filtered.filter(opp =>
        opp.genres?.toLowerCase().includes(opportunityFilters.genres.toLowerCase())
      );
    }

    if (opportunityFilters.collab_type) {
      filtered = filtered.filter(opp =>
        opp.collab_type?.toLowerCase() === opportunityFilters.collab_type.toLowerCase()
      );
    }

    setFilteredOpportunities(filtered);
  };

  // Apply filters when opportunities or filters change
  useEffect(() => {
    applyOpportunityFilters();
  }, [opportunities, opportunityFilters, savedProfileId]);

  // Render dashboard page
  const renderDashboard = () => {
    console.log('renderDashboard() called');
    console.log('currentUser:', currentUser);
    console.log('savedProfileId:', savedProfileId);

    // Show loading state if currentUser is not loaded yet
    if (!currentUser && savedProfileId) {
      console.log('Showing loading state - currentUser is null but savedProfileId exists');
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    // Get user badge if they have enough collabs
    const userBadge = currentUser ? getCollabBadge(currentUser.accepted_collabs || 0) : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header with Solar System Animation */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                CollabX
              </h1>
              <Users className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-white/70 mb-2 text-lg">Where Creators Connect & Collaborate</p>
            <p className="text-white/50 text-sm">Welcome back, {currentUser?.name || 'Creator'}!</p>

            {/* Solar System Animation */}
            <div className="flex justify-center mb-8">
              <div className="solar-system">
                <div className="sun"></div>

                <div className="orbit orbit-1">
                  <div className="planet planet-1"></div>
                </div>

                <div className="orbit orbit-2">
                  <div className="planet planet-2"></div>
                </div>

                <div className="orbit orbit-3">
                  <div className="planet planet-3"></div>
                </div>

                <div className="orbit orbit-4">
                  <div className="planet planet-4"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView(VIEWS.SETTINGS)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setCurrentView(VIEWS.INBOX);
                  const currentInvitationCount = myInvitations.filter(inv => inv.status === 'pending').length;
                  // Mark inbox as viewed and store current count
                  setHasViewedInbox(true);
                  setLastViewedInvitationCount(currentInvitationCount);
                  localStorage.setItem('hasViewedInbox', 'true');
                  localStorage.setItem('lastViewedInvitationCount', currentInvitationCount.toString());
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg inline-flex items-center gap-2 relative"
              >
                <Mail className="w-5 h-5" />
                Inbox
                {(() => {
                  const pendingCount = myInvitations.filter(inv => inv.status === 'pending').length;
                  const hasNewInvitations = pendingCount > lastViewedInvitationCount || !hasViewedInbox;
                  return hasNewInvitations && pendingCount > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {pendingCount}
                    </span>
                  ) : null;
                })()}
              </button>
              <button
                onClick={() => {
                  setCurrentView(VIEWS.BROWSE);
                  loadProfiles();
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Browse Profiles
              </button>
              <button
                onClick={() => {
                  setCurrentView(VIEWS.OPPORTUNITIES);
                  loadOpportunities();
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Opportunities
              </button>
              <button
                onClick={() => setCurrentView(VIEWS.HELP)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Help
              </button>
            </div>
          </div>

          {/* Profile Status Card */}
          {currentUser && (
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <UserAvatar user={currentUser} size="2xl" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2 flex-wrap">
                      {currentUser.name}
                      {userBadge && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${userBadge.bgColor} border-2 ${userBadge.borderColor}`}>
                          <Award className={`w-5 h-5 ${userBadge.textColor}`} />
                          <span className={`text-sm font-bold ${userBadge.textColor}`}>{userBadge.level} CollabX</span>
                        </div>
                      )}
                    </h2>
                    <div className="flex items-center gap-2">
                      <RoleIcon role={currentUser.role} className="w-5 h-5 text-purple-300" />
                      <p className="text-purple-300 text-lg capitalize">{currentUser.role}</p>
                    </div>
                  <div className="flex items-center gap-4 mt-2">
                    {userBadge && (
                      <p className="text-white/50 text-sm">
                        {currentUser.accepted_collabs} successful collaboration{currentUser.accepted_collabs !== 1 ? 's' : ''}
                      </p>
                    )}
                    {getMembershipDuration(currentUser.created_at) && (
                      <p className="text-cyan-400 text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Member for {getMembershipDuration(currentUser.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Profile Completion</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all"
                        style={{ width: `${currentUser.profile_completion_percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-white font-bold">{currentUser.profile_completion_percentage || 0}%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Accepted Collabs</p>
                  <p className="text-white text-2xl font-bold">{currentUser.accepted_collabs || 0}</p>
                  {!userBadge && currentUser.accepted_collabs < 4 && (
                    <p className="text-white/40 text-xs">Need {4 - (currentUser.accepted_collabs || 0)} more for Blue badge</p>
                  )}
                  {userBadge && userBadge.level === 'Blue' && (
                    <p className="text-blue-300 text-xs">Next: Purple badge at 10</p>
                  )}
                  {userBadge && userBadge.level === 'Purple' && (
                    <p className="text-purple-300 text-xs">Next: Gold badge at 20</p>
                  )}
                  {userBadge && userBadge.level === 'Gold' && (
                    <p className="text-yellow-300 text-xs">Next: Orange badge at 40</p>
                  )}
                  {userBadge && userBadge.level === 'Orange' && (
                    <p className="text-orange-400 text-xs">Max badge achieved! 🎉</p>
                  )}
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1">Profile Views</p>
                  <p className="text-white text-2xl font-bold">{currentUser.profile_views || 0}</p>
                  <p className="text-white/40 text-xs">Total profile clicks</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Received Invitations
                  </p>
                  <p className="text-white text-2xl font-bold">{myInvitations.length}</p>
                  <p className="text-white/40 text-xs">
                    {myInvitations.filter(inv => inv.status === 'pending').length} pending
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                    <Send className="w-4 h-4" />
                    Sent Invitations
                  </p>
                  <p className="text-white text-2xl font-bold">{sentInvitations.length}</p>
                  <p className="text-white/40 text-xs">
                    {sentInvitations.filter(inv => inv.status === 'pending').length} pending
                  </p>
                </div>
              </div>

              {/* Private Mode Toggle */}
              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {currentUser.private_mode ? (
                      <EyeOff className="w-5 h-5 text-purple-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-purple-300" />
                    )}
                    <p className="text-white font-semibold">Private Mode</p>
                  </div>
                  <p className="text-white/60 text-sm">
                    {currentUser.private_mode
                      ? 'Your profile is hidden from other users'
                      : 'Your profile is visible to other users'}
                  </p>
                </div>
                <button
                  onClick={togglePrivateMode}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentUser.private_mode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {currentUser.private_mode ? 'Enable Visibility' : 'Go Private'}
                </button>
              </div>
            </div>
          )}

          {/* Date Filter for Invitations */}
          <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Filter by Date:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'today', 'week', 'month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setInvitationDateFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    invitationDateFilter === filter
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Invitations Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Received Invitations */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowReceivedInvitations(!showReceivedInvitations)}
              >
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Received Invitations ({filterInvitationsByDate(myInvitations).length})
                </h3>
                {showReceivedInvitations ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </div>

              {showReceivedInvitations && (
                <>
                  {isLoadingInvitations ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                  ) : filterInvitationsByDate(myInvitations).length === 0 ? (
                    <p className="text-white/60 text-center py-8">No invitations match the filter.</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {paginateInvitations(filterInvitationsByDate(myInvitations), receivedInvitationsPage).map((invitation) => (
                        <div key={invitation.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <button
                                onClick={() => {
                                  setPreviousView(VIEWS.INBOX);
                                  setSelectedProfile(invitation.from_user);
                                  setCurrentView(VIEWS.PROFILE_DETAIL);
                                }}
                                className="text-white font-semibold hover:text-purple-300 transition-colors text-left"
                              >
                                {invitation.from_user?.name || 'Someone'}
                              </button>
                              <div className="flex items-center gap-2">
                                <RoleIcon role={invitation.from_user?.role} className="w-4 h-4 text-purple-300" />
                                <p className="text-purple-300 text-sm capitalize">{invitation.from_user?.role || 'Collaborator'}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                              invitation.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                              invitation.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                              invitation.status === 'declined' ? 'bg-red-500/20 text-red-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {invitation.status}
                            </span>
                          </div>
                          {invitation.opportunity ? (
                            <div className="mt-2 mb-3 p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg">
                              <p className="text-white/60 text-xs mb-1">
                                <Briefcase className="w-3 h-3 inline mr-1" />
                                For your opportunity
                              </p>
                              <p className="text-white text-sm font-semibold">
                                Looking for: {invitation.opportunity.looking_for_role}
                              </p>
                              {invitation.opportunity.location && (
                                <p className="text-white/70 text-xs mt-1">
                                  📍 {invitation.opportunity.location}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-white/60 text-sm mb-3">
                              Direct collaboration request
                            </p>
                          )}
                          {invitation.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  acceptInvitation(invitation.id, invitation.from_user_id);
                                }}
                                disabled={isLoadingInvitations}
                                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Accept
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  rejectInvitation(invitation.id);
                                }}
                                disabled={isLoadingInvitations}
                                className="flex-1 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls for Received Invitations */}
                    {getTotalPages(filterInvitationsByDate(myInvitations)) > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => setReceivedInvitationsPage(Math.max(1, receivedInvitationsPage - 1))}
                          disabled={receivedInvitationsPage === 1}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                            receivedInvitationsPage === 1
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        <span className="text-white/70 text-sm">
                          Page {receivedInvitationsPage} of {getTotalPages(filterInvitationsByDate(myInvitations))}
                        </span>
                        <button
                          onClick={() => setReceivedInvitationsPage(Math.min(getTotalPages(filterInvitationsByDate(myInvitations)), receivedInvitationsPage + 1))}
                          disabled={receivedInvitationsPage === getTotalPages(filterInvitationsByDate(myInvitations))}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                            receivedInvitationsPage === getTotalPages(filterInvitationsByDate(myInvitations))
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Sent Invitations */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowSentInvitations(!showSentInvitations)}
              >
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Sent Invitations ({filterInvitationsByDate(sentInvitations).length})
                </h3>
                {showSentInvitations ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </div>

              {showSentInvitations && (
                <>
                  {isLoadingInvitations ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                  ) : filterInvitationsByDate(sentInvitations).length === 0 ? (
                    <p className="text-white/60 text-center py-8">No invitations match the filter.</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {paginateInvitations(filterInvitationsByDate(sentInvitations), sentInvitationsPage).map((invitation) => (
                          <div key={invitation.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <button
                                  onClick={() => {
                                    setPreviousView(VIEWS.INBOX);
                                    setSelectedProfile(invitation.to_user);
                                    setCurrentView(VIEWS.PROFILE_DETAIL);
                                  }}
                                  className="text-white font-semibold hover:text-purple-300 transition-colors text-left"
                                >
                                  {invitation.to_user?.name || 'Someone'}
                                </button>
                                <div className="flex items-center gap-2">
                                  <RoleIcon role={invitation.to_user?.role} className="w-4 h-4 text-purple-300" />
                                  <p className="text-purple-300 text-sm capitalize">{invitation.to_user?.role || 'Collaborator'}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                invitation.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                                invitation.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                                invitation.status === 'declined' ? 'bg-red-500/20 text-red-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {invitation.status}
                              </span>
                            </div>
                            {invitation.opportunity ? (
                              <div className="mt-2 p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-lg">
                                <p className="text-white/60 text-xs mb-1">
                                  <Briefcase className="w-3 h-3 inline mr-1" />
                                  For their opportunity
                                </p>
                                <p className="text-white text-sm font-semibold">
                                  Looking for: {invitation.opportunity.looking_for_role}
                                </p>
                                {invitation.opportunity.location && (
                                  <p className="text-white/70 text-xs mt-1">
                                    📍 {invitation.opportunity.location}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-white/60 text-sm mt-2">
                                Direct collaboration request
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls for Sent Invitations */}
                      {getTotalPages(filterInvitationsByDate(sentInvitations)) > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <button
                            onClick={() => setSentInvitationsPage(Math.max(1, sentInvitationsPage - 1))}
                            disabled={sentInvitationsPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                              sentInvitationsPage === 1
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                          <span className="text-white/70 text-sm">
                            Page {sentInvitationsPage} of {getTotalPages(filterInvitationsByDate(sentInvitations))}
                          </span>
                          <button
                            onClick={() => setSentInvitationsPage(Math.min(getTotalPages(filterInvitationsByDate(sentInvitations)), sentInvitationsPage + 1))}
                            disabled={sentInvitationsPage === getTotalPages(filterInvitationsByDate(sentInvitations))}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                              sentInvitationsPage === getTotalPages(filterInvitationsByDate(sentInvitations))
                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Settings Page
  const renderSettingsPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentView(VIEWS.DASHBOARD)}
            className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <Settings className="w-10 h-10" />
              Profile Settings
            </h1>

            {/* Profile Edit Form */}
            {(
              <div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <p className="text-green-300 font-semibold">Access code verified! You can now edit your profile.</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="artist">Artist</option>
                      <option value="producer">Producer</option>
                      <option value="songwriter">Songwriter</option>
                      <option value="dj">DJ</option>
                      <option value="promoter">Promoter</option>
                      <option value="pr">PR</option>
                      <option value="fan">Fan</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself - your hobbies, instruments you play, top 3 artists you like, etc."
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                    />
                  </div>

                  {/* Genres */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Genres (comma-separated) *</label>
                    <input
                      type="text"
                      name="genres_raw"
                      value={formData.genres_raw}
                      onChange={handleInputChange}
                      placeholder="e.g., Hip Hop, R&B, Pop"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Skills (comma-separated) *</label>
                    <input
                      type="text"
                      name="skills_raw"
                      value={formData.skills_raw}
                      onChange={handleInputChange}
                      placeholder="e.g., Mixing, Mastering, Vocals"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Experience Level *</label>
                    <select
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Availability *</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
                      required
                    >
                      <option value="">Select availability</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="weekends">Weekends</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  {/* Collaboration Type */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Collaboration Type *</label>
                    <select
                      name="collab_type"
                      value={formData.collab_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
                      required
                    >
                      <option value="">Select collaboration type</option>
                      <option value="remote">Remote</option>
                      <option value="in-person">In-person</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-white mb-2 font-semibold">Social Links (comma-separated) *</label>
                    <input
                      type="text"
                      name="social_links"
                      value={formData.social_links}
                      onChange={handleInputChange}
                      placeholder="e.g., instagram.com/artist, soundcloud.com/artist"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView(VIEWS.DASHBOARD);
                      }}
                      className="flex-1 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                {/* Account Actions Section */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Account Actions
                  </h2>

                  <div className="space-y-4">
                    {/* Sign Out Button */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-400" />
                            Sign Out
                          </h3>
                          <p className="text-white/70 text-sm">
                            Sign out of your account and return to the introduction page. You can sign back in anytime.
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <Unlock className="w-5 h-5" />
                          Sign Out
                        </button>
                      </div>
                    </div>

                    {/* Delete Account Button */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            Delete Account
                          </h3>
                          <p className="text-white/70 text-sm">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render login page
  const renderLoginPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => setCurrentView(VIEWS.AUTH_CHOICE)}
            className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70">Login to your CollabX account</p>
            </div>

            {!supabase && (
              <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-200 font-semibold text-sm">Configuration Required</p>
                  <p className="text-yellow-200/80 text-sm mt-1">
                    Database connection is not available. Login will not work until this is configured.
                  </p>
                </div>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthLogin('google', 'signin')}
                disabled={isAuthProcessing || !supabase}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuthLogin('azure', 'signin')}
                disabled={isAuthProcessing || !supabase}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Continue with Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-white/50 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin(loginEmail, loginPassword)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {authError && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{authError}</p>
              </div>
            )}

            {authSuccess && (
              <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <p className="text-green-200 text-sm">{authSuccess}</p>
              </div>
            )}

            <button
              onClick={() => handleEmailLogin(loginEmail, loginPassword)}
              disabled={!loginEmail || !loginPassword || isAuthProcessing || !supabase}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                !loginEmail || !loginPassword || isAuthProcessing || !supabase
                  ? 'bg-white/5 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
              }`}
            >
              {isAuthProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm mb-3">Don't have an account?</p>
              <button
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setCurrentView(VIEWS.SIGNUP);
                }}
                className="text-purple-300 hover:text-purple-200 font-semibold text-sm flex items-center justify-center gap-2 mx-auto"
              >
                Create New Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render how to use page
  // Render help page
  const renderHelpPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-6xl mx-auto py-8">
          <button
            onClick={() => {
              setCurrentView(VIEWS.DASHBOARD);
              setHelpSubpage('main');
            }}
            className="mb-6 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Dashboard
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Help & Support</h1>
            </div>

            {/* Navigation Menu */}
            {helpSubpage === 'main' && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => setHelpSubpage('how-to-use')}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 rounded-2xl p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">How to Use</h2>
                  </div>
                  <p className="text-white/70">Learn how to get the most out of CollabX</p>
                </button>

                <button
                  onClick={() => setHelpSubpage('contact')}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/30 rounded-2xl p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                  </div>
                  <p className="text-white/70">Get in touch with our support team</p>
                </button>

                <button
                  onClick={() => setHelpSubpage('privacy')}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 rounded-2xl p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                  </div>
                  <p className="text-white/70">Learn how we protect your data</p>
                </button>

                <button
                  onClick={() => setHelpSubpage('terms')}
                  className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/30 rounded-2xl p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-amber-400" />
                    <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
                  </div>
                  <p className="text-white/70">Read our terms and conditions</p>
                </button>
              </div>
            )}

            {/* Back button for subpages */}
            {helpSubpage !== 'main' && (
              <button
                onClick={() => setHelpSubpage('main')}
                className="mb-6 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Help Menu
              </button>
            )}

            <div className="space-y-8">
              {/* How to Use Subpage */}
              {helpSubpage === 'how-to-use' && (
                <>
                  {/* Why CollabX Section */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-400/30 mb-6">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                      <Star className="w-8 h-8 text-purple-400" />
                      Why CollabX?
                    </h2>
                    <div className="space-y-4 text-white/80">
                      <p className="text-lg leading-relaxed">
                        CollabX is the premier platform connecting music creators worldwide. Whether you're a producer seeking vocalists, an artist looking for beat makers, or a songwriter searching for collaborators, CollabX makes finding your perfect match effortless.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-purple-400/20">
                          <Users className="w-8 h-8 text-purple-400 mb-2" />
                          <h3 className="text-white font-semibold mb-1">Global Network</h3>
                          <p className="text-white/70 text-sm">Connect with talented musicians from around the world</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-pink-400/20">
                          <Shield className="w-8 h-8 text-pink-400 mb-2" />
                          <h3 className="text-white font-semibold mb-1">Safe & Secure</h3>
                          <p className="text-white/70 text-sm">Privacy controls and verified profiles protect your information</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-amber-400/20">
                          <TrendingUp className="w-8 h-8 text-amber-400 mb-2" />
                          <h3 className="text-white font-semibold mb-1">Grow Together</h3>
                          <p className="text-white/70 text-sm">Build your network, earn badges, and level up your career</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Getting Started Process */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      Getting Started: Step-by-Step
                    </h2>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Create Your Profile</h3>
                          <p className="text-white/70 mb-2">Set up your profile with your role (producer, artist, songwriter, etc.), location, genres, skills, and bio. The more complete your profile, the better your matches!</p>
                          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-400/20 text-sm text-white/70">
                            <strong className="text-white">Tip:</strong> Add social media links (Spotify, SoundCloud, Instagram) so collaborators can check out your work
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Browse Collaborators</h3>
                          <p className="text-white/70 mb-2">Explore profiles in the "Browse Collaborators" section. Use filters to narrow down by location, genre, role, experience level, and collaboration type.</p>
                          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20 text-sm text-white/70">
                            <strong className="text-white">Tip:</strong> Your scroll position is saved when viewing profiles - come back exactly where you left off!
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Send Collaboration Requests</h3>
                          <p className="text-white/70 mb-2">Found someone interesting? Click "View Full Profile" and send them a collaboration request. They'll receive it in their inbox and can accept or decline.</p>
                          <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/20 text-sm text-white/70">
                            <strong className="text-white">Note:</strong> If declined, you cannot send another request to respect their decision
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Manage Your Inbox</h3>
                          <p className="text-white/70 mb-2">Check your inbox regularly for incoming requests. Accept requests to share contact information and start collaborating, or decline politely if it's not a good fit.</p>
                          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-400/20 text-sm text-white/70">
                            <strong className="text-white">Pro Tip:</strong> The inbox badge shows how many unread invitations you have
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Post Opportunities</h3>
                          <p className="text-white/70 mb-2">Need specific talent? Create a collaboration opportunity listing what you're looking for. Other users can browse opportunities and send you requests!</p>
                          <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-400/20 text-sm text-white/70">
                            <strong className="text-white">Tip:</strong> Be specific about role, location, genres, and collaboration type for better matches
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">6</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">Connect & Collaborate</h3>
                          <p className="text-white/70 mb-2">Once a request is accepted, you'll see each other's full contact information and social links. Take your collaboration off-platform via email, social media, or your preferred communication method.</p>
                          <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-400/20 text-sm text-white/70">
                            <strong className="text-white">Remember:</strong> Always document collaboration agreements in writing (payment, rights, credits, etc.)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CollabX Badge System */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-400/30 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-400" />
                      CollabX Badge System
                    </h2>
                    <p className="text-white/80 mb-6">
                      Earn prestige badges as you complete collaborations! Badges showcase your experience and help you stand out to potential collaborators.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border-l-4 border-bronze-400">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-8 h-8 text-amber-600" />
                          <h3 className="text-white font-bold text-lg">Bronze CollabX</h3>
                        </div>
                        <p className="text-white/70 mb-2"><strong>1-4 completed collaborations</strong></p>
                        <p className="text-white/60 text-sm">You're starting your journey! Keep building connections.</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border-l-4 border-gray-400">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-8 h-8 text-gray-400" />
                          <h3 className="text-white font-bold text-lg">Silver CollabX</h3>
                        </div>
                        <p className="text-white/70 mb-2"><strong>5-9 completed collaborations</strong></p>
                        <p className="text-white/60 text-sm">You're an active collaborator with proven experience!</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border-l-4 border-amber-400">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-8 h-8 text-amber-400" />
                          <h3 className="text-white font-bold text-lg">Gold CollabX</h3>
                        </div>
                        <p className="text-white/70 mb-2"><strong>10-24 completed collaborations</strong></p>
                        <p className="text-white/60 text-sm">Highly experienced! You're a trusted collaborator in the community.</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border-l-4 border-purple-400">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-8 h-8 text-purple-400" />
                          <h3 className="text-white font-bold text-lg">Platinum CollabX</h3>
                        </div>
                        <p className="text-white/70 mb-2"><strong>25-49 completed collaborations</strong></p>
                        <p className="text-white/60 text-sm">Elite status! You're a CollabX power user and networking expert.</p>
                      </div>

                      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border-l-4 border-cyan-400 md:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-8 h-8 text-cyan-400" />
                          <h3 className="text-white font-bold text-lg">Diamond CollabX</h3>
                        </div>
                        <p className="text-white/70 mb-2"><strong>50+ completed collaborations</strong></p>
                        <p className="text-white/60 text-sm">Legendary status! You're at the top of the CollabX community with unmatched experience.</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white/80 text-sm">
                        <strong className="text-white">Note:</strong> Badges are earned through accepted collaborations. They display on your profile card and detail view, helping others see your collaboration history at a glance.
                      </p>
                    </div>
                  </div>

                  {/* Privacy Mode */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Lock className="w-6 h-6 text-amber-400" />
                      Privacy Mode
                    </h2>
                    <div className="space-y-4 text-white/80">
                      <p>
                        Enable privacy mode to control who sees your full profile details. When privacy mode is enabled:
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>Your basic info (name, role, genres, location, bio) is always visible</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>Skills, availability, collaboration type, and social links are hidden until connected</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>Email is only revealed after accepting a collaboration request</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>Once connected (request sent/received), they see your full profile automatically</span>
                        </li>
                      </ul>
                      <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-400/20 mt-4">
                        <p className="text-white/70 text-sm">
                          <strong className="text-white">Recommendation:</strong> Privacy mode is great for established artists who want to filter connections. New users typically get better results with privacy mode off to maximize visibility.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                      <div className="border-l-4 border-purple-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Is CollabX free to use?</h3>
                        <p className="text-white/70">Yes! CollabX is completely free. We don't charge for browsing, sending requests, or connecting with collaborators. Users decide individually how they want to work together (paid, free, revenue-split, or feature-swap).</p>
                      </div>

                      <div className="border-l-4 border-blue-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">How do I get more collaboration requests?</h3>
                        <p className="text-white/70">Complete your profile 100%, add social media links, be specific about your skills and genres, upload quality work examples, respond quickly to requests, and stay active on the platform. Profiles with badges also attract more attention!</p>
                      </div>

                      <div className="border-l-4 border-green-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Why was my collaboration request declined?</h3>
                        <p className="text-white/70">Users decline for many reasons: they might be too busy, looking for different genres/styles, already have enough collaborators, or the timing isn't right. Don't take it personally - keep connecting with others!</p>
                      </div>

                      <div className="border-l-4 border-amber-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Can I send another request if declined?</h3>
                        <p className="text-white/70">No. If someone declines your request, you cannot send another one. This respects their decision and prevents spam. Focus on finding other collaborators who are excited to work with you!</p>
                      </div>

                      <div className="border-l-4 border-pink-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">How do I delete my account?</h3>
                        <p className="text-white/70">Go to Settings and click "Delete Account" at the bottom. This permanently removes all your data including profile, requests, and collaborations. This action cannot be undone.</p>
                      </div>

                      <div className="border-l-4 border-cyan-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">What if I'm having technical issues?</h3>
                        <p className="text-white/70">Contact us at <a href="mailto:support@x.colsphere.com" className="text-cyan-300 hover:text-cyan-200 font-semibold">support@x.colsphere.com</a> with details about the issue, including screenshots if possible. We typically respond within 24-48 hours.</p>
                      </div>

                      <div className="border-l-4 border-red-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">How do I report inappropriate behavior?</h3>
                        <p className="text-white/70">Email <a href="mailto:support@x.colsphere.com" className="text-red-300 hover:text-red-200 font-semibold">support@x.colsphere.com</a> with the user's name/profile and description of the issue. We take all reports seriously and investigate promptly.</p>
                      </div>

                      <div className="border-l-4 border-orange-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Can I change my role or genres?</h3>
                        <p className="text-white/70">Yes! Go to Settings and update your profile anytime. Changes take effect immediately and update your profile across the platform.</p>
                      </div>

                      <div className="border-l-4 border-indigo-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">What collaboration types are available?</h3>
                        <p className="text-white/70">CollabX supports: <strong>Paid</strong> (fee for services), <strong>Free</strong> (no payment), <strong>Revenue Split</strong> (share earnings), and <strong>Feature Swap</strong> (exchange features). Choose what works for your situation!</p>
                      </div>

                      <div className="border-l-4 border-teal-400 pl-4">
                        <h3 className="text-lg font-semibold text-white mb-2">How long does it take to hear back from someone?</h3>
                        <p className="text-white/70">Response times vary by user. Some respond within hours, others may take days or weeks. Active users with complete profiles tend to respond faster. If you don't hear back within a week, try connecting with others!</p>
                      </div>
                    </div>
                  </div>

                  {/* Pro Tips Section */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-green-400" />
                      Pro Tips for Success
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Complete Your Profile to 100%</h3>
                          <p className="text-white/70 text-sm">Profiles with all fields filled get 3x more collaboration requests. Add bio, skills, genres, social links, and availability.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Showcase Your Work</h3>
                          <p className="text-white/70 text-sm">Add links to Spotify, SoundCloud, YouTube, or Instagram so potential collaborators can hear your style before reaching out.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Be Specific with Genres</h3>
                          <p className="text-white/70 text-sm">Instead of "hip-hop," try "trap, boom-bap, conscious rap." Specific genres help you find better matches and show you know your craft.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Respond Quickly</h3>
                          <p className="text-white/70 text-sm">Check your inbox regularly and respond within 24-48 hours. Fast responders build better reputations and get more opportunities.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Use Filters Effectively</h3>
                          <p className="text-white/70 text-sm">Narrow down by location (for local collabs), genre (for style match), and collaboration type (for budget alignment) to find perfect matches faster.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Be Clear About Collaboration Type</h3>
                          <p className="text-white/70 text-sm">State upfront if you're looking for paid, free, revenue-split, or feature-swap. This prevents misunderstandings and saves time.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Post Opportunities Regularly</h3>
                          <p className="text-white/70 text-sm">Don't just browse - post what you need! Opportunities get seen by hundreds of users and bring collaborators to you.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Build Your Badge Collection</h3>
                          <p className="text-white/70 text-sm">Complete collaborations to earn badges. Higher badges = more credibility = more requests. It's a virtuous cycle!</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Network Beyond Requests</h3>
                          <p className="text-white/70 text-sm">After connecting, follow each other on social media, engage with their content, and build genuine relationships. The best collabs come from real connections!</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Document Everything</h3>
                          <p className="text-white/70 text-sm">Once you connect, put all collaboration terms in writing: payment, deadlines, rights, credits, revisions. Use email or contracts to protect both parties.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                      Collaboration Best Practices
                    </h2>
                    <div className="space-y-4 text-white/80">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-400" />
                          Communication
                        </h3>
                        <ul className="space-y-2 text-sm text-white/70 ml-6">
                          <li>• Be clear and professional in all messages</li>
                          <li>• Set expectations upfront (timeline, payment, deliverables)</li>
                          <li>• Ask questions before committing to avoid misunderstandings</li>
                          <li>• Keep communication channels open and respond promptly</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-400" />
                          Agreements
                        </h3>
                        <ul className="space-y-2 text-sm text-white/70 ml-6">
                          <li>• Get everything in writing via email or contract</li>
                          <li>• Specify payment terms, deadlines, and revision limits</li>
                          <li>• Clarify ownership rights and publishing splits</li>
                          <li>• Agree on credits and how you'll be listed</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-amber-400" />
                          Professionalism
                        </h3>
                        <ul className="space-y-2 text-sm text-white/70 ml-6">
                          <li>• Meet deadlines or communicate early if you can't</li>
                          <li>• Deliver quality work that matches what was agreed</li>
                          <li>• Be respectful even if the collaboration doesn't work out</li>
                          <li>• Give and receive constructive feedback gracefully</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-400" />
                          Building Relationships
                        </h3>
                        <ul className="space-y-2 text-sm text-white/70 ml-6">
                          <li>• Follow up after successful collaborations</li>
                          <li>• Share and promote each other's work</li>
                          <li>• Stay in touch for future opportunities</li>
                          <li>• Recommend great collaborators to your network</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Contact Subpage */}
              {helpSubpage === 'contact' && (
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-blue-400" />
                    Contact Us
                  </h2>
                  <div className="space-y-6">
                    <p className="text-white/80 text-lg">
                      We're here to help! Reach out to us for any questions, concerns, or feedback about CollabX.
                    </p>

                    <div className="bg-white/5 rounded-xl p-6 border-l-4 border-blue-400">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-400" />
                        General Inquiries & Feedback
                      </h3>
                      <p className="text-white/70 mb-3">
                        Questions, feedback, suggestions, partnership opportunities, or general information about CollabX
                      </p>
                      <a href="mailto:info@x.colsphere.com" className="text-blue-300 hover:text-blue-200 font-semibold text-xl transition-colors">
                        info@x.colsphere.com
                      </a>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border-l-4 border-green-400">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Technical Support & Account Help
                      </h3>
                      <p className="text-white/70 mb-3">
                        Platform issues, account problems, login difficulties, profile help, bug reports, or abuse reporting
                      </p>
                      <a href="mailto:support@x.colsphere.com" className="text-green-300 hover:text-green-200 font-semibold text-xl transition-colors">
                        support@x.colsphere.com
                      </a>
                    </div>

                    <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-400/30">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-400" />
                        Response Time
                      </h3>
                      <p className="text-white/70">
                        We typically respond within 24-48 hours during business days. For urgent technical issues, please mark your email subject with "URGENT" and we'll prioritize your request.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Policy Subpage */}
              {helpSubpage === 'privacy' && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-8 h-8 text-green-400" />
                    Privacy Policy
                  </h2>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <p className="text-white/60 text-sm mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                      <p className="text-white mb-4">
                        At CollabX, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
                      <p className="text-white/70 mb-2">We collect information that you provide directly to us, including:</p>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>Profile information (name, email, role, location, genres, skills)</li>
                        <li>Collaboration preferences and experience level</li>
                        <li>Social media links and portfolio URLs</li>
                        <li>Messages and collaboration requests</li>
                        <li>Usage data and platform interactions</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
                      <p className="text-white/70 mb-2">We use the information we collect to:</p>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Connect you with potential collaborators</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Respond to your comments and questions</li>
                        <li>Prevent fraud and enhance security</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h3>
                      <p className="text-white/70 mb-2">
                        We do not sell your personal information. We only share your information in the following circumstances:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>With other users when you accept a collaboration request</li>
                        <li>With service providers who assist in operating our platform</li>
                        <li>When required by law or to protect our rights</li>
                        <li>With your explicit consent</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">4. Data Security</h3>
                      <p className="text-white/70">
                        We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">5. Your Rights</h3>
                      <p className="text-white/70 mb-2">You have the right to:</p>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>Access and update your personal information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt-out of promotional communications</li>
                        <li>Request a copy of your data</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">6. Contact Us</h3>
                      <p className="text-white/70">
                        If you have questions about this Privacy Policy, please contact us at{' '}
                        <a href="mailto:info@x.colsphere.com" className="text-green-300 hover:text-green-200 font-semibold">
                          info@x.colsphere.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms of Service Subpage */}
              {helpSubpage === 'terms' && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-amber-400" />
                    Terms of Service
                  </h2>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <p className="text-white/60 text-sm mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                      <p className="text-white mb-4">
                        Welcome to CollabX! By using our platform, you agree to these Terms of Service. Please read them carefully.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
                      <p className="text-white/70">
                        By accessing and using CollabX, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">2. User Accounts</h3>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>You must be at least 13 years old to use CollabX</li>
                        <li>You are responsible for maintaining the security of your account</li>
                        <li>You must provide accurate and complete information</li>
                        <li>One person or entity may maintain only one account</li>
                        <li>You may not impersonate others or provide false information</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">3. User Content and Conduct</h3>
                      <p className="text-white/70 mb-2">You agree not to:</p>
                      <ul className="list-disc list-inside space-y-1 text-white/70 ml-4">
                        <li>Post false, misleading, or fraudulent content</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Spam or send unsolicited messages</li>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Use the platform for commercial solicitation without permission</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">4. Collaboration Agreements</h3>
                      <p className="text-white/70">
                        CollabX facilitates connections between collaborators but is not a party to any agreements made between users. All collaboration terms (payment, rights, credits, etc.) are solely between the collaborating parties. We recommend documenting all agreements in writing.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h3>
                      <p className="text-white/70">
                        You retain all rights to content you post on CollabX. By posting content, you grant us a license to display, distribute, and promote your content on our platform. We respect intellectual property rights and expect our users to do the same.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">6. Termination</h3>
                      <p className="text-white/70">
                        We reserve the right to suspend or terminate accounts that violate these Terms of Service. You may also delete your account at any time through your settings.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">7. Disclaimers</h3>
                      <p className="text-white/70">
                        CollabX is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free or uninterrupted. We are not responsible for the conduct of users or the outcome of collaborations.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h3>
                      <p className="text-white/70">
                        CollabX and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h3>
                      <p className="text-white/70">
                        We may update these Terms of Service from time to time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the new terms.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">10. Contact Us</h3>
                      <p className="text-white/70">
                        Questions about these Terms? Contact us at{' '}
                        <a href="mailto:info@x.colsphere.com" className="text-amber-300 hover:text-amber-200 font-semibold">
                          info@x.colsphere.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render my opportunities page
  const renderMyOpportunities = () => {
    // Filter to show only user's own opportunities
    const myOpportunities = opportunities.filter(opp => opp.user_id === savedProfileId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView(VIEWS.OPPORTUNITIES)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Opportunities
            </button>
            <button
              onClick={() => {
                setEditingOpportunityId(null);
                setOpportunityForm({
                  looking_for_role: '',
                  location: '',
                  description: '',
                  genres: '',
                  collab_type: ''
                });
                setCurrentView(VIEWS.CREATE_OPPORTUNITY);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Post New Opportunity
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Briefcase className="w-10 h-10" />
              My Posted Opportunities
            </h1>
            <p className="text-white/70">Manage your collaboration opportunities</p>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-white/70 text-sm">
            {myOpportunities.length} {myOpportunities.length === 1 ? 'opportunity' : 'opportunities'} posted
          </div>

          {/* Opportunities List */}
          {isLoadingOpportunities ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <span className="ml-3 text-white text-lg">Loading opportunities...</span>
            </div>
          ) : myOpportunities.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <Briefcase className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-4">
                You haven't posted any opportunities yet.
              </p>
              <button
                onClick={() => {
                  setEditingOpportunityId(null);
                  setOpportunityForm({
                    looking_for_role: '',
                    location: '',
                    description: '',
                    genres: '',
                    collab_type: ''
                  });
                  setCurrentView(VIEWS.CREATE_OPPORTUNITY);
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                Post Your First Opportunity
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-amber-400/30 hover:border-amber-400/50 transition-all shadow-xl hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-amber-500/20 px-3 py-1 rounded-full">
                          <span className="text-amber-300 text-xs font-semibold uppercase">{opportunity.looking_for_role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-white mb-2">
                        Looking for {opportunity.looking_for_role}
                      </p>
                      <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Location</p>
                      <p className="text-white text-sm">{opportunity.location}</p>
                    </div>

                    {opportunity.genres && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Genres</p>
                        <p className="text-white text-sm">{opportunity.genres}</p>
                      </div>
                    )}

                    {opportunity.collab_type && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Collaboration Type</p>
                        <div className="inline-block">
                          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-sm font-medium capitalize">
                            {opportunity.collab_type}
                          </span>
                        </div>
                      </div>
                    )}

                    {opportunity.description && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Details</p>
                        <p className="text-white/80 text-sm line-clamp-3">{opportunity.description}</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-white/60 text-xs">
                        Posted {new Date(opportunity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditOpportunity(opportunity)}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOpportunity(opportunity.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render opportunities page
  const renderOpportunitiesPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button
              onClick={() => setCurrentView(VIEWS.DASHBOARD)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </button>
            {savedProfileId && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView(VIEWS.MY_OPPORTUNITIES)}
                  className="px-5 py-3 bg-white/10 backdrop-blur-lg border border-amber-400/50 text-white rounded-xl font-semibold hover:bg-white/20 hover:border-amber-400 transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  My Opportunities
                </button>
                <button
                  onClick={() => {
                    setEditingOpportunityId(null);
                    setOpportunityForm({
                      looking_for_role: '',
                      location: '',
                      description: '',
                      genres: '',
                      collab_type: ''
                    });
                    setCurrentView(VIEWS.CREATE_OPPORTUNITY);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Post Opportunity
                </button>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Briefcase className="w-10 h-10" />
              Collaboration Opportunities
            </h1>
            <p className="text-white/70">Find your next collaboration partner</p>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Search & Filter</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Role</label>
                <input
                  type="text"
                  placeholder="e.g. producer, artist..."
                  value={opportunityFilters.role}
                  onChange={(e) => setOpportunityFilters({ ...opportunityFilters, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Toronto, Remote..."
                  value={opportunityFilters.location}
                  onChange={(e) => setOpportunityFilters({ ...opportunityFilters, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Genres</label>
                <input
                  type="text"
                  placeholder="e.g. hip-hop, jazz..."
                  value={opportunityFilters.genres}
                  onChange={(e) => setOpportunityFilters({ ...opportunityFilters, genres: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Collab Type</label>
                <select
                  value={opportunityFilters.collab_type}
                  onChange={(e) => setOpportunityFilters({ ...opportunityFilters, collab_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">All types...</option>
                  {OPTIONS.collab_type.map(type => (
                    <option key={type} value={type} className="bg-gray-800 capitalize">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {(opportunityFilters.role || opportunityFilters.location || opportunityFilters.genres || opportunityFilters.collab_type) && (
              <button
                onClick={() => setOpportunityFilters({ role: '', location: '', genres: '', collab_type: '' })}
                className="mt-4 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-white/70 text-sm">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </div>

          {/* Opportunities List */}
          {isLoadingOpportunities ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <span className="ml-3 text-white text-lg">Loading opportunities...</span>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <Briefcase className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 text-lg mb-4">
                {opportunities.length === 0 ? 'No opportunities posted yet.' : 'No opportunities match your filters.'}
              </p>
              {opportunities.length === 0 && savedProfileId && (
                <button
                  onClick={() => setCurrentView(VIEWS.CREATE_OPPORTUNITY)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Be the first to post!
                </button>
              )}
              {opportunities.length > 0 && (
                <button
                  onClick={() => setOpportunityFilters({ role: '', location: '', genres: '' })}
                  className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-bold text-sm">{opportunity.profiles?.name || 'Anonymous'}</h3>
                            {opportunity.user_id && isConnectedToUser(opportunity.user_id) && (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/50" title="You are connected with this user">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-xs font-semibold text-green-400">
                                  Connected
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <RoleIcon role={opportunity.profiles?.role} className="w-3 h-3 text-purple-300" />
                            <p className="text-purple-300 text-xs capitalize">{opportunity.profiles?.role || 'Creator'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {savedProfileId && savedProfileId !== opportunity.user_id && (
                        <button
                          onClick={() => starredOpportunities.includes(opportunity.id) ? unstarOpportunity(opportunity.id) : starOpportunity(opportunity.id)}
                          className={`p-2 rounded-full transition-all ${
                            starredOpportunities.includes(opportunity.id)
                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-amber-300'
                          }`}
                          title={starredOpportunities.includes(opportunity.id) ? 'Unstar opportunity' : 'Star opportunity'}
                        >
                          <Star className={`w-4 h-4 ${starredOpportunities.includes(opportunity.id) ? 'fill-white' : ''}`} />
                        </button>
                      )}
                      <div className="bg-amber-500/20 px-3 py-1 rounded-full">
                        <span className="text-amber-300 text-xs font-semibold uppercase">{opportunity.looking_for_role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-white mb-2">
                        Looking for {opportunity.looking_for_role}
                      </p>
                      <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Location</p>
                      <p className="text-white text-sm">{opportunity.location}</p>
                    </div>

                    {opportunity.genres && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Genres</p>
                        <p className="text-white text-sm">{opportunity.genres}</p>
                      </div>
                    )}

                    {opportunity.collab_type && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Collaboration Type</p>
                        <div className="inline-block">
                          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-sm font-medium capitalize">
                            {opportunity.collab_type}
                          </span>
                        </div>
                      </div>
                    )}

                    {opportunity.description && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Details</p>
                        <p className="text-white/80 text-sm line-clamp-3">{opportunity.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {savedProfileId && savedProfileId !== opportunity.user_id ? (
                    areUsersConnected(opportunity.user_id) ? (
                      <button
                        onClick={() => viewConnectedUserProfile(opportunity.user_id)}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        View Profile
                      </button>
                    ) : hasPendingInvitationForOpportunity(opportunity.id, opportunity.user_id) ? (
                      <button
                        disabled
                        className="w-full py-3 bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-xl font-semibold cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => sendInvitation(opportunity.id, opportunity.user_id)}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-5 h-5" />
                        Collab
                      </button>
                    )
                  ) : savedProfileId && savedProfileId === opportunity.user_id ? (
                    <div className="space-y-2">
                      <div className="w-full py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 font-semibold flex items-center justify-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        Your Opportunity
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditOpportunity(opportunity)}
                          className="flex-1 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteOpportunity(opportunity.id)}
                          className="flex-1 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg font-medium hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        showToast('Please log in or sign up to apply for collaboration opportunities', 'info');
                        setCurrentView(VIEWS.LOGIN);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white rounded-xl font-semibold hover:from-purple-600/50 hover:to-pink-600/50 transition-all border border-white/20 flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Collab (Login Required)
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render create opportunity page
  const renderCreateOpportunityPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button
            onClick={() => setCurrentView(VIEWS.OPPORTUNITIES)}
            className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Opportunities
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Authentication Warning */}
            {!savedProfileId && (
              <div className="mb-6 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-200 font-semibold text-sm">Authentication Required</p>
                  <p className="text-amber-200/80 text-sm mt-1 mb-3">
                    You need to log in or create a profile to post opportunities.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentView(VIEWS.LOGIN)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 text-sm font-semibold"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => setCurrentView(VIEWS.SIGNUP)}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm font-semibold"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                {editingOpportunityId ? (
                  <Edit className="w-6 h-6 text-white" />
                ) : (
                  <Briefcase className="w-6 h-6 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">
                {editingOpportunityId ? 'Edit Opportunity' : 'Post a Collaboration Opportunity'}
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">I'm looking for a...</label>
                <select
                  value={opportunityForm.looking_for_role}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, looking_for_role: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all"
                >
                  <option value="">Select role...</option>
                  {OPTIONS.role.map(role => (
                    <option key={role} value={role} className="bg-gray-800">{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Location</label>
                <input
                  type="text"
                  value={opportunityForm.location}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, location: e.target.value })}
                  placeholder="e.g. Los Angeles, USA or Remote"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Genres (optional)</label>
                <input
                  type="text"
                  value={opportunityForm.genres}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, genres: e.target.value })}
                  placeholder="e.g. hip-hop, r&b, afrobeats"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Collaboration Type (optional)</label>
                <select
                  value={opportunityForm.collab_type}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, collab_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all"
                >
                  <option value="">Select collaboration type...</option>
                  {OPTIONS.collab_type.map(type => (
                    <option key={type} value={type} className="bg-gray-800 capitalize">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Description (optional)</label>
                <textarea
                  value={opportunityForm.description}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, description: e.target.value })}
                  placeholder="Tell us more about what you're looking for..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all resize-none"
                />
              </div>

              <button
                onClick={editingOpportunityId ? updateOpportunity : createOpportunity}
                disabled={!opportunityForm.looking_for_role || !opportunityForm.location}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  !opportunityForm.looking_for_role || !opportunityForm.location
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:scale-105'
                }`}
              >
                {editingOpportunityId ? 'Update Opportunity' : 'Post Opportunity'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render browse page
  const renderBrowsePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setCurrentView(VIEWS.DASHBOARD)}
            className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Star className="w-10 h-10" />
              Browse Collaborators
            </h1>
            <p className="text-white/70">Find your perfect music collaboration match</p>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Toronto, London..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Genre</label>
                <input
                  type="text"
                  placeholder="e.g. hip-hop, jazz..."
                  value={filters.genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Experience Level</label>
                <select
                  value={filters.experience_level}
                  onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Collab Type</label>
                <select
                  value={filters.collab_type}
                  onChange={(e) => setFilters({ ...filters, collab_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">All Types</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="revenue-split">Revenue Split</option>
                  <option value="feature-swap">Feature Swap</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setFilters({ location: '', genre: '', experience_level: '', collab_type: '' })}
              className="mt-4 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              Clear Filters
            </button>
          </div>

          {/* Results */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-white/70 text-sm">
              {!hasFiltered ? (
                <span>Showing 10 random profiles • Filter to see more</span>
              ) : (
                <span>Showing {displayedProfiles.length} of {filteredProfiles.length} filtered profiles</span>
              )}
            </div>
            {filteredProfiles.length > PROFILES_PER_PAGE && (
              <div className="text-white/70 text-sm">
                Page {currentPage} of {Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE)}
              </div>
            )}
          </div>

          {isLoadingProfiles ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <span className="ml-3 text-white text-lg">Loading profiles...</span>
            </div>
          ) : displayedProfiles.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <p className="text-white/70 text-lg">No profiles found matching your filters.</p>
              <button
                onClick={() => setFilters({ location: '', genre: '', experience_level: '', collab_type: '' })}
                className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedProfiles.map((profile) => {
                  const unlocked = isProfileUnlocked(profile);
                  return (
                <div key={profile.id} className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border transition-all shadow-xl hover:shadow-2xl hover:scale-105 ${unlocked ? 'border-amber-400/50' : 'border-white/20'}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <UserAvatar user={profile} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                        {getCollabBadge(profile.accepted_collabs || 0) && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getCollabBadge(profile.accepted_collabs || 0).bgColor} border ${getCollabBadge(profile.accepted_collabs || 0).borderColor}`}>
                            <Award className={`w-4 h-4 ${getCollabBadge(profile.accepted_collabs || 0).textColor}`} />
                            <span className={`text-xs font-bold ${getCollabBadge(profile.accepted_collabs || 0).textColor}`}>
                              {getCollabBadge(profile.accepted_collabs || 0).level}
                            </span>
                          </div>
                        )}
                        {isConnectedToUser(profile.id) && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/50" title="You are connected with this user">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400">
                              Connected
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleIcon role={profile.role} className="w-4 h-4 text-purple-300" />
                        <p className="text-purple-300 text-sm font-semibold uppercase">{profile.role}</p>
                      </div>
                      {getMembershipDuration(profile.created_at) && (
                        <p className="text-cyan-400 text-xs mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Member for {getMembershipDuration(profile.created_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Always visible: Bio, Skills, Genres, Locations only */}
                    {profile.bio && (
                      <div>
                        <span className="text-white/60 text-xs uppercase tracking-wide">Bio</span>
                        <p className="text-white text-sm mt-1 line-clamp-3">{profile.bio}</p>
                      </div>
                    )}

                    {profile.skills_raw && (
                      <div>
                        <span className="text-white/60 text-xs uppercase tracking-wide">Skills</span>
                        <p className="text-white text-sm mt-1">{profile.skills_raw}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-white/60 text-xs uppercase tracking-wide">Genres</span>
                      <p className="text-white text-sm mt-1">{profile.genres_raw}</p>
                    </div>

                    <div>
                      <span className="text-white/60 text-xs uppercase tracking-wide">Location</span>
                      <p className="text-white text-sm mt-1">{profile.location}</p>
                    </div>

                    {/* Locked message for non-unlocked profiles */}
                    {!unlocked && (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10 mt-2">
                        <div className="flex items-center gap-2 text-amber-300 mb-2">
                          <Lock className="w-4 h-4" />
                          <span className="text-xs font-semibold">Privacy Mode Enabled</span>
                        </div>
                        <p className="text-white/60 text-xs">
                          Connect with this user to view their full profile details
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        // Save current scroll position and previous view before navigating
                        setBrowseScrollPosition(window.scrollY);
                        setPreviousView(VIEWS.BROWSE);
                        incrementProfileViews(profile.id);
                        setSelectedProfile(profile);
                        setCurrentView(VIEWS.PROFILE_DETAIL);
                      }}
                      className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        unlocked
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {unlocked ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {unlocked ? 'View Full Profile' : 'Preview Profile'}
                    </button>
                  </div>
                </div>
                  );
                })}
            </div>

            {/* Pagination */}
            {filteredProfiles.length > PROFILES_PER_PAGE && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE) }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      const totalPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE);
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-white/40">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE)
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/10 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              <button
                onClick={() => {
                  setCurrentView(VIEWS.HELP);
                  setHelpSubpage('main');
                }}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Help & Support
              </button>
            </div>
            <p className="text-white/50 text-sm">© 2025 CollabX. All rights reserved.</p>
          </footer>
        </div>
      </div>
    );
  };

  // Introduction/Onboarding view
  if (currentView === VIEWS.INTRO) {
    const slides = [
      {
        icon: Music,
        title: "Welcome to CollabX",
        description: "The ultimate platform for music creators to connect, collaborate, and create magic together.",
        gradient: "from-purple-400 to-pink-400",
        bgGradient: "from-purple-950 via-black to-black"
      },
      {
        icon: Users,
        title: "Find Your Perfect Match",
        description: "Discover artists, producers, and creatives who share your vision. Filter by genre, location, and collaboration type.",
        gradient: "from-blue-400 to-cyan-400",
        bgGradient: "from-blue-950 via-black to-black"
      },
      {
        icon: Globe,
        title: "Build Your Network",
        description: "Create opportunities, send invitations, and grow your music career. Track collaborations and unlock achievements.",
        gradient: "from-green-400 to-emerald-400",
        bgGradient: "from-green-950 via-black to-black"
      }
    ];

    const currentSlideData = slides[currentSlide];

    const handleNext = () => {
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        // Mark intro as seen and go to auth choice
        localStorage.setItem('hasSeenIntro', 'true');
        setCurrentView(VIEWS.AUTH_CHOICE);
      }
    };

    const handleSkip = () => {
      localStorage.setItem('hasSeenIntro', 'true');
      setCurrentView(VIEWS.AUTH_CHOICE);
    };

    return (
      <>
        <SpaceBackground />
        <div className={`min-h-screen bg-gradient-to-br ${currentSlideData.bgGradient} flex items-center justify-center p-4 transition-all duration-700`}>
          <div className="max-w-4xl w-full">
          {/* Logo at top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              CollabX
            </h1>
            <Users className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          {/* Skip button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleSkip}
              className="text-white/60 hover:text-white text-sm font-medium transition-all"
            >
              Skip intro →
            </button>
          </div>

          {/* Slide content - key prop triggers re-animation on slide change */}
          <div key={currentSlide} className="text-center mb-12 animate-fade-in">
            {/* Icon with animation */}
            <div className="flex justify-center mb-8">
              <div className={`w-32 h-32 bg-gradient-to-br ${currentSlideData.gradient} rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow`}>
                <currentSlideData.icon className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentSlideData.gradient} mb-6 animate-slide-up`}>
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
              {currentSlideData.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `w-12 bg-gradient-to-r ${currentSlideData.gradient}`
                    : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-8 py-4 bg-gradient-to-r ${currentSlideData.gradient} text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
            >
              {currentSlide === totalSlides - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Auth choice view (initial page)
  if (currentView === VIEWS.AUTH_CHOICE) {
    return (
      <>
        <SpaceBackground />
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4">
              CollabX
            </h1>
            <p className="text-white/70 text-xl">Connect. Create. Collaborate.</p>
          </div>

          {authError && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-200 text-center">{authError}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sign In Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Sign In</h2>
                <p className="text-white/70 text-center">Already have an account? Sign in to access your dashboard</p>

                <button
                  onClick={() => handleOAuthLogin('google', 'signin')}
                  disabled={isAuthProcessing || !supabase}
                  className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign In with Google
                </button>
              </div>
            </div>

            {/* Sign Up Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Sign Up</h2>
                <p className="text-white/70 text-center">New here? Create your profile and start collaborating</p>

                <button
                  onClick={() => handleOAuthLogin('google', 'signup')}
                  disabled={isAuthProcessing || !supabase}
                  className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign Up with Google
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Login view
  if (currentView === VIEWS.LOGIN) {
    return (
      <>
        <SpaceBackground />
        {renderLoginPage()}
      </>
    );
  }

  // How to use view
  // Help view
  if (currentView === VIEWS.HELP) {
    return (
      <>
        <SpaceBackground />
        {renderHelpPage()}
      </>
    );
  }

  // Opportunities view
  if (currentView === VIEWS.OPPORTUNITIES) {
    return (
      <>
        <SpaceBackground />
        {renderOpportunitiesPage()}
      </>
    );
  }

  // My Opportunities view
  if (currentView === VIEWS.MY_OPPORTUNITIES) {
    return (
      <>
        <SpaceBackground />
        {renderMyOpportunities()}
      </>
    );
  }

  // Create opportunity view
  if (currentView === VIEWS.CREATE_OPPORTUNITY) {
    return (
      <>
        <SpaceBackground />
        {renderCreateOpportunityPage()}
      </>
    );
  }

  // Dashboard view
  if (currentView === VIEWS.DASHBOARD) {
    console.log('Rendering Dashboard view');
    console.log('Current View:', currentView);
    console.log('Current User:', currentUser);
    console.log('Saved Profile ID:', savedProfileId);
    return (
      <>
        <SpaceBackground />
        {renderDashboard()}
      </>
    );
  }

  // Settings view
  if (currentView === VIEWS.SETTINGS) {
    return (
      <>
        <SpaceBackground />
        {renderSettingsPage()}
      </>
    );
  }

  // Inbox view
  if (currentView === VIEWS.INBOX) {
    // If still loading auth, show loading state
    if (isAuthLoading) {
      return (
        <>
          <SpaceBackground />
          <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-xl mb-4">Loading...</p>
            </div>
          </div>
        </>
      );
    }

    // If no profile ID after auth loaded, redirect to auth or dashboard
    if (!savedProfileId) {
      // If not authenticated, redirect to intro and show loading while redirecting
      if (!authUser) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => setCurrentView(VIEWS.INTRO), 0);
        return (
          <>
            <SpaceBackground />
            <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-white text-xl mb-4">Redirecting...</p>
              </div>
            </div>
          </>
        );
      }
      // If authenticated but no profile loaded, show loading with retry
      return (
        <>
          <SpaceBackground />
          <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-xl mb-4">Loading your inbox...</p>
              <p className="text-white/60 text-sm mb-4">If this takes too long, try going to dashboard first</p>
              <button
                onClick={() => setCurrentView(VIEWS.DASHBOARD)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </>
      );
    }

    // Filter pending invitations with comprehensive safety checks
    // Only include invitations that have valid from_user data to prevent crashes
    const pendingInvitations = Array.isArray(myInvitations)
      ? myInvitations.filter(inv => {
          // Check basic invitation properties
          if (!inv || inv.status !== 'pending') return false;
          // Check that from_user exists and has required properties
          if (!inv.from_user || !inv.from_user.name) {
            console.warn('Skipping invitation with missing from_user data:', inv.id);
            return false;
          }
          return true;
        })
      : [];

    // Filter collaborations with comprehensive safety checks
    // Only include collaborations that have valid user data to prevent crashes
    const safeCollaborations = Array.isArray(collaborations)
      ? collaborations.filter(collab => {
          // Check basic collaboration properties
          if (!collab || !collab.id) return false;
          // Check that both users exist
          if (!collab.user1 || !collab.user2) {
            console.warn('Skipping collaboration with missing user data:', collab.id);
            return false;
          }
          // Check that both users have required properties
          if (!collab.user1.name || !collab.user2.name) {
            console.warn('Skipping collaboration with incomplete user data:', collab.id);
            return false;
          }
          return true;
        })
      : [];

    return (
      <>
        <SpaceBackground />
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4 overflow-x-hidden w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6 px-2">
            <button
              onClick={() => setCurrentView(VIEWS.DASHBOARD)}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-xs sm:text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="hidden xs:inline sm:inline">Back to Dashboard</span>
              <span className="xs:hidden sm:hidden">Back</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3 flex-wrap">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10" />
              <span>Collaboration Inbox</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base">Manage your collaboration requests and connections</p>
          </div>

          {/* Error Messages */}
          {(invitationsError || collaborationsError) && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 sm:p-6 mx-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-300 font-semibold mb-2">Error Loading Inbox Data</h3>
                  {invitationsError && (
                    <p className="text-red-200 text-sm mb-2">{invitationsError}</p>
                  )}
                  {collaborationsError && (
                    <p className="text-red-200 text-sm mb-2">{collaborationsError}</p>
                  )}
                  <div className="mt-4 space-y-2">
                    <p className="text-red-200 text-sm">This may be due to:</p>
                    <ul className="text-red-200 text-sm list-disc list-inside space-y-1">
                      <li>Database schema needs to be updated (run the schema migration)</li>
                      <li>Profile data structure issues</li>
                      <li>Network connection problems</li>
                    </ul>
                    <button
                      onClick={() => {
                        setInvitationsError(null);
                        setCollaborationsError(null);
                        loadInvitations();
                        loadCollaborations();
                      }}
                      className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      Retry Loading
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isLoadingCollaborations || isLoadingInvitations) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
              <span className="text-white text-lg mb-4">Loading inbox...</span>
              <button
                onClick={() => {
                  loadCollaborations();
                  loadInvitations();
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-all"
              >
                Retry if stuck
              </button>
            </div>
          ) : (
            <>
              {/* Pending Requests Section */}
              {pendingInvitations.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Pending Requests ({pendingInvitations.length})</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
                    {pendingInvitations.map((invitation) => {
                      // Additional defensive check (should not happen due to earlier filtering)
                      if (!invitation || !invitation.from_user || !invitation.from_user.name) {
                        console.error('Skipping render of invitation with missing data:', invitation?.id);
                        return null;
                      }

                      return (
                      <div
                        key={invitation.id}
                        className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border-2 border-amber-400/50 shadow-xl w-full"
                      >
                        {/* User Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{invitation.from_user.name}</h3>
                            <div className="flex items-center gap-2">
                              <RoleIcon role={invitation.from_user.role} className="w-4 h-4 text-amber-300" />
                              <p className="text-amber-300 text-sm font-semibold uppercase">{invitation.from_user.role}</p>
                            </div>
                          </div>
                        </div>

                        {/* Basic Info */}
                        {invitation.from_user.genres_raw && (
                          <div className="mb-4">
                            <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Genres</span>
                            <p className="text-white text-sm">{invitation.from_user.genres_raw}</p>
                          </div>
                        )}

                        {/* Opportunity Info - Show which opportunity this collaboration is for */}
                        {invitation.opportunity && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-lg">
                            <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">
                              <Briefcase className="w-3 h-3 inline mr-1" />
                              For Your Opportunity
                            </span>
                            <p className="text-white text-sm font-semibold">
                              Looking for: {invitation.opportunity.looking_for_role}
                            </p>
                            {invitation.opportunity.location && (
                              <p className="text-white/70 text-xs mt-1">
                                📍 {invitation.opportunity.location}
                              </p>
                            )}
                          </div>
                        )}

                        {invitation.message && (
                          <div className="mb-4 p-3 bg-white/5 rounded-lg">
                            <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Message</span>
                            <p className="text-white text-sm italic">"{invitation.message}"</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              acceptInvitation(invitation.id, invitation.from_user_id);
                            }}
                            disabled={isLoadingInvitations}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              rejectInvitation(invitation.id, invitation.from_user_id);
                            }}
                            disabled={isLoadingInvitations}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                            Decline
                          </button>
                        </div>

                        <p className="text-white/50 text-xs text-center mt-3">
                          Accept to share full contact information
                        </p>
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}

              {/* Accepted Collaborations Section */}
              <div>
                <div className="flex items-center gap-2 mb-6 px-2">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Accepted Collaborations ({safeCollaborations.length})
                  </h2>
                </div>

                {/* Collaboration Filters */}
                <div className="mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-4 border border-purple-400/30 mx-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold text-sm sm:text-base">Filter Collaborations:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Filter by Genre:</label>
                      <input
                        type="text"
                        placeholder="e.g., hip-hop, r&b"
                        value={collabGenreFilter}
                        onChange={(e) => setCollabGenreFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-1 block">Filter by Location:</label>
                      <input
                        type="text"
                        placeholder="e.g., Toronto, LA"
                        value={collabLocationFilter}
                        onChange={(e) => setCollabLocationFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  {(collabGenreFilter || collabLocationFilter) && (
                    <button
                      onClick={() => {
                        setCollabGenreFilter('');
                        setCollabLocationFilter('');
                      }}
                      className="mt-3 px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-all"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Custom Groups Management */}
                <div className="mb-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-4 border border-amber-400/30 mx-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Custom Groups (Albums/Songs):</span>
                    </div>
                    <button
                      onClick={() => setShowGroupModal(true)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      New Group
                    </button>
                  </div>

                  {customGroups.length === 0 ? (
                    <p className="text-white/60 text-sm">No custom groups yet. Create groups to organize your collaborators!</p>
                  ) : (
                    <div className="space-y-2">
                      {customGroups.map((group) => (
                        <div key={group.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{group.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white/60 text-xs">{group.collaborators.length} members</span>
                              <button
                                onClick={() => exportGroupToFile(group)}
                                className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs hover:bg-green-500/30 transition-all flex items-center gap-1"
                                title="Export group to text file"
                              >
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedGroupForEdit(group);
                                  setShowGroupModal(true);
                                }}
                                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs hover:bg-purple-500/30 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCustomGroup(group.id)}
                                className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Group Modal */}
                {showGroupModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">
                          {selectedGroupForEdit ? 'Edit Group' : 'Create New Group'}
                        </h3>
                        <button
                          onClick={() => {
                            setShowGroupModal(false);
                            setSelectedGroupForEdit(null);
                            setNewGroupName('');
                            setSelectedCollabsForGroup([]);
                          }}
                          className="text-white/70 hover:text-white transition-all"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      {!selectedGroupForEdit && (
                        <div className="mb-4">
                          <label className="text-white mb-2 block">Group Name (e.g., "Summer EP", "Album 2025"):</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newGroupName}
                              onChange={(e) => setNewGroupName(e.target.value)}
                              placeholder="Enter group name..."
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                            />
                            <button
                              onClick={() => {
                                if (newGroupName.trim()) {
                                  addCustomGroup(newGroupName);
                                }
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedGroupForEdit && (
                        <div className="mb-4">
                          <p className="text-white mb-2">Managing group: <strong>{selectedGroupForEdit.name}</strong></p>
                          <div className="space-y-2 mb-4">
                            <p className="text-white/70 text-sm">Select collaborators to add/remove:</p>
                            {filterCollaborations(safeCollaborations).map((collab) => {
                              const otherUser = collab.user1_id === savedProfileId ? collab.user2 : collab.user1;
                              const isInGroup = selectedGroupForEdit.collaborators.includes(collab.id);

                              return (
                                <div key={collab.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                  <span className="text-white">{otherUser.name}</span>
                                  <button
                                    onClick={() => {
                                      if (isInGroup) {
                                        removeCollabFromGroup(selectedGroupForEdit.id, collab.id);
                                      } else {
                                        addCollabToGroup(selectedGroupForEdit.id, collab.id);
                                      }
                                      // Update selected group
                                      const updated = customGroups.find(g => g.id === selectedGroupForEdit.id);
                                      if (updated) setSelectedGroupForEdit(updated);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                      isInGroup
                                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                    }`}
                                  >
                                    {isInGroup ? 'Remove' : 'Add'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Collaborations Display */}
                {safeCollaborations.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-12 text-center border border-white/20 mx-2">
                    <Mail className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-lg mb-4">
                      No accepted collaborations yet.
                    </p>
                    <p className="text-white/60 text-sm mb-6">
                      Accept collaboration requests above to see full contact information here.
                    </p>
                  </div>
                ) : filterCollaborations(safeCollaborations).length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-12 text-center border border-white/20 mx-2">
                    <Filter className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-lg mb-4">
                      No collaborations match your filters.
                    </p>
                    <button
                      onClick={() => {
                        setCollabGenreFilter('');
                        setCollabLocationFilter('');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
              {filterCollaborations(safeCollaborations)
                .slice((collaborationsPage - 1) * COLLABORATIONS_PER_PAGE, collaborationsPage * COLLABORATIONS_PER_PAGE)
                .map((collab) => {
                // Determine which user is the "other" user
                const otherUser = collab.user1_id === savedProfileId ? collab.user2 : collab.user1;

                // Additional safety check (should not happen due to earlier filtering, but defensive)
                if (!otherUser || !otherUser.name) {
                  console.error('Skipping render of collaboration with missing user data:', collab.id);
                  return null;
                }

                // Find which groups this collab belongs to
                const belongsToGroups = customGroups.filter(g => g.collaborators.includes(collab.id));

                return (
                  <div
                    key={collab.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-purple-400/50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 w-full"
                  >
                    {/* User Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{otherUser.name}</h3>
                        <div className="flex items-center gap-2">
                          <RoleIcon role={otherUser.role} className="w-4 h-4 text-purple-300" />
                          <p className="text-purple-300 text-sm font-semibold uppercase">{otherUser.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Groups Badge */}
                    {belongsToGroups.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {belongsToGroups.map(group => (
                          <span key={group.id} className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                            {group.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Location</span>
                        <p className="text-white text-sm">{otherUser.location}</p>
                      </div>

                      <div>
                        <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Genres</span>
                        <p className="text-white text-sm">{otherUser.genres_raw}</p>
                      </div>

                      {otherUser.skills_raw && (
                        <div>
                          <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Skills</span>
                          <p className="text-white text-sm">{otherUser.skills_raw}</p>
                        </div>
                      )}

                      {otherUser.experience_level && (
                        <div>
                          <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Experience</span>
                          <p className="text-white text-sm capitalize">{otherUser.experience_level}</p>
                        </div>
                      )}

                      {otherUser.collab_type && (
                        <div>
                          <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Collab Type</span>
                          <p className="text-white text-sm">{otherUser.collab_type}</p>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-300" />
                        <a
                          href={`mailto:${otherUser.email}`}
                          className="text-purple-300 hover:text-purple-200 text-sm break-all transition-colors"
                        >
                          {otherUser.email}
                        </a>
                      </div>

                      {otherUser.social_links && (
                        <div>
                          <span className="text-white/60 text-xs uppercase tracking-wide block mb-2">Social Links</span>
                          <div className="flex flex-wrap gap-2">
                            {parseSocialLinks(otherUser.social_links).map((link, idx) => {
                              const urlWithProtocol = ensureUrlProtocol(link.url);
                              if (!urlWithProtocol) return null; // Skip invalid URLs
                              const platformInfo = getPlatformInfo(link);
                              return (
                                <a
                                  key={idx}
                                  href={urlWithProtocol}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-3 py-1.5 bg-gradient-to-r ${platformInfo.color} text-white rounded-lg hover:shadow-lg transition-all text-xs font-medium flex items-center gap-1`}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  {platformInfo.label}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filterCollaborations(safeCollaborations).length > COLLABORATIONS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 mt-6 px-2">
                <button
                  onClick={() => setCollaborationsPage(prev => Math.max(1, prev - 1))}
                  disabled={collaborationsPage === 1}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <span className="text-white text-sm">
                  Page {collaborationsPage} of {Math.ceil(filterCollaborations(safeCollaborations).length / COLLABORATIONS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setCollaborationsPage(prev => Math.min(Math.ceil(filterCollaborations(safeCollaborations).length / COLLABORATIONS_PER_PAGE), prev + 1))}
                  disabled={collaborationsPage >= Math.ceil(filterCollaborations(safeCollaborations).length / COLLABORATIONS_PER_PAGE)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Next
                </button>
              </div>
            )}
            </>
                )}
              </div>

              {/* Starred Opportunities Section */}
              {starredOpportunitiesData.length > 0 && (
                <div className="mt-12 px-2">
                  {!selectedStarredOpportunity ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
                          <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Starred Opportunities ({starredOpportunitiesData.length})
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStarredOppsSliderIndex(prev => Math.max(0, prev - 1))}
                            disabled={starredOppsSliderIndex === 0}
                            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Previous"
                          >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                          <span className="text-white/60 text-sm">
                            {starredOppsSliderIndex + 1} / {starredOpportunitiesData.length}
                          </span>
                          <button
                            onClick={() => setStarredOppsSliderIndex(prev => Math.min(starredOpportunitiesData.length - 1, prev + 1))}
                            disabled={starredOppsSliderIndex >= starredOpportunitiesData.length - 1}
                            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Next"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mb-6">Swipe through your saved opportunities (most recent first)</p>

                      {/* Horizontal Slider */}
                      <div className="relative overflow-hidden">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${starredOppsSliderIndex * 100}%)` }}
                        >
                    {starredOpportunitiesData.map((opportunity) => (
                      <div
                        key={opportunity.id}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-amber-400/30 hover:border-amber-400/50 transition-all shadow-xl max-w-2xl mx-auto"
                        >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-1">
                              {opportunity.profiles?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center gap-2">
                              <RoleIcon role={opportunity.profiles?.role} className="w-4 h-4 text-purple-300" />
                              <p className="text-purple-300 text-sm capitalize">{opportunity.profiles?.role || 'Creator'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => unstarOpportunity(opportunity.id)}
                            className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-all"
                            title="Unstar opportunity"
                          >
                            <Star className="w-5 h-5 fill-white" />
                          </button>
                        </div>

                        <div className="bg-amber-500/20 px-3 py-1.5 rounded-full inline-block mb-4">
                          <span className="text-amber-300 text-xs font-semibold uppercase">
                            Looking for: {opportunity.looking_for_role}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Location</p>
                            <p className="text-white text-sm">{opportunity.location}</p>
                          </div>

                          {opportunity.genres && (
                            <div>
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Genres</p>
                              <p className="text-white text-sm">{opportunity.genres}</p>
                            </div>
                          )}

                          {opportunity.collab_type && (
                            <div>
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Collaboration Type</p>
                              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-xs font-medium capitalize inline-block">
                                {opportunity.collab_type}
                              </span>
                            </div>
                          )}

                          {opportunity.description && (
                            <div>
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Details</p>
                              <p className="text-white/80 text-sm line-clamp-3">{opportunity.description}</p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedStarredOpportunity(opportunity);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          View Full Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        </div>
                      </div>
                    ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Detail view for selected opportunity
                    <div className="max-w-4xl mx-auto">
                      <button
                        onClick={() => setSelectedStarredOpportunity(null)}
                        className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back to Starred Opportunities
                      </button>

                      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border-2 border-amber-400/30 shadow-2xl">
                        {/* Header with collaboration status */}
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                  {selectedStarredOpportunity.profiles?.name || 'Anonymous'}
                                </h2>
                              </div>
                              <div className="flex items-center gap-2">
                                <RoleIcon role={selectedStarredOpportunity.profiles?.role} className="w-5 h-5 text-purple-300" />
                                <p className="text-purple-300 text-base capitalize font-medium">
                                  {selectedStarredOpportunity.profiles?.role || 'Creator'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => unstarOpportunity(selectedStarredOpportunity.id)}
                              className="p-3 rounded-full bg-amber-500 text-white hover:bg-amber-600 hover:scale-110 transition-all shadow-lg"
                              title="Unstar opportunity"
                            >
                              <Star className="w-6 h-6 fill-white" />
                            </button>
                          </div>

                          {/* Collaboration Status Badge */}
                          {(() => {
                            const collabStatus = getCollaborationStatusForOpportunity(selectedStarredOpportunity);
                            let statusColor = 'bg-gray-500/20 text-gray-300 border-gray-500/40';
                            if (collabStatus.status === 'collaborated' || collabStatus.status === 'accepted') {
                              statusColor = 'bg-green-500/20 text-green-300 border-green-500/40';
                            } else if (collabStatus.status === 'pending_sent' || collabStatus.status === 'pending_received') {
                              statusColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                            } else if (collabStatus.status === 'rejected') {
                              statusColor = 'bg-red-500/20 text-red-300 border-red-500/40';
                            }
                            return (
                              <div className={`px-4 py-2 rounded-full border-2 ${statusColor} inline-flex items-center gap-2 font-semibold text-sm mb-4`}>
                                {collabStatus.status === 'collaborated' && <Check className="w-4 h-4" />}
                                {(collabStatus.status === 'pending_sent' || collabStatus.status === 'pending_received') && <Loader2 className="w-4 h-4 animate-spin" />}
                                {collabStatus.message}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Looking For Badge */}
                        <div className="bg-amber-500/20 px-4 py-2 rounded-full inline-block mb-6">
                          <span className="text-amber-300 text-sm font-bold uppercase">
                            Looking for: {selectedStarredOpportunity.looking_for_role}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Location</p>
                            <p className="text-white text-base font-medium">{selectedStarredOpportunity.location}</p>
                          </div>

                          {selectedStarredOpportunity.genres && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Genres</p>
                              <p className="text-white text-base">{selectedStarredOpportunity.genres}</p>
                            </div>
                          )}

                          {selectedStarredOpportunity.collab_type && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Collaboration Type</p>
                              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-sm font-medium capitalize inline-block">
                                {selectedStarredOpportunity.collab_type}
                              </span>
                            </div>
                          )}

                          {selectedStarredOpportunity.profiles?.email && canSeeUserEmail(selectedStarredOpportunity.user_id) && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Contact</p>
                              <p className="text-white text-base break-all">{selectedStarredOpportunity.profiles.email}</p>
                            </div>
                          )}

                          {selectedStarredOpportunity.profiles?.email && !canSeeUserEmail(selectedStarredOpportunity.user_id) && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <p className="text-white/60 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-amber-400" />
                                Contact
                              </p>
                              <p className="text-white/60 text-sm">Connect with this user to view their email address</p>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {selectedStarredOpportunity.description && (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
                            <p className="text-white/60 text-xs uppercase tracking-wide mb-3">Details</p>
                            <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                              {selectedStarredOpportunity.description}
                            </p>
                          </div>
                        )}

                        {/* Profile Bio */}
                        {selectedStarredOpportunity.profiles?.bio && (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
                            <p className="text-white/60 text-xs uppercase tracking-wide mb-3">About {selectedStarredOpportunity.profiles.name}</p>
                            <p className="text-white/90 text-base leading-relaxed">
                              {selectedStarredOpportunity.profiles.bio}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {(() => {
                            const collabStatus = getCollaborationStatusForOpportunity(selectedStarredOpportunity);

                            if (collabStatus.status === 'none') {
                              return (
                                <button
                                  onClick={() => sendInvitation(selectedStarredOpportunity.id, selectedStarredOpportunity.user_id)}
                                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                  <Send className="w-5 h-5" />
                                  Send Collaboration Request
                                </button>
                              );
                            } else if (collabStatus.status === 'pending_received') {
                              return (
                                <div className="flex-1 flex gap-3">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      acceptInvitation(collabStatus.invitation.id, collabStatus.invitation.from_user_id);
                                    }}
                                    disabled={isLoadingInvitations}
                                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Check className="w-5 h-5" />
                                    Accept Invitation
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      rejectInvitation(collabStatus.invitation.id, collabStatus.invitation.from_user_id);
                                    }}
                                    disabled={isLoadingInvitations}
                                    className="px-6 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Decline
                                  </button>
                                </div>
                              );
                            } else if (collabStatus.status === 'collaborated') {
                              return (
                                <button
                                  onClick={() => setCurrentView(VIEWS.INBOX)}
                                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  View in Collaborations
                                </button>
                              );
                            } else if (collabStatus.status === 'pending_sent') {
                              return (
                                <div className="flex-1 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl font-semibold text-center">
                                  Waiting for response...
                                </div>
                              );
                            } else if (collabStatus.status === 'accepted') {
                              return (
                                <div className="flex-1 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl font-semibold text-center">
                                  ✓ Collaboration accepted
                                </div>
                              );
                            }
                          })()}

                          <button
                            onClick={() => viewConnectedUserProfile(selectedStarredOpportunity.user_id)}
                            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </>
    );
  }

  // Success view
  if (currentView === VIEWS.SUCCESS) {
    return (
      <>
        <SpaceBackground />
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-4xl w-full border border-white/20 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Profile Complete! 🎉</h2>
            <p className="text-xl text-white/80 mb-4">Your music collab profile is ready</p>
          </div>


          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Profile
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(profile).map(([key, value]) => (
                  <div key={key} className="mb-3 pb-3 border-b border-white/10 last:border-0">
                    <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">
                      {key.replace('_', ' ')}
                    </span>
                    <p className="text-white mt-1 break-anywhere text-sm leading-relaxed">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Top Matches
              </h3>
              {isLoadingMatches ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <span className="ml-3 text-white/80">Finding your perfect matches...</span>
                </div>
              ) : matches && matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.slice(0, 3).map((match, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all">
                      <div className="flex justify-between items-start mb-2 gap-3">
                        <h4 className="text-white font-bold text-base flex-1">{match.name}</h4>
                        <div className="flex items-center gap-1 bg-purple-500/20 px-3 py-1 rounded-full flex-shrink-0">
                          <Star className="w-4 h-4 text-purple-300" />
                          <span className="text-purple-300 font-bold text-sm">{match.score}%</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed break-anywhere">{match.reason}</p>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <p className="text-white/50 text-xs">View more matches in Browse</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">No matches found yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentView(VIEWS.DASHBOARD)}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              View Dashboard
            </button>

            <button
              onClick={() => {
                setCurrentView(VIEWS.BROWSE);
                loadProfiles();
              }}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Browse Collaborators
            </button>

            <button
              onClick={() => {
                setCurrentView(VIEWS.OPPORTUNITIES);
                loadOpportunities();
              }}
              className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              View Opportunities
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Browse view
  if (currentView === VIEWS.BROWSE) {
    return (
      <>
        <SpaceBackground />
        {renderBrowsePage()}
      </>
    );
  }

  // Profile Detail view
  if (currentView === VIEWS.PROFILE_DETAIL && selectedProfile) {
    const profileUnlocked = isProfileUnlocked(selectedProfile);

    return (
      <>
        <SpaceBackground />
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <button
              onClick={() => setCurrentView(previousView || VIEWS.BROWSE)}
              className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              {previousView === VIEWS.OPPORTUNITIES ? 'Back to Opportunities' :
               previousView === VIEWS.INBOX ? 'Back to Inbox' : 'Back to Browse'}
            </button>

            <div className="flex items-start gap-6 mb-8">
              <UserAvatar user={selectedProfile} size="3xl" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-4xl font-bold text-white">{selectedProfile.name}</h1>
                  {getCollabBadge(selectedProfile.accepted_collabs || 0) && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getCollabBadge(selectedProfile.accepted_collabs || 0).bgColor} border-2 ${getCollabBadge(selectedProfile.accepted_collabs || 0).borderColor}`}>
                      <Award className={`w-5 h-5 ${getCollabBadge(selectedProfile.accepted_collabs || 0).textColor}`} />
                      <span className={`text-sm font-bold ${getCollabBadge(selectedProfile.accepted_collabs || 0).textColor}`}>
                        {getCollabBadge(selectedProfile.accepted_collabs || 0).level} CollabX
                      </span>
                    </div>
                  )}
                  {isConnectedToUser(selectedProfile.id) && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border-2 border-green-500/50" title="You are connected with this user">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-bold text-green-400">
                        Connected
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <RoleIcon role={selectedProfile.role} className="w-6 h-6 text-purple-300" />
                  <p className="text-2xl text-purple-300 font-semibold uppercase">{selectedProfile.role}</p>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <span>{selectedProfile.location}</span>
                </div>
                {getMembershipDuration(selectedProfile.created_at) && (
                  <p className="text-cyan-400 text-sm mt-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member for {getMembershipDuration(selectedProfile.created_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Collaboration Request Button */}
            {savedProfileId && savedProfileId !== selectedProfile.id && (
              <div className="mb-6">
                {areUsersConnected(selectedProfile.id) ? (
                  <div className="w-full py-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 text-green-300 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Already Connected
                  </div>
                ) : hasPendingDirectCollabRequest(selectedProfile.id) ? (
                  <button
                    disabled
                    className="w-full py-4 bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-xl font-semibold cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Invitation Pending
                  </button>
                ) : (
                  <button
                    onClick={() => sendDirectCollabRequest(selectedProfile.id)}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Send Collaboration Request
                  </button>
                )}
              </div>
            )}

            {!savedProfileId && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    showToast('Please log in or sign up to send collaboration requests', 'info');
                    setCurrentView(VIEWS.LOGIN);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white rounded-xl font-semibold hover:from-purple-600/50 hover:to-pink-600/50 transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Send Collaboration Request (Login Required)
                </button>
              </div>
            )}

            {/* Always visible: Genres, Role, Location, Bio */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Visible Information
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Genres</span>
                  <p className="text-white">{selectedProfile.genres_raw}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Role</span>
                  <div className="flex items-center gap-2">
                    <RoleIcon role={selectedProfile.role} className="w-5 h-5 text-purple-400" />
                    <p className="text-white capitalize">{selectedProfile.role}</p>
                  </div>
                </div>
                <div>
                  <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Location</span>
                  <p className="text-white">{selectedProfile.location}</p>
                </div>
                {selectedProfile.bio && (
                  <div>
                    <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Bio</span>
                    <p className="text-white">{selectedProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {!profileUnlocked && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6 text-center">
                <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Privacy Mode Enabled</h3>
                <p className="text-white/70">
                  This user has privacy mode enabled. Send a collaboration request to view their full profile details.
                </p>
              </div>
            )}

            {profileUnlocked && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Skills & Experience
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Skills</span>
                        <p className="text-white">{selectedProfile.skills_raw}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Experience Level</span>
                        <p className="text-white capitalize">{selectedProfile.experience_level}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Collaboration Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Availability</span>
                        <p className="text-white">{selectedProfile.availability}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm uppercase tracking-wide block mb-1">Collaboration Type</span>
                        <p className="text-white">{selectedProfile.collab_type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedProfile.social_links && canSeeSocialLinks(selectedProfile.id) && (
                  <div className="bg-white/5 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Social Links & Portfolio</h3>
                    <div className="flex flex-wrap gap-3">
                      {parseSocialLinks(selectedProfile.social_links).map((link, idx) => {
                        const urlWithProtocol = ensureUrlProtocol(link.url);
                        if (!urlWithProtocol) return null; // Skip invalid URLs
                        const platformInfo = getPlatformInfo(link);
                        return (
                          <a
                            key={idx}
                            href={urlWithProtocol}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 bg-gradient-to-r ${platformInfo.color} text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2`}
                          >
                            <ArrowRight className="w-4 h-4" />
                            {platformInfo.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedProfile.social_links && !canSeeSocialLinks(selectedProfile.id) && (
                  <div className="bg-white/5 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-400" />
                      Social Links & Portfolio
                    </h3>
                    <p className="text-white/60">
                      Social links will be visible once you send a collaboration request. Send a request using the button above to view their social profiles.
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Contact {selectedProfile.name}</h3>
                  {canSeeUserEmail(selectedProfile.id) ? (
                    <>
                      <p className="text-white/70 mb-4">
                        Reach out through their social links above or email them at:
                      </p>
                      <a
                        href={`mailto:${selectedProfile.email}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        <Mail className="w-5 h-5" />
                        {selectedProfile.email}
                      </a>
                    </>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white/70">
                        {canSeeSocialLinks(selectedProfile.id)
                          ? "Your collaboration request is pending. Email address will be visible once your request is accepted."
                          : "Send a collaboration request to unlock their social links. Email address will be available once the request is accepted."}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  // Signup view (default)
  return (
    <>
      <SpaceBackground />
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Only show back button for unauthenticated users who haven't started signup */}
        {!authUser && currentStep === 0 && (
          <button
            onClick={() => setCurrentView(VIEWS.INTRO)}
            className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>
        )}
        {/* Show warning message for authenticated users who must complete profile */}
        {authUser && currentStep === 0 && (
          <div className="mb-4 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-semibold text-sm">Profile Completion Required</p>
              <p className="text-amber-200/80 text-sm mt-1">
                You must complete your profile to access the dashboard. All fields except social links are required. Social links are optional but recommended (adds 10% to completion).
              </p>
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm font-medium">Step {currentStep + 1} of {FIELDS.length}</span>
            <span className="text-white/80 text-sm font-medium">{Math.round(((currentStep + 1) / FIELDS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / FIELDS.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Music Collab Profile</h1>
          </div>

          {!supabase && (
            <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 font-semibold text-sm">Configuration Required</p>
                <p className="text-yellow-200/80 text-sm mt-1">
                  VITE_SUPABASE_ANON_KEY environment variable is not set. Profile saving will not work until this is configured.
                </p>
              </div>
            </div>
          )}

          {/* Floating Message on First Page */}
          {currentStep === 0 && (
            <div className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-xl p-4 flex items-start gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-200 font-semibold text-sm">💡 Important Tip</p>
                <p className="text-blue-100 text-sm mt-1">
                  Please use your <strong>real information</strong> for authentic collaborations and future opportunities. This helps you connect with serious musicians and build genuine partnerships.
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-3xl font-bold text-white mb-4">{QUESTIONS[currentField]}</label>

            {OPTIONS[currentField] ? (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {OPTIONS[currentField].map((option) => (
                  <button key={option} onClick={() => handleOptionSelect(option)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      currentInput === option
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/20'
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
            ) : currentField === 'social_links' ? (
              <div className="space-y-4">
                <p className="text-white/60 text-sm mb-4">Add your music profiles and social links (optional)</p>

                {/* Platform selector and URL input */}
                <div className="flex gap-3">
                  <select
                    value={currentLinkPlatform}
                    onChange={(e) => setCurrentLinkPlatform(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  >
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.value} value={platform.value} className="bg-zinc-900">
                        {platform.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="url"
                    value={currentLinkUrl}
                    onChange={(e) => setCurrentLinkUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSocialLink()}
                    placeholder={SOCIAL_PLATFORMS.find(p => p.value === currentLinkPlatform)?.placeholder}
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                  />

                  <button
                    onClick={addSocialLink}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>

                {/* Display added links */}
                {socialLinks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white/60 text-sm">Added links:</p>
                    {socialLinks.map((link) => (
                      <div
                        key={link.platform}
                        className="flex items-center justify-between bg-white/5 border border-white/20 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-purple-300 font-medium">
                            {SOCIAL_PLATFORMS.find(p => p.value === link.platform)?.label || 'Custom'}
                          </span>
                          <span className="text-white/60 text-sm truncate">{link.url}</span>
                        </div>
                        <button
                          onClick={() => removeSocialLink(link.platform)}
                          className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : currentField === 'bio' ? (
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={PLACEHOLDERS[currentField]}
                rows={5}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all text-lg resize-none"
                autoFocus
              />
            ) : (
              <input type={currentField === 'email' ? 'email' : 'text'} value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                placeholder={PLACEHOLDERS[currentField]}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all text-lg"
                autoFocus />
            )}

            {validationMessage && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">{validationMessage}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <button onClick={() => { setCurrentStep(currentStep - 1); setCurrentInput(profile[FIELDS[currentStep - 1]] || ""); }}
                className="px-6 py-3 bg-white/5 text-white/80 rounded-xl font-medium hover:bg-white/10 transition-all border border-white/20">
                Back
              </button>
            )}
            
            <button onClick={handleNext} disabled={currentField !== 'social_links' && !currentInput.trim() && !profile[currentField]}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                isValidating ? 'bg-yellow-500/20 text-yellow-300 cursor-wait'
                  : (currentField !== 'social_links' && !currentInput.trim() && !profile[currentField]) ? 'bg-white/5 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:scale-105'
              }`}>
              {isValidating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  {currentStep === FIELDS.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Required fields notice */}
          <div className="mt-4 text-center">
            <p className="text-white/40 text-xs">
              {currentField === 'social_links'
                ? '✨ Social links are optional - skip if you prefer'
                : '* This field is required to complete your profile'}
            </p>
          </div>

          {Object.keys(profile).length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm mb-3">Completed:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(profile).map((key) => (
                  <span key={key} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    {key.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Math CAPTCHA Overlay */}
        {showCaptcha && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify You're Human</h2>
                <p className="text-white/70 text-sm">Please solve this simple math problem to continue</p>
              </div>

              <div className="mb-6">
                <label className="block text-white/80 text-sm mb-3 text-center">
                  What is <span className="text-3xl font-bold text-white px-3">{mathQuestion.question}</span> ?
                </label>
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSaving && verifyCaptcha()}
                  placeholder="Enter your answer"
                  disabled={isSaving}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white text-center text-2xl placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  autoFocus
                />
              </div>

              {captchaError && (
                <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm text-center">{captchaError}</p>
                </div>
              )}

              <button
                onClick={verifyCaptcha}
                disabled={!mathAnswer || isSaving}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  !mathAnswer || isSaving
                    ? 'bg-white/5 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:scale-105'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Profile...
                  </span>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <p className="text-white/50 text-xs text-center mt-4">
                This helps us prevent spam and ensure real collaborators
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Delete Account Confirmation Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Delete Account?</h2>
            <p className="text-white/70">This action cannot be undone</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-white/90 text-sm">
              Are you sure you want to permanently delete your account? This will:
            </p>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                Delete your profile and all personal information
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                Remove all your collaboration requests
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                Sign you out immediately
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Toast Notifications */}
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`backdrop-blur-xl rounded-xl shadow-2xl border overflow-hidden transition-all duration-300 ${
            toast.removing ? 'animate-slide-out-right' : 'animate-slide-in-right'
          } ${
            toast.type === 'success'
              ? 'bg-green-500/20 border-green-500/50'
              : toast.type === 'error'
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-blue-500/20 border-blue-500/50'
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className={`flex-shrink-0 ${
              toast.type === 'success'
                ? 'text-green-400'
                : toast.type === 'error'
                ? 'text-red-400'
                : 'text-blue-400'
            }`}>
              {toast.type === 'success' && <CheckCircle className="w-6 h-6" />}
              {toast.type === 'error' && <XCircle className="w-6 h-6" />}
              {toast.type === 'info' && <Info className="w-6 h-6" />}
            </div>
            <p className="text-white text-sm flex-1 pt-0.5">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress bar container with visible animation */}
          <div className="h-1 bg-white/10 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              toast.type === 'success'
                ? 'from-green-500 to-emerald-500'
                : toast.type === 'error'
                ? 'from-red-500 to-pink-500'
                : 'from-blue-500 to-cyan-500'
            } ${!toast.removing ? 'animate-progress' : ''}`} />
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
