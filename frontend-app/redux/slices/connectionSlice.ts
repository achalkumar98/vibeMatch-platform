import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "@/types";

type ConnectionState = Connection[] | null;

const connectionSlice = createSlice({
  name: "connections",
  initialState: null as ConnectionState,
  reducers: {
    addConnections: (_state, action: PayloadAction<Connection[]>) => {
      return action.payload;
    },
    removeConnections: () => {
      return null;
    },
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;
