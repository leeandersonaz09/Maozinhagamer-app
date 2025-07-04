import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Linking,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import styles from "../../constants/Theme/styles/HomeStyles";
import { HomeCard, Carousel, Shimmer } from "../../components";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/Theme/theme";
import LottieView from "lottie-react-native";
import {
  getBannerData,
  fetchWidgetsData,
  getUpdateNotes,
} from "../../utils/apiRequests";
import { loadDataIfNeeded } from "../../utils/globalFunctions";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Tipos para os dados da API
type WidgetItem = { id: string; title: string; subCollection: any[] };
type BannerItem = { id: string; [key: string]: any };
type NoteItem = { id: string; uri: string; img: string; title: string };

// Tipo para a estrutura de dados da nossa lista unificada
type ListItem = {
  type:
    | "loading_state"
    | "carousel"
    | "channels_title"
    | "channels_list"
    | "widgets_title"
    | "widget_row";
  id: string;
  data?: any;
};

const Home = () => {
  const [data, setData] = useState<WidgetItem[]>([]);
  const [dataBanner, setDataBanner] = useState<BannerItem[]>([]);
  const [dataNotes, setDataNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [bannerData, widgetsData, notesData] = await Promise.all([
        loadDataIfNeeded<BannerItem[]>("bannerData", getBannerData),
        loadDataIfNeeded<WidgetItem[]>("widgetsData", fetchWidgetsData),
        loadDataIfNeeded<NoteItem[]>("notesData", getUpdateNotes),
      ]);
      setDataBanner(bannerData ?? []);
      setData(widgetsData ?? []);
      setDataNotes(notesData ?? []);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Estrutura de dados unificada para a FlatList principal
  const listData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];

    if (isLoading) {
      items.push({ type: "loading_state", id: "loading_state" });
      items.push({ type: "carousel", id: "carousel_shimmer", data: [] });
    } else {
      if (dataBanner.length > 0) {
        items.push({ type: "carousel", id: "carousel", data: dataBanner });
      } else {
        items.push({ type: "carousel", id: "carousel_shimmer", data: [] });
      }
    }

    items.push({ type: "channels_title", id: "channels_title" });
    items.push({
      type: "channels_list",
      id: "channels_list",
      data: dataNotes,
    });

    items.push({ type: "widgets_title", id: "widgets_title" });

    // Agrupa os widgets em pares para a grade, mantendo o layout de 2 colunas
    const itemsToLoop = isLoading ? 6 : data.length;
    const sourceData = isLoading ? Array(6).fill(null) : data;

    for (let i = 0; i < itemsToLoop; i += 2) {
      items.push({
        type: "widget_row",
        id: `widget-row-${i}`,
        data: sourceData.slice(i, i + 2),
      });
    }

    return items;
  }, [isLoading, data, dataBanner, dataNotes]);

  const renderItem = ({ item }: { item: ListItem }) => {
    switch (item.type) {
      case "loading_state":
        return (
          <View style={{ alignItems: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>
              Aguenta aí que estamos no meio da ranked MW3!
            </ThemedText>
            <ThemedText style={{ fontWeight: "bold" }}>
              Já iremos atualizar!
            </ThemedText>
            <LottieView
              autoPlay
              style={{ width: 150, height: 150 }}
              source={require("../../assets/Lotties/hand 2.json")}
            />
          </View>
        );
      case "carousel":
        return (
          // Adicionamos esta View para criar o espaçamento desejado
          <View style={{ marginTop: 15 }}>
            {item.data.length > 0 ? (
              <Carousel data={item.data} />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Shimmer width={300} height={150} borderRadius={12} />
              </View>
            )}
          </View>
        );
      case "channels_title":
        return (
          <ThemedText style={styles.SmallListTittle}>
            Canais Parceiros
          </ThemedText>
        );
      case "channels_list":
        return <PartnerChannelsList isLoading={isLoading} data={item.data} />;
      case "widgets_title":
        return <ThemedText style={styles.WidgetsTittle}>Jogos</ThemedText>;
      case "widget_row":
        return (
          <View style={styles.WigtesContainer}>
            {item.data.map((widget: WidgetItem | null, index: number) =>
              widget ? (
                <Link
                  key={widget.id}
                  push
                  href={{
                    pathname: `/pages/HomeCard/${widget.id}`,
                    params: {
                      title: widget.title,
                      subCollection: JSON.stringify(widget.subCollection),
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.cardTouchable}>
                    <HomeCard data={widget} />
                  </TouchableOpacity>
                </Link>
              ) : (
                <View key={index} style={styles.cardTouchable}>
                  <Shimmer width="100%" height={120} borderRadius={8} />
                </View>
              )
            )}
            {/* Adiciona um placeholder se houver apenas um item na linha para manter o alinhamento */}
            {item.data.length === 1 && <View style={styles.cardTouchable} />}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Image
              style={styles.headerImage}
              source={require("../../assets/images/maozinha-home.jpg")}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchAllData} />
          }
        />
      </ThemedView>
    </>
  );
};

const PartnerChannelsList = ({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: NoteItem[];
}) => {
  if (isLoading) {
    return (
      <FlatList
        horizontal
        data={[...Array(3)]}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={() => (
          <View style={{ paddingLeft: 10 }}>
            <Shimmer width={200} height={80} borderRadius={15} />
          </View>
        )}
        keyExtractor={(_, index) => `shimmer-note-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10 }}
      />
    );
  }

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => `note-${item.id}`}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.SmallListContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Linking.openURL(item.uri)}
          >
            <View style={styles.Sitem}>
              <Image
                source={{ uri: item.img }}
                style={styles.SitemPhoto}
                resizeMode="cover"
              />
              <View style={styles.StextContainer}>
                <Text style={styles.SitemText}>{item.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default Home;
