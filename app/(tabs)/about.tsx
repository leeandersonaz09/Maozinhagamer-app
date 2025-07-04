import React from "react";
import { View, TouchableOpacity, Image, FlatList } from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Card } from "../../components/index.js";
import styles from "../../constants/Theme/styles/AboutStyles.js";
import { COLORS } from "../../constants/Theme/theme.js";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type SocialLink = {
  id: number;
  title: string;
  icon: React.ReactNode;
  uri: string;
  text: string;
};

// Dados dos links sociais, definidos como uma constante fora do componente
const socialLinks: SocialLink[] = [
  {
    id: 1,
    title: "Discord",
    icon: <FontAwesome6 size={40} color={COLORS.discord} name="discord" />,
    uri: "https://discord.gg/jv6mkdcW",
    text: "discord.gg/jv6mkdcW",
  },
  {
    id: 2,
    title: "Youtube",
    icon: <FontAwesome size={50} color={COLORS.youtube} name="youtube" />,
    uri: "https://www.youtube.com/@maozinhagamer_diih",
    text: "@maozinhagamer_diih",
  },
  {
    id: 3,
    title: "Grupo do Whatsapp",
    icon: (
      <FontAwesome6 size={50} color={COLORS.whatsapp} name="square-whatsapp" />
    ),
    uri: "https://chat.whatsapp.com/ETCJi0tjrmtGdBddUTP6IK",
    text: "Grupo do mãozinha",
  },
  {
    id: 4,
    title: "Ajude nossas plataformas",
    icon: <FontAwesome6 size={50} color={COLORS.pix} name="pix" />,
    uri: "https://livepix.gg/diih145807",
    text: "livepix.gg/diih145807",
  },
  {
    id: 5,
    title: "Política de Privacidade",
    // 'shield-halved' é um ótimo ícone para privacidade.
    // Outras opções: 'file-shield', 'user-shield', 'file-contract'
    icon: <FontAwesome6 size={45} color={COLORS.yellow} name="user-shield" />,
    // TODO: Adicionar o link correto para a política de privacidade
    uri: "https://politicadeprivavidade-maozinhagamer.blogspot.com/p/poliica-de-privacidade.html",
    text: "Leia nossos termos",
  },
];

// Componente para renderizar cada card de link social
const SocialLinkCard: React.FC<{ item: SocialLink }> = ({ item }) => {
  return (
    <Card>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.uri)}
        accessibilityLabel={`Abrir link para ${item.title}`}
      >
        <View style={styles.CardContent}>
          {item.icon}
          <View style={styles.TextContent}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.text}>{item.text}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

// Componente principal da tela "Sobre"
const AboutScreen = () => {
  return (
    <>
      <ThemedView style={styles.Container}>
        <View style={styles.HeaderBackGround} />
        <FlatList
          ListHeaderComponent={
            <View style={styles.Content}>
              <Card>
                <View style={styles.CardContainer}>
                  <Image
                    style={styles.Image}
                    source={require("../../assets/images/logo-rouded.png")}
                  />
                  <View style={styles.TextContent}>
                    <ThemedText style={styles.title}>Mãozinha Gamer</ThemedText>
                    <ThemedText style={styles.text}>
                      “Mãozinha Gamer” é um canal de jogos destacando-se por
                      gameplay emocionante e momentos épicos em jogos.
                    </ThemedText>
                  </View>
                </View>
              </Card>
            </View>
          }
          data={socialLinks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SocialLinkCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ThemedView>
    </>
  );
};
export default AboutScreen;
