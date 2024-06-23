import React, { useEffect, useState, useMemo } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import Swiper from "react-native-swiper";

var { height, width } = Dimensions.get("window");

async function getBannerData() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/banner"
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API:", error);
    return [
      {
        id: 1,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        category: "Patrocinadores",
        tittle: "Maozinha Gamer",
        text: "Maozinhag Gamer",
      },
    ];
  }
}

export default function Banner() {
  const [dataBanner, setDataBanner] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    fetch("https://restapimaozinhagamer.onrender.com/banner")
      .then((response) => response.json)
      .then((data) => setDataBanner(data));
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedDataBanner = useMemo(() => dataBanner, [dataBanner]);

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ width: width, alignItems: "center" }}>
          {isLoading ? (
            <ActivityIndicator color="red" size="large" />
          ) : (
            <Swiper
              activeDotColor={"#FFFB00"}
              style={{ height: width / 2 }}
              showsPagination={true}
              showsButtons={false}
              autoplayTimeout={2.3}
              autoplay={true}
              autoplayDirection={true}
            >
              {memoizedDataBanner.map((data, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/Patrocinadores/[id]",
                    params: {
                      id: data.id,
                      category: data.category,
                      tittle: data.tittle,
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
                      source={{ uri: data.img }}
                    />
                  </TouchableOpacity>
                </Link>
              ))}
            </Swiper>
          )}
          <View style={{ height: 20 }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBanner: {
    height: "100%",
    width: width - 40,
    borderRadius: 20,
    marginHorizontal: 20,
  },
});
