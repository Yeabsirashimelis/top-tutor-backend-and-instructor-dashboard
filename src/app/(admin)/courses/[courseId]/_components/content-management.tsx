import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  PlayCircle,
  FileText,
  Download,
  Upload,
  MoreHorizontal,
  DotIcon as DragHandleDots2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentManagementProps {
  course: any;
}

const courseContent = [
  {
    id: 1,
    type: "section",
    title: "Introduction to React",
    lessons: [
      {
        id: 11,
        type: "video",
        title: "What is React?",
        duration: "12:30",
        status: "published",
        views: 1234,
      },
      {
        id: 12,
        type: "video",
        title: "Setting up the Development Environment",
        duration: "18:45",
        status: "published",
        views: 1156,
      },
      {
        id: 13,
        type: "quiz",
        title: "React Basics Quiz",
        questions: 5,
        status: "published",
        completions: 892,
      },
    ],
  },
  {
    id: 2,
    type: "section",
    title: "Components and JSX",
    lessons: [
      {
        id: 21,
        type: "video",
        title: "Understanding Components",
        duration: "15:20",
        status: "published",
        views: 1089,
      },
      {
        id: 22,
        type: "video",
        title: "JSX Syntax and Rules",
        duration: "22:10",
        status: "draft",
        views: 0,
      },
      {
        id: 23,
        type: "assignment",
        title: "Build Your First Component",
        submissions: 456,
        status: "published",
      },
    ],
  },
  {
    id: 3,
    type: "section",
    title: "State and Props",
    lessons: [
      {
        id: 31,
        type: "video",
        title: "Understanding State",
        duration: "19:30",
        status: "published",
        views: 967,
      },
      {
        id: 32,
        type: "video",
        title: "Props and Data Flow",
        duration: "16:45",
        status: "published",
        views: 834,
      },
    ],
  },
];

export function ContentManagement({ course }: ContentManagementProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      case "assignment":
        return <Upload className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="text-muted-foreground">
            Manage your course curriculum and lessons
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Sections</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">2h 45m</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Curriculum */}
      <div className="space-y-4">
        {courseContent.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {section.lessons.length} lessons
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit Section</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate Section</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <DragHandleDots2Icon className="h-4 w-4 text-muted-foreground cursor-move" />
                      {getTypeIcon(lesson.type)}
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {lesson.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                          )}
                          {lesson.views !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {lesson.views} views
                            </span>
                          )}
                          {lesson.questions && (
                            <span>{lesson.questions} questions</span>
                          )}
                          {lesson.submissions && (
                            <span>{lesson.submissions} submissions</span>
                          )}
                          {lesson.completions && (
                            <span>{lesson.completions} completions</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(lesson.status)}
                      >
                        {lesson.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
