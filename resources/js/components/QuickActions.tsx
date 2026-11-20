import { useState } from "react";
import { router } from "@inertiajs/react";
import { Upload, FolderPlus, Share2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadFile from "@/components/dashboard/UploadFile";

export function QuickActions() {
  const [uploadOpen, setUploadOpen] = useState(false);

  const actions = [
    {
      name: "Upload Files",
      description: "Add documents, images or media",
      icon: Upload,
      primary: true,
      onClick: () => setUploadOpen(true),
    },
    {
      name: "Manage Folders",
      description: "Create & organize nested folders",
      icon: FolderPlus,
      primary: false,
      onClick: () => router.visit("/folders"),
    },
    {
      name: "Shared with Me",
      description: "View files shared by teammates",
      icon: Share2,
      primary: false,
      onClick: () => router.visit("/shared-files"),
    },
    {
      name: "Upgrade Storage",
      description: "View Naira (₦) storage plans",
      icon: CreditCard,
      primary: false,
      onClick: () => router.visit("/subscription"),
    },
  ];

  return (
    <>
      <Card className="border-slate-800 bg-[#202a3c] rounded-3xl shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.name}
                type="button"
                onClick={action.onClick}
                variant={action.primary ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3.5 rounded-2xl transition ${
                  action.primary
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 shadow-md"
                    : "bg-[#1c2431]/80 hover:bg-slate-800 text-white border border-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      action.primary ? "bg-slate-950/15" : "bg-teal-500/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        action.primary ? "text-slate-950" : "text-teal-400"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-xs font-bold ${
                        action.primary ? "text-slate-950" : "text-white"
                      }`}
                    >
                      {action.name}
                    </p>
                    <p
                      className={`text-[11px] ${
                        action.primary ? "text-slate-900/80" : "text-gray-400"
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <UploadFile
        hideTrigger
        externalOpen={uploadOpen}
        onExternalOpenChange={setUploadOpen}
      />
    </>
  );
}
