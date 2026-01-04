"use client";

import { useState } from "react";
import { useGetCourseChallenges, useCreateChallenge, useDeleteChallenge } from "../_hooks/challenges-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Target, 
  Plus, 
  Trash2, 
  Users, 
  CheckCircle,
  BookOpen,
  Trophy,
  Clock,
  Sparkles,
  Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChallengesManagementProps {
  courseId: string;
}

const CHALLENGE_TYPES = [
  { value: "complete_lecture", label: "Complete Lectures", icon: BookOpen, description: "Students complete X lectures from this course" },
  { value: "pass_quiz", label: "Pass Quizzes", icon: Trophy, description: "Students pass X quizzes" },
  { value: "study_time", label: "Study Time", icon: Clock, description: "Students study for X minutes" },
  { value: "perfect_quiz", label: "Perfect Quiz Score", icon: Sparkles, description: "Students get 100% on X quizzes" },
  { value: "complete_section", label: "Complete Section", icon: Target, description: "Students complete X sections" },
];

export default function ChallengesManagement({ courseId }: ChallengesManagementProps) {
  const { data, isLoading, refetch } = useGetCourseChallenges(courseId);
  const createChallenge = useCreateChallenge(courseId);
  const deleteChallenge = useDeleteChallenge(courseId);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [newChallenges, setNewChallenges] = useState<any[]>([
    { type: "complete_lecture", target: 3, points: 20, description: "Complete 3 lectures from this course" }
  ]);

  const addChallengeRow = () => {
    setNewChallenges([
      ...newChallenges,
      { type: "complete_lecture", target: 1, points: 10, description: "" }
    ]);
  };

  const removeChallengeRow = (index: number) => {
    setNewChallenges(newChallenges.filter((_, i) => i !== index));
  };

  const updateChallengeRow = (index: number, field: string, value: any) => {
    const updated = [...newChallenges];
    updated[index][field] = value;
    
    // Auto-generate description
    if (field === "type" || field === "target") {
      const challengeType = CHALLENGE_TYPES.find(t => t.value === updated[index].type);
      if (challengeType) {
        const target = updated[index].target || 1;
        updated[index].description = challengeType.description.replace("X", target.toString());
      }
    }
    
    setNewChallenges(updated);
  };

  const handleCreateChallenge = async () => {
    if (newChallenges.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one challenge",
        variant: "destructive",
      });
      return;
    }

    try {
      await createChallenge.mutateAsync({
        date: selectedDate,
        challenges: newChallenges,
      });

      toast({
        title: "Success",
        description: "Challenge created successfully!",
      });

      setShowCreateForm(false);
      setNewChallenges([
        { type: "complete_lecture", target: 3, points: 20, description: "Complete 3 lectures from this course" }
      ]);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create challenge",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
      await deleteChallenge.mutateAsync(challengeId);
      toast({
        title: "Success",
        description: "Challenge deleted successfully!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete challenge",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const challenges = data?.challenges || [];
  const today = new Date().toISOString().split("T")[0];
  const activeChallenges = challenges.filter((c: any) => 
    c.date.split("T")[0] >= today && c.isActive
  );
  const pastChallenges = challenges.filter((c: any) => 
    c.date.split("T")[0] < today || !c.isActive
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Daily Challenges
          </h2>
          <p className="text-gray-600 mt-1">
            Create daily challenges to motivate your students
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Challenge Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
              />
            </div>

            <div className="space-y-3">
              <Label>Challenge Tasks</Label>
              {newChallenges.map((challenge, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start p-4 border rounded-lg">
                  <div className="col-span-4">
                    <Label className="text-xs">Type</Label>
                    <select
                      value={challenge.type}
                      onChange={(e) => updateChallengeRow(index, "type", e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {CHALLENGE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-xs">Target</Label>
                    <Input
                      type="number"
                      min="1"
                      value={challenge.target}
                      onChange={(e) => updateChallengeRow(index, "target", parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-xs">XP</Label>
                    <Input
                      type="number"
                      min="1"
                      value={challenge.points}
                      onChange={(e) => updateChallengeRow(index, "points", parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={challenge.description}
                      onChange={(e) => updateChallengeRow(index, "description", e.target.value)}
                      placeholder="Auto-generated"
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChallengeRow(index)}
                      disabled={newChallenges.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addChallengeRow}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateChallenge} disabled={createChallenge.isPending}>
                {createChallenge.isPending ? "Creating..." : "Create Challenge"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Active Challenges
          </h3>
          <div className="space-y-3">
            {activeChallenges.map((challenge: any) => (
              <Card key={challenge._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold">
                          {new Date(challenge.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {challenge.challenges.map((task: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              {task.type === "complete_lecture" && <BookOpen className="w-5 h-5 text-indigo-600" />}
                              {task.type === "pass_quiz" && <Trophy className="w-5 h-5 text-indigo-600" />}
                              {task.type === "study_time" && <Clock className="w-5 h-5 text-indigo-600" />}
                              {task.type === "perfect_quiz" && <Sparkles className="w-5 h-5 text-indigo-600" />}
                              {task.type === "complete_section" && <Target className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{task.description}</p>
                              <p className="text-xs text-gray-600">Target: {task.target} • Reward: {task.points} XP</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChallenge(challenge._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Challenges */}
      {pastChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-600">Past Challenges</h3>
          <div className="space-y-2">
            {pastChallenges.slice(0, 5).map((challenge: any) => (
              <div key={challenge._id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(challenge.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({challenge.challenges.length} tasks)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {challenges.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Challenges Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create daily challenges to keep your students engaged and motivated
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
