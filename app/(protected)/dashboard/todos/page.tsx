import { TodoList } from "./_components";

export default function TodosPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-primary dark:text-primary-foreground">My Tasks</h1>
        <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
          Manage your tasks and stay organized
        </p>
      </div>

      <TodoList />
    </div>
  );
}
