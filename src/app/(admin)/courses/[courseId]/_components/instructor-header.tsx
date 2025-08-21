import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Share2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InstructorHeaderProps {
  course: any;
}

export function InstructorHeader({ course }: InstructorHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {course.category}
              </Badge>
              <Badge
                variant={
                  course.status === "published" ? "default" : "secondary"
                }
                className={
                  course.status === "published"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              >
                {course.status === "published" ? "Published" : "Draft"}
              </Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-white/90 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <span>{course.students?.length || 0} students enrolled</span>
              <span>
                ⭐ {course.rating} ({course.reviews?.length || 0} reviews)
              </span>
              <span>
                Last updated: {new Date(course.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="lg:w-80">
            <Card className="p-4 bg-white/10 border-white/20">
              <div className="aspect-video bg-black/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white/60">Course Preview</span>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Duplicate Course</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
