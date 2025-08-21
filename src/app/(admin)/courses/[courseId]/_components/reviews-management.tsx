import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewsManagementProps {
  course: any;
}

const reviews = [
  {
    id: 1,
    student: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2024-01-15",
    review:
      "Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped me grasp the material.",
    helpful: 23,
    notHelpful: 2,
    replied: true,
    response:
      "Thank you so much for your kind words, Sarah! I'm thrilled that the hands-on approach worked well for you.",
  },
  {
    id: 2,
    student: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2024-01-20",
    review:
      "Great content overall. Some sections could use more detailed explanations, but the practical examples are very helpful.",
    helpful: 15,
    notHelpful: 1,
    replied: false,
  },
  {
    id: 3,
    student: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2024-02-01",
    review:
      "This course exceeded my expectations! The curriculum is well-structured and the instructor is very knowledgeable. Highly recommend!",
    helpful: 31,
    notHelpful: 0,
    replied: true,
    response:
      "Emily, thank you for the wonderful feedback! It means a lot to know the course structure worked well for you.",
  },
  {
    id: 4,
    student: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 3,
    date: "2024-02-10",
    review:
      "The course is okay, but I expected more advanced topics. The basics are covered well though.",
    helpful: 8,
    notHelpful: 5,
    replied: false,
  },
];

export function ReviewsManagement({ course }: ReviewsManagementProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Reviews</h2>
          <p className="text-muted-foreground">
            Manage and respond to student feedback
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search reviews..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">4.6</div>
            <div className="flex justify-center mb-1">{renderStars(5)}</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">456</div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">89%</div>
            <p className="text-sm text-muted-foreground">5 Star Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Pending Responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">98%</div>
            <p className="text-sm text-muted-foreground">Response Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={review.student.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {review.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.student.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mark as Featured</DropdownMenuItem>
                      <DropdownMenuItem>Report Review</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Hide Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Content */}
                <p className="text-foreground leading-relaxed">
                  {review.review}
                </p>

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{review.notHelpful}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.replied && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Replied
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {review.replied ? "Edit Reply" : "Reply"}
                    </Button>
                  </div>
                </div>

                {/* Instructor Response */}
                {review.replied && review.response && (
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Instructor Response</Badge>
                    </div>
                    <p className="text-sm">{review.response}</p>
                  </div>
                )}

                {/* Reply Form (would be shown when Reply button is clicked) */}
                {!review.replied && (
                  <div className="hidden space-y-3 bg-muted/30 p-4 rounded-lg">
                    <Textarea
                      placeholder="Write your response to this review..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm">Post Response</Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
