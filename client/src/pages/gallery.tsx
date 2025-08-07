import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const galleryItems = [
  {
    title: "School Days",
    description: "Dhirubhai Ambani International School memories",
    period: "2013-2019",
    color: "birthday-lavender",
    image: "https://pixabay.com/get/g2769110c8177f38b571602b69c1e459edb42f737df8194bf407a77f479a1902364a9f39bc7027bf1423c9d8f64be18282a7b90516b35d3920bde7990c8e214e9_1280.jpg",
    alt: "Graduation ceremony celebration",
  },
  {
    title: "College Life",
    description: "Union College adventures and growth",
    period: "2019-2023",
    color: "birthday-teal",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "College campus with students",
  },
  {
    title: "Career Success",
    description: "Goldman Sachs professional journey",
    period: "2023-Present",
    color: "birthday-pink",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Modern office building and business district",
  },
  {
    title: "Birthday Fun",
    description: "Previous birthday celebrations and joy",
    period: "Memories",
    color: "birthday-yellow",
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Friends celebrating at a birthday party",
  },
  {
    title: "Achievements",
    description: "Awards, recognitions, and milestones",
    period: "Success",
    color: "birthday-coral",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Award ceremony with trophy and achievements",
  },
  {
    title: "Future Dreams",
    description: "Exciting adventures ahead at 25!",
    period: "2024+",
    color: "birthday-mint",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Sunrise over a path representing future journey",
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
            📸 Memory Lane
          </h2>
          <p className="text-xl text-white/80">Celebrating Trisha's amazing journey through the years</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <Badge 
                    className={`absolute top-4 left-4 bg-${item.color} text-white px-3 py-1 rounded-full text-sm`}
                  >
                    {item.period}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-poppins font-bold text-lg text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Gallery Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-poppins font-bold text-white mb-8">
            Share Your Memories! 📷
          </h3>
          <Card className="max-w-2xl mx-auto shadow-2xl">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                Have a special memory with Trisha? We'd love to feature it in our gallery! 
                Share your favorite moments and help us celebrate her amazing journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold px-6 py-3 rounded-full transition-colors">
                  📧 Share a Memory
                </button>
                <button className="bg-birthday-teal hover:bg-birthday-teal/80 text-white font-bold px-6 py-3 rounded-full transition-colors">
                  📱 Social Media
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
