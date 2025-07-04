import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  LayoutChangeEvent,
  ViewToken,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Header } from "../../../components/index.js"; // Verifique se o caminho está correto
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

// --- 1. CONFIGURAÇÃO DE CORES E TIPOS ---

const COLORS = {
  background: "#1A1A1A",
  cardBackground: "#2C2C2E",
  accent: "#D32F2F", // Vermelho Gamer
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  weaponTypeBg: "rgba(211, 47, 47, 0.2)",
};

type Loadout = {
  id: string;
  name: string;
  img: string;
  weaponType: string;
  stats: { damage: string; range: string; accuracy: string };
  accessories: string[];
};

// --- 2. COMPONENTE DO CARD PRINCIPAL ---

const LoadoutCard = ({ item }: { item: Loadout }) => {
  const isExpanded = useSharedValue(0);
  const [accessoriesHeight, setAccessoriesHeight] = useState(0);

  const onAccessoriesLayout = (event: LayoutChangeEvent) => {
    setAccessoriesHeight(event.nativeEvent.layout.height);
  };

  const animatedAccordionStyle = useAnimatedStyle(() => {
    const height = interpolate(isExpanded.value, [0, 1], [0, accessoriesHeight], Extrapolate.CLAMP);
    return { height, opacity: isExpanded.value };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isExpanded.value, [0, 1], [0, 180]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const toggleAccordion = () => {
    isExpanded.value = withTiming(isExpanded.value === 0 ? 1 : 0, { duration: 350 });
  };
  
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ImageBackground source={{ uri: item.img }} style={styles.imageBackground} resizeMode="contain">
          <LinearGradient colors={['transparent', 'rgba(26,26,26,0.8)', COLORS.background]} style={styles.gradientOverlay} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.weaponTypeBox}><Text style={styles.weaponTypeText}>{item.weaponType}</Text></View>
          </View>
        </ImageBackground>
        <View style={styles.contentContainer}>
          <View style={styles.statsContainer}>
            <View style={styles.statPill}><Text style={styles.statText}>DANO: {item.stats.damage || 'N/A'}</Text></View>
            <View style={styles.statPill}><Text style={styles.statText}>ALCANCE: {item.stats.range || 'N/A'}</Text></View>
            <View style={styles.statPill}><Text style={styles.statText}>PRECISÃO: {item.stats.accuracy || 'N/A'}</Text></View>
          </View>
          <TouchableOpacity style={styles.accessoriesHeaderTouchable} onPress={toggleAccordion} activeOpacity={0.8}>
            <Text style={styles.accessoriesHeader}>Acessórios</Text>
            <Animated.View style={animatedChevronStyle}><Feather name="chevron-down" size={24} color={COLORS.accent} /></Animated.View>
          </TouchableOpacity>
          <Animated.View style={[styles.accessoriesList, animatedAccordionStyle]}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }} onLayout={onAccessoriesLayout}>
              {item.accessories.map((accessory, index) => (
                accessory ? <Text key={index} style={styles.accessory}><Text style={styles.bulletPoint}>•</Text> {accessory}</Text> : null
              ))}
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// --- 3. COMPONENTES DE PAGINAÇÃO ---

const PaginatedDot = ({ index, activeIndex }: { index: number, activeIndex: Animated.SharedValue<number> }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    const scale = withTiming(isActive ? 1.5 : 1, { duration: 250 });
    const opacity = withTiming(isActive ? 1 : 0.5, { duration: 250 });
    return { transform: [{ scale }], opacity };
  });
  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

const Pagination = ({ data, activeIndex }: { data: any[], activeIndex: Animated.SharedValue<number> }) => (
  <View style={styles.paginationContainer}>
    {data.map((_, index) => (
      <PaginatedDot key={index} index={index} activeIndex={activeIndex} />
    ))}
  </View>
);

// --- 4. NOVO COMPONENTE PARA O MINI CARD ---
type MiniCardProps = {
  item: Loadout;
  index: number;
  activeIndex: Animated.SharedValue<number>;
  onPress: () => void;
}

const MiniCard = ({ item, index, activeIndex, onPress }: MiniCardProps) => {
  // A lógica da animação agora está aqui dentro, de forma correta.
  const animatedMiniCardStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    const backgroundColor = withTiming(isActive ? COLORS.accent : "transparent", { duration: 300 });
    const borderColor = withTiming(isActive ? COLORS.accent : "rgba(202, 56, 56, 0.48)", { duration: 300 });
    return { backgroundColor, borderColor };
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.miniCard, animatedMiniCardStyle]}>
        <ThemedText style={styles.miniCardText}>{item.name}</ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
}

// --- 5. TELA PRINCIPAL: BUILD DETAIL ---

const BuildDetail = () => {
  const { title, subCollection } = useLocalSearchParams();
  const mainListRef = useRef<FlatList<Loadout>>(null);
  const miniListRef = useRef<FlatList<Loadout>>(null);

  let loadouts: Loadout[] = [];
  try {
    if (subCollection && typeof subCollection === 'string') loadouts = JSON.parse(subCollection);
  } catch (error) { console.error("Erro ao processar dados de subCollection:", error); }

  const activeIndex = useSharedValue(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const newIndex = viewableItems[0].index;
      activeIndex.value = newIndex;
      miniListRef.current?.scrollToIndex({ index: newIndex, animated: true, viewPosition: 0.5 });
    }
  }).current;
  
  const handleMiniCardPress = (index: number) => {
    mainListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <>
      <Header HeaderTittle={title as string} href={"/(tabs)"} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.header}>Loadouts Exclusivos</ThemedText>

        <ThemedView style={{ flex: 1 }}>
          <FlatList
            ref={mainListRef}
            data={loadouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <LoadoutCard item={item} />}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            bounces={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            getItemLayout={(_, index) => ({
              length: Dimensions.get("window").width,
              offset: Dimensions.get("window").width * index,
              index,
            })}
          />
        </ThemedView>

        <Pagination data={loadouts} activeIndex={activeIndex} />

        <ThemedView style={styles.miniListContainer}>
          <FlatList
            ref={miniListRef}
            data={loadouts}
            keyExtractor={(item) => `mini-${item.id}`}
            // A função renderItem agora está muito mais limpa
            renderItem={({ item, index }) => (
              <MiniCard
                item={item}
                index={index}
                activeIndex={activeIndex}
                onPress={() => handleMiniCardPress(index)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          />
        </ThemedView>
      </ThemedView>
    </>
  );
};

// --- 6. ESTILOS COMPLETOS ---

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.background,
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    //color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  cardContainer: {
    width: width,
    alignItems: 'center',
    paddingBottom: 10,
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  imageBackground: {
    height: 200,
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  nameContainer: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  weaponTypeBox: {
    backgroundColor: COLORS.weaponTypeBg,
    borderColor: COLORS.accent,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  weaponTypeText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  statPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  accessoriesHeaderTouchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 15,
  },
  accessoriesHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  accessoriesList: {
    overflow: 'hidden',
    paddingTop: 10,
  },
  accessory: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 24,
  },
  bulletPoint: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginHorizontal: 4,
  },
  miniListContainer: {
    height: 70,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(252, 128, 128, 0.28)',
    //backgroundColor: COLORS.background,
  },
  miniCard: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 10,
  },
  miniCardText: {
    //color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default BuildDetail;