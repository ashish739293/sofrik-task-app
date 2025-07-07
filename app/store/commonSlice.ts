import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
  projectId: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  tasks: Task[];
}

interface CommonState {
  token: string | null;
  user: string | null;
  projects: Project[];
  selectedProject: Project | null;
}

const initialState: CommonState = {
  token: null,
  user: null,
  projects: [],
  selectedProject: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<string | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.projects = [];
      state.selectedProject = null;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: Task["status"] }>
    ) => {
      const project = state.selectedProject;
      if (project) {
        const task = project.tasks.find((t) => t._id === action.payload.taskId);
        if (task) task.status = action.payload.status;
      }
    },
  },
});

export const {
  setToken,
  setUser,
  logout,
  setProjects,
  setSelectedProject,
  updateTaskStatus,
} = commonSlice.actions;

export default commonSlice.reducer;
