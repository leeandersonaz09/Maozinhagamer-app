// App.js
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Tabs from './components/Tabs';
import { COLORS } from './components/Theme';
import { StatusBar } from 'expo-status-bar';
const App = () => {

  return (
    <SafeAreaView style={{flex:1}}>
       <StatusBar backgroundColor={COLORS.statusbar} barStyle="light-content" />
       <Tabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    marginTop: 5,
  },
  textView: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tittle: {
    color:COLORS.white,
    fontSize:18,
    fontWeight: 'bold'
  }

})

export default App;

