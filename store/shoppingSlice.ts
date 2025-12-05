import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  purchased: boolean;
}

interface ShoppingList {
  name: string;
  items: Item[];
  createdAt: string;
  completedAt?: string | null;
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
      state.recentLists.unshift({
        name: action.payload,
        items: [],
        createdAt: new Date().toISOString(),
      });
    },
    deleteList: (state, action: PayloadAction<number>) => {
      state.recentLists.splice(action.payload, 1);
      state.currentListIndex = null;
    },
    addItem: (state, action: PayloadAction<Omit<Item, "id" | "purchased">>) => {
      const list = state.recentLists[state.currentListIndex!];
      list.items.push({
        id: nanoid(),
        purchased: false,
        ...action.payload,
      });
    },
    togglePurchased: (state, action: PayloadAction<string>) => {
      const list = state.recentLists[state.currentListIndex!];
      const item = list.items.find(i => i.id === action.payload);
      if (item) item.purchased = !item.purchased;
    },
    editItem: (state, action: PayloadAction<Item>) => {
      const list = state.recentLists[state.currentListIndex!];
      const index = list.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) list.items[index] = action.payload;
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      const list = state.recentLists[state.currentListIndex!];
      list.items = list.items.filter(i => i.id !== action.payload);
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
