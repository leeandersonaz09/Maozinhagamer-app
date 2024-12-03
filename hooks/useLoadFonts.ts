import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

export const useLoadFonts = (): boolean => {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProDisplay_bold: require("../assets/fonts/SFProDisplay_Bold.ttf"),
    SFProDisplay_regular: require("../assets/fonts/SFProDisplay_Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        if (!fontsLoaded) {
          await SplashScreen.preventAutoHideAsync();
        }
      } catch (e) {
        console.error("Error during font loading or splash screen:", e);
      } finally {
        if (fontsLoaded) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    };

    prepare();
  }, [fontsLoaded]);

  return isReady;
};
