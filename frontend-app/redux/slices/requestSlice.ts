import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ConnectionRequest } from "@/types";

type RequestState = ConnectionRequest[] | null;

const requestSlice = createSlice({
  name: "requests",
  initialState: null as RequestState,
  reducers: {
    addRequests: (_state, action: PayloadAction<ConnectionRequest[]>) => {
      return action.payload;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      if (!state) return state;
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
