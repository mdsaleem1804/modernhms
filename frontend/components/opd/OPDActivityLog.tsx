import { OPDActivityLog } from "@/services/api/types";
import { formatTimeHHmm } from "@/lib/dateTime";

interface OPDActivityLogProps {
  logs: OPDActivityLog[];
}

export function OPDActivityLogList({ logs }: OPDActivityLogProps) {
  return (
    <div className="space-y-1.5 text-xs">
      {logs.length === 0 && <p className="text-gray-400">No activity yet.</p>}
      {logs.map((log) => (
        <div key={log.id} className="rounded border border-gray-100 bg-gray-50 px-2 py-1.5">
          <p className="font-bold text-gray-700">
            {formatTimeHHmm(log.timestamp)} - {log.action}
          </p>
          <p className="text-gray-500">{log.description}</p>
        </div>
      ))}
    </div>
  );
}
