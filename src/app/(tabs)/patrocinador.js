import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importando ícone
import { Carousel } from "../components"; // Reutilizando o Carousel da Home
import { COLORS } from "../Theme/theme";

const Patrocinador = () => {
  const [dataBanner, setDataBanner] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ads, setAds] = useState([]);

  // Mock para simular os dados
  useEffect(() => {
    setDataBanner([
      { id: "1", img: "https://via.placeholder.com/300x100?text=Banner+1" },
      { id: "2", img: "https://via.placeholder.com/300x100?text=Banner+2" },
    ]);

    setPartners([
      { id: "1", name: "Parceiro A", img: "https://via.placeholder.com/100" },
      { id: "2", name: "Parceiro B", img: "https://via.placeholder.com/100" },
      { id: "3", name: "Parceiro C", img: "https://via.placeholder.com/100" },
    ]);

    setAds([
      {
        id: "1",
        title: "Calça Farm",
        img: "https://via.placeholder.com/300x200?text=Oferta+1",
        price: "R$ 100",
        oldPrice: "R$ 150",
        badge: "Garantia da OLX",
      },
      {
        id: "2",
        title: "Calça Cargo Farm",
        img: "https://via.placeholder.com/300x200?text=Oferta+2",
        price: "R$ 130",
        badge: "Garantia da OLX",
      },
    ]);
  }, []);

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
                <Text style={styles.partnerName}>{item.name}</Text>
              </View></TouchableOpacity>
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
    fontSize: 12,
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
