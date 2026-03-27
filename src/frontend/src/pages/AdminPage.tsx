import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ApplicationStatus } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllApplications,
  useIsCallerAdmin,
  useUpdateApplicationStatus,
} from "../hooks/useQueries";

function parseAnswers(raw: string): Record<string, string> {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.pending]: "bg-muted text-muted-foreground",
  [ApplicationStatus.accepted]: "bg-amber text-primary-foreground",
  [ApplicationStatus.rejected]: "bg-destructive/20 text-destructive",
};

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: applications, isLoading: appsLoading } =
    useGetAllApplications();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
          data-ocid="admin.panel"
        >
          <Lock className="w-8 h-8 text-amber mx-auto mb-6" />
          <h1 className="font-display text-2xl text-foreground mb-3">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            This area is restricted. Please authenticate to continue.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground rounded-none px-8 py-5 tracking-widest uppercase text-xs"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoggingIn ? "Connecting..." : "Login"}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-6 h-6 text-amber animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-6"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <p className="font-display text-xl text-foreground mb-2">
            Access Denied
          </p>
          <p className="text-muted-foreground text-sm">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-foreground">
            Say It Out — Admin
          </h1>
          <p className="text-muted-foreground text-xs mt-1 tracking-widest">
            {applications?.length ?? 0} applications received
          </p>
        </div>
        <Badge className="bg-amber text-primary-foreground text-xs tracking-widest rounded-none px-3">
          Admin
        </Badge>
      </header>

      <main className="px-6 py-10">
        {appsLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-6 h-6 text-amber animate-spin" />
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="text-center py-20" data-ocid="admin.empty_state">
            <p className="font-display text-lg text-muted-foreground">
              No applications yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.table">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    #
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Age
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    City
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Handle
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Vibe
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs tracking-widest uppercase">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, idx) => {
                  const answers = parseAnswers(app.personalityAnswers);
                  const isExpanded = expandedId === app.id;
                  const rowNum = idx + 1;
                  return (
                    <>
                      <TableRow
                        key={app.id}
                        className="border-border hover:bg-muted/30 cursor-pointer"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : app.id)
                        }
                        data-ocid={`admin.row.${rowNum}`}
                      >
                        <TableCell className="text-muted-foreground text-xs">
                          {rowNum}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {app.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.age.toString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.city}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {app.socialHandle}
                        </TableCell>
                        <TableCell className="text-amber text-xs">
                          {answers.socialSelf ?? "—"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded-none ${
                              statusColors[app.status] ??
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={app.status}
                            onValueChange={(v) =>
                              updateStatus({
                                id: app.id,
                                status: v as ApplicationStatus,
                              })
                            }
                          >
                            <SelectTrigger
                              className="h-8 w-32 bg-secondary border-border rounded-none text-xs"
                              data-ocid={`admin.select.${rowNum}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border rounded-none">
                              <SelectItem value={ApplicationStatus.pending}>
                                Pending
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.accepted}>
                                Accept
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.rejected}>
                                Reject
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow
                          key={`${app.id}-expanded`}
                          className="bg-muted/20 border-border"
                        >
                          <TableCell colSpan={8} className="py-6 px-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                              <div>
                                <p className="text-xs text-amber tracking-widest uppercase mb-2">
                                  Room Entry
                                </p>
                                <p className="text-foreground">
                                  {answers.roomEntry ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-amber tracking-widest uppercase mb-2">
                                  Midnight Energy
                                </p>
                                <p className="text-foreground">
                                  {answers.midnightEnergy ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-amber tracking-widest uppercase mb-2">
                                  Social Self
                                </p>
                                <p className="text-foreground">
                                  {answers.socialSelf ?? "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-amber tracking-widest uppercase mb-2">
                                  Unforgettable Night
                                </p>
                                <p className="text-foreground">
                                  {answers.unforgettableNight ?? "—"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
