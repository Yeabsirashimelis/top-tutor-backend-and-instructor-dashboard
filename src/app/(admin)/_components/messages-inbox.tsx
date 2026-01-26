"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MessageSquare, Mail, Filter, Search, Pin, PinOff, CheckCircle2 } from "lucide-react";
import { useGetInstructor } from "../_hooks/instructor-hooks";
import { useToast } from "@/hooks/use-toast";

export default function MessagesInbox() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [qaStatus, setQaStatus] = useState<string>("pending");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [dmStatus, setDmStatus] = useState<string>("all");

  const { data: courses } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: async () => {
      if (!instructorId) return [];
      const res = await fetch(`/api/courses?instructorId=${instructorId}`);
      const data = await res.json();
      return data.courses || [];
    },
    enabled: !!instructorId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-messages", instructorId, qaStatus, courseFilter, dmStatus],
    queryFn: async () => {
      if (!instructorId) return null;
      const params = new URLSearchParams({ instructorId, type: "all" });
      if (courseFilter) params.set("courseId", courseFilter);
      if (qaStatus) params.set("status", qaStatus);
      const res = await fetch(`/api/instructor/messages?${params.toString()}`);
      return res.json();
    },
    enabled: !!instructorId,
    staleTime: 60 * 1000,
  });

  const qaMessages = useMemo(() => {
    if (!data?.qaMessages) return [];
    return data.qaMessages;
  }, [data]);

  const directMessages = useMemo(() => {
    if (!data?.directMessages) return [];
    if (dmStatus === "unread") return data.directMessages.filter((m: any) => !m.isRead);
    return data.directMessages;
  }, [data, dmStatus]);

  const unread = data?.unreadCounts || { qa: 0, direct: 0, total: 0 };

  const answerMutation = useMutation({
    mutationFn: async ({ messageId, answer }: { messageId: string; answer: string }) => {
      const res = await fetch("/api/instructor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "qa-answer", messageId, answer }),
      });
      if (!res.ok) throw new Error("Failed to post answer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-messages"] });
      toast({ title: "Answer posted", description: "Your reply has been sent." });
    },
    onError: () => toast({ title: "Failed to post answer", variant: "destructive" }),
  });

  const updateQAMutation = useMutation({
    mutationFn: async ({ messageId, updates }: { messageId: string; updates: any }) => {
      const res = await fetch("/api/instructor/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "qa", messageId, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update Q&A");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-messages"] }),
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  const updateDMMutation = useMutation({
    mutationFn: async ({ messageId, updates }: { messageId: string; updates: any }) => {
      const res = await fetch("/api/instructor/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "direct", messageId, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update message");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-messages"] }),
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  if (!instructorId) return null;

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Badge>Unread: {unread.total}</Badge>
      </div>

      <Tabs defaultValue="qa">
        <TabsList>
          <TabsTrigger value="qa"><MessageSquare className="w-4 h-4 mr-2" />Q&A ({unread.qa})</TabsTrigger>
          <TabsTrigger value="direct"><Mail className="w-4 h-4 mr-2" />Direct ({unread.direct})</TabsTrigger>
        </TabsList>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Q&A</CardTitle>
                <div className="flex gap-2 items-center">
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="All courses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All courses</SelectItem>
                      {(courses || []).map((c: any) => (
                        <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={qaStatus} onValueChange={setQaStatus}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">Loading...</div>
              ) : qaMessages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No Q&A messages</div>
              ) : (
                <div className="space-y-3">
                  {qaMessages.map((m: any) => (
                    <QACard key={m._id} m={m} onAnswer={(answer) => answerMutation.mutate({ messageId: m._id, answer })} onPin={(pin) => updateQAMutation.mutate({ messageId: m._id, updates: { isPinned: pin } })} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="direct">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Direct Messages</CardTitle>
                <div className="flex gap-2 items-center">
                  <Select value={dmStatus} onValueChange={setDmStatus}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">Loading...</div>
              ) : directMessages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No direct messages</div>
              ) : (
                <div className="space-y-3">
                  {directMessages.map((m: any) => (
                    <DMCard key={m._id} m={m} onMarkRead={(read) => updateDMMutation.mutate({ messageId: m._id, updates: { isRead: read } })} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QACard({ m, onAnswer, onPin }: { m: any; onAnswer: (answer: string) => void; onPin: (pin: boolean) => void }) {
  const [answer, setAnswer] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (m.answer) setAnswer(m.answer);
  }, [m.answer]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{m.student?.name} - {m.course?.title}{m.lecture ? ` - ${m.lecture.title}` : ""}</p>
          <p className="text-sm text-gray-600">{m.question}</p>
        </div>
        <div className="flex items-center gap-2">
          {m.isPinned ? (
            <Button size="sm" variant="outline" onClick={() => onPin(false)} title="Unpin"><PinOff className="w-4 h-4" /></Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onPin(true)} title="Pin"><Pin className="w-4 h-4" /></Button>
          )}
        </div>
      </div>

      {m.answer ? (
        <div className="mt-3 p-3 bg-white rounded border">
          <p className="text-sm"><span className="font-semibold">Answer:</span> {m.answer}</p>
        </div>
      ) : (
        <div className="mt-3">
          <Label htmlFor={`answer-${m._id}`}>Your Answer</Label>
          <Textarea id={`answer-${m._id}`} value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} placeholder="Type your reply..." />
          <div className="mt-2">
            <Button size="sm" disabled={!answer.trim()} onClick={() => onAnswer(answer)}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Post Answer
            </Button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</div>
    </div>
  );
}

function DMCard({ m, onMarkRead }: { m: any; onMarkRead: (read: boolean) => void }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{m.sender?.name}{m.course ? ` - ${m.course.title}` : ""}</p>
          <p className="text-sm text-gray-600">{m.subject || "No Subject"}</p>
        </div>
        <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
      </div>
      <div className="mt-2 p-3 bg-white rounded border"><p className="text-sm">{m.message}</p></div>
      <div className="mt-2 flex gap-2">
        {m.isRead ? (
          <Button size="sm" variant="outline" onClick={() => onMarkRead(false)}>Mark Unread</Button>
        ) : (
          <Button size="sm" onClick={() => onMarkRead(true)}>Mark Read</Button>
        )}
      </div>
    </div>
  );
}
