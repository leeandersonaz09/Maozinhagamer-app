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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Carousel, Shimmer } from "../../components";
import {
  fetchAdsBanner,
  fetchOffers,
  fetchSponsors,
} from "../../utils/apiRequests";
import { loadDataIfNeeded } from "../../utils/globalFunctions";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type Offer = {
  id: string | number;
  img: string;
  title: string;
  text?: string;
  uri?: string;
  price?: string | number;
  oldPrice?: string | number;
  badge?: string;
};

type Sponsor = {
  id: string | number;
  img: string;
  title: string;
  uri?: string;
};

type AdBanner = {
  id: string | number;
  img: string;
  title?: string;
  text?: string;
  uri?: string;
  buttonTitle?: string;
  category?: string;
};

type PatrocinadorData = {
  dataBanner: AdBanner[];
  partners: Sponsor[];
  ads: Offer[];
};

const Patrocinador = () => {
  const [data, setData] = useState<PatrocinadorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      const [offersData, sponsorsData, adsbannerData] = await Promise.all([
        loadDataIfNeeded("offersData", fetchOffers, { forceRefresh }),
        loadDataIfNeeded("sponsorsData", fetchSponsors, { forceRefresh }),
        loadDataIfNeeded("adsbannerData", fetchAdsBanner, { forceRefresh }),
      ]);

      setData({
        dataBanner: (adsbannerData ?? []) as AdBanner[],
        partners: (sponsorsData ?? []) as Sponsor[],
        ads: (offersData ?? []) as Offer[],
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setData({ dataBanner: [], partners: [], ads: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderSkeleton = () => (
    <View className="px-4">
      <View className="mt-6">
        <Shimmer width={200} height={24} borderRadius={4} />
        <View className="flex-row mt-4">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="mr-4 items-center">
              <Shimmer width={64} height={64} borderRadius={32} />
              <View className="mt-2">
                <Shimmer width={50} height={12} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="mt-10">
        <Shimmer width="100%" height={180} borderRadius={20} />
      </View>
      <View className="mt-10">
        <Shimmer width={200} height={24} borderRadius={4} />
        {[1, 2].map((i) => (
          <View key={i} className="mt-4 p-4 rounded-3xl bg-black/5">
            <Shimmer width="100%" height={150} borderRadius={16} />
            <View className="mt-4 gap-2">
              <Shimmer width="60%" height={20} borderRadius={4} />
              <Shimmer width="40%" height={15} borderRadius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ThemedView className="flex-1 bg-white dark:bg-[#0D0D0D]">
      <FlatList
        data={isLoading ? [] : (data?.ads ?? [])}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={() => fetchAllData(true)} 
            tintColor="#7A0000"
          />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View className="bg-[#7A0000] px-6 pt-12 pb-10 rounded-b-[40px]">
              <View className="flex-row items-center gap-2 mb-6">
                <MaterialCommunityIcons name="handshake-outline" size={24} color="white" />
                <Text className="text-white text-2xl font-black uppercase tracking-tighter">Parceiros</Text>
              </View>
              
              <Text className="text-white/60 text-xs font-bold uppercase mb-4 tracking-widest">Canais & Squads Parceiros</Text>
              
              <FlatList
                horizontal
                data={data?.partners ?? []}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => item.uri && Linking.openURL(item.uri)}
                    className="mr-6 items-center"
                  >
                    <View className="w-16 h-16 rounded-full border-2 border-white/20 p-1">
                      <Image source={{ uri: item.img }} className="w-full h-full rounded-full bg-white/10" />
                    </View>
                    <Text className="text-white text-[10px] font-bold mt-2 uppercase text-center w-16" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Featured Section (Carousel) */}
            <View className="mt-8 px-4">
              <SectionTitle title="Destaques Patrocinados" />
              {data?.dataBanner && data.dataBanner.length > 0 ? (
                <View className="rounded-[30px] overflow-hidden shadow-xl">
                  <Carousel data={data.dataBanner} />
                </View>
              ) : !isLoading && (
                <View className="p-8 rounded-[30px] border border-dashed border-black/10 items-center">
                  <MaterialCommunityIcons name="bullhorn-outline" size={32} color="#999" />
                  <Text className="text-black/40 font-bold mt-2">Nenhum destaque hoje</Text>
                </View>
              )}
            </View>

            <View className="mt-10 px-4 mb-4">
              <SectionTitle title="Ofertas & Promoções" />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => item.uri && Linking.openURL(item.uri)}
            activeOpacity={0.9}
            className="mx-4 mb-6"
          >
            <View className="rounded-[35px] bg-black/5 dark:bg-white/5 overflow-hidden border border-black/5 dark:border-white/10 shadow-sm">
              <Image source={{ uri: item.img }} className="w-full h-56 bg-black/10" resizeMode="cover" />
              
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 mr-4">
                    {item.badge && (
                      <View className="bg-[#7A0000] self-start px-3 py-1 rounded-full mb-2">
                        <Text className="text-white text-[9px] font-black uppercase">{item.badge}</Text>
                      </View>
                    )}
                    <ThemedText className="text-xl font-black uppercase leading-6">{item.title}</ThemedText>
                  </View>
                  
                  <View className="items-end">
                    {item.oldPrice && (
                      <Text className="text-black/40 dark:text-white/40 text-xs font-bold line-through">
                        R$ {item.oldPrice}
                      </Text>
                    )}
                    <Text className="text-[#7A0000] dark:text-[#FFFB00] text-2xl font-black">
                      R$ {item.price}
                    </Text>
                  </View>
                </View>

                {item.text && (
                  <ThemedText className="text-sm opacity-60 font-bold leading-5 mb-6">
                    {item.text}
                  </ThemedText>
                )}

                <View className="flex-row items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
                    <Text className="text-[#4CAF50] text-[10px] font-black uppercase">Verificado</Text>
                  </View>
                  
                  <View className="flex-row items-center bg-[#7A0000] px-5 py-2.5 rounded-2xl">
                    <Text className="text-white font-black text-xs uppercase mr-2">Ver Oferta</Text>
                    <MaterialCommunityIcons name="arrow-right" size={14} color="white" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isLoading ? renderSkeleton() : (
            <View className="items-center py-20 opacity-20">
              <MaterialCommunityIcons name="tag-off-outline" size={64} color="gray" />
              <Text className="mt-4 font-black uppercase">Sem ofertas no momento</Text>
            </View>
          )
        }
      />
    </ThemedView>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <ThemedText className="text-xs font-black uppercase tracking-[3px] text-black/30 dark:text-white/30 mb-4 ml-2">
    {title}
  </ThemedText>
);

export default Patrocinador;
