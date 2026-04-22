import React from "react";
import { View, TouchableOpacity, Image, ScrollView, Linking, Text } from "react-native";
import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type SocialLink = {
  id: number;
  title: string;
  iconName: string;
  iconType: "fa" | "fa6" | "mci";
  color: string;
  uri: string;
  subtitle: string;
};

const socialLinks: SocialLink[] = [
  {
    id: 1,
    title: "Discord",
    subtitle: "Comunidade Oficial",
    iconName: "discord",
    iconType: "fa6",
    color: "#5865F2",
    uri: "https://discord.gg/EBHZu3aw",
  },
  {
    id: 2,
    title: "Youtube",
    subtitle: "@maozinhagamer_diih",
    iconName: "youtube",
    iconType: "fa",
    color: "#FF0000",
    uri: "https://www.youtube.com/@maozinhagamer_diih",
  },
  {
    id: 3,
    title: "WhatsApp",
    subtitle: "Grupo do Mãozinha",
    iconName: "square-whatsapp",
    iconType: "fa6",
    color: "#25D366",
    uri: "https://chat.whatsapp.com/LnpW61ReLHOKPMx8ytTXp9",
  },
  {
    id: 4,
    title: "Apoie o Canal",
    subtitle: "Contribua via LivePix",
    iconName: "pix",
    iconType: "fa6",
    color: "#32BCAD",
    uri: "https://livepix.gg/diih145807",
  },
  {
    id: 5,
    title: "Privacidade",
    subtitle: "Termos e Condições",
    iconName: "shield-check",
    iconType: "mci",
    color: "#FFB300",
    uri: "https://politicadeprivavidade-maozinhagamer.blogspot.com/p/poliica-de-privacidade.html",
  },
];

const AboutScreen = () => {
  const renderIcon = (link: SocialLink) => {
    const size = 28;
    if (link.iconType === "fa") return <FontAwesome name={link.iconName as any} size={size} color="white" />;
    if (link.iconType === "fa6") return <FontAwesome6 name={link.iconName as any} size={size} color="white" />;
    return <MaterialCommunityIcons name={link.iconName as any} size={size} color="white" />;
  };

  return (
    <ThemedView className="flex-1 bg-white dark:bg-[#0D0D0D]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Hero Section */}
        <View className="bg-[#7A0000] pt-16 pb-12 px-6 rounded-b-[50px] shadow-2xl items-center">
          <View className="w-32 h-32 rounded-full border-4 border-white/20 p-1 mb-6 shadow-xl">
            <Image
              style={{ width: '100%', height: '100%', borderRadius: 60 }}
              source={require("../../assets/images/logo-rouded.png")}
            />
          </View>
          <Text className="text-white text-3xl font-black uppercase tracking-tighter mb-2">Mãozinha Gamer</Text>
          <View className="bg-white/10 px-4 py-1 rounded-full">
            <Text className="text-white/80 text-[10px] font-black uppercase tracking-widest">Est. 2024 • Gaming Community</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View className="px-8 mt-10 mb-8">
          <Text className="text-[#7A0000] dark:text-[#FFFB00] text-xs font-black uppercase tracking-[4px] mb-4">Sobre Nós</Text>
          <ThemedText className="text-lg font-bold leading-7 opacity-70">
            O canal focado em gameplays emocionantes, builds meta e momentos épicos. 
            Nossa missão é trazer o melhor conteúdo de Call of Duty e FPS para a comunidade brasileira.
          </ThemedText>
        </View>

        {/* Social Grid */}
        <View className="px-6 flex-row flex-wrap justify-between">
          <View className="w-full mb-4">
            <Text className="text-black/30 dark:text-white/30 text-[10px] font-black uppercase tracking-[3px] ml-2">Links Oficiais</Text>
          </View>
          
          {socialLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              onPress={() => Linking.openURL(link.uri)}
              activeOpacity={0.9}
              className="w-[48%] mb-4"
            >
              <View className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[30px] p-5 items-center">
                <View 
                  style={{ backgroundColor: link.color }}
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg"
                >
                  {renderIcon(link)}
                </View>
                <ThemedText className="font-black text-sm uppercase tracking-tight text-center">{link.title}</ThemedText>
                <ThemedText className="text-[9px] font-bold opacity-40 uppercase mt-1 text-center">{link.subtitle}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version Footer */}
        <View className="mt-12 items-center opacity-20">
          <MaterialCommunityIcons name="star-four-points" size={20} color="gray" />
          <Text className="text-[10px] font-black uppercase mt-2 tracking-[5px]">Versão 1.0.3</Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default AboutScreen;
