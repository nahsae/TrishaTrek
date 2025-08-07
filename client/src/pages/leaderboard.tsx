import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award, Crown, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GameSession } from "@shared/schema";

export default function Leaderboard() {
  const { data: leaderboard = [], isLoading } = useQuery<GameSession[]>({
    queryKey: ["/api/leaderboard"],
  });

  const { data: analytics } = useQuery<{ totalQuestions: number; totalPlayers: number }>({
    queryKey: ["/api/analytics"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-8 h-8 text-birthday-yellow" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Award className="w-8 h-8 text-birthday-coral" />;
      default: return null;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return "border-birthday-yellow bg-birthday-yellow/10";
      case 2: return "border-gray-400 bg-gray-100";
      case 3: return "border-birthday-coral bg-birthday-coral/10";
      default: return "border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-effect border-none">
          <CardContent className="p-8 text-center">
            <div className="text-white text-xl">Loading leaderboard...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <section className="py-16 bg-white/10 backdrop-blur-md min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
            🏆 Leaderboard
          </h2>
          <p className="text-xl text-white/80">See who knows Trisha best!</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Analytics Cards */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-birthday-teal mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-2">
                  {analytics?.totalQuestions || 0}
                </div>
                <div className="text-white/80 font-medium">Total Questions</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-none">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-birthday-pink mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-2">
                  {analytics?.totalPlayers || 0}
                </div>
                <div className="text-white/80 font-medium">Players</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <motion.div 
              className="flex justify-center items-end mb-12 space-x-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Medal className="w-10 h-10 text-gray-600" />
                  </div>
                  <Card className="shadow-xl">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-800">{topThree[1].playerName}</h4>
                      <p className="text-birthday-teal font-bold text-lg">{topThree[1].score} pts</p>
                      <p className="text-sm text-gray-500">
                        {topThree[1].correctAnswers}/{topThree[1].totalQuestions} correct
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-birthday-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Crown className="w-12 h-12 text-gray-800" />
                </div>
                <Card className="shadow-xl border-4 border-birthday-yellow">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-gray-800 text-lg">{topThree[0].playerName}</h4>
                    <p className="text-birthday-pink font-bold text-xl">{topThree[0].score} pts</p>
                    <p className="text-sm text-gray-500">
                      {topThree[0].correctAnswers}/{topThree[0].totalQuestions} correct
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-birthday-coral rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <Card className="shadow-xl">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-gray-800">{topThree[2].playerName}</h4>
                      <p className="text-birthday-teal font-bold text-lg">{topThree[2].score} pts</p>
                      <p className="text-sm text-gray-500">
                        {topThree[2].correctAnswers}/{topThree[2].totalQuestions} correct
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* Full Leaderboard */}
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-birthday-pink to-birthday-teal p-6">
              <h3 className="text-2xl font-poppins font-bold text-white">Complete Rankings</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {leaderboard.length === 0 ? (
                <div className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No scores yet!</h3>
                  <p className="text-gray-400">Be the first to play the trivia and set a high score.</p>
                </div>
              ) : (
                leaderboard.map((player, index) => {
                  const position = index + 1;
                  return (
                    <motion.div
                      key={player.id}
                      className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${getPositionColor(position)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {position <= 3 ? (
                            getPodiumIcon(position)
                          ) : (
                            <span className="w-8 h-8 bg-birthday-lavender text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {position}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{player.playerName}</h4>
                          <p className="text-gray-500 text-sm">
                            Completed {formatTimeAgo(player.completedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-birthday-teal">{player.score} pts</div>
                        <div className="text-sm text-gray-500">
                          {player.correctAnswers}/{player.totalQuestions} correct
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {Math.round((player.correctAnswers / player.totalQuestions) * 100)}% accuracy
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Encouragement Section */}
          {leaderboard.length > 0 && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="bg-birthday-yellow border-none">
                <CardContent className="p-6">
                  <h4 className="font-poppins font-bold text-gray-800 text-xl mb-2">
                    Think you can do better? 🚀
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Challenge yourself and see if you can beat the current high score!
                  </p>
                  <a 
                    href="/trivia"
                    className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
                  >
                    Play Trivia Challenge
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
