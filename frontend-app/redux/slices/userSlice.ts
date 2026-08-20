import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

type UserState = User | null;

const userSlice = createSlice({
  name: "user",
  initialState: null as UserState,
  reducers: {
    addUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
