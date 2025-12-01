import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  purchased: boolean;
}

export interface ShoppingList {
  name: string;
  items: Item[];
  createdAt: string;
  completedAt?: string;
}

interface ShoppingState {
  recentLists: ShoppingList[];
  currentListIndex: number | null;
}

const initialState: ShoppingState = {
  recentLists: [],
  currentListIndex: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    loadLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.recentLists = action.payload;
    },
    setCurrentList: (state, action: PayloadAction<number | null>) => {
      state.currentListIndex = action.payload;
    },
    createList: (state, action: PayloadAction<string>) => {
      const newList: ShoppingList = {
        name: action.payload,
        items: [],
        createdAt: new Date().toISOString(),
      };
      state.recentLists.unshift(newList);
      state.currentListIndex = 0;
    },
    deleteList: (state, action: PayloadAction<number>) => {
      state.recentLists = state.recentLists.filter((_, i) => i !== action.payload);
      if (state.currentListIndex === action.payload) state.currentListIndex = null;
    },
    addItem: (state, action: PayloadAction<Omit<Item, "id" | "purchased">>) => {
      const index = state.currentListIndex;
      if (index === null) return;
      const newItem: Item = { ...action.payload, id: Date.now().toString(), purchased: false };
      state.recentLists[index].items.push(newItem);
      state.recentLists[index].completedAt = undefined;
    },
    togglePurchased: (state, action: PayloadAction<string>) => {
      const index = state.currentListIndex;
      if (index === null) return;
      const list = state.recentLists[index];
      list.items = list.items.map(i =>
        i.id === action.payload ? { ...i, purchased: !i.purchased } : i
      );
      const allPurchased = list.items.length > 0 && list.items.every(i => i.purchased);
      list.completedAt = allPurchased ? new Date().toISOString() : undefined;
    },
    editItem: (state, action: PayloadAction<Item>) => {
      const index = state.currentListIndex;
      if (index === null) return;
      const list = state.recentLists[index];
      list.items = list.items.map(i => (i.id === action.payload.id ? action.payload : i));
      const allPurchased = list.items.length > 0 && list.items.every(i => i.purchased);
      list.completedAt = allPurchased ? new Date().toISOString() : undefined;
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      const index = state.currentListIndex;
      if (index === null) return;
      const list = state.recentLists[index];
      list.items = list.items.filter(i => i.id !== action.payload);
      const allPurchased = list.items.length > 0 && list.items.every(i => i.purchased);
      list.completedAt = allPurchased ? new Date().toISOString() : undefined;
    },
  },
});

export const {
  loadLists,
  setCurrentList,
  createList,
  deleteList,
  addItem,
  togglePurchased,
  editItem,
  deleteItem,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
