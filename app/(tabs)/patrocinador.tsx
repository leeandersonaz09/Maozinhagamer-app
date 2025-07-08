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
  Dimensions, // Importado para obter largura da tela
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

// Obter a largura da tela para estilização responsiva do card
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.7; // Largura do card, 70% da tela
const CARD_MARGIN = 15; // Margem entre os cards

type PatrocinadorData = {
  dataBanner: AdBanner[];
  partners: Sponsor[];
  ads: Offer[];
};

const Patrocinador = () => {
  const [data, setData] = useState<PatrocinadorData | null>(null);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(true);
  const colorScheme = useColorScheme();
  const cardBackgroundColor =
  colorScheme === "dark" ? "#2C2C2CFF" : COLORS.card;
  const priceColor = colorScheme === "dark" ? COLORS.success : COLORS.success; // Verde para preço ou cor primária
  const oldPriceColor = colorScheme === "dark" ? COLORS.white : COLORS.yellow; // Cor para preço antigo
  const iconColor = colorScheme === "dark" ? COLORS.success : COLORS.primary; // Ícone de link, use uma cor que chame atenção

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [offersData, sponsorsData, adsbannerData] = await Promise.all([
        loadDataIfNeeded("offersData", fetchOffers),
        loadDataIfNeeded("sponsorsData", fetchSponsors),
        loadDataIfNeeded("adsbannerData", fetchAdsBanner),
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
    !isLoading &&
    (!data ||
      (data.partners.length === 0 &&
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
      <View style={[styles.headerview, { paddingTop: insets.top + 10 }]}>
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
              <Shimmer width={300} height={150} borderRadius={12} />
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
        oldPriceColor={oldPriceColor} // Passa a cor do preço antigo
        iconColor={iconColor} // Passa a cor do ícone de link
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
        const { id, ...rest } = item;

        return (
          <Link
            href={{
              pathname: rest.uri,
              params: rest,
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
  oldPriceColor: string; // Adicionado
  iconColor: string; // Adicionado
};

const AdsList: FC<AdsListProps> = ({
  isLoading,
  ads,
  cardBackgroundColor,
  priceColor,
  oldPriceColor, // Recebido
  iconColor, // Recebido
}) => {
  if (isLoading) {
    return (
      <FlatList
        horizontal
        data={[...Array(3)]}
        renderItem={() => (
          <View style={{ marginLeft: CARD_MARGIN }}>
            <Shimmer
              width={CARD_WIDTH}
              height={CARD_WIDTH * 0.8} // Ajuste para proporção da imagem
              borderRadius={8}
            />
          </View>
        )}
        keyExtractor={(_, index) => `shimmer-ad-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }} // Para remover o marginLeft inicial do primeiro item
      />
    );
  }

  return (
    <FlatList
      horizontal
      data={ads}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => item.uri && Linking.openURL(item.uri)}
          style={{
            marginLeft: index === 0 ? CARD_MARGIN : CARD_MARGIN / 2,
            marginRight: CARD_MARGIN / 2,
          }} // Ajusta a margem para o primeiro card
        >
          <ThemedView
            style={[styles.adCard, { backgroundColor: cardBackgroundColor }]}
          >
            <Image source={{ uri: item.img }} style={styles.adImage} />
            <View style={styles.adContent}>
              {/* Badge (subtítulo) */}
              {item.badge && (
                <View style={styles.badgeOfferContainer}>
                  <Text style={styles.badgeOfferText}>{item.badge}</Text>
                </View>
              )}

              {/* Título da Oferta */}
              <ThemedText style={styles.adTitle}>{item.title}</ThemedText>

              {/* Preços */}
              <View style={styles.priceContainer}>
                {item.oldPrice && (
                  <ThemedText
                    style={[styles.oldPrice, { color: oldPriceColor }]}
                  >
                    R$ {item.oldPrice}
                  </ThemedText>
                )}
                <ThemedText style={[styles.price, { color: priceColor }]}>
                  R$ {item.price}
                </ThemedText>
              </View>

              {/* Descrição */}
              {item.text && (
                <ThemedText style={styles.adDescription}>
                  {item.text}
                </ThemedText>
              )}

              {/* Ícone de Link */}
              {item.uri && (
                <View style={styles.linkIconContainer}>
                  <MaterialCommunityIcons
                    name="link-variant"
                    size={20}
                    color={iconColor}
                  />
                  <ThemedText style={[styles.linkText, { color: iconColor }]}>
                    Ver Oferta
                  </ThemedText>
                </View>
              )}
            </View>
          </ThemedView>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.adsListContainer} // Adiciona estilo ao container da FlatList
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    gap: 10, // Espaçamento entre os badges
  },
  headerview: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingBottom: 10,
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
  // --- Estilos do Card de Oferta Refatorado ---
  adsListContainer: {
    paddingRight: CARD_MARGIN, // Adiciona padding no final da lista
  },
  adCard: {
    borderRadius: 12, // Borda mais arredondada
    width: CARD_WIDTH, // Usando largura responsiva
    overflow: "hidden",
    elevation: 4, // Sombra mais proeminente
    marginBottom: 20,
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  adImage: {
    width: "100%",
    height: CARD_WIDTH * 0.6, // Proporção da imagem (60% da largura do card)
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  adContent: {
    padding: 12, // Aumenta o padding interno
  },
  badgeOfferContainer: {
    backgroundColor: COLORS.primary, // Cor de fundo para o badge
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start", // Alinha o badge à esquerda
    marginBottom: 8, // Espaço abaixo do badge
  },
  badgeOfferText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.white, // Texto do badge branco
    textTransform: "uppercase", // Texto em maiúsculas
  },
  adTitle: {
    fontSize: 16, // Aumenta o tamanho da fonte do título
    fontWeight: "bold",
    marginBottom: 4, // Espaço abaixo do título
  },
  adDescription: {
    fontSize: 13,
    //color: COLORS.lightText, // Cor mais suave para a descrição
    marginBottom: 10, // Espaço abaixo da descrição
    lineHeight: 18, // Altura da linha para melhor legibilidade
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Espaço abaixo dos preços
  },
  oldPrice: {
    fontSize: 13, // Tamanho da fonte do preço antigo
    textDecorationLine: "line-through",
    marginRight: 8, // Espaço entre preço antigo e novo
  },
  price: {
    fontSize: 18, // Aumenta o tamanho da fonte do preço principal
    fontWeight: "bold",
  },
  linkIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "flex-end", // Alinha o ícone e texto do link à direita
  },
  linkText: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 5,
  },
  // --- Fim dos Estilos do Card de Oferta Refatorado ---

  spaceBotton: {
    marginBottom: 120,
  },
});

export default Patrocinador;
