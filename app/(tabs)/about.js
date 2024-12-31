// @ts-nocheck
import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  FlatList,
} from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Card } from "../../components/index.js";
import styles from "../../constants/Theme/styles/AboutStyles.js";
import { COLORS } from "../../constants/Theme/theme.js";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const about = () => {
  const data = [
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
      icon: (
        <FontAwesome
          size={50}
          style={{ color: COLORS.youtube }}
          name="youtube"
        />
      ),
      uri: "https://www.youtube.com/@maozinhagamer_diih",
      text: "@maozinhagamer_diih",
    },
    {
      id: 3,
      title: "Grupo do Whatsapp",
      icon: (
        <FontAwesome6
          size={50}
          style={{ color: COLORS.whatsapp }}
          name="square-whatsapp"
        />
      ),
      uri: "https://chat.whatsapp.com/ETCJi0tjrmtGdBddUTP6IK",
      text: "Grupo do mãozinha",
    },
    {
      id: 4,
      title: "Ajude nossas plataformas",
      icon: <FontAwesome6 size={50} style={{ color: COLORS.pix }} name="pix" />,
      uri: "https://livepix.gg/diih145807",
      text: "livepix.gg/diih145807",
    },
  ];

  const CardList = ({ item }) => {
    return (
      <Card>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.uri);
          }}
        >
          <View style={styles.CardContent}>
            {item.icon}
            <View style={styles.TextContent}>
              <ThemedText style={styles.tittle}>{item.title}</ThemedText>
              <ThemedText style={styles.text}> {item.text}</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);
  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <ThemedView style={styles.Container}>
        <View style={styles.HeaderBackGround} />

        <View style={styles.Content}>
          <Card>
            <View style={styles.CardContainer}>
              <Image
                style={styles.Image}
                source={require("../../assets/images/logo-rouded.png")}
              />

              <View style={styles.TextContent}>
                <ThemedText style={styles.tittle}>Mãozinha Gamer</ThemedText>
                <ThemedText style={styles.text}>
                  “Mãozinha Gamer” é um canal de jogos destacando-se por
                  gameplay emocionante e momentos épicos em jogos
                </ThemedText>
              </View>
            </View>
          </Card>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={memoizedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardList item={item} />}
            //numColumns={2} // Exibe dois itens por linha
          />
        </View>
      </ThemedView>
    </>
  );
};
export default about;
