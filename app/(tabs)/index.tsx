import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../../constants/Theme/styles/HomeStyles";
import { Carousel, HomeCard, Shimmer } from "../../components";
import {
  fetchWidgetsData,
  getBannerData,
} from "../../utils/apiRequests";
import { loadDataIfNeeded } from "../../utils/globalFunctions";
import { fetchFeaturedLoadout, ApiLoadoutItem } from "../../src/services/loadouts/api";
import {
  getYouTubeLiveStatus,
  YouTubeLiveStatus,
} from "../../src/services/youtube/liveStatus";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type WidgetSubItem = {
  id: string | number;
  title: string;
  description?: string;
  img?: string;
  uri?: string;
  loadouts?: unknown[];
};

type WidgetItem = {
  id: string | number;
  img: string;
  title: string;
  subCollection: WidgetSubItem[];
};

type BannerItem = {
  id: string | number;
  img: string;
  title?: string;
  text?: string;
  uri?: string;
};

type HomeListItem = WidgetItem | number;

const Home = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [featuredLoadout, setFeaturedLoadout] =
    useState<ApiLoadoutItem | null>(null);
  const [youtubeLiveStatus, setYoutubeLiveStatus] =
    useState<YouTubeLiveStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLiveOnYouTube = Boolean(youtubeLiveStatus?.isLive);

  const fetchAllData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      const [bannerData, widgetsData, metaData, liveStatus] =
        await Promise.all([
          loadDataIfNeeded("bannerData", getBannerData, { forceRefresh }),
          loadDataIfNeeded("widgetsData", fetchWidgetsData, { forceRefresh }),
          loadDataIfNeeded("featuredLoadout", fetchFeaturedLoadout, {
            forceRefresh,
            maxAgeMs: 1000 * 60 * 15,
          }),
          getYouTubeLiveStatus(),
        ]);

      setBanners((bannerData ?? []) as BannerItem[]);
      setWidgets((widgetsData ?? []) as WidgetItem[]);
      setFeaturedLoadout((metaData ?? null) as ApiLoadoutItem | null);
      setYoutubeLiveStatus(liveStatus);
    } catch (error) {
      console.error("Erro ao obter dados da home:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const liveMonitor = setInterval(async () => {
      const liveStatus = await getYouTubeLiveStatus();
      setYoutubeLiveStatus(liveStatus);
    }, 1000 * 60);

    return () => clearInterval(liveMonitor);
  }, []);

  const renderWidgetCard = ({ item }: { item: WidgetItem }) => (
    <Link
      push
      href={{
        pathname: "/pages/HomeCard/[id]",
        params: {
          id: String(item.id),
          title: item.title,
          subCollection: JSON.stringify(item.subCollection ?? []),
        },
      }}
      asChild
    >
      <TouchableOpacity style={styles.cardTouchable} activeOpacity={0.85}>
        <HomeCard data={item} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView className="flex-1 bg-white dark:bg-[#0D0D0D]">
      <FlatList
        data={
          isLoading
            ? (Array.from({ length: 6 }, (_, index) => index) as HomeListItem[])
            : (widgets as HomeListItem[])
        }
        keyExtractor={(item) =>
          typeof item === "number" ? `widget-loading-${item}` : `widget-${item.id}`
        }
        numColumns={2}
        renderItem={({ item }) =>
          typeof item === "number" ? (
            <View className="flex-1 m-2">
              <Shimmer width="100%" height={120} borderRadius={12} />
            </View>
          ) : (
            renderWidgetCard({ item })
          )
        }
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Image
              className="w-full h-[220px]"
              source={require("../../assets/images/maozinha-home.jpg")}
              resizeMode="cover"
            />

            <View className="mt-5">
              <SectionTitle title="Mural do Gamer" />
              <View className="flex-row px-3 gap-3 mb-3">
                <HighlightCard
                  title="Ao vivo agora"
                  subtitle={isLiveOnYouTube ? "MaozinhaGamer está AO VIVO!" : "Aguardando próxima live"}
                  icon={isLiveOnYouTube ? "broadcast" : "broadcast-off"}
                  accent={isLiveOnYouTube ? "#E53935" : "#999"}
                  onPress={() =>
                    isLiveOnYouTube &&
                    Linking.openURL(
                      youtubeLiveStatus?.url ??
                        "https://youtube.com/@maozinhagamer_diih/live"
                    )
                  }
                  buttonLabel={isLiveOnYouTube ? "Entrar na Live" : "Offline"}
                />
                <HighlightCard
                  title="Meta do dia"
                  subtitle={
                    featuredLoadout
                      ? `${featuredLoadout.weapon} • Absolute Meta`
                      : "Carregando meta recomendada"
                  }
                  icon="target-variant"
                  accent="#C39200"
                  onPress={() =>
                    featuredLoadout &&
                    router.push({
                      pathname: "/pages/Builds/[id]",
                      params: {
                        id: "featured",
                        title: "Meta do Dia",
                        focus: featuredLoadout.slug,
                      },
                    })
                  }
                  buttonLabel={featuredLoadout ? "Ver build" : "Ver Agora"}
                />
              </View>
            </View>

            {/* Chamador para o Radar de Novidades */}
            <TouchableOpacity 
              onPress={() => router.push("/news")}
              className="mt-8 mx-4 bg-[#7A0000] rounded-[30px] p-6 shadow-lg flex-row items-center justify-between"
            >
              <View className="flex-1 mr-4">
                <View className="flex-row items-center gap-2 mb-1">
                  <MaterialCommunityIcons name="rss" size={18} color="#FFFB00" />
                  <Text className="text-[#FFFB00] text-[10px] font-black uppercase tracking-widest">Novidades</Text>
                </View>
                <Text className="text-white text-lg font-black uppercase">Radar Maozinha</Text>
                <Text className="text-white/60 text-xs font-bold">Confira Buffs, Nerfs e novidades da Season!</Text>
              </View>
              <View className="bg-white/20 p-3 rounded-2xl">
                <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <View className="mt-8">
              <SectionTitle title="Destaques" />
              {isLoading ? (
                <View className="items-center">
                  <Shimmer width={300} height={150} borderRadius={12} />
                </View>
              ) : banners.length > 0 ? (
                <Carousel data={banners} />
              ) : (
                <View className="mx-4 rounded-2xl p-5 border border-black/10 items-center gap-3">
                  <MaterialCommunityIcons
                    name="image-off-outline"
                    size={24}
                    color="#999"
                  />
                  <ThemedText>Nenhum banner publicado no momento.</ThemedText>
                </View>
              )}
            </View>

            <View className="mt-6 mb-2">
              <SectionTitle title="Jogos e guias" />
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchAllData(true)}
            tintColor="#7A0000"
          />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </ThemedView>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <ThemedText className="px-4 pb-3 text-xl font-black uppercase tracking-tighter text-[#7A0000] dark:text-[#FFFB00]">
    {title}
  </ThemedText>
);

const HighlightCard = ({
  title,
  subtitle,
  icon,
  accent,
  buttonLabel,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accent: string;
  buttonLabel: string;
  onPress?: () => void;
}) => (
  <View 
    style={{ borderColor: accent }}
    className="flex-1 border rounded-2xl p-3.5 bg-black/5 dark:bg-white/5"
  >
    <View className="flex-row items-center mb-2.5 gap-2">
      <MaterialCommunityIcons name={icon} size={20} color={accent} />
      <ThemedText className="text-[13px] font-black uppercase">{title}</ThemedText>
    </View>
    <ThemedText className="text-[14px] leading-5 min-h-[42px] font-bold opacity-80">{subtitle}</ThemedText>
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{ backgroundColor: onPress ? accent : "#999999" }}
      className="mt-3.5 rounded-xl py-2.5 px-3 items-center shadow-sm"
    >
      <Text className="text-white font-black uppercase text-xs">{buttonLabel}</Text>
    </TouchableOpacity>
  </View>
);

export default Home;
