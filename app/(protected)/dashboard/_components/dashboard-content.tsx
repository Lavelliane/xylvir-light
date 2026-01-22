"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
          Welcome back! Here&apos;s an overview of your tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Getting Started</CardTitle>
            <CardDescription>Welcome to Xylvir</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                You&apos;re logged in and ready to go
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                Your session is secure and active
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
