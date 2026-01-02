"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Send, Calendar, Users, Mail, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AnnouncementCreatorProps {
  instructorId: string;
  courses: Array<{ _id: string; title: string }>;
}

export default function AnnouncementCreator({
  instructorId,
  courses,
}: AnnouncementCreatorProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [scheduledFor, setScheduledFor] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendInApp, setSendInApp] = useState(true);

  const createAnnouncement = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/instructor/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create announcement");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-announcements"] });
      // Reset form
      setTitle("");
      setContent("");
      setCourseId("");
      setTargetAudience("all");
      setScheduledFor("");
      setSendEmail(true);
      setSendInApp(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !courseId) {
      alert("Please fill in all required fields");
      return;
    }

    createAnnouncement.mutate({
      title,
      content,
      courseId,
      instructorId,
      targetAudience,
      scheduledFor: scheduledFor || null,
      sendEmail,
      sendInApp,
    });
  };

  const audienceOptions = [
    { value: "all", label: "All Students", icon: Users },
    { value: "active", label: "Active Students (Last 7 days)", icon: Users },
    { value: "at-risk", label: "At-Risk Students", icon: Users },
    { value: "completed", label: "Completed Students", icon: Users },
    { value: "new", label: "New Students (Last 7 days)", icon: Users },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Create Announcement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select value={courseId} onValueChange={setCourseId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Important Course Update"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement message..."
              rows={6}
              required
            />
            <p className="text-xs text-gray-500">
              {content.length} characters
            </p>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose who will receive this announcement
            </p>
          </div>

          {/* Scheduling */}
          <div className="space-y-2">
            <Label htmlFor="scheduled">Schedule (Optional)</Label>
            <Input
              id="scheduled"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave empty to send immediately
            </p>
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label>Delivery Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <label
                htmlFor="sendEmail"
                className="text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendInApp"
                checked={sendInApp}
                onCheckedChange={(checked) => setSendInApp(checked as boolean)}
              />
              <label
                htmlFor="sendInApp"
                className="text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                Send In-App Notification
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createAnnouncement.isPending}
              className="flex-1"
            >
              {createAnnouncement.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : scheduledFor ? (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Announcement
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </>
              )}
            </Button>
          </div>

          {createAnnouncement.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Announcement sent successfully!
              </p>
            </div>
          )}

          {createAnnouncement.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Failed to send announcement. Please try again.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
