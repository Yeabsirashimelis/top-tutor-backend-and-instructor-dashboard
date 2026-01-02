"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Mail,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  studentId: string;
  name: string;
  email: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  lastActive: string;
  daysSinceActive: number;
  progress: number;
  engagementScore: number;
  atRisk: boolean;
  completed: boolean;
  lecturesCompleted: number;
  quizzesPassed: number;
}

interface StudentListProps {
  instructorId: string;
}

export default function StudentList({ instructorId }: StudentListProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-students", instructorId, selectedCourse, filter, search],
    queryFn: async () => {
      let url = `/api/instructor/students?instructorId=${instructorId}&filter=${filter}`;
      if (selectedCourse) url += `&courseId=${selectedCourse}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json() as Promise<{
        students: Student[];
        summary: { total: number; active: number; atRisk: number; completed: number };
      }>;
    },
    staleTime: 2 * 60 * 1000,
  });

  const students = data?.students || [];
  const summary = data?.summary || { total: 0, active: 0, atRisk: 0, completed: 0 };

  const getEngagementColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{summary.active}</div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{summary.atRisk}</div>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{summary.completed}</div>
            <p className="text-xs text-gray-500">100% progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Student List</CardTitle>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full sm:w-[250px]"
                />
              </div>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={`${student.studentId}-${student.courseId}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{student.courseTitle}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(
                                  student.progress
                                )}`}
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {student.progress.toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {student.lecturesCompleted} lectures · {student.quizzesPassed}{" "}
                            quizzes
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEngagementColor(student.engagementScore)}>
                          {student.engagementScore.toFixed(0)}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(student.lastActive).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.daysSinceActive === 0
                            ? "Today"
                            : `${student.daysSinceActive} day${
                                student.daysSinceActive > 1 ? "s" : ""
                              } ago`}
                        </p>
                      </TableCell>
                      <TableCell>
                        {student.completed ? (
                          <Badge className="bg-green-100 text-green-700">
                            Completed
                          </Badge>
                        ) : student.atRisk ? (
                          <Badge className="bg-red-100 text-red-700">At Risk</Badge>
                        ) : student.daysSinceActive <= 7 ? (
                          <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
