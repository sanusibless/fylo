import { Files, Users, HardDrive, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";



export function StatsCards({ totalFiles, sharedFiles, storageUsed, downloads }) {

    const stats = [
        {
          name: "Total Files",
          value: totalFiles,
          change: "+12%",
          changeType: "positive" as const,
          icon: Files,
        },
        {
          name: "Shared Files",
          value: sharedFiles,
          change: "+5%",
          changeType: "positive" as const,
          icon: Users,
        },
        {
          name: "Storage Used",
          value: storageUsed + "GB",
          change: "+2.1 GB",
          changeType: "neutral" as const,
          icon: HardDrive,
        },
        {
          name: "Downloads",
          value: downloads,
          change: "+8%",
          changeType: "positive" as const,
          icon: TrendingUp,
        },
      ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} className="hover:shadow-card transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
