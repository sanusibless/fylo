import { Upload, FolderPlus, Link, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    name: "Upload Files",
    description: "Add new files to your storage",
    icon: Upload,
    primary: true,
  },
  {
    name: "Create Folder",
    description: "Organize your files better",
    icon: FolderPlus,
    primary: false,
  },
  {
    name: "Share Link",
    description: "Generate shareable links",
    icon: Link,
    primary: false,
  },
  {
    name: "Invite Team",
    description: "Collaborate with others",
    icon: UserPlus,
    primary: false,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.name}
              variant={action.primary ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-4 ${
                action.primary
                  ? "bg-gradient-primary hover:bg-gradient-hover text-white"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  action.primary ? "bg-white/20" : "bg-muted"
                }`}>
                  <Icon className={`h-5 w-5 ${
                    action.primary ? "text-white" : "text-foreground"
                  }`} />
                </div>
                <div className="text-left">
                  <p className={`font-medium ${
                    action.primary ? "text-white" : "text-foreground"
                  }`}>
                    {action.name}
                  </p>
                  <p className={`text-sm ${
                    action.primary ? "text-white/80" : "text-muted-foreground"
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
