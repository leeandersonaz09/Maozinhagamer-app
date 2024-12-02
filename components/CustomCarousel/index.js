// components/Carousel.js
import React from "react";
import { Image, StyleSheet, Dimensions, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");

const Carousel = ({ data }) => {
  return (
    <View style={styles.carouselContainer}>
      <Swiper
        activeDotColor="#FFFB00"
        style={styles.swiper}
        showsPagination={true}
        showsButtons={false}
        autoplayTimeout={2.3}
        autoplay={true}
        autoplayDirection={true}
      >
        {data.map((item, index) => (
          <Link
            key={index}
            href={{
              pathname: "/Patrocinadores/[id]",
              params: {
                id: item.id,
                href: item.href,
                button: item.buttonTittle,
                category: item.category,
                title: item.title,
                img: item.img,
                text: item.text,
              },
            }}
            asChild
          >
            <TouchableOpacity>
              <Image
                style={styles.imageBanner}
                resizeMode="stretch"
                source={{ uri: item.img }}
              />
            </TouchableOpacity>
          </Link>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: width,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  swiper: {
    height: width / 2,
  },
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default Carousel;
