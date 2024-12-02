import React from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Link } from "expo-router";
import Swiper from "react-native-swiper";
import { ThemedView } from "@/components/ThemedView";
var { height, width } = Dimensions.get("window");

export default function Banner({ data }) {
  const dataBanner = data;

  return (
    <ScrollView>
      <ThemedView style={{ flex: 1 }}>
        <View
          style={{
            width: width,
            alignItems: "center",
            shadowColor: "#000", // Cor da sombra
            shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra (largura e altura)
            shadowOpacity: 0.8, // Opacidade da sombra (multiplicada pelo componente de cor)
            shadowRadius: 2, // Raio de desfoque da sombra
            elevation: 5, // Elevação (apenas para Android)
          }}
        >
          <Swiper
            activeDotColor={"#FFFB00"}
            style={{ height: width / 2 }}
            showsPagination={true}
            showsButtons={false}
            autoplayTimeout={2.3}
            autoplay={true}
            autoplayDirection={true}
          >
            {dataBanner.map((data, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/pages/Patrocinadores/[id]",
                  params: {
                    id: data.id,
                    uri: data.uri,
                    button: data.buttonTitle,
                    category: data.category,
                    title: data.title,
                    img: data.img,
                    text: data.text,
                  },
                }}
                asChild
              >
                <TouchableOpacity>
                  <Image
                    style={styles.imageBanner}
                    resizeMode="stretch"
                    source={{
                      uri: data.img,
                    }}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </Swiper>
          <View style={{ height: 20 }} />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});
