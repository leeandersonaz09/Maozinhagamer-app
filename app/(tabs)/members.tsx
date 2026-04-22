import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { Shimmer } from "../../components";
import { COLORS } from "../../constants/Theme/theme";
import { getMembers } from "../../utils/apiRequests";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "../../utils/notificationPreferences";
import type { MemberModalData } from "../../components/Modal";

const COMMUNITY_SQUAD_KEY = "communitySquad";

type Platform = "xbox" | "playstation" | "pc";
type PlatformFilter = "all" | Platform;

type Member = {
  id: string;
  name: string;
  image?: string;
  followers?: string;
  xbox?: boolean;
  xboxTag?: string;
  ps?: boolean;
  playstationTag?: string;
  pc?: boolean;
  pcTag?: string;
};

type SquadMember = {
  id: string;
  name: string;
  platform: Platform | "error";
  gamertag: string;
};

const PLATFORM_META: Record<
  Platform,
  {
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    field: keyof Member;
  }
> = {
  xbox: {
    label: "Xbox",
    icon: "microsoft-xbox",
    color: COLORS.xbox,
    field: "xboxTag",
  },
  playstation: {
    label: "PSN",
    icon: "sony-playstation",
    color: COLORS.playstation,
    field: "playstationTag",
  },
  pc: {
    label: "PC",
    icon: "steam",
    color: COLORS.steam,
    field: "pcTag",
  },
};

const FILTERS: { key: PlatformFilter; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: "all", label: "Todos", icon: "account-group" },
  { key: "xbox", label: "Xbox", icon: "microsoft-xbox" },
  { key: "playstation", label: "PSN", icon: "sony-playstation" },
  { key: "pc", label: "PC", icon: "steam" },
];

const SETTINGS_ITEMS: {
  key: keyof NotificationPreferences;
  label: string;
  detail: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  {
    key: "live",
    label: "Lives ao vivo",
    detail: "Avisar quando a Maozinha entrar ao vivo.",
    icon: "broadcast",
  },
  {
    key: "metaUpdates",
    label: "Novas metas",
    detail: "Receber alertas de loadouts e mudancas importantes.",
    icon: "target",
  },
  {
    key: "promotions",
    label: "Promocoes",
    detail: "Cupons, parceiros e oportunidades da comunidade.",
    icon: "sale",
  },
];

const hasText = (value?: string | boolean) =>
  typeof value === "string" && value.trim().length > 0;

const formatFollowers = (value?: string) => {
  if (!value) {
    return "Membro";
  }

  return value;
};

const getMemberPlatforms = (member: Member): Platform[] => {
  const platforms: Platform[] = [];

  if (member.xbox || hasText(member.xboxTag)) {
    platforms.push("xbox");
  }

  if (member.ps || hasText(member.playstationTag)) {
    platforms.push("playstation");
  }

  if (member.pc || hasText(member.pcTag)) {
    platforms.push("pc");
  }

  return platforms;
};

const getPrimaryPlatform = (member: Member): Platform =>
  getMemberPlatforms(member)[0] ?? "pc";

const getGamertag = (member: Member, platform: Platform) => {
  const value = member[PLATFORM_META[platform].field];
  return typeof value === "string" ? value : "";
};

const avatarInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "M";

const compactTag = (tag: string) => {
  const trimmedTag = tag.trim();

  if (trimmedTag.length <= 10) {
    return trimmedTag;
  }

  return `${trimmedTag.slice(0, 7)}...`;
};

const triggerLightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

const StatTile = ({
  icon,
  label,
  value,
  tint,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  tint: string;
}) => (
  <View className="flex-1 rounded-lg border border-white/10 bg-white/10 p-3">
    <MaterialCommunityIcons name={icon} size={18} color={tint} />
    <Text className="mt-2 text-xl font-black text-white" selectable>
      {value}
    </Text>
    <Text className="text-[10px] font-black uppercase text-white/55" numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const PlatformIcon = ({ platform, size = 18 }: { platform: Platform; size?: number }) => {
  const meta = PLATFORM_META[platform];

  return <MaterialCommunityIcons name={meta.icon} size={size} color={meta.color} />;
};

const Avatar = ({ member, size = 68 }: { member: Member; size?: number }) => {
  if (member.image) {
    return (
      <Image
        source={{ uri: member.image }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-white/10"
        resizeMode="cover"
      />
    );
  }

  return (
    <LinearGradient
      colors={["#D80F22", "#1B1B1B"]}
      style={{
        alignItems: "center",
        borderRadius: size / 2,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Text className="text-2xl font-black text-white">{avatarInitial(member.name)}</Text>
    </LinearGradient>
  );
};

const Hero = ({
  total,
  xboxCount,
  psCount,
  pcCount,
  onSettingsPress,
}: {
  total: number;
  xboxCount: number;
  psCount: number;
  pcCount: number;
  onSettingsPress: () => void;
}) => (
  <LinearGradient
    colors={["#3A0508", "#121212", "#080808"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      overflow: "hidden",
      paddingBottom: 20,
      paddingHorizontal: 20,
      paddingTop: 56,
    }}
  >
    <View className="flex-row items-start justify-between">
      <View className="h-11 w-11 items-center justify-center rounded-md bg-[#D80F22]">
        <MaterialCommunityIcons name="account-group" size={25} color="white" />
      </View>

      <Pressable
        onPress={onSettingsPress}
        className="h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/10"
      >
        <MaterialCommunityIcons name="bell-cog" size={22} color="white" />
      </Pressable>
    </View>

    <Text className="mt-7 text-[11px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
      Comunidade Maozinha
    </Text>
    <Text className="mt-2 text-4xl font-black uppercase leading-10 text-white">
      Encontre seu squad em segundos
    </Text>
    <Text className="mt-3 text-sm font-semibold leading-5 text-gray-300">
      Veja quem joga em cada plataforma, copie gamertags e monte seu time rapido
      antes da partida.
    </Text>

    <View className="mt-6 flex-row gap-2">
      <StatTile icon="account-star" label="membros" value={String(total)} tint="#FFFFFF" />
      <StatTile icon="microsoft-xbox" label="xbox" value={String(xboxCount)} tint={COLORS.xbox} />
      <StatTile icon="sony-playstation" label="psn" value={String(psCount)} tint="#8AB4FF" />
      <StatTile icon="steam" label="pc" value={String(pcCount)} tint="#9DB6C9" />
    </View>
  </LinearGradient>
);

const SquadRail = ({
  squad,
  onCopy,
  onClear,
}: {
  squad: SquadMember[];
  onCopy: (member: SquadMember) => void;
  onClear: () => void;
}) => (
  <View className="px-4">
    <View className="mb-3 flex-row items-center justify-between">
      <View>
        <Text className="text-[11px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
          Squad fixado
        </Text>
        <Text className="mt-1 text-xs font-semibold text-gray-500">
          Toque para copiar a gamertag
        </Text>
      </View>

      {squad.length > 0 ? (
        <Pressable
          onPress={onClear}
          className="h-9 flex-row items-center rounded-md bg-white/10 px-3"
        >
          <MaterialCommunityIcons name="playlist-remove" size={16} color="#FCA5A5" />
          <Text className="ml-1.5 text-[10px] font-black uppercase text-[#FCA5A5]">
            Limpar
          </Text>
        </Pressable>
      ) : null}
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3 pr-4">
        {squad.length === 0 ? (
          <View className="w-72 rounded-lg border border-dashed border-white/15 bg-white/5 p-4">
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#9CA3AF" />
            <Text className="mt-3 text-sm font-black uppercase text-white">
              Nenhum jogador fixado
            </Text>
            <Text className="mt-1 text-xs font-semibold leading-4 text-gray-500">
              Abra um card, copie a tag ou mande o membro para o squad.
            </Text>
          </View>
        ) : (
          squad.map((member) => {
            const platform = member.platform === "error" ? null : member.platform;

            return (
              <Pressable
                key={member.id}
                onPress={() => onCopy(member)}
                className="w-52 rounded-lg border border-white/10 bg-[#151515] p-4"
              >
                <View className="flex-row items-center">
                  <View className="h-10 w-10 items-center justify-center rounded-md bg-[#D80F22]">
                    {platform ? (
                      <PlatformIcon platform={platform} size={20} />
                    ) : (
                      <MaterialCommunityIcons name="account" size={20} color="white" />
                    )}
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-black uppercase text-white" numberOfLines={1}>
                      {member.name}
                    </Text>
                    <Text className="text-xs font-semibold text-gray-500" numberOfLines={1}>
                      {member.gamertag}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  </View>
);

const SearchAndFilters = ({
  search,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: {
  search: string;
  activeFilter: PlatformFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: PlatformFilter) => void;
}) => (
  <View className="gap-4 px-4">
    <View className="h-12 flex-row items-center rounded-lg border border-white/10 bg-[#151515] px-4">
      <MaterialCommunityIcons name="magnify" size={21} color="#FCA5A5" />
      <TextInput
        placeholder="Buscar membro, tag ou plataforma..."
        placeholderTextColor="#6B7280"
        value={search}
        onChangeText={onSearchChange}
        className="ml-3 flex-1 text-sm font-bold text-white"
      />
      {search ? (
        <Pressable onPress={() => onSearchChange("")}>
          <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
        </Pressable>
      ) : null}
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pr-4">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key;
          const color =
            filter.key === "all"
              ? "#FFFFFF"
              : PLATFORM_META[filter.key as Platform].color;

          return (
            <Pressable
              key={filter.key}
              onPress={() => onFilterChange(filter.key)}
              className={`h-10 flex-row items-center rounded-md border px-3 ${
                isActive
                  ? "border-[#D80F22] bg-[#D80F22]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <MaterialCommunityIcons
                name={filter.icon}
                size={16}
                color={isActive ? "white" : color}
              />
              <Text
                className={`ml-2 text-[11px] font-black uppercase ${
                  isActive ? "text-white" : "text-gray-300"
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  </View>
);

const PlatformButton = ({
  member,
  platform,
  onPress,
}: {
  member: Member;
  platform: Platform;
  onPress: (platform: Platform) => void;
}) => {
  const enabled = getMemberPlatforms(member).includes(platform);
  const tag = getGamertag(member, platform);
  const meta = PLATFORM_META[platform];
  const label = enabled && tag ? compactTag(tag) : meta.label;

  return (
    <Pressable
      onPress={() => onPress(platform)}
      className={`h-9 flex-1 flex-row items-center justify-center rounded-md border px-1 ${
        enabled ? "border-white/10 bg-white/10" : "border-white/5 bg-white/5"
      }`}
    >
      <MaterialCommunityIcons
        name={meta.icon}
        size={16}
        color={enabled ? meta.color : "#4B5563"}
      />
      <Text
        className={`ml-1 flex-shrink text-[9px] font-black uppercase ${
          enabled ? "text-gray-100" : "text-gray-600"
        }`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Pressable>
  );
};

const MemberCard = ({
  item,
  index,
  onOpenPlatform,
}: {
  item: Member;
  index: number;
  onOpenPlatform: (member: Member, platform: Platform) => void;
}) => {
  const platforms = getMemberPlatforms(item);
  const primaryPlatform = getPrimaryPlatform(item);

  return (
    <Pressable
      onPress={() => onOpenPlatform(item, primaryPlatform)}
      className="mb-4 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#141414]"
    >
      <LinearGradient
        colors={["rgba(216,15,34,0.28)", "rgba(255,255,255,0.03)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 12 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-black uppercase text-white/45">
            #{String(index + 1).padStart(2, "0")}
          </Text>
          <View className="flex-row gap-1">
            {platforms.slice(0, 3).map((platform) => (
              <View
                key={`${item.id}-${platform}`}
                className="h-7 w-7 items-center justify-center rounded-md bg-black/25"
              >
                <PlatformIcon platform={platform} size={15} />
              </View>
            ))}
          </View>
        </View>

        <View className="mt-4 items-center">
          <View className="rounded-full border-2 border-white/15 p-1">
            <Avatar member={item} />
          </View>
          <Text
            className="mt-3 text-center text-sm font-black uppercase leading-4 text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text
            className="mt-1 text-center text-[10px] font-bold uppercase text-gray-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatFollowers(item.followers)}
          </Text>
        </View>
      </LinearGradient>

      <View className="gap-2 p-3">
        <View className="flex-row gap-2">
          <PlatformButton
            member={item}
            platform="xbox"
            onPress={(platform) => onOpenPlatform(item, platform)}
          />
          <PlatformButton
            member={item}
            platform="playstation"
            onPress={(platform) => onOpenPlatform(item, platform)}
          />
        </View>
        <PlatformButton
          member={item}
          platform="pc"
          onPress={(platform) => onOpenPlatform(item, platform)}
        />
      </View>
    </Pressable>
  );
};

const LoadingGrid = ({ columns }: { columns: number }) => (
  <View className="flex-row flex-wrap gap-3 px-4">
    {[0, 1, 2, 3, 4, 5].map((item) => (
      <View
        key={`member-skeleton-${item}`}
        style={{ flexBasis: columns === 3 ? "31%" : "48%" }}
        className="overflow-hidden rounded-lg bg-[#141414]"
      >
        <Shimmer width="100%" height={214} borderRadius={8} />
      </View>
    ))}
  </View>
);

const EmptyState = ({ search }: { search: string }) => (
  <View className="mx-4 items-center rounded-lg border border-white/10 bg-[#151515] px-6 py-12">
    <View className="mb-4 h-14 w-14 items-center justify-center rounded-md bg-white/10">
      <MaterialCommunityIcons name="account-search" size={30} color="#9CA3AF" />
    </View>
    <Text className="text-center text-lg font-black uppercase text-white">
      Ninguem encontrado
    </Text>
    <Text className="mt-2 text-center text-sm font-semibold leading-5 text-gray-400">
      {search
        ? "Tenta buscar por outro nome ou limpa o filtro de plataforma."
        : "Nao consegui carregar membros da comunidade agora."}
    </Text>
  </View>
);

const QuickTagSheet = ({
  visible,
  memberData,
  onClose,
  onCopy,
  onAddToSquad,
  onShare,
}: {
  visible: boolean;
  memberData: MemberModalData | null;
  onClose: () => void;
  onCopy: (memberData: MemberModalData) => void | Promise<void>;
  onAddToSquad: (memberData: MemberModalData) => void | Promise<void>;
  onShare: (memberData: MemberModalData) => void | Promise<void>;
}) => {
  const [copied, setCopied] = useState(false);
  const platform =
    memberData?.platform && memberData.platform !== "error"
      ? memberData.platform
      : null;
  const platformMeta = platform ? PLATFORM_META[platform] : null;

  useEffect(() => {
    if (!visible) {
      setCopied(false);
    }
  }, [visible]);

  if (!memberData) {
    return null;
  }

  const handleCopy = async () => {
    await onCopy(memberData);
    setCopied(true);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/75">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-lg border border-white/10 bg-[#101010] px-5 pb-8 pt-4">
          <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-white/20" />

          <View className="flex-row items-center">
            {memberData.image ? (
              <Image
                source={{ uri: memberData.image }}
                className="h-20 w-20 rounded-full bg-white/10"
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={["#D80F22", "#1B1B1B"]}
                style={{
                  alignItems: "center",
                  borderRadius: 40,
                  height: 80,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <Text className="text-2xl font-black text-white">
                  {avatarInitial(memberData.name)}
                </Text>
              </LinearGradient>
            )}

            <View className="ml-4 flex-1">
              <Text
                className="text-2xl font-black uppercase text-white"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {memberData.name}
              </Text>
              <View className="mt-2 flex-row items-center">
                <View
                  className="h-8 flex-row items-center rounded-md px-2.5"
                  style={{
                    backgroundColor: memberData.isValid
                      ? `${platformMeta?.color ?? "#D80F22"}33`
                      : "#EF444433",
                  }}
                >
                  <MaterialCommunityIcons
                    name={platformMeta?.icon ?? "alert-circle-outline"}
                    size={16}
                    color={platformMeta?.color ?? COLORS.error}
                  />
                  <Text className="ml-1.5 text-[10px] font-black uppercase text-gray-200">
                    {platformMeta?.label ?? "Sem tag"}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-md bg-white/10"
            >
              <MaterialCommunityIcons name="close" size={22} color="white" />
            </Pressable>
          </View>

          <View className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
              Gamertag
            </Text>
            <Text
              className="mt-2 text-2xl font-black text-white"
              selectable
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {memberData.gamertag}
            </Text>
            <Text className="mt-2 text-xs font-semibold leading-4 text-gray-500">
              {memberData.isValid
                ? "Copie, fixe no squad ou compartilhe com quem vai entrar na partida."
                : "Esse membro ainda nao cadastrou uma tag para esta plataforma."}
            </Text>
          </View>

          {memberData.isValid ? (
            <View className="mt-4 gap-3">
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleCopy}
                  className="h-12 flex-1 flex-row items-center justify-center rounded-lg bg-[#D80F22]"
                >
                  <MaterialCommunityIcons
                    name={copied ? "check" : "content-copy"}
                    size={18}
                    color="white"
                  />
                  <Text className="ml-2 text-xs font-black uppercase text-white">
                    {copied ? "Copiado" : "Copiar"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onAddToSquad(memberData)}
                  className="h-12 flex-1 flex-row items-center justify-center rounded-lg bg-white"
                >
                  <MaterialCommunityIcons name="account-plus" size={18} color="#111827" />
                  <Text className="ml-2 text-xs font-black uppercase text-gray-950">
                    Squad
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => onShare(memberData)}
                className="h-12 flex-row items-center justify-center rounded-lg border border-white/10 bg-white/10"
              >
                <MaterialCommunityIcons name="share-variant" size={18} color="#E5E7EB" />
                <Text className="ml-2 text-xs font-black uppercase text-gray-200">
                  Compartilhar tag
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={onClose}
              className="mt-4 h-12 flex-row items-center justify-center rounded-lg bg-white/10"
            >
              <Text className="text-xs font-black uppercase text-gray-200">Fechar</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const SettingsModal = ({
  visible,
  preferences,
  onClose,
  onToggle,
}: {
  visible: boolean;
  preferences: NotificationPreferences;
  onClose: () => void;
  onToggle: (key: keyof NotificationPreferences) => void;
}) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/70">
      <View className="rounded-t-lg border border-white/10 bg-[#101010] px-5 pb-8 pt-4">
        <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-white/20" />

        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black uppercase text-white">
              Alertas do squad
            </Text>
            <Text className="mt-1 text-xs font-semibold text-gray-500">
              Escolha o que merece interromper sua fila.
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-md bg-white/10"
          >
            <MaterialCommunityIcons name="close" size={23} color="white" />
          </Pressable>
        </View>

        <View className="gap-3">
          {SETTINGS_ITEMS.map((item) => (
            <View
              key={item.key}
              className="flex-row items-center rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <View className="h-11 w-11 items-center justify-center rounded-md bg-[#D80F22]/20">
                <MaterialCommunityIcons name={item.icon} size={22} color="#FCA5A5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-black uppercase text-white">{item.label}</Text>
                <Text className="mt-1 text-xs font-semibold leading-4 text-gray-500">
                  {item.detail}
                </Text>
              </View>
              <Switch
                value={Boolean(preferences[item.key])}
                onValueChange={() => onToggle(item.key)}
                trackColor={{ false: "#2A2A2A", true: "#7A0000" }}
                thumbColor={preferences[item.key] ? "#FFFFFF" : "#888888"}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  </Modal>
);

const MembersScreen = () => {
  const { width } = useWindowDimensions();
  const columns = width >= 520 ? 3 : 2;
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberModalData | null>(null);
  const [squad, setSquad] = useState<SquadMember[]>([]);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);

  const stats = useMemo(() => {
    const xboxCount = members.filter((member) => getMemberPlatforms(member).includes("xbox")).length;
    const psCount = members.filter((member) =>
      getMemberPlatforms(member).includes("playstation")
    ).length;
    const pcCount = members.filter((member) => getMemberPlatforms(member).includes("pc")).length;

    return {
      total: members.length,
      xboxCount,
      psCount,
      pcCount,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...members]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((member) =>
        activeFilter === "all"
          ? true
          : getMemberPlatforms(member).includes(activeFilter)
      )
      .filter((member) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchable = [
          member.name,
          member.followers,
          member.xboxTag,
          member.playstationTag,
          member.pcTag,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedSearch);
      });
  }, [activeFilter, members, search]);

  const fetchMembersData = useCallback(async () => {
    try {
      const membersData = await getMembers();
      setMembers((membersData ?? []) as Member[]);
    } catch (error) {
      console.error("Erro ao buscar dados dos membros:", error);
      setMembers([]);
    }
  }, []);

  useEffect(() => {
    const loadScreen = async () => {
      setIsLoading(true);

      try {
        const [storedSquad, storedPreferences] = await Promise.all([
          AsyncStorage.getItem(COMMUNITY_SQUAD_KEY),
          getNotificationPreferences(),
          fetchMembersData(),
        ]);

        if (storedSquad) {
          setSquad(JSON.parse(storedSquad));
        }

        setNotificationPreferences(storedPreferences);
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScreen();
  }, [fetchMembersData]);

  const persistSquad = async (nextSquad: SquadMember[]) => {
    setSquad(nextSquad);
    await AsyncStorage.setItem(COMMUNITY_SQUAD_KEY, JSON.stringify(nextSquad));
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMembersData();
    setIsRefreshing(false);
  }, [fetchMembersData]);

  const handleFilterChange = (filter: PlatformFilter) => {
    triggerLightImpact();
    setActiveFilter(filter);
  };

  const handleOpenPlatform = (member: Member, platform: Platform) => {
    triggerLightImpact();
    const gamertag = getGamertag(member, platform);
    const isValid = hasText(gamertag);

    setSelectedMember({
      name: member.name,
      image: member.image ?? "",
      platform: isValid ? platform : "error",
      gamertag: isValid ? gamertag : "Tag nao cadastrada",
      isValid,
    });
    setIsMemberModalVisible(true);
  };

  const handleAddToSquad = async (memberData: MemberModalData) => {
    const squadMember: SquadMember = {
      id: `${memberData.name}-${memberData.gamertag}`,
      name: memberData.name,
      platform: memberData.platform,
      gamertag: memberData.gamertag,
    };
    const nextSquad = [
      squadMember,
      ...squad.filter((item) => item.id !== squadMember.id),
    ].slice(0, 8);

    await persistSquad(nextSquad);
    setIsMemberModalVisible(false);
  };

  const handleCopySelectedMember = async (memberData: MemberModalData) => {
    if (!memberData.isValid) {
      return;
    }

    triggerLightImpact();
    await Clipboard.setStringAsync(memberData.gamertag);
  };

  const handleShareSelectedMember = async (memberData: MemberModalData) => {
    if (!memberData.isValid) {
      return;
    }

    triggerLightImpact();
    await Share.share({
      message: `${memberData.name} na Maozinha Gamer: ${memberData.gamertag}`,
      title: `Gamertag de ${memberData.name}`,
    });
  };

  const handleCopySquadMember = async (member: SquadMember) => {
    triggerLightImpact();
    await Clipboard.setStringAsync(member.gamertag);
  };

  const handleClearSquad = async () => {
    triggerLightImpact();
    await persistSquad([]);
  };

  const handlePreferenceToggle = async (key: keyof NotificationPreferences) => {
    triggerLightImpact();
    const nextPreferences = {
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    };

    setNotificationPreferences(nextPreferences);
    await saveNotificationPreferences(nextPreferences);
  };

  return (
    <View className="flex-1 bg-[#090909]">
      <FlatList
        key={`members-grid-${columns}`}
        data={isLoading ? [] : filteredMembers}
        keyExtractor={(item, index) => String(item.id || `member-${index}`)}
        numColumns={columns}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => (
          <MemberCard item={item} index={index} onOpenPlatform={handleOpenPlatform} />
        )}
        contentContainerStyle={{ paddingBottom: 120, gap: 18 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#D80F22"
            colors={["#D80F22"]}
          />
        }
        ListHeaderComponent={
          <View className="gap-6">
            <Hero
              total={stats.total}
              xboxCount={stats.xboxCount}
              psCount={stats.psCount}
              pcCount={stats.pcCount}
              onSettingsPress={() => setIsSettingsVisible(true)}
            />
            <SquadRail
              squad={squad}
              onCopy={handleCopySquadMember}
              onClear={handleClearSquad}
            />
            <SearchAndFilters
              search={search}
              activeFilter={activeFilter}
              onSearchChange={setSearch}
              onFilterChange={handleFilterChange}
            />
            <View className="px-4">
              <Text className="text-[11px] font-black uppercase tracking-[2px] text-[#FFB4B4]">
                Operadores da comunidade
              </Text>
              <Text className="mt-1 text-xs font-semibold text-gray-500">
                {filteredMembers.length} resultado(s) para o filtro atual
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? <LoadingGrid columns={columns} /> : <EmptyState search={search} />
        }
      />

      <SettingsModal
        visible={isSettingsVisible}
        preferences={notificationPreferences}
        onClose={() => setIsSettingsVisible(false)}
        onToggle={handlePreferenceToggle}
      />

      <QuickTagSheet
        visible={isMemberModalVisible}
        onClose={() => setIsMemberModalVisible(false)}
        onCopy={handleCopySelectedMember}
        onAddToSquad={handleAddToSquad}
        onShare={handleShareSelectedMember}
        memberData={selectedMember}
      />
    </View>
  );
};

export default MembersScreen;
