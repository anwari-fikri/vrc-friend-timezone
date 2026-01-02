"use client";

import React, { createContext, useContext, useEffect } from "react";
import { friendStore } from "./friendStore";

const FriendStoreContext = createContext(friendStore);

export function FriendStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    friendStore.loadFriends();
  }, []);

  return (
    <FriendStoreContext.Provider value={friendStore}>
      {children}
    </FriendStoreContext.Provider>
  );
}

export function useFriendStore() {
  const store = useContext(FriendStoreContext);
  if (!store) {
    throw new Error("useFriendStore must be used inside FriendStoreProvider");
  }
  return store;
}
