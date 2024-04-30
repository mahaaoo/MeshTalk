import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/rootNavigation';
import Router from './src/router';
import {useAppStore} from './src/store';
import {ModalProvider, modalRef} from 'react-native-ma-modal';

const App: React.FC<{}> = () => {
  // const {appStore} = useStores();
  // const initApp = async () => {
  //   await appStore.initApp();
  // };
  // useEffect(() => {
  //   initApp();
  // }, []);

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
