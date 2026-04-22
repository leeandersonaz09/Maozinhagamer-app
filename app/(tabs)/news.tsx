import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Shimmer } from "../../components";
import { fetchLatestCoDNews, NewsCategory, NewsItem } from "../../src/services/news/newsProvider";

const FALLBACK_IMAGE =
  "https://imgs.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/body/bo7/BO7-ACCESSIBILITY-TOUT.jpg";

const CATEGORY_META: Record<
  NewsCategory,
  { label: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  BO7: { label: "BO7", color: "#D80F22", icon: "target" },
  WARZONE: { label: "Warzone", color: "#2BB673", icon: "parachute" },
  CODM: { label: "COD Mobile", color: "#F2A900", icon: "cellphone" },
  TEMPORADA: { label: "Temporada", color: "#8B5CF6", icon: "calendar-star" },
  PATCH: { label: "Patch", color: "#38BDF8", icon: "tune-variant" },
  EVENTO: { label: "Evento", color: "#FB7185", icon: "flag-variant" },
  SEGURANCA: { label: "RICOCHET", color: "#F97316", icon: "shield-check" },
  "BUFF/NERF": { label: "Buff/Nerf", color: "#38BDF8", icon: "chart-bell-curve" },
  SEASON: { label: "Season", color: "#8B5CF6", icon: "calendar-star" },
};

const getCategoryMeta = (category: NewsCategory) =>
  CATEGORY_META[category] ?? CATEGORY_META.EVENTO;

const monthLabel = () => {
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const now = new Date();

  return `${months[now.getMonth()]} ${now.getFullYear()}`;
};

const CategoryBadge = ({ category }: { category: NewsCategory }) => {
  const meta = getCategoryMeta(category);

  return (
    <View
      className="h-7 flex-row items-center rounded-md px-2.5"
      style={{ backgroundColor: meta.color }}
    >
      <MaterialCommunityIcons name={meta.icon} size={13} color="white" />
      <Text
        className="ml-1.5 text-[10px] font-black uppercase text-white"
        numberOfLines={1}
      >
        {meta.label}
      </Text>
    </View>
  );
};

const SourcePill = () => (
  <View className="h-7 flex-row items-center rounded-md border border-white/10 bg-white/10 px-2.5">
    <MaterialCommunityIcons name="newspaper-variant" size={13} color="#E5E7EB" />
    <Text className="ml-1.5 text-[10px] font-black uppercase text-gray-200">
      Fonte oficial
    </Text>
  </View>
);

const NewsHero = ({ featured, total }: { featured?: NewsItem; total: number }) => (
  <View className="mb-6">
    <ImageBackground
      source={{ uri: featured?.image || FALLBACK_IMAGE }}
      className="overflow-hidden rounded-b-lg bg-[#151515]"
      imageStyle={{ opacity: 0.58 }}
      resizeMode="cover"
    >
      <View className="min-h-[350px] justify-end bg-black/55 px-5 pb-8 pt-14">
        <View className="mb-4 h-10 w-10 items-center justify-center rounded-md bg-[#D80F22]">
          <MaterialCommunityIcons name="radar" size={23} color="white" />
        </View>

        <Text className="text-[11px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
          Radar Maozinha | {monthLabel()}
        </Text>
        <Text className="mt-2 text-4xl font-black uppercase leading-10 text-white">
          Noticias oficiais CoD resumidas no app
        </Text>
        <Text className="mt-3 text-sm font-semibold leading-5 text-gray-200">
          A IA busca o blog oficial, filtra as novidades do mes e entrega o que
          muda no gameplay sem te mandar para outra pagina.
        </Text>

        <View className="mt-5 flex-row flex-wrap gap-2">
          <View className="h-8 flex-row items-center rounded-md bg-white px-3">
            <MaterialCommunityIcons name="auto-fix" size={15} color="#111827" />
            <Text className="ml-1.5 text-[11px] font-black uppercase text-gray-950">
              Cerebras + Gemini
            </Text>
          </View>
          <View className="h-8 flex-row items-center rounded-md bg-white/15 px-3">
            <MaterialCommunityIcons name="calendar-month" size={15} color="white" />
            <Text className="ml-1.5 text-[11px] font-black uppercase text-white">
              {total} no radar
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>

    {featured ? <FeaturedNews item={featured} /> : null}
  </View>
);

const FeaturedNews = ({ item }: { item: NewsItem }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View className="mx-4 mt-4 overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
      <Image
        source={{ uri: imageError ? FALLBACK_IMAGE : item.image || FALLBACK_IMAGE }}
        className="h-52 w-full bg-[#222]"
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
      <View className="p-4">
        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <CategoryBadge category={item.category} />
          <SourcePill />
          <Text className="ml-auto text-[10px] font-black uppercase text-gray-400">
            {item.date}
          </Text>
        </View>

        <Text className="text-2xl font-black uppercase leading-7 text-white">
          {item.title}
        </Text>
        <Text className="mt-3 text-sm font-semibold leading-5 text-gray-300">
          {item.summary}
        </Text>

        {item.impact ? (
          <View className="mt-4 rounded-md border border-[#D80F22]/40 bg-[#D80F22]/15 p-3">
            <View className="flex-row items-start">
              <MaterialCommunityIcons name="crosshairs-gps" size={17} color="#FFB4B4" />
              <Text className="ml-2 flex-1 text-xs font-bold leading-4 text-[#FFE1E1]">
                {item.impact}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const NewsCard = ({ item }: { item: NewsItem }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const bullets = item.bullets?.filter(Boolean).slice(0, expanded ? 3 : 2) ?? [];

  return (
    <Pressable
      onPress={() => setExpanded((value) => !value)}
      className="mx-4 mb-4 overflow-hidden rounded-lg border border-white/10 bg-[#151515]"
    >
      <View className="flex-row">
        <Image
          source={{ uri: imageError ? FALLBACK_IMAGE : item.image || FALLBACK_IMAGE }}
          className="h-36 w-32 bg-[#252525]"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        <View className="min-h-36 flex-1 p-3">
          <View className="mb-2 flex-row items-center">
            <CategoryBadge category={item.category} />
            <Text className="ml-auto text-[10px] font-black uppercase text-gray-500">
              {item.date}
            </Text>
          </View>

          <Text
            className="text-base font-black uppercase leading-5 text-white"
            numberOfLines={expanded ? 4 : 2}
          >
            {item.title}
          </Text>
          <Text
            className="mt-2 text-xs font-semibold leading-4 text-gray-400"
            numberOfLines={expanded ? 8 : 3}
          >
            {item.summary}
          </Text>
        </View>
      </View>

      <View className="border-t border-white/10 px-4 py-3">
        {bullets.map((bullet, index) => (
          <View key={`${item.id}-bullet-${index}`} className="mb-2 flex-row items-start">
            <View className="mt-1.5 h-1.5 w-1.5 rounded-sm bg-[#D80F22]" />
            <Text className="ml-2 flex-1 text-xs font-semibold leading-4 text-gray-300">
              {bullet}
            </Text>
          </View>
        ))}

        {item.impact ? (
          <View className="mt-1 flex-row items-start rounded-md bg-white/5 p-3">
            <MaterialCommunityIcons name="gamepad-variant" size={16} color="#FCA5A5" />
            <Text className="ml-2 flex-1 text-xs font-bold leading-4 text-gray-200">
              {item.impact}
            </Text>
          </View>
        ) : null}

        <View className="mt-3 flex-row items-center">
          <SourcePill />
          <View className="ml-auto flex-row items-center">
            <Text className="mr-1 text-[10px] font-black uppercase text-gray-500">
              {expanded ? "Ver menos" : "Resumo completo"}
            </Text>
            <MaterialCommunityIcons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6B7280"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const LoadingState = () => (
  <View className="px-4">
    {[0, 1, 2].map((item) => (
      <View key={`news-skeleton-${item}`} className="mb-4 overflow-hidden rounded-lg bg-[#151515]">
        <Shimmer width="100%" height={190} borderRadius={8} />
        <View className="p-4">
          <Shimmer width="42%" height={18} borderRadius={6} />
          <View className="h-3" />
          <Shimmer width="88%" height={20} borderRadius={6} />
          <View className="h-2" />
          <Shimmer width="70%" height={14} borderRadius={6} />
        </View>
      </View>
    ))}
  </View>
);

const EmptyState = ({ message }: { message?: string }) => (
  <View className="mx-4 items-center rounded-lg border border-white/10 bg-[#151515] px-6 py-12">
    <View className="mb-4 h-14 w-14 items-center justify-center rounded-md bg-white/10">
      <MaterialCommunityIcons name="newspaper-remove" size={30} color="#9CA3AF" />
    </View>
    <Text className="text-center text-lg font-black uppercase text-white">
      Nada novo no radar
    </Text>
    <Text className="mt-2 text-center text-sm font-semibold leading-5 text-gray-400">
      {message ||
        "Nao encontrei materias oficiais do mes atual no blog do Call of Duty agora."}
    </Text>
  </View>
);

const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const restNews = useMemo(() => news.slice(1), [news]);

  const loadNews = async (force = false) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchLatestCoDNews(force);
      setNews(data);

      if (data.length === 0) {
        setErrorMessage("O provedor nao retornou noticias oficiais para exibir.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Nao consegui atualizar o Radar Maozinha agora.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <View className="flex-1 bg-[#090909]">
      <FlatList
        data={restNews}
        keyExtractor={(item, index) => item.id || `news-item-${index}`}
        renderItem={({ item }) => <NewsCard item={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadNews(true)}
            tintColor="#D80F22"
            colors={["#D80F22"]}
          />
        }
        ListHeaderComponent={
          <>
            <NewsHero featured={news[0]} total={news.length} />
            {news.length > 1 ? (
              <View className="mb-3 px-4">
                <Text className="text-[11px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
                  Mais novidades oficiais
                </Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState />
          ) : news.length === 0 ? (
            <EmptyState message={errorMessage} />
          ) : null
        }
      />
    </View>
  );
};

export default NewsScreen;
