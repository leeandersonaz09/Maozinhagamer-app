import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { LoadoutItem } from "../../src/services/loadouts/types";

// --- TEMAS E TOKENS ---
const COLORS = {
  background: "#121212",
  cardBg: "rgba(44, 44, 46, 0.7)", // Glassmorphism base
  accent: "#D32F2F",
  accentLight: "rgba(211, 47, 47, 0.15)",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  meta: "#FFD700",
  glassBorder: "rgba(255, 255, 255, 0.08)",
};

interface LoadoutCardProps {
  item: LoadoutItem;
}

const LoadoutCard: React.FC<LoadoutCardProps> = React.memo(({ item }) => {
  const isExpanded = useSharedValue(0);
  const [accessoriesHeight, setAccessoriesHeight] = useState(0);

  const onAccessoriesLayout = (event: LayoutChangeEvent) => {
    setAccessoriesHeight(event.nativeEvent.layout.height);
  };

  const animatedAccordionStyle = useAnimatedStyle(() => {
    const height = interpolate(
      isExpanded.value,
      [0, 1],
      [0, accessoriesHeight],
      Extrapolate.CLAMP
    );
    return {
      height,
      opacity: isExpanded.value,
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isExpanded.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const toggleAccordion = () => {
    isExpanded.value = withTiming(isExpanded.value === 0 ? 1 : 0, { duration: 300 });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: item.thumbnailUrl || item.gunImageUrl || 'https://via.placeholder.com/400x200' }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(18,18,18,0.4)', 'rgba(18,18,18,0.95)']}
            style={styles.gradientOverlay}
          />

          {/* Badges */}
          <View style={styles.badgesTopContainer}>
            {item.game && (
              <View style={styles.gameBadge}>
                <Text style={styles.badgeText}>{item.game.toUpperCase()}</Text>
              </View>
            )}
            <View style={[
              styles.tierBadge,
              item.tier === 'absolute_meta' && { borderColor: COLORS.meta }
            ]}>
              <Text style={[
                styles.badgeText,
                item.tier === 'absolute_meta' && { color: COLORS.meta }
              ]}>
                {item.tierLabel}
              </Text>
            </View>
          </View>

          {/* Info Principal */}
          <View style={styles.nameHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.weaponType.toUpperCase()}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.accordionToggle}
            onPress={toggleAccordion}
            activeOpacity={0.7}
          >
            <View style={styles.toggleLeft}>
              <Feather name="layers" size={16} color={COLORS.accent} style={{ marginRight: 8 }} />
              <Text style={styles.accessoriesTitle}>Acessórios ({item.attachments?.length || 0})</Text>
            </View>
            <Animated.View style={animatedChevronStyle}>
              <Feather name="chevron-down" size={20} color={COLORS.textSecondary} />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[styles.accordionContent, animatedAccordionStyle]}>
            <View style={{ position: 'absolute', width: '100%' }} onLayout={onAccessoriesLayout}>
              {item.attachments && item.attachments.map((acc, index) => (
                <View key={index} style={styles.attachmentRow}>
                  <Text style={styles.slotText}>{acc.slot}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.accNameText}>{acc.name}</Text>
                </View>
              ))}
              
              {item.code && (
                <TouchableOpacity style={styles.copyBtn}>
                  <Feather name="terminal" size={14} color={COLORS.textPrimary} />
                  <Text style={styles.copyBtnText}>GERAR CÓDIGO CLASSE</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
});

LoadoutCard.displayName = "LoadoutCard";

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  imageBackground: {
    height: 180,
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  badgesTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  gameBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tierBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  nameHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  typeBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.3)',
  },
  typeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  bottomContent: {
    padding: 16,
    paddingTop: 8,
  },
  accordionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessoriesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  accordionContent: {
    overflow: 'hidden',
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  slotText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    width: '35%',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginHorizontal: 10,
  },
  accNameText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  copyBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 13,
    marginLeft: 10,
    letterSpacing: 1,
  },
});

export default LoadoutCard;
