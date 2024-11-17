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
import { Carousel } from "../components"; // Reutilizando o Carousel da Home
import { COLORS } from "../Theme/theme";
import { fetchOffers, fetchSponsors, fetchAdsBanner} from "../utils/apiRequests"; // Certifique-se de ter a função de API

const Patrocinador = () => {
  const [dataBanner, setDataBanner] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const pushData = async () => {
    setLoading(true); // Ativa o carregamento ao buscar os dados
    try {
      const offersData = await fetchOffers(); // Chama a função de API para pegar dados atualizados
      const sponsorsData = await fetchSponsors(); // Chama a função de API para pegar dados atualizados
      const adsbannerData = await fetchAdsBanner(); // Chama a função de API para pegar dados atualizados
      setDataBanner(adsbannerData || []);
      setPartners(sponsorsData || []);
      setAds(offersData || []);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setLoading(false); // Desativa o carregamento após a busca dos dados
    }
  };

  useEffect(() => {
    pushData(); // Chama a função pushData quando o componente for montado
  }, []); // O array vazio faz com que a função seja chamada uma vez, ao montar o componente

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="account-group"
          size={40}
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>Carregando...</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    ); // Exibe o spinner enquanto os dados estão sendo carregados
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerview}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.white}
          />
          <Text style={styles.headerTitle}>Parceiros e ofertas</Text>
        </View>

        {/* Principais Parceiros */}
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

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Carousel data={dataBanner} />
      </View>

      {/* Ofertas Patrocinadas */}
      <Text style={styles.sectionTitle}>Ofertas Patrocinadas</Text>
      <FlatList
        horizontal
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.adCard}>
            <Image source={{ uri: item.img }} style={styles.adImage} />
            <View style={styles.adContent}>
              {item.oldPrice && (
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              )}
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.adTitle}>{item.title}</Text>
              {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
            </View>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Mais Parceiros e Ofertas */}
      <TouchableOpacity style={styles.moreSponsorsCard}>
        <Text style={styles.moreSponsorsTitle}>Mais Parceiros e Ofertas</Text>
        <Text style={styles.moreSponsorsDate}>
          Clique aqui para ver mais parceiros e ofertas
        </Text>
      </TouchableOpacity>

      <View style={styles.spaceBotton} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 10,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerview: {
    backgroundColor: COLORS.primary,
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
    color: COLORS.black,
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
    backgroundColor: COLORS.card,
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
    color: COLORS.lightText,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: 5,
  },
  adTitle: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 5,
  },
  badge: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.success,
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
