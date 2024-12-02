// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator, // Spinner nativo do React Native
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importando ícone
import { Carousel, Badge } from "../../components"; // Reutilizando o Carousel da Home
import { COLORS } from "../../constants/Theme/theme";
import {
  fetchOffers,
  fetchSponsors,
  fetchAdsBanner,
} from "../../utils/apiRequests"; // Certifique-se de ter a função de API
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native"; // Importando o hook useColorScheme
import { ThemedScrollView } from "@/components/ThemedScrollView";

const Patrocinador = () => {
  const [dataBanner, setDataBanner] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(true); // Controle de visibilidade do Carousel
  const colorScheme = useColorScheme();
  const cardBackgroundColor =
    colorScheme === "dark" ? "#2C2C2CFF" : COLORS.card;
  const priceColor = colorScheme === "dark" ? "#00CE0EFF" : COLORS.primary;
  const iconColor = colorScheme === "dark" ? "#00CE0EFF" : COLORS.primary;

  const pushData = async () => {
    setLoading(true);
    try {
      const offersData = await fetchOffers();
      const sponsorsData = await fetchSponsors();
      const adsbannerData = await fetchAdsBanner();
      setDataBanner(adsbannerData || []);
      setPartners(sponsorsData || []);
      setAds(offersData || []);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pushData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="account-group"
          size={40}
          color={iconColor}
        />
        <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
        <ActivityIndicator size="large" color={iconColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerview}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.white}
          />
          <Text style={styles.headerTitle}>Parceiros e ofertas</Text>
        </View>

        <Text style={styles.sectionTitlePartner}>Principais Parceiros</Text>
        <FlatList
          horizontal
          data={partners}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.partnerCard}>
                <Image source={{ uri: item.img }} style={styles.partnerImage} />
                <Text style={styles.partnerName}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.badgeContainer}>
        <Badge
          label="Mostrar Tudo"
          active={showCarousel}
          onPress={() => setShowCarousel(true)} // Agora funciona!
        />
        <Badge
          label="Mostrar ofertas"
          active={!showCarousel}
          onPress={() => setShowCarousel(false)} // Agora funciona!
        />
      </View>

      {/* Banner com controle de visibilidade */}
      {showCarousel && (
        <View style={styles.bannerContainer}>
          <Carousel data={dataBanner} />
        </View>
      )}

      <ThemedText style={styles.sectionTitle}>Ofertas Patrocinadas</ThemedText>
      <FlatList
        horizontal
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView
            style={[styles.adCard, { backgroundColor: cardBackgroundColor }]}
          >
            <Image source={{ uri: item.img }} style={styles.adImage} />
            <View style={styles.adContent}>
              {item.oldPrice && (
                <ThemedText style={styles.oldPrice}>{item.oldPrice}</ThemedText>
              )}
              <ThemedText style={[styles.price, { color: priceColor }]}>
                {item.price}
              </ThemedText>
              <ThemedText style={styles.adTitle}>{item.title}</ThemedText>
              {item.badge && (
                <ThemedText style={styles.badge}>{item.badge}</ThemedText>
              )}
            </View>
          </ThemedView>
        )}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.spaceBotton} />
    </ThemedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    //color: COLORS.primary,
    marginTop: 10,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  badgeContainer: {
    flexDirection: "row", // Coloca os badges na mesma linha
    alignItems: "center", // Alinha os badges verticalmente ao centro
    //justifyContent: "space-between", // Espaçamento uniforme (ou use 'flex-start' para alinhá-los à esquerda)
    paddingHorizontal: 10, // Margem horizontal
    marginVertical: 10, // Margem vertical para separar do restante
  },
  headerview: {
    flex: 1,
    backgroundColor: COLORS.primary,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 10,
  },
  bannerContainer: {
    marginVertical: 10,
  },
  sectionTitlePartner: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 15,
    paddingBottom: 15,
    //olor: COLORS.black,
  },
  partnerCard: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginBottom: 5,
  },
  partnerName: {
    fontSize: 10,
    color: COLORS.white,
  },
  adCard: {
    borderRadius: 8,
    marginLeft: 15,
    marginRight: 10,
    width: 250,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 20,
  },
  adImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  adContent: {
    padding: 10,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    //color: COLORS.lightText,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    //color: COLORS.primary,
    marginVertical: 5,
  },
  adTitle: {
    fontSize: 14,
    //color: COLORS.text,
    marginBottom: 5,
  },
  badge: {
    fontSize: 12,
    fontWeight: "bold",
    //color: COLORS.success,
    backgroundColor: COLORS.lightSuccess,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  moreSponsorsCard: {
    backgroundColor: COLORS.primary,
    margin: 15,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  moreSponsorsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  moreSponsorsDate: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 5,
  },
  spaceBotton: {
    marginBottom: 120,
  },
});

export default Patrocinador;
