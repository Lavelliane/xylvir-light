import { TodoList } from "./_components";

export default function TodosPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Tasks
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your tasks and stay organized
        </p>
      </div>

      <TodoList />
    </div>
  );
}
