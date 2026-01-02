"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetInstructor } from "../_hooks/instructor-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Filter, Search } from "lucide-react";

export default function InstructorMessagesPage() {
  const { data: instructor } = useGetInstructor();
  const instructorId = instructor?._id || instructor?.id;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["instructor-messages", instructorId],
    queryFn: async () => {
      if (!instructorId) return null;
      const res = await fetch(`/api/instructor/messages?instructorId=${instructorId}&type=all`);
      return res.json();
    },
    enabled: !!instructorId,
    staleTime: 60 * 1000,
  });

  if (!instructorId) return null;

  const qaMessages = data?.qaMessages || [];
  const directMessages = data?.directMessages || [];
  const unread = data?.unreadCounts || { qa: 0, direct: 0, total: 0 };

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Badge>Unread: {unread.total}</Badge>
      </div>

      <Tabs defaultValue="qa">
        <TabsList>
          <TabsTrigger value="qa">
            <MessageSquare className="w-4 h-4 mr-2" /> Q&A ({unread.qa})
          </TabsTrigger>
          <TabsTrigger value="direct">
            <Mail className="w-4 h-4 mr-2" /> Direct ({unread.direct})
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle>Course Q&A</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">Loading...</div>
              ) : qaMessages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No Q&A messages</div>
              ) : (
                <div className="space-y-3">
                  {qaMessages.map((m: any) => (
                    <div key={m._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{m.student?.name} • {m.course?.title}{m.lecture ? ` • ${m.lecture.title}` : ''}</p>
                          <p className="text-sm text-gray-600">{m.question}</p>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                      {m.answer ? (
                        <div className="mt-2 p-3 bg-white rounded border">
                          <p className="text-sm"><span className="font-semibold">Answer:</span> {m.answer}</p>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <Button size="sm">Answer</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="direct">
          <Card>
            <CardHeader>
              <CardTitle>Direct Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">Loading...</div>
              ) : directMessages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No direct messages</div>
              ) : (
                <div className="space-y-3">
                  {directMessages.map((m: any) => (
                    <div key={m._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{m.sender?.name}{m.course ? ` • ${m.course.title}` : ''}</p>
                          <p className="text-sm text-gray-600">{m.subject || 'No Subject'}</p>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="mt-2 p-3 bg-white rounded border">
                        <p className="text-sm">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <div className="text-gray-500">Use tabs to view Q&A or Direct messages.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
