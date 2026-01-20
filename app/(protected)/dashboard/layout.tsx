import { DashboardNav } from "./_components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950">{children}</main>
    </div>
  );
}
