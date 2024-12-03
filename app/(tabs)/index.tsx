// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
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
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataBanner, setDataBanner] = useState([]);
  const [dataNotes, setDataNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const bannerData = await getBannerData();
      setDataBanner(bannerData || []);
      const widgetsData = await fetchWidgetsData();
      setData(widgetsData || []);
      const notesData = await getUpdateNotes();
      setDataNotes(notesData || []);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderItems = () => {
    if (isLoading || data.length === 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Shimmer key={index} width={180} height={120} borderRadius={8} />
          ))}
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => `widget-${item.id}`}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link
            push
            href={{
              pathname: `/pages/HomeCard/${item.id}`,
              params: {
                title: item.title,
                subCollection: JSON.stringify(item.subCollection),
              },
            }}
            asChild
          >
            <TouchableOpacity style={styles.cardTouchable}>
              <HomeCard data={item} />
            </TouchableOpacity>
          </Link>
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={COLORS.primary}
        style="light"
        translucent={false}
      />
      <FlatList
        data={dataBanner}
        keyExtractor={(item) => `banner-${item.id}`}
        ListHeaderComponent={
          <ThemedView style={styles.container}>
            <Image
              style={styles.headerImage}
              source={require("../../assets/images/maozinha-home.jpg")}
            />
            <ThemedView style={[styles.contentContainer]}>
              <View style={styles.subscribeView}>
                <View style={styles.loadingView}>
                  {isLoading ? (
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
                  ) : (
                    <>
                      {dataBanner.length === 0 ? (
                        <Shimmer width={300} height={150} borderRadius={12} />
                      ) : (
                        <Carousel data={dataBanner} />
                      )}
                    </>
                  )}
                  <ThemedText style={styles.SmallListTittle}>
                    Canais Parceiros
                  </ThemedText>
                  {isLoading || dataNotes.length === 0 ? (
                    <FlatList
                      horizontal
                      data={[...Array(3)]}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 16 }} />
                      )} // Espaçamento horizontal de 16px
                      renderItem={() => (
                        <Shimmer width={150} height={80} borderRadius={8} />
                      )}
                      keyExtractor={(_, index) => `shimmer-note-${index}`}
                      showsHorizontalScrollIndicator={false} // Esconde a barra horizontal
                    />
                  ) : (
                    <FlatList
                      horizontal
                      data={dataNotes}
                      keyExtractor={(item) => `note-${item.id}`}
                      showsHorizontalScrollIndicator={false} // Esconde a barra horizontal
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
                                <Text style={styles.SitemText}>
                                  {item.title}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  )}
                  <ThemedText style={styles.WidgetsTittle}>Jogos</ThemedText>
                  {renderItems()}
                </View>
              </View>
            </ThemedView>
          </ThemedView>
        }
        refreshing={isLoading}
        onRefresh={fetchAllData}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default Home;
