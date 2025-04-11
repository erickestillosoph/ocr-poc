import { createStore } from "jotai";

type Store = ReturnType<typeof createStore>;

export const jotaiStore: Store = createStore();
