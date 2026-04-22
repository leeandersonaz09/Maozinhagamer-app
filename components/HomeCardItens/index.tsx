import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";

type HomeCardProps = {
  data: {
    img: string;
    title: string;
  };
};

const HomeCard = ({ data: { img, title } }: HomeCardProps) => (
  <>
    <StatusBar style="light" />
    <View className="flex-1 m-2">
      <ImageBackground
        source={{ uri: img }}
        className="h-[120px] w-full justify-end overflow-hidden rounded-xl"
        imageStyle={{ borderRadius: 12 }}
      >
        {/* Overlay escuro com Tailwind */}
        <View className="absolute inset-0 bg-black/40" />
        
        <View className="p-3">
          <Text className="text-white font-black text-sm uppercase tracking-tight">
            {title}
          </Text>
        </View>
      </ImageBackground>
    </View>
  </>
);

export default HomeCard;
