// App.js
import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import Tabs from './components/Tabs';
import Header from './components/Header'
import { COLORS } from './components/Theme';

const App = () => {

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Header>
        <View style={styles.container}>
          <View style={styles.textView}>
            <Text style={styles.tittle}>Mãozinha Gamer</Text>
          </View>
        </View>
      </Header>
      <Tabs />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    marginTop: 5
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

