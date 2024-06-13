// App.js
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Tabs from './components/Tabs';
import { COLORS } from './components/Theme';

const App = () => {

  return (
    <SafeAreaView style={{flex:1}}>
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

