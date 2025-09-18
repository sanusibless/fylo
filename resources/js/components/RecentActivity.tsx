import { Clock, FileText, Share2, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: "John Doe",
    userInitials: "JD",
    action: "uploaded",
    target: "Project-Plan.pdf",
    time: "2 minutes ago",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    userInitials: "SJ",
    action: "shared",
    target: "Marketing-Assets",
    time: "15 minutes ago",
    icon: Share2,
    color: "text-green-400",
  },
  {
    id: 3,
    user: "Mike Chen",
    userInitials: "MC",
    action: "downloaded",
    target: "Budget-2024.xlsx",
    time: "1 hour ago",
    icon: Download,
    color: "text-purple-400",
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    userInitials: "AR",
    action: "deleted",
    target: "old-backup.zip",
    time: "2 hours ago",
    icon: Trash2,
    color: "text-red-400",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-white text-xs">
                  {activity.userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>
                  {" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                  {" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
