import React from "react";
import { View, TouchableOpacity, ScrollView, Text, Image } from "react-native";
import { Ionicons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Card } from "../components/index.js";
import styles from "../Theme/styles/AboutStyles.js";
import { COLORS } from "../Theme/theme.js";
import { StatusBar } from "expo-status-bar";

const about = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={styles.Container}>
        <ScrollView>
          <View style={styles.HeaderBackGround} />

          <View style={styles.Content}>
            <Card>
              <View style={styles.CardContainer}>
                <Image
                  style={styles.Image}
                  source={require("../assets/logo-rouded.png")}
                />

                <View style={styles.TextContent}>
                  <Text style={styles.tittle}>Mãozinha Gamer</Text>
                  <Text style={styles.text}>
                    “Mãozinha Gamer” é um canal de jogos destacando-se por
                    gameplay emocionante e momentos épicos em jogos
                  </Text>
                </View>
              </View>
            </Card>

            <Card>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://discord.gg/k3cyDsyK");
                }}
              >
                <View style={styles.CardContent}>
                  <FontAwesome6
                    size={40}
                    color={COLORS.discord}
                    name="discord"
                  />
                  <View style={styles.TextContent}>
                    <Text style={styles.tittle}>Discord</Text>
                    <Text style={styles.text}> discord.gg/k3cyDsyK</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://www.youtube.com/@maozinhagamer_diih"
                  );
                }}
              >
                <View style={styles.CardContent}>
                  <FontAwesome
                    size={50}
                    style={{ color: COLORS.youtube }}
                    name="youtube"
                  />

                  <View style={styles.TextContent}>
                    <Text style={styles.tittle}>Youtube</Text>
                    <Text style={styles.text}>@maozinhagamer_diih</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://chat.whatsapp.com/ETCJi0tjrmtGdBddUTP6IK"
                  );
                }}
              >
                <View style={styles.CardContent}>
                  <FontAwesome6
                    //as={Ionicons}
                    size={50}
                    style={{ color: COLORS.whatsapp }}
                    name="square-whatsapp"
                  />

                  <View style={styles.TextContent}>
                    <Text style={styles.tittle}>Grupo do Whatsapp</Text>
                    <Text style={styles.text}>Grupo do mãozinha</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://livepix.gg/diih145807");
                }}
              >
                <View style={styles.CardContent}>
                  <FontAwesome6
                    //as={Ionicons}
                    size={50}
                    style={{ color: COLORS.pix }}
                    name="pix"
                  />

                  <View style={styles.TextContent}>
                    <Text style={styles.tittle}>Ajude o canal com Pix</Text>
                    <Text style={styles.text}>livepix.gg/diih145807</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
export default about;
