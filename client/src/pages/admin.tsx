import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Question, InsertQuestion } from "@shared/schema";

const categories = ["Education", "Career", "Personal", "Achievements", "Fun Facts"];
const difficulties = ["easy", "medium", "hard"];

export default function Admin() {
  const { toast } = useToast();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<InsertQuestion>({
    category: "",
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    difficulty: "medium",
  });

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const { data: analytics } = useQuery<{ totalQuestions: number; totalPlayers: number }>({
    queryKey: ["/api/analytics"],
  });

  const addQuestionMutation = useMutation({
    mutationFn: (question: InsertQuestion) => 
      apiRequest("POST", "/api/questions", question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Question Added! ✅",
        description: "The new trivia question has been added successfully.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, question }: { id: string; question: Partial<InsertQuestion> }) =>
      apiRequest("PUT", `/api/questions/${id}`, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Question Updated! ✅",
        description: "The trivia question has been updated successfully.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Question Deleted! 🗑️",
        description: "The trivia question has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      category: "",
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      difficulty: "medium",
    });
    setIsAddingQuestion(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.text || !formData.optionA || !formData.optionB || 
        !formData.optionC || !formData.optionD || !formData.correctAnswer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, question: formData });
    } else {
      addQuestionMutation.mutate(formData);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      category: question.category,
      text: question.text,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
    });
    setIsAddingQuestion(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Education: "bg-birthday-lavender text-white",
      Career: "bg-birthday-coral text-white", 
      Personal: "bg-birthday-yellow text-gray-800",
      Achievements: "bg-birthday-teal text-white",
      "Fun Facts": "bg-birthday-mint text-gray-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-200 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-effect border-none">
          <CardContent className="p-8 text-center">
            <div className="text-white text-xl">Loading admin panel...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            ⚙️ Admin Panel
          </h2>
          <p className="text-xl text-white/80">Manage trivia questions and celebrate Trisha</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Management */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl">
              <div className="bg-gradient-to-r from-birthday-pink to-birthday-coral p-6">
                <h3 className="text-2xl font-poppins font-bold text-white">
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </h3>
              </div>
              
              <CardContent className="p-6">
                {!isAddingQuestion ? (
                  <div className="text-center py-8">
                    <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-4">
                      Ready to add a new question?
                    </h4>
                    <Button 
                      onClick={() => setIsAddingQuestion(true)}
                      className="bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold px-6 py-3 rounded-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Question
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                        Question Category
                      </Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text" className="block text-gray-700 font-semibold mb-2">
                        Question Text
                      </Label>
                      <Textarea 
                        id="text"
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Enter your trivia question about Trisha..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Option A</Label>
                        <Input 
                          value={formData.optionA}
                          onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                          placeholder="First answer option"
                        />
                      </div>
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Option B</Label>
                        <Input 
                          value={formData.optionB}
                          onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                          placeholder="Second answer option"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Option C</Label>
                        <Input 
                          value={formData.optionC}
                          onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                          placeholder="Third answer option"
                        />
                      </div>
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Option D</Label>
                        <Input 
                          value={formData.optionD}
                          onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                          placeholder="Fourth answer option"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Correct Answer</Label>
                        <Select 
                          value={formData.correctAnswer}
                          onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Option A</SelectItem>
                            <SelectItem value="B">Option B</SelectItem>
                            <SelectItem value="C">Option C</SelectItem>
                            <SelectItem value="D">Option D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="block text-gray-700 font-semibold mb-2">Difficulty</Label>
                        <Select 
                          value={formData.difficulty}
                          onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map(difficulty => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="submit"
                        disabled={addQuestionMutation.isPending || updateQuestionMutation.isPending}
                        className="flex-1 bg-birthday-pink hover:bg-birthday-pink/80 text-white font-bold py-3 rounded-xl"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        {editingQuestion ? "Update Question" : "Add Question"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Existing Questions & Analytics */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-xl">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-birthday-pink mx-auto mb-2" />
                  <div className="text-3xl font-bold text-birthday-pink mb-2">
                    {analytics?.totalQuestions || 0}
                  </div>
                  <div className="text-gray-600 font-medium">Total Questions</div>
                </CardContent>
              </Card>
              <Card className="shadow-xl">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-birthday-teal mx-auto mb-2" />
                  <div className="text-3xl font-bold text-birthday-teal mb-2">
                    {analytics?.totalPlayers || 0}
                  </div>
                  <div className="text-gray-600 font-medium">Players</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Questions */}
            <Card className="shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-birthday-teal to-birthday-mint p-6">
                <h3 className="text-xl font-poppins font-bold text-white">All Questions</h3>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No questions added yet. Create your first question!</p>
                  </div>
                ) : (
                  questions.map((question) => (
                    <div key={question.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(question.category)}>
                            {question.category}
                          </Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(question)}
                            className="text-gray-400 hover:text-birthday-teal p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(question.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-800 font-medium mb-2 line-clamp-2">{question.text}</p>
                      <div className="text-sm text-gray-500">
                        <span className="text-green-600 font-medium">
                          Correct: Option {question.correctAnswer}
                        </span>
                        {" • "}
                        <span>
                          {question.correctAnswer === "A" ? question.optionA :
                           question.correctAnswer === "B" ? question.optionB :
                           question.correctAnswer === "C" ? question.optionC :
                           question.optionD}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
