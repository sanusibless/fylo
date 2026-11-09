import { Clock, Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ActivityItem } from "@/types";

interface RecentActivityProps {
    activities?: ActivityItem[];
}

function timeAgo(date: string | Date | undefined): string {
    if (!date) return 'Just now';
    const timestamp = new Date(date).getTime();
    if (isNaN(timestamp)) return 'Just now';

    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return 'Just now';

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center text-foreground">
                    <Clock className="mr-2 h-5 w-5 text-teal-400" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm flex flex-col items-center">
                        <ActivityIcon className="w-8 h-8 mb-2 opacity-40" />
                        <p>No recent activity yet</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground leading-snug">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {timeAgo(activity.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default RecentActivity;
