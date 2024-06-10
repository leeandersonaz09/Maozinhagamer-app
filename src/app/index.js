// App.js
import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Tabs from './components/Tabs';

const App = () => {
  return (
    <SafeAreaProvider>
      <Tabs />
    </SafeAreaProvider>
  );
};

export default App;