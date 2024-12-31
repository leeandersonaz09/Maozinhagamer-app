// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Carousel, Badge, Shimmer } from "../../components";
import { COLORS } from "../../constants/Theme/theme";
import {
  fetchOffers,
  fetchSponsors,
  fetchAdsBanner,
} from "../../utils/apiRequests";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native";
import { ThemedScrollView } from "@/components/ThemedScrollView";

const Patrocinador = () => {
  const [dataBanner, setDataBanner] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(true);
  const colorScheme = useColorScheme();
  const cardBackgroundColor =
    colorScheme === "dark" ? "#2C2C2CFF" : COLORS.card;
  const priceColor = colorScheme === "dark" ? "#00CE0EFF" : COLORS.primary;
  const iconColor = colorScheme === "dark" ? "#00CE0EFF" : COLORS.primary;

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const offersData = await fetchOffers();
      const sponsorsData = await fetchSponsors();
      const adsbannerData = await fetchAdsBanner();
      setDataBanner(adsbannerData || []);
      setPartners(sponsorsData || []);
      setAds(offersData || []);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (
    !isLoading &&
    partners.length === 0 &&
    ads.length === 0 &&
    dataBanner.length === 0
  ) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          Nenhum dado disponível no momento.
        </ThemedText>
        <ThemedText style={styles.contactText}>
          Entre em contato para anunciar conosco:
        </ThemedText>
        <ThemedText
          style={styles.contactEmail}
          onPress={() => Linking.openURL("mailto:contato@contato.com")}
        >
          Email: contato@contato.com
        </ThemedText>
        <ThemedText
          style={styles.contactPhone}
          onPress={() => Linking.openURL("tel:+5571999999999")}
        >
          Telefone: (71) 99999-9999
        </ThemedText>
        <ThemedView style={styles.refreshButtonContainer}>
          <Button
            title="Atualizar"
            onPress={fetchAllData}
            color={COLORS.primary}
          />
        </ThemedView>
      </ThemedView>
    );
  }

  const renderPartners = () => {
    if (isLoading) {
      return (
        <FlatList
          horizontal
          data={[...Array(5)]}
          renderItem={() => (
            <View style={{ marginHorizontal: 10, gap: 10 }}>
              <Shimmer width={50} height={50} borderRadius={25} />
              <Shimmer width={50} height={15} />
            </View>
          )}
          keyExtractor={(_, index) => `shimmer-partner-${index}`}
          showsHorizontalScrollIndicator={false}
        />
      );
    }

    return (
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
    );
  };

  const renderAds = () => {
    if (isLoading) {
      return (
        <FlatList
          horizontal
          data={[...Array(3)]}
          renderItem={() => (
            <Shimmer
              width={250}
              height={200}
              style={{ borderRadius: 8, marginRight: 10, gap: 10 }}
            />
          )}
          keyExtractor={(_, index) => `shimmer-ad-${index}`}
          showsHorizontalScrollIndicator={false}
        />
      );
    }

    return (
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
            </View>
          </ThemedView>
        )}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

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
          <Text style={styles.headerTitle}>Parceiros e Ofertas</Text>
        </View>

        <Text style={styles.sectionTitlePartner}>Principais Parceiros</Text>
        {renderPartners()}
      </View>
      <View style={styles.badgeContainer}>
        <Badge
          label="Mostrar Tudo"
          active={showCarousel}
          onPress={() => setShowCarousel(true)}
        />
        <Badge
          label="Mostrar Ofertas"
          active={!showCarousel}
          onPress={() => setShowCarousel(false)}
        />
      </View>

      {showCarousel && (
        <View style={styles.bannerContainer}>
          {isLoading || dataBanner.length === 0 ? (
            <Shimmer
              width="100%"
              height={150}
              borderRadius={12}
              style={{ marginLeft: 50 }}
            />
          ) : (
            <Carousel data={dataBanner} />
          )}
        </View>
      )}
      <ThemedText style={styles.sectionTitle}>Ofertas Patrocinadas</ThemedText>
      {renderAds()}

      <View style={styles.spaceBotton} />
    </ThemedScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactEmail: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  refreshButtonContainer: {
    margin: 20,
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
    //marginTop: 20, // da uma margem abaixo do status bar
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
