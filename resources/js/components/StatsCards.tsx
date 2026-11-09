import { Files, Users, HardDrive, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
    totalFiles?: number | string;
    sharedFiles?: number | string;
    storageUsed?: number | string;
    downloads?: number | string;
}

export function StatsCards({ totalFiles = 0, sharedFiles = 0, storageUsed = 0, downloads = 0 }: StatsCardsProps) {
    const stats = [
        {
            name: "Total Files",
            value: totalFiles,
            icon: Files,
            badge: "Active",
        },
        {
            name: "Shared Files",
            value: sharedFiles,
            icon: Users,
            badge: "Collaborators",
        },
        {
            name: "Storage Used",
            value: `${storageUsed} GB`,
            icon: HardDrive,
            badge: "Cloud disk",
        },
        {
            name: "Total Downloads",
            value: downloads,
            icon: TrendingUp,
            badge: "Activity",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.name} className="hover:shadow-card transition-shadow border-border bg-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2" />
                                {stat.badge}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default StatsCards;
