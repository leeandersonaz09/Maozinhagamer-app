import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Carousel, Badge, Shimmer } from "../../components";
import { COLORS } from "../../constants/Theme/theme";
import {
  fetchOffers,
  fetchSponsors,
  fetchAdsBanner,
  // Importe os tipos dos dados da sua API
  Offer,
  Sponsor,
  AdBanner,
} from "../../utils/apiRequests";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedScrollView } from "@/components/ThemedScrollView";

// TODO: Substituir pela busca de dados do Contexto global
import { loadDataIfNeeded } from "../../utils/globalFunctions";

type PatrocinadorData = {
  dataBanner: AdBanner[];
  partners: Sponsor[];
  ads: Offer[];
};

const Patrocinador = () => {
  const [data, setData] = useState<PatrocinadorData | null>(null);
  const insets = useSafeAreaInsets(); // 1. Pega os valores da área segura
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
      // Idealmente, estes dados viriam de um Contexto global
      // que já foi carregado no _layout.tsx
      const [offersData, sponsorsData, adsbannerData] = await Promise.all([
        loadDataIfNeeded<Offer[]>("offersData", fetchOffers),
        loadDataIfNeeded<Sponsor[]>("sponsorsData", fetchSponsors),
        loadDataIfNeeded<AdBanner[]>("adsbannerData", fetchAdsBanner),
      ]);

      setData({
        dataBanner: adsbannerData ?? [],
        partners: sponsorsData ?? [],
        ads: offersData ?? [],
      });
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
    !isLoading && // Se não está carregando
    (!data || // E não há dados
      (data.partners.length === 0 && // ou todas as listas estão vazias
        data.ads.length === 0 &&
        data.dataBanner.length === 0))
  ) {
    return (
      <ThemedScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchAllData} />
        }
      >
        <View>
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
        </View>
      </ThemedScrollView>
    );
  }

  return (
    <ThemedScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchAllData} />
      }
    >
     {/* 2. Aplica o 'paddingTop' dinâmico ao cabeçalho */}
     <View
        style={[styles.headerview, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.white}
          />
          <Text style={styles.headerTitle}>Parceiros e Ofertas</Text>
        </View>

        <Text style={styles.sectionTitlePartner}>Principais Parceiros</Text>
        <PartnersList isLoading={isLoading} partners={data?.partners ?? []} />
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
          {isLoading ? (
            <View style={{ alignItems: "center" }}>
              <Shimmer
                width="90%" // Usando porcentagem para ser responsivo
                height={150}
                borderRadius={12}
              />
            </View>
          ) : (
            data?.dataBanner &&
            data.dataBanner.length > 0 && <Carousel data={data.dataBanner} />
          )}
        </View>
      )}
      <ThemedText style={styles.sectionTitle}>Ofertas Patrocinadas</ThemedText>
      <AdsList
        isLoading={isLoading}
        ads={data?.ads ?? []}
        cardBackgroundColor={cardBackgroundColor}
        priceColor={priceColor}
      />

      <View style={styles.spaceBotton} />
    </ThemedScrollView>
  );
};

type PartnersListProps = {
  isLoading: boolean;
  partners: Sponsor[];
};

const PartnersList: FC<PartnersListProps> = ({ isLoading, partners }) => {
  if (isLoading) {
    return (
      <FlatList
        horizontal
        data={[...Array(5)]}
        renderItem={() => (
          <View style={{ alignItems: "center", marginHorizontal: 10 }}>
            <Shimmer width={50} height={50} borderRadius={25} />
            <View style={{ marginTop: 5 }}>
              <Shimmer width={50} height={15} borderRadius={4} />
            </View>
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
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        // Desestruturamos o 'id' para usá-lo diretamente no caminho
        const { id, ...rest } = item;
        
        return (
          <Link
            href={{
              pathname: rest.uri, // Caminho construído dinamicamente
              params: rest, // Restante dos dados como parâmetros
            }}
            asChild
          >
            <TouchableOpacity>
              <View style={styles.partnerCard}>
                <Image source={{ uri: item.img }} style={styles.partnerImage} />
                <Text style={styles.partnerName}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        );
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

type AdsListProps = {
  isLoading: boolean;
  ads: Offer[];
  cardBackgroundColor: string;
  priceColor: string;
};

const AdsList: FC<AdsListProps> = ({
  isLoading,
  ads,
  cardBackgroundColor,
  priceColor,
}) => {
  if (isLoading) {
    return (
      <FlatList
        horizontal
        data={[...Array(3)]}
        renderItem={() => (
          <Shimmer
            width={250}
            height={200}
            style={{ borderRadius: 8, marginLeft: 15 }}
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
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => item.uri && Linking.openURL(item.uri)}>
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
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
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
    textAlign: "center",
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
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
    marginBottom: 20,
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
// marginTop: 40, // REMOVIDO: Não usar mais valores fixos
paddingBottom: 10, // Mantém o padding inferior
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
