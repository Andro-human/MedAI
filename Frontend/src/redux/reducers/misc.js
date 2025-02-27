import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isSearch: false,
  isDeleteMenu: false,
  selectedDeleteConversation: ""
};

const miscSlice = createSlice({
  name: "misc",
  initialState: initialState,
  reducers: {
    setisMobile(state, action) {
      state.isMobile = action.payload;
    },
    setisSearch(state, action) {
      state.isSearch = action.payload;
    },
    setisDeleteMenu(state, action) {
      state.isDeleteMenu = action.payload;
    },
    setSelectedDeleteConversation(state, action) {
      state.selectedDeleteConversation = action.payload;
    },
  },
});

export default miscSlice;
export const {
    setisMobile,
    setisSearch,
    setisDeleteMenu,
    setSelectedDeleteConversation,
} = miscSlice.actions;
