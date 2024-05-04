import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ModalProvider, modalRef } from "react-native-ma-modal";

import Router from "./src/router";
import useAppStore from "./src/store/useAppStore";
import { navigationRef } from "./src/utils/rootNavigation";

const App: React.FC<object> = () => {
  const initApp = useAppStore((state) => state.initApp);

  useEffect(() => {
    initApp();
  }, []);

  return (
    <ModalProvider ref={modalRef}>
      <NavigationContainer ref={navigationRef}>
        <Router />
      </NavigationContainer>
    </ModalProvider>
  );
};

export default App;
