import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import defaultTimeline from "@/data/defaultTimeline";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Sparkles, Cake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { TimelineEvent } from "@shared/schema";

export default function Timeline() {
  const [visibleCards, setVisibleCards] = useState(new Set<string>());
  const [birthdayWish, setBirthdayWish] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch the timeline events from the API when available. On static
  // deployments (e.g. GitHub Pages) there is no backend, so this falls back
  // to a static list defined in `defaultTimeline`.
  const { data: timelineEvents = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/timeline"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/timeline");
        return (await res.json()) as TimelineEvent[];
      } catch (error) {
        // Fall back to the pre-defined timeline when the API is unreachable
        return defaultTimeline;
      }
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineEvents) return;

      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollPosition / documentHeight;

      // Progressive reveal based on scroll
      const cardsToShow = Math.floor(scrollPercentage * timelineEvents.length * 1.2);
      
      timelineEvents.slice(0, cardsToShow).forEach((event) => {
        setVisibleCards(prev => new Set(prev).add(event.id));
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Initial load
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [timelineEvents]);

  const handleSendWish = () => {
    if (birthdayWish.trim()) {
      // In a real app, this would send to backend
      console.log("Birthday wish sent:", birthdayWish);
      setBirthdayWish("");
      setIsDialogOpen(false);
      // Could show a success toast here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🎂
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-indigo-50 relative">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 px-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-600 mb-4">
          Trisha's Journey ✨
        </h1>
        <p className="text-xl md:text-2xl text-indigo-700 mb-8">
          From Mumbai ki galiyan to Wall Street ki duniya! 🚀
        </p>
        <div className="flex justify-center items-center space-x-2 text-3xl mb-8">
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>🏡</motion.span>
          <span>→</span>
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>🎓</motion.span>
          <span>→</span>
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>💼</motion.span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gradient-to-b from-orange-400 via-pink-400 to-indigo-400 h-full"></div>
          
          {timelineEvents?.map((event, index) => {
            const isVisible = visibleCards.has(event.id);
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: isLeft ? -100 : 100, scale: 0.8 }}
                animate={isVisible ? { 
                  opacity: 1, 
                  x: 0, 
                  scale: 1 
                } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'} mb-12`}
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 border-4 border-white shadow-lg z-10`}
                />

                {/* Card */}
                <Card className={`w-full md:w-96 ${isLeft ? 'md:mr-12' : 'md:ml-12'} bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          {event.period}
                        </span>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Sparkles className="h-5 w-5 text-pink-500" />
                        </motion.div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-indigo-800 mb-3 group-hover:text-pink-600 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {event.description}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Birthday Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl text-lg group"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mr-2"
              >
                <Cake className="h-6 w-6" />
              </motion.div>
              Celebrate Trisha!
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                className="ml-2"
              >
                <Heart className="h-5 w-5 fill-current" />
              </motion.div>
            </Button>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 flex items-center gap-2">
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                🎂
              </motion.span>
              Birthday Wishes for Trisha!
            </DialogTitle>
            <DialogDescription className="text-indigo-700">
              Send your heartfelt wishes for Trisha's 25th birthday celebration! 🎉
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="wish" className="text-indigo-800 font-medium">
                Your Birthday Message
              </Label>
              <Textarea
                id="wish"
                placeholder="Happy 25th Birthday Trisha! Wishing you all the happiness in the world... 🎈"
                value={birthdayWish}
                onChange={(e) => setBirthdayWish(e.target.value)}
                className="mt-2 resize-none border-orange-200 focus:border-pink-300 focus:ring-pink-300"
                rows={4}
              />
            </div>
            
            <Button
              onClick={handleSendWish}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
              disabled={!birthdayWish.trim()}
            >
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Send Birthday Wish
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating emoji animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50,
              rotate: 0 
            }}
            animate={{ 
              y: -50, 
              rotate: 360,
              x: Math.random() * window.innerWidth 
            }}
            transition={{ 
              duration: 8 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear" 
            }}
          >
            {['🎂', '🎉', '🎈', '✨', '🎁', '💖'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}