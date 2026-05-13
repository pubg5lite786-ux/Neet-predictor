import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: {
    id: string;
    email: string;
    name: string;
    neetRank?: number;
    neetScore?: number;
    state?: string;
    category?: string;
  } | null;
  loading: boolean;
  savedColleges: string[];
  preferences: {
    collegePreference?: string;
    quotaPreference?: string;
  };
}

const initialState: UserState = {
  profile: null,
  loading: false,
  savedColleges: [],
  preferences: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
    setSavedColleges: (state, action: PayloadAction<string[]>) => {
      state.savedColleges = action.payload;
    },
    addSavedCollege: (state, action: PayloadAction<string>) => {
      if (!state.savedColleges.includes(action.payload)) {
        state.savedColleges.push(action.payload);
      }
    },
    removeSavedCollege: (state, action: PayloadAction<string>) => {
      state.savedColleges = state.savedColleges.filter(id => id !== action.payload);
    },
    setPreferences: (state, action: PayloadAction<UserState['preferences']>) => {
      state.preferences = action.payload;
    },
  },
});

export const {
  setProfile,
  setSavedColleges,
  addSavedCollege,
  removeSavedCollege,
  setPreferences,
} = userSlice.actions;
export default userSlice.reducer;
