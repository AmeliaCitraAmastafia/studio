
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useLogs } from "@/hooks/use-logs";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";

export default function LogsPage() {
  const { logs, loading } = useLogs();
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);
  
  // Sort logs by timestamp, most recent first
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (user?.role !== "admin") {
    return (
        <div className="flex-1 p-6 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-destructive" />
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You do not have permission to view this page. Please contact an administrator.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <>
      <Header title="Activity Logs" />
      <main className="flex-1 p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Timestamp</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No log entries found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.timestamp), "PPpp")}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.user}</div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
