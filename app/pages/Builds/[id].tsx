import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as ExpoLinking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { Header } from "../../../components";
import {
  fetchLoadoutsFromApi,
  getLoadoutsCacheKey,
  type ApiLoadoutItem,
} from "../../../src/services/loadouts/api";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { loadDataIfNeeded } from "../../../utils/globalFunctions";
import { getWeaponStats, WeaponStats } from "../../../src/services/stats/attachmentProcessor";

const TACTICAL = {
  bg: "#050505",
  surface: "#121212",
  surfaceHighlight: "#1E1E1E",
  primary: "#E53935",
  textWhite: "#FFFFFF",
  textMuted: "#666666",
  borderRaw: "#222222",
  accent: "#FF2A2A",
};

const DEFAULT_CATEGORIES = [
  "Meta Absoluta",
  "Meta",
  "Aceitavel",
  "Novo",
  "Sem classificacao",
];

const getSafeImageUrl = (url?: string | null) => {
  if (!url || typeof url !== "string") {
    return null;
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `https://wzhub.gg${url.startsWith("/") ? "" : "/"}${url}`;
};

const buildDeepLink = ({
  routeId,
  title,
  slug,
}: {
  routeId: string;
  title: string;
  slug: string;
}) =>
  ExpoLinking.createURL(`/pages/Builds/${routeId}`, {
    queryParams: {
      title,
      focus: slug,
    },
  });

const buildLoadoutText = ({
  item,
  deepLink,
}: {
  item: ApiLoadoutItem;
  deepLink: string;
}) => {
  const attachmentLines = (item.attachments ?? []).map(
    (attachment) => `${attachment.slot}: ${attachment.name}`
  );

  return [
    `${item.weapon} • ${item.category}`,
    `Modo: ${item.game_mode}`,
    item.loadout_code ? `Codigo: ${item.loadout_code}` : null,
    ...attachmentLines,
    `Link: ${deepLink}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const FilterTab = React.memo(function FilterTab({
  label,
  active,
  onPress,
}: {
  label: string | number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tab}>
      {active && <View style={styles.tabActiveIndicator} />}
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {String(label || "").toUpperCase()}
      </Text>
    </Pressable>
  );
});

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.statRow}>
    <View style={styles.statLabelContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}%</Text>
    </View>
    <View style={styles.statBarBg}>
      <View style={[styles.statBarFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const LoadoutCard = React.memo(function LoadoutCard({
  item,
  index,
  highlighted,
  copied,
  onCopy,
  onShare,
}: {
  item: ApiLoadoutItem;
  index: number;
  highlighted: boolean;
  copied: boolean;
  onCopy: (item: ApiLoadoutItem) => void;
  onShare: (item: ApiLoadoutItem) => void;
}) {
  const [expanded, setExpanded] = useState(highlighted);
  const [stats, setStats] = useState<WeaponStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const expandProgress = useSharedValue(highlighted ? 1 : 0);

  const fetchStats = useCallback(async () => {
    if (!item.attachments || item.attachments.length === 0) return;
    setLoadingStats(true);
    try {
      const data = await getWeaponStats(item.weapon, item.attachments);
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  }, [item]);

  useEffect(() => {
    if (expanded && !stats && !loadingStats) {
      fetchStats();
    }
  }, [expanded, stats, loadingStats, fetchStats]);

  useEffect(() => {
    if (highlighted) {
      setExpanded(true);
      expandProgress.value = withSpring(1, {
        mass: 0.6,
        damping: 15,
        stiffness: 120,
      });
    }
  }, [expandProgress, highlighted]);

  const toggleExpand = () => {
    const nextValue = !expanded;
    setExpanded(nextValue);
    expandProgress.value = withSpring(nextValue ? 1 : 0, {
      mass: 0.6,
      damping: 15,
      stiffness: 120,
    });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${expandProgress.value * 180}deg` }],
  }));

  const safeCategory = String(item.category || "");
  const isMeta = safeCategory.toLowerCase().includes("meta");
  const secureImage = getSafeImageUrl(item.detail_image_url || item.thumbnail_url);
  const safeAttachments = Array.isArray(item.attachments)
    ? item.attachments
    : [];

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60).springify().mass(0.8).damping(16)}
      layout={Layout.springify().damping(15)}
      style={styles.cardContainer}
    >
      <View
        style={[
          styles.cardSurface,
          isMeta && styles.cardSurfaceMeta,
          highlighted && styles.cardSurfaceHighlighted,
        ]}
      >
        {isMeta && <View style={styles.metaLeftStrip} />}

        <Pressable onPress={toggleExpand} style={styles.cardPressable}>
          <View style={styles.cardTopRow}>
            <View style={styles.infoBlock}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, isMeta && styles.badgeMeta]}>
                  <Text
                    style={[
                      styles.badgeText,
                      isMeta && styles.badgeTextMeta,
                    ]}
                  >
                    {safeCategory.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.classText}>
                  [{String(item.weapon_type || "WPN").toUpperCase()}]
                </Text>
              </View>

              <Text style={styles.weaponName}>
                {String(item.weapon || "UNKNOWN").toUpperCase()}
              </Text>

              <Text style={styles.modeText}>
                {"// "}
                {String(item.game_mode || "WARZONE").toUpperCase()}
              </Text>

              {!!item.updated_at && (
                <Text style={styles.updateText}>
                  LAST_UPD: {String(item.updated_at).toUpperCase()}
                </Text>
              )}
            </View>

            {!!secureImage && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: secureImage }}
                  style={styles.gunImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerData}>
              <View style={styles.techSquare} />
              <Text style={styles.footerText}>
                ATTACHMENTS_FOUND:{" "}
                <Text style={styles.footerHighlight}>{safeAttachments.length}</Text>
              </Text>
            </View>
            <Animated.View style={chevronStyle}>
              <Feather name="plus" size={18} color={TACTICAL.textMuted} />
            </Animated.View>
          </View>
        </Pressable>

        {expanded && (
          <Animated.View style={styles.expandedContent}>
            {/* Calculadora de Impacto via IA com fallback automatico */}
            <View style={styles.calculatorSection}>
              <View style={styles.calcHeader}>
                <Feather name="activity" size={14} color={TACTICAL.primary} />
                <Text style={styles.calcTitle}>[ANALISE_DE_IMPACTO_AI]</Text>
              </View>
              
              {loadingStats ? (
                <View style={{ paddingVertical: 10, alignItems: "center" }}>
                  <ActivityIndicator size="small" color={TACTICAL.primary} />
                  <Text style={[styles.calcDisclaimer, { marginTop: 8 }]}>Calculando influência dos acessórios...</Text>
                </View>
              ) : stats ? (
                <View style={styles.statsGrid}>
                  <StatBar label="RECUO (ESTABILIDADE)" value={stats.recoil} color="#4CAF50" />
                  <StatBar label="VELOCIDADE ADS" value={stats.ads} color="#2196F3" />
                  <StatBar label="MOBILIDADE" value={stats.mobility} color="#FF9800" />
                  <StatBar label="ALCANCE DE DANO" value={stats.range} color="#F44336" />
                </View>
              ) : null}
              
              <Text style={styles.calcDisclaimer}>
                * Valores estimados via IA com base na Meta Absoluta 2026.
              </Text>
            </View>

            {!!item.loadout_code && (
              <View style={styles.codeBlock}>
                <Text style={styles.codeLabel}>[IMPORT_CODE]</Text>
                <View style={styles.codeRow}>
                  <Text style={styles.codeValue}>
                    {String(item.loadout_code)}
                  </Text>
                  <TouchableOpacity onPress={() => onCopy(item)}>
                    <Feather name="copy" size={16} color={TACTICAL.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onCopy(item)}
              >
                <Feather name="copy" size={14} color={TACTICAL.textWhite} />
                <Text style={styles.actionButtonText}>
                  {copied ? "COPIADO" : "COPIAR"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onShare(item)}
              >
                <Feather name="share-2" size={14} color={TACTICAL.textWhite} />
                <Text style={styles.actionButtonText}>COMPARTILHAR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.attachmentGrid}>
              {safeAttachments.length > 0 ? (
                safeAttachments.map((att, attachmentIndex) => (
                  <View
                    key={`att-${attachmentIndex}`}
                    style={styles.attachmentItem}
                  >
                    <Text style={styles.attachmentSlot}>
                      [{String(att.slot || "SLOT")}]
                    </Text>
                    <Text style={styles.attachmentName}>
                      {String(att.name || "UNKNOWN")}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  DATA_CORRUPTED // NO ATTACHMENTS
                </Text>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
});

export default function BuildDetail() {
  const { title, focus, id } = useLocalSearchParams<{
    title?: string;
    focus?: string;
    id?: string;
  }>();
  const isConnected = useNetworkStatus();

  const [items, setItems] = useState<ApiLoadoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | null>(
    null
  );
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLoadouts = useCallback(
    async (forceRefresh = false) => {
      try {
        setError(null);
        if (forceRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const cacheKey = getLoadoutsCacheKey({
          search: debouncedSearch,
          category: selectedCategory,
          weaponType: selectedWeaponType,
        });

        const response = await loadDataIfNeeded(
          cacheKey,
          () =>
            fetchLoadoutsFromApi({
              search: debouncedSearch,
              category: selectedCategory,
              weaponType: selectedWeaponType,
              refresh: forceRefresh,
            }),
          {
            forceRefresh,
            maxAgeMs: 1000 * 60 * 15,
          }
        );

        const normalizedItems = Array.isArray(response?.items)
          ? response.items
          : [];
        setItems(normalizedItems);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "CONNECTION TIMEOUT."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, selectedCategory, selectedWeaponType]
  );

  useEffect(() => {
    fetchLoadouts(false);
  }, [fetchLoadouts]);

  const weaponTypes = useMemo(() => {
    const values = Array.from(
      new Set(
        items
          .map((item) => String(item.weapon_type || "").trim())
          .filter(Boolean)
      )
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [items]);

  const headerTitle = title ? String(title).toUpperCase() : "DATABASE // METAS";
  const routeId = String(id ?? "featured");
  const focusSlug = typeof focus === "string" ? focus : null;

  const handleCopyLoadout = async (item: ApiLoadoutItem) => {
    const deepLink = buildDeepLink({
      routeId,
      title: headerTitle,
      slug: item.slug,
    });
    const payload = buildLoadoutText({ item, deepLink });

    await Clipboard.setStringAsync(payload);
    setCopiedSlug(item.slug);
    setTimeout(() => {
      setCopiedSlug((currentValue) =>
        currentValue === item.slug ? null : currentValue
      );
    }, 2200);
  };

  const handleShareLoadout = async (item: ApiLoadoutItem) => {
    const deepLink = buildDeepLink({
      routeId,
      title: headerTitle,
      slug: item.slug,
    });
    const payload = buildLoadoutText({ item, deepLink });

    await Share.share({
      title: `${item.weapon} • ${item.category}`,
      message: payload,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: TACTICAL.bg }}>
      <Header replace HeaderTittle={headerTitle} href="/(tabs)" />

      <View style={styles.container}>
        {!isConnected && (
          <View style={styles.offlineBanner}>
            <Feather name="wifi-off" size={14} color={TACTICAL.textWhite} />
            <Text style={styles.offlineBannerText}>
              MODO OFFLINE // exibindo builds salvas em cache
            </Text>
          </View>
        )}

        <View style={styles.searchBlock}>
          <View style={styles.commandLine}>
            <Text style={styles.commandPrompt}>{">"}</Text>
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="AWAITING_DESIGNATION..."
              placeholderTextColor={TACTICAL.textMuted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            <Feather name="crosshair" size={18} color={TACTICAL.primary} />
          </View>
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            <FilterTab
              label="TODOS"
              active={!selectedCategory}
              onPress={() => setSelectedCategory(null)}
            />
            {DEFAULT_CATEGORIES.map((cat) => (
              <FilterTab
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabsRow, { paddingTop: 0 }]}
          >
            <FilterTab
              label="TODAS CLASSES"
              active={!selectedWeaponType}
              onPress={() => setSelectedWeaponType(null)}
            />
            {weaponTypes.map((weaponType) => (
              <FilterTab
                key={weaponType}
                label={weaponType}
                active={selectedWeaponType === weaponType}
                onPress={() => setSelectedWeaponType(weaponType)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.listArea}>
          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={TACTICAL.primary} />
              <Text style={styles.loadingText}>ESTABLISHING CONNECTION...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerState}>
              <Text style={styles.errorText}>[ {error} ]</Text>
              <Pressable
                style={styles.retryBtn}
                onPress={() => fetchLoadouts(true)}
              >
                <Text style={styles.retryBtnText}>REBOOT_SYSTEM</Text>
              </Pressable>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.centerState}>
              <Feather
                name="target"
                size={48}
                color={TACTICAL.borderRaw}
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.emptyTitle}>NO TARGETS FOUND</Text>
              <Text style={styles.emptySubText}>
                Adjust parameters to re-scan.
              </Text>
            </View>
          ) : (
            <Animated.FlatList
              data={items}
              keyExtractor={(item, index) => `${item.slug || "item"}-${index}`}
              renderItem={({ item, index }) => (
                <LoadoutCard
                  item={item}
                  index={index}
                  highlighted={focusSlug === item.slug}
                  copied={copiedSlug === item.slug}
                  onCopy={handleCopyLoadout}
                  onShare={handleShareLoadout}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              windowSize={5}
              initialNumToRender={6}
              removeClippedSubviews
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchLoadouts(true)}
                  colors={[TACTICAL.primary]}
                  tintColor={TACTICAL.primary}
                />
              }
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TACTICAL.bg },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: TACTICAL.primary,
    backgroundColor: TACTICAL.surface,
  },
  offlineBannerText: {
    color: TACTICAL.textWhite,
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  searchBlock: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  commandLine: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: TACTICAL.borderRaw,
    paddingBottom: 10,
  },
  commandPrompt: {
    color: TACTICAL.primary,
    fontFamily: "monospace",
    fontSize: 18,
    fontWeight: "900",
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontFamily: "monospace",
    color: TACTICAL.textWhite,
    textTransform: "uppercase",
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: TACTICAL.borderRaw,
    paddingBottom: 8,
    marginBottom: 16,
  },
  tabsRow: { paddingHorizontal: 20, paddingVertical: 10, gap: 20 },
  tab: { position: "relative", paddingBottom: 4 },
  tabActiveIndicator: {
    position: "absolute",
    bottom: -6,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: TACTICAL.primary,
  },
  tabText: {
    fontSize: 11,
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 1,
  },
  tabTextActive: { color: TACTICAL.textWhite, fontWeight: "900" },
  listArea: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 11,
  },
  errorText: {
    textAlign: "center",
    color: TACTICAL.primary,
    marginBottom: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: TACTICAL.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 2,
  },
  retryBtnText: {
    color: TACTICAL.primary,
    fontFamily: "monospace",
    fontWeight: "900",
  },
  emptyTitle: {
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
  emptySubText: {
    color: TACTICAL.borderRaw,
    fontFamily: "monospace",
    marginTop: 8,
    fontSize: 12,
  },
  cardContainer: { marginBottom: 20 },
  cardSurface: {
    backgroundColor: TACTICAL.surface,
    borderWidth: 1,
    borderColor: TACTICAL.borderRaw,
    position: "relative",
    overflow: "hidden",
  },
  cardSurfaceMeta: { borderColor: TACTICAL.borderRaw },
  cardSurfaceHighlighted: {
    borderColor: TACTICAL.primary,
    shadowColor: TACTICAL.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  metaLeftStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: TACTICAL.primary,
    zIndex: 10,
  },
  cardPressable: { width: "100%" },
  cardTopRow: { flexDirection: "row", padding: 20, minHeight: 120 },
  infoBlock: { flex: 1, zIndex: 2, justifyContent: "center" },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  badge: {
    backgroundColor: TACTICAL.borderRaw,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 8,
  },
  badgeMeta: { backgroundColor: TACTICAL.primary },
  badgeText: {
    color: TACTICAL.textWhite,
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  badgeTextMeta: { color: "#000" },
  classText: {
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  weaponName: {
    color: TACTICAL.textWhite,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  modeText: {
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1,
  },
  updateText: {
    color: TACTICAL.primary,
    fontFamily: "monospace",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  imageWrapper: { width: 120, justifyContent: "center", alignItems: "flex-end" },
  gunImage: {
    width: 180,
    height: 90,
    marginRight: -20,
    transform: [{ scaleX: -1 }],
    opacity: 0.9,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: TACTICAL.bg,
    borderTopWidth: 1,
    borderTopColor: TACTICAL.borderRaw,
  },
  footerData: { flexDirection: "row", alignItems: "center" },
  techSquare: {
    width: 6,
    height: 6,
    backgroundColor: TACTICAL.textMuted,
    marginRight: 10,
  },
  footerText: {
    fontSize: 10,
    fontWeight: "800",
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  footerHighlight: { color: TACTICAL.textWhite },
  expandedContent: {
    backgroundColor: TACTICAL.bg,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: TACTICAL.borderRaw,
  },
  codeBlock: {
    marginBottom: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: TACTICAL.primary,
  },
  codeLabel: {
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontSize: 10,
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  codeValue: {
    color: TACTICAL.textWhite,
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: TACTICAL.primary,
    backgroundColor: TACTICAL.surfaceHighlight,
  },
  actionButtonText: {
    color: TACTICAL.textWhite,
    fontFamily: "monospace",
    fontWeight: "800",
    letterSpacing: 1,
  },
  attachmentGrid: { gap: 16 },
  attachmentItem: { flexDirection: "column" },
  attachmentSlot: {
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontSize: 10,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  attachmentName: {
    color: TACTICAL.textWhite,
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyText: {
    color: TACTICAL.primary,
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "bold",
  },
  calculatorSection: {
    marginBottom: 24,
    backgroundColor: TACTICAL.surfaceHighlight,
    padding: 16,
    borderWidth: 1,
    borderColor: TACTICAL.borderRaw,
  },
  calcHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  calcTitle: {
    color: TACTICAL.primary,
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "900",
  },
  statsGrid: {
    gap: 12,
  },
  statRow: {
    gap: 4,
  },
  statLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    color: TACTICAL.textWhite,
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "800",
  },
  statValue: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "900",
  },
  statBarBg: {
    height: 4,
    backgroundColor: TACTICAL.bg,
    borderRadius: 2,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  calcDisclaimer: {
    marginTop: 12,
    color: TACTICAL.textMuted,
    fontFamily: "monospace",
    fontSize: 9,
    fontStyle: "italic",
  },
});
