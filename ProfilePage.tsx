import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Award, Bell, Tv, LogOut, RefreshCw, Check } from 'lucide-react';
import { <TouchableOpacity> } from './ui/button';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';

const LEVELS = [
  { level: 1, title: 'Movie Newbie', movies: 0 },
  { level: 2, title: 'Casual Viewer', movies: 5 },
  { level: 3, title: 'Film Enthusiast', movies: 15 },
  { level: 4, title: 'Cinema Buff', movies: 30 },
  { level: 5, title: 'Movie Master', movies: 50 }, 
  { level: 6, title: 'Film Critic', movies: 75 }, 
  { level: 7, title: 'Cinema Legend', movies: 100 },
];

const STREAMING_SERVICES = [
  { name: 'Netflix', logo: 'N', color: '#E50914' },
  { name: 'Disney+', logo: 'D+', color: '#113CCF' },
  { name: 'HBO Max', logo: 'HBO', color: '#6C5CE7' },
  { name: 'Amazon Prime', logo: 'P', color: '#00A8E1' },
  { name: 'Hulu', logo: 'H', color: '#1CE783' },
  { name: 'Apple TV+', logo: 'TV+', color: '#000000' },
  { name: 'Paramount+', logo: 'P+', color: '#0064FF' },
  { name: 'Peacock', logo: 'P', color: '#6C2C91' },
  { name: 'Showtime', logo: 'SHO', color: '#FF0000' }
];

export function ProfileScreen() {
  const { userData, updateUserData, setCurrentScreen } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    userData?.streamingServices || []
  );

  const currentLevel = LEVELS.find(l => l.level === (userData?.level || 1)) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === (userData?.level || 1) + 1);
  const moviesWatched = userData?.watchedMovies?.length || 0;
  const progress = nextLevel
    ? ((moviesWatched - currentLevel.movies) / (nextLevel.movies - currentLevel.movies)) * 100
    : 100;

  const toggleService = (serviceName: string) => {
    const updated = selectedServices.includes(serviceName)
      ? selectedServices.filter(s => s !== serviceName)
      : [...selectedServices, serviceName];
    setSelectedServices(updated);
    updateUserData({ streamingServices: updated });
  };

  const handleRetakeQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleLogout = () => {
    setCurrentScreen('auth');
  };

  return (
    <View className="min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-black pb-24">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-white">Profile</h1>
      </View>

      <View className="px-6 space-y-6">
        {/* User Info */}
        <View className="bg-[#0a0a1a] rounded-2xl p-6 space-y-4">
          <View className="flex items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-[#5C7AB8] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </View>
            <View className="flex-1">
              <h2 className="text-xl text-white">{userData?.username || 'Guest'}</h2>
              <p className="text-sm text-gray-400">{userData?.email}</p>
            </View>
          </View>

          {/* Level System */}
          <View className="space-y-3 pt-4 border-t border-[#5C7AB8]/20">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#5C7AB8]" />
                <span className="text-white">{currentLevel.title}</span>
              </View>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-sm text-[#7B9ED9] hover:text-[#5C7AB8]">
                    View All Levels
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a1a] border-[#5C7AB8]/30">
                  <DialogHeader>
                    <DialogTitle className="text-white">All Levels</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Track your progress and unlock new levels by watching movies
                    </DialogDescription>
                  </DialogHeader>
                  <View className="space-y-3 py-4 max-h-96 overflow-y-auto">
                    {LEVELS.map((level) => (
                      <View
                        key={level.level}
                        className={`p-4 rounded-lg ${
                          level.level === userData?.level
                            ? 'bg-[#5C7AB8]'
                            : level.movies <= moviesWatched
                            ? 'bg-[#2a2a4a]'
                            : 'bg-[#1a1a2e] opacity-50'
                        }`}
                      >
                        <View className="flex items-center justify-between">
                          <View>
                            <h4 className="text-white">{level.title}</h4>
                            <p className="text-sm text-gray-400">
                              Watch {level.movies} movies
                            </p>
                          </View>
                          <View className="text-2xl text-gray-400">
                            {level.movies <= moviesWatched ? '✓' : '🔒'}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </DialogContent>
              </Dialog>
            </View>
            <View className="space-y-1">
              <View className="flex justify-between text-sm text-gray-400">
                <span>{moviesWatched} movies watched</span>
                {nextLevel && <span>{nextLevel.movies} to next level</span>}
              </View>
              <Progress value={progress} className="h-2" />
            </View>
          </View>
        </View>

        {/* Favorite Genres */}
        <View className="bg-[#0a0a1a] rounded-2xl p-6 space-y-4">
          <View className="flex items-center justify-between">
            <h3 className="text-white">Favorite Genres</h3>
            <button
              onClick={handleRetakeQuiz}
              className="text-sm text-[#7B9ED9] hover:text-[#5C7AB8] flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Quiz
            </button>
          </View>
          <View className="flex flex-wrap gap-2">
            {userData?.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-[#5C7AB8] text-white rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </View>
        </View>

        {/* Streaming Services */}
        <View className="bg-[#0a0a1a] rounded-2xl p-6 space-y-4">
          <View className="flex items-center gap-2 mb-3">
            <Tv className="w-5 h-5 text-[#5C7AB8]" />
            <h3 className="text-white">My Streaming Services</h3>
          </View>
          <View className="grid grid-cols-3 gap-2">
            {STREAMING_SERVICES.map((service) => (
              <button
                key={service.name}
                onClick={() => toggleService(service.name)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 p-2 transition-all border ${
                  selectedServices.includes(service.name)
                    ? 'bg-[#5C7AB8] border-[#5C7AB8] shadow-md'
                    : 'bg-[#1a1a2e] border-[#2a2a4a] hover:border-[#5C7AB8]/40'
                }`}
              >
                <View className="relative">
                  {service.isApple ? (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" style={{ color: selectedServices.includes(service.name) ? '#FFFFFF' : service.color }}>
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  ) : (
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: selectedServices.includes(service.name) ? '#FFFFFF' : service.color }}
                    >
                      {service.logo} 
                    </span>
                  )}
                  {selectedServices.includes(service.name) && (
                    <View className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#5C7AB8]" />
                    </View>
                  )}
                </View>
                <span className={`text-[10px] leading-tight text-center ${
                  selectedServices.includes(service.name) ? 'text-white' : 'text-gray-400'
                }`}>
                  {service.name}
                </span>
              </button>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View className="bg-[#0a0a1a] rounded-2xl p-6">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#5C7AB8]" />
              <View>
                <h3 className="text-white">Notifications</h3>
                <p className="text-sm text-gray-400">Get updates about new recommendations</p>
              </View>
            </View>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </View>
        </View>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </View>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </View>
  );
}