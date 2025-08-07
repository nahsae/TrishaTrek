import { motion } from "framer-motion";
import { Link } from "wouter";
import { Play, Gift, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative z-20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Floating Balloons */}
            <div className="absolute -top-10 left-10 balloon">
              <div className="w-16 h-16 bg-birthday-coral rounded-full"></div>
            </div>
            <div className="absolute -top-5 right-20 balloon" style={{ animationDelay: "1s" }}>
              <div className="w-12 h-12 bg-birthday-lavender rounded-full"></div>
            </div>
            <div className="absolute top-5 left-1/4 balloon" style={{ animationDelay: "2s" }}>
              <div className="w-10 h-10 bg-birthday-mint rounded-full"></div>
            </div>

            {/* Birthday celebration image */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Birthday celebration with balloons and decorations" 
                className="rounded-2xl shadow-2xl mx-auto max-w-md"
              />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-poppins font-black text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Happy 25th Birthday<br />
              <span className="text-birthday-yellow">Trisha! 🎉</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Let's celebrate with a fun trivia about your amazing journey!<br />
              From Union College to Goldman Sachs - test your knowledge! 
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/trivia">
                <Button 
                  size="lg"
                  className="bg-white text-birthday-pink font-poppins font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Start Trivia Game
                </Button>
              </Link>
              <Link href="/gallery">
                <Button 
                  size="lg"
                  className="bg-birthday-yellow text-gray-800 font-poppins font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Gift className="w-5 h-5 mr-3" />
                  View Gallery
                </Button>
              </Link>
            </motion.div>

            {/* Birthday Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="glass-effect border-none">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">25</div>
                  <div className="text-white/80 font-medium">Years Amazing</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-none">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">2</div>
                  <div className="text-white/80 font-medium">Great Schools</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-none">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">1</div>
                  <div className="text-white/80 font-medium">Dream Job</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-none">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">∞</div>
                  <div className="text-white/80 font-medium">Memories</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Birthday Wishes */}
      <section className="py-16 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-5xl font-poppins font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              🎂 Birthday Wishes
            </motion.h2>
            
            <motion.img 
              src="https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Group of people celebrating and cheering together" 
              className="rounded-2xl shadow-2xl mx-auto mb-8 max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />

            <motion.div 
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-poppins font-bold text-gray-800 mb-6">
                Happy 25th Birthday, Trisha! 🎉
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                From your amazing journey at Dhirubhai Ambani High School to your incredible success at Union College, 
                and now making waves at Goldman Sachs – you've shown us what dedication and brilliance look like. 
                Here's to 25 years of inspiring everyone around you and to many more years of success, joy, and adventure ahead!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/leaderboard">
                  <Button className="bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold px-8 py-4 rounded-full text-lg transition-colors">
                    <Trophy className="w-5 h-5 mr-3" />
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/trivia">
                  <Button className="bg-birthday-yellow hover:bg-birthday-yellow/80 text-gray-800 font-bold px-8 py-4 rounded-full text-lg transition-colors">
                    <Users className="w-5 h-5 mr-3" />
                    Join the Fun
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
