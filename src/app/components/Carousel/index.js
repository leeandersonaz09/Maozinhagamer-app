import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Link } from "expo-router";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { height, width } = Dimensions.get("window");

export default function Banner() {
  const [dataBanner, setDataBanner] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    // Faz a requisição GET à sua API
    fetch("https://restapimaozinhagamer.onrender.com/banner")
      .then((response) => response.json())
      .then((data) => {
        setDataBanner(data);
        // Armazene os dados em cache
        AsyncStorage.setItem("dataBanner", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Erro ao obter dados da API:", error);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    // Tente obter os dados da API do AsyncStorage
    AsyncStorage.getItem("dataBanner")
      .then((cachedData) => {
        if (cachedData) {
          setDataBanner(JSON.parse(cachedData));
        } else {
          fetchData();
        }
      })
      .catch((error) => {
        console.error("Erro ao obter dados em cache:", error);
      });
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ width: width, alignItems: "center" }}>
          <Swiper
            activeDotColor={"#FFFB00"}
            style={{ height: width / 2 }}
            showsPagination={true}
            showsButtons={false}
            autoplayTimeout={2.3}
            autoplay={true}
            autoplayDirection={true}
          >
            {dataBanner.map((data, index) => {
              return (
                <Link
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
                      key={index}
                      index
                      style={styles.imageBanner}
                      resizeMode="stretch"
                      source={{ uri: data.img }}
                    />
                  </TouchableOpacity>
                </Link>
              );
            })}
          </Swiper>
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
