import React from "react";
import UIProvider from "./UIProvider";
import Web3Provider from "./Web3Provider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UIProvider>
      <Web3Provider>{children} </Web3Provider>
    </UIProvider>
  );
};

export default AppProvider;
