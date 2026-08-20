import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FeedUser } from "@/types";

type FeedState = FeedUser[] | null;

const feedSlice = createSlice({
  name: "feed",
  initialState: null as FeedState,
  reducers: {
    addFeed: (_state, action: PayloadAction<FeedUser[]>) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      if (!state) return state;
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
