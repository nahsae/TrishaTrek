import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, ArrowLeft, ArrowRight, SkipForward, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Question, InsertGameSession } from "@shared/schema";

interface GameState {
  currentQuestion: number;
  score: number;
  correctAnswers: number;
  answers: string[];
  timeRemaining: number;
  isComplete: boolean;
  lastResult?: {
    isCorrect: boolean;
    selectedAnswer: string;
    correctAnswer: string;
    correctAnswerText: string;
  };
}

// Fun desi-style wrong answer roasts
const wrongAnswerRoasts = [
  "Arre yaar, galti ho gayi—par tension nahi, try again! 😜",
  "Bhai, thoda dhoka ho gaya—dusri baar phir se dekh! 😂", 
  "Oops! Thoda focus dhyaan se, ek aur chance! 😉",
  "Arey chutki bajao, ye answer toh goli se bhi tez chala! 🤣",
  "Galat jawab, par fikar not—inspo milega next time! 😁",
  "Haww! Ye toh complete miss ho gaya—next wale mein dhamaal karna! 🙈",
  "Arrey boss, thoda sa off-track ho gaye—wapas aa jaao! 🎯"
];

export default function Trivia() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    correctAnswers: 0,
    answers: [],
    timeRemaining: 45,
    isComplete: false,
    lastResult: undefined,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const saveGameSession = useMutation({
    mutationFn: (session: InsertGameSession) => 
      apiRequest("POST", "/api/game-sessions", session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({
        title: "Score Saved! 🎉",
        description: "Your trivia results have been added to the leaderboard.",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameState.isComplete || gameState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          // Use setTimeout to avoid state update during render
          setTimeout(() => handleNextQuestion(), 0);
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameState.isComplete, gameState.timeRemaining]);

  const currentQuestion = questions[gameState.currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((gameState.currentQuestion) / totalQuestions) * 100;

  const startGame = () => {
    if (!playerName.trim()) {
      toast({
        title: "Player Name Required",
        description: "Please enter your name to start the trivia.",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const pointsEarned = isCorrect ? 100 : 0;

    // Store result info before updating state
    const resultInfo = {
      isCorrect,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      correctAnswerText: currentQuestion[`option${currentQuestion.correctAnswer}` as keyof typeof currentQuestion]
    };

    setGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      answers: [...prev.answers, selectedAnswer],
      currentQuestion: prev.currentQuestion + 1,
      timeRemaining: 45,
      lastResult: resultInfo, // Store result for display
    }));

    if (isCorrect) {
      toast({
        title: "Waah! Bilkul sahi! 🎉",
        description: "+100 points milte hai!",
      });
    } else {
      const randomRoast = wrongAnswerRoasts[Math.floor(Math.random() * wrongAnswerRoasts.length)];
      toast({
        title: randomRoast,
        description: `Sahi jawab tha: ${resultInfo.correctAnswerText}`,
        variant: "destructive",
      });
    }

    setSelectedAnswer("");
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      if (gameState.currentQuestion + 1 >= totalQuestions) {
        finishGame();
      }
    }, 2000);
  };

  const skipQuestion = () => {
    setSelectedAnswer("");
    handleNextQuestion();
  };

  const finishGame = () => {
    setGameState(prev => ({ ...prev, isComplete: true }));
    
    saveGameSession.mutate({
      playerName,
      score: gameState.score,
      correctAnswers: gameState.correctAnswers,
      totalQuestions: totalQuestions,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-effect border-none">
          <CardContent className="p-8 text-center">
            <div className="text-white text-xl">Loading trivia questions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto shadow-2xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-poppins font-bold text-gray-800 mb-6">
                Ready to Play? 🎮
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your name to start the birthday trivia challenge!
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-birthday-pink focus:border-transparent mb-6"
                onKeyDown={(e) => e.key === "Enter" && startGame()}
              />
              <Button 
                onClick={startGame}
                className="w-full bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold py-3 rounded-xl"
              >
                Start Trivia Challenge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="shadow-2xl">
              <CardContent className="p-12">
                <Trophy className="w-20 h-20 text-birthday-yellow mx-auto mb-6" />
                <h2 className="text-4xl font-poppins font-bold text-gray-800 mb-4">
                  Trivia Complete! 🎉
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Great job, {playerName}!
                </p>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-birthday-pink mb-2">
                      {gameState.score}
                    </div>
                    <div className="text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-birthday-teal mb-2">
                      {gameState.correctAnswers}
                    </div>
                    <div className="text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-birthday-yellow mb-2">
                      {totalQuestions - gameState.correctAnswers}
                    </div>
                    <div className="text-gray-600">Wrong</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.reload()}
                    className="bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold px-8 py-3 rounded-full"
                  >
                    Play Again
                  </Button>
                  <Button 
                    onClick={() => window.location.href = "/leaderboard"}
                    className="bg-birthday-teal hover:bg-birthday-teal/80 text-white font-bold px-8 py-3 rounded-full"
                  >
                    View Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-effect border-none">
          <CardContent className="p-8 text-center">
            <div className="text-white text-xl">No more questions available!</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white/10 backdrop-blur-md min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
            🧠 Trivia Challenge
          </h2>
          <p className="text-xl text-white/80">How well do you know Trisha? Let's find out!</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                Question {gameState.currentQuestion + 1} of {totalQuestions}
              </span>
              <span className="text-white font-medium">Score: {gameState.score} pts</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={gameState.currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-2xl mb-8">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <img 
                        src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                        alt="Interactive trivia game interface display" 
                        className="rounded-xl w-full h-48 object-cover"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <Badge className="bg-birthday-pink text-white px-4 py-2 rounded-full font-medium">
                        {currentQuestion.category}
                      </Badge>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-mono text-lg">
                          {String(Math.floor(gameState.timeRemaining / 60)).padStart(2, '0')}:
                          {String(gameState.timeRemaining % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-poppins font-bold text-gray-800 mb-8 leading-relaxed">
                      {currentQuestion.text}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {[
                        { key: "A", text: currentQuestion.optionA },
                        { key: "B", text: currentQuestion.optionB },
                        { key: "C", text: currentQuestion.optionC },
                        { key: "D", text: currentQuestion.optionD },
                      ].map((option) => (
                        <Button
                          key={option.key}
                          variant="outline"
                          onClick={() => handleAnswerSelect(option.key)}
                          className={`group h-auto p-6 text-left transition-all duration-300 transform hover:scale-105 ${
                            selectedAnswer === option.key
                              ? "bg-birthday-pink text-white border-birthday-pink"
                              : "bg-gray-50 hover:bg-birthday-pink hover:text-white border-gray-200 hover:border-birthday-pink"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                              selectedAnswer === option.key
                                ? "bg-white text-birthday-pink"
                                : "bg-gray-300 group-hover:bg-white group-hover:text-birthday-pink"
                            }`}>
                              {option.key}
                            </span>
                            <span className="font-medium text-lg">{option.text}</span>
                          </div>
                        </Button>
                      ))}
                    </div>

                    <div className="flex justify-end items-center">
                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          onClick={skipQuestion}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          Skip Question
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={!selectedAnswer}
                          className="bg-birthday-teal hover:bg-birthday-teal/80 text-white"
                        >
                          {gameState.currentQuestion + 1 >= totalQuestions ? "Finish" : "Next Question"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-96"
              >
                <Card className="shadow-2xl">
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">
                      {gameState.lastResult?.isCorrect ? "🎉" : "😔"}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {gameState.lastResult?.isCorrect ? "Shabash! 🎉" : "Oho! 😅"}
                    </h3>
                    <p className="text-gray-600">
                      {gameState.lastResult?.isCorrect 
                        ? "Waah! Bilkul sahi! +100 points 🎉" 
                        : `Sahi jawab tha: ${gameState.lastResult?.correctAnswerText}`
                      }
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Stats */}
          {!showResult && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass-effect border-none">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {gameState.correctAnswers}
                  </div>
                  <div className="text-white/80 text-sm">Correct</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-none">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {gameState.answers.length - gameState.correctAnswers}
                  </div>
                  <div className="text-white/80 text-sm">Wrong</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-none">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {totalQuestions - gameState.answers.length}
                  </div>
                  <div className="text-white/80 text-sm">Remaining</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
