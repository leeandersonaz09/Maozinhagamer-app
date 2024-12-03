import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slide, { SLIDE_HEIGHT, BORDER_RADIUS } from "./Slide";
import { COLORS } from "../constants/Theme/theme";
import Subslide from "./Subslide";
import { Dot } from "../components";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  interpolate,
  Extrapolation,
  interpolateColor,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
const { width } = Dimensions.get("window");

// Tipos para as slides
type SlideType = {
  title: string;
  subtitle: string;
  description: string;
  picture: {
    src: any; // Como é um require() para assets, o tipo `any` é utilizado
    width: number;
    height: number;
  };
  color: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: BORDER_RADIUS,
    overflow: "hidden",
  },
  slider: {
    height: SLIDE_HEIGHT,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  pagination: {
    ...StyleSheet.absoluteFillObject,
    height: BORDER_RADIUS,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS,
  },
});

const slides: SlideType[] = [
  {
    title: "Mãozinha Gamer",
    subtitle: "Bem-vindo à Comunidade Gamer!",
    description:
      "Explore nosso aplicativo para acesso rápido a lives, redes sociais, patrocinadores e recursos úteis na palma da sua mão. Junte-se à diversão",
    picture: {
      src: require("../assets/Lotties/hand 2.json"),
      width: 2160,
      height: 2517,
    },
    color: COLORS.primary,
  },
  {
    title: "Conecte-se",
    subtitle: "Redes Sociais e Grupo WhatsApp",
    description:
      "Acompanhe-nos em todas as plataformas! Encontre links para nossas redes sociais e participe do nosso grupo WhatsApp.",
    picture: {
      src: require("../assets/Lotties/13255-loader.json"),
      width: 2160,
      height: 2517,
    },
    color: COLORS.primary,
  },
  {
    title: "Nos Apoie",
    subtitle: "Live Pix e Patrocinadores",
    description:
      "Apoie nosso canal com Live Pix e descubra quem são nossos incríveis patrocinadores. Juntos, fazemos a diferença pra nossa comunidade crescer!",
    picture: {
      src: require("../assets/Lotties/help.json"),
      width: 2160,
      height: 2517,
    },
    color: COLORS.primary,
  },
  {
    title: "Recursos Úteis",
    subtitle: "Mapas Interativos e Links Úteis",
    description:
      "Encontre tudo o que você precisa em um só lugar! Explore mapas interativos, links úteis e muito mais.",
    picture: {
      src: require("../assets/Lotties/useful.json"),
      width: 2160,
      height: 3500,
    },
    color: COLORS.primary,
  },
  {
    title: "Preparado?",
    subtitle: "Iai, pra conhecer sua nova mãozinha?",
    description:
      "Agora, vamos conhecer o seu novo Mãozinha Gamer! Siga-nos nas redes sociais e junte-se à diversão.! 🎮🚀",
    picture: {
      src: require("../assets/Lotties/hand 2.json"),
      width: 2160,
      height: 3500,
    },
    color: COLORS.primary,
  },
];

const Welcome: React.FC = () => {
  const scroll = useRef<ScrollView>(null);
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      x.value = contentOffset.x;
    },
  });

  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      x.value,
      slides.map((_, i) => i * width),
      slides.map((slide) => slide.color)
    )
  );

  const slider = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const background = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const currentIndex = useDerivedValue(() => x.value / width);

  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -x.value }],
  }));

  const [bar, setBar] = useState(true);

  const submit = async () => {
    await AsyncStorage.setItem("isnewinApp", JSON.stringify(true)).then(() => {
      setBar(false);
      router.replace("/");
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar animated={true} />
        <Animated.View style={[styles.slider, slider]}>
          {slides.map(({ picture }, index) => {
            const style = useAnimatedStyle(() => ({
              opacity: interpolate(
                x.value,
                [(index - 0.5) * width, index * width, (index + 0.5) * width],
                [0, 1, 0],
                Extrapolation.CLAMP
              ),
            }));

            return (
              <Animated.View style={[styles.underlay, style]} key={index}>
                <LottieView
                  autoPlay
                  style={{
                    width: width - BORDER_RADIUS,
                    height:
                      ((width - BORDER_RADIUS) * picture.height) /
                      picture.width,
                  }}
                  source={picture.src}
                />
              </Animated.View>
            );
          })}

          <Animated.ScrollView
            ref={scroll}
            horizontal
            snapToInterval={width}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {slides.map(({ title, picture }, index) => (
              <Slide
                key={index}
                right={!!(index % 2)}
                {...{ title, picture }}
              />
            ))}
          </Animated.ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <Animated.View style={[StyleSheet.absoluteFill, background]} />
          <View style={styles.footerContent}>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <Dot key={index} currentIndex={currentIndex} {...{ index }} />
              ))}
            </View>
            <Animated.View
              style={[
                {
                  flex: 1,
                  flexDirection: "row",
                  width: width * slides.length,
                },
                footerStyle,
              ]}
            >
              {slides.map(({ description, subtitle }, index) => {
                const last = index === slides.length - 1;
                return (
                  <Subslide
                    key={index}
                    onPress={() => {
                      if (last) {
                        submit();
                      } else {
                        scroll.current?.scrollTo({
                          x: width * (index + 1),
                          animated: true,
                        });
                      }
                    }}
                    {...{ description, subtitle, last }}
                  />
                );
              })}
            </Animated.View>
          </View>
        </View>
      </View>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
    </GestureHandlerRootView>
  );
};

export default Welcome;
