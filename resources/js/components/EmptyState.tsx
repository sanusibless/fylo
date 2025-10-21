import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No data available yet" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-24 h-24 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-100">{message}</h3>
      <p className="text-gray-500 mt-1">Try adding some new data.</p>
    </div>
  );
}
