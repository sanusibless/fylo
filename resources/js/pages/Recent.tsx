import { useState } from "react";
import { Grid, List, Filter, SortAsc, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/FileCard";

const recentFiles = [
  {
    id: "1",
    name: "Project-Presentation.pptx",
    type: "document" as const,
    size: "2.4 MB",
    modifiedAt: "2 hours ago",
    isStarred: true,
  },
  {
    id: "2",
    name: "Team-Photo.jpg",
    type: "image" as const,
    size: "1.8 MB",
    modifiedAt: "1 day ago",
  },
  {
    id: "3",
    name: "Demo-Video.mp4",
    type: "video" as const,
    size: "24.5 MB",
    modifiedAt: "3 days ago",
  },
  {
    id: "4",
    name: "Background-Music.mp3",
    type: "audio" as const,
    size: "5.2 MB",
    modifiedAt: "1 week ago",
  },
  {
    id: "5",
    name: "Archive-Backup.zip",
    type: "archive" as const,
    size: "156 MB",
    modifiedAt: "2 weeks ago",
    isStarred: true,
  },
  {
    id: "6",
    name: "Budget-Report.xlsx",
    type: "document" as const,
    size: "890 KB",
    modifiedAt: "3 weeks ago",
  },
];

export default function Recent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recent Files</h1>
            <p className="text-muted-foreground">Files you've accessed recently</p>
          </div>
        </div>

        {/* Files Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">All Recent Files</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentFiles.map((file) => (
                  <FileCard key={file.id} file={file} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentFiles.map((file) => (
                  <FileCard key={file.id} file={file} view="list" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
