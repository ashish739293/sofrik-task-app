import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./commonSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
