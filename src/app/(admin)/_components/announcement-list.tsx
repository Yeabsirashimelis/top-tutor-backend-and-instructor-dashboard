"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetInstructor } from "../_hooks/instructor-hooks";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

export default function AnnouncementList() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [courseFilter, setCourseFilter] = useState("");

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
    queryKey: ["instructor-announcements", instructorId, courseFilter],
    queryFn: async () => {
      if (!instructorId) return { announcements: [] };
      const params = new URLSearchParams({ instructorId });
      if (courseFilter) params.set("courseId", courseFilter);
      const res = await fetch(`/api/instructor/announcements?${params.toString()}`);
      return res.json();
    },
    enabled: !!instructorId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const res = await fetch(`/api/instructor/announcements?announcementId=${announcementId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-announcements"] });
      toast({ title: "Announcement deleted" });
    },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  const patchMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`/api/instructor/announcements`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-announcements"] });
      toast({ title: "Announcement updated" });
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  if (!instructorId) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Announcements</CardTitle>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="All courses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All courses</SelectItem>
              {(courses || []).map((c: any) => (
                <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-8">Loading...</div>
        ) : (data?.announcements || []).length === 0 ? (
          <div className="text-center p-8 text-gray-500">No announcements found</div>
        ) : (
          <div className="space-y-3">
            {data.announcements.map((a: any) => (
              <AnnouncementRow key={a._id} a={a} onDelete={() => deleteMutation.mutate(a._id)} onSave={(updates) => patchMutation.mutate({ announcementId: a._id, ...updates })} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnnouncementRow({ a, onDelete, onSave }: { a: any; onDelete: () => void; onSave: (updates: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(a.title);
  const [content, setContent] = useState(a.content);
  const [scheduled, setScheduled] = useState(a.scheduledFor ? new Date(a.scheduledFor).toISOString().slice(0,16) : "");

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{a.course?.title || "Course"}</p>
          <p className="text-xs text-gray-500">Status: {a.status} - Recipients: {a.recipients}</p>
        </div>
        <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
      </div>

      {!editing ? (
        <div className="mt-2">
          <h4 className="font-semibold mb-1">{a.title}</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{a.content}</p>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <Input type="datetime-local" value={scheduled} onChange={(e) => setScheduled(e.target.value)} />
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {!editing ? (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={() => { onSave({ title, content, scheduledFor: scheduled || null }); setEditing(false); }}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => { setEditing(false); setTitle(a.title); setContent(a.content); setScheduled(a.scheduledFor ? new Date(a.scheduledFor).toISOString().slice(0,16) : ""); }}>Cancel</Button>
          </>
        )}
      </div>
    </div>
  );
}
