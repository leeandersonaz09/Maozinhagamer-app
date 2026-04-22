import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";

import { ThemedView } from "@/components/ThemedView";

type CarouselItem = {
  id?: string | number;
  uri?: string;
  buttonTitle?: string;
  category?: string;
  title?: string;
  img: string;
  text?: string;
};

type CarouselProps = {
  data?: CarouselItem[];
};

const { width } = Dimensions.get("window");

export default function Banner({ data = [] }: CarouselProps) {
  const listRef = useRef<FlatList<CarouselItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, data.length]);

  if (data.length === 0) {
    return null;
  }

  return (
    <ThemedView className="flex-1">
      <View className="w-full items-center shadow-lg shadow-black/80 elevation-5">
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.id ?? "banner"}-${index}`}
          getItemLayout={(_, index) => ({
            index,
            length: width,
            offset: width * index,
          })}
          onMomentumScrollEnd={(event) => {
            const nextIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentIndex(nextIndex);
          }}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Link
                href={{
                  pathname: "/pages/Patrocinadores/[id]",
                  params: {
                    id: String(item.id ?? "banner"),
                    uri: item.uri ?? "",
                    button: item.buttonTitle ?? "",
                    category: item.category ?? "",
                    title: item.title ?? "",
                    img: item.img,
                    text: item.text ?? "",
                  },
                }}
                asChild
              >
                <TouchableOpacity activeOpacity={0.9}>
                  <Image
                    className="h-[180px] w-[90%] self-center rounded-xl"
                    style={{ width: width - 40 }}
                    resizeMode="stretch"
                    source={{ uri: item.img }}
                  />
                </TouchableOpacity>
              </Link>
            </View>
          )}
        />

        {/* Paginação Estilizada */}
        <View className="flex-row justify-center items-center gap-2 mt-3 mb-5">
          {data.map((_, index) => (
            <View
              key={`dot-${index}`}
              className={`h-2 rounded-full ${
                index === currentIndex 
                  ? "w-5 bg-[#FFFB00]" 
                  : "w-2 bg-white/45"
              }`}
            />
          ))}
        </View>
      </View>
    </ThemedView>
  );
}
