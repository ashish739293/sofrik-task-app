export interface Project {
  id: string;
  title: string;
  token: string;
  description: string;
  status: "active" | "completed";
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
};
