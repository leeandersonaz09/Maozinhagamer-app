import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, Card, Shimmer, GamertagModal } from "../../components";
import styles from "../../constants/Theme/styles/MembersStyles";
import { COLORS } from "../../constants/Theme/theme";
import { getMembers } from "../../utils/apiRequests";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type Member = {
  id: string;
  name: string;
  image: string;
  followers: string;
  xbox: boolean;
  xboxTag?: string;
  ps: boolean;
  playstationTag?: string;
  pc: boolean;
  pcTag?: string;
};

type SelectedMemberData = {
  name: string;
  image: string;
  platform: "xbox" | "playstation" | "pc" | "error";
  gamertag: string;
  isValid: boolean;
};

const MembersScreen = () => {
  const [data, setData] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estados para controlar o Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<SelectedMemberData | null>(null);

  const fetchMembersData = async () => {
    try {
      const membersData = await getMembers();
      setData(membersData ?? []);
    } catch (error) {
      console.error("Erro ao buscar dados dos membros:", error);
      setData([]); // Garante que o estado não fique com dados antigos em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  const onRefresh = async () => {
    setIsLoading(true);
    await fetchMembersData();
  };

  const searchIconName =
    search.length > 0 ? "arrow-left" : "account-search-outline";

  const handleSearchIconClick = () => {
    if (search.length > 0) {
      setSearch("");
    }
  };

  const filteredMembers = useMemo(() => {
    if (!search) {
      return data;
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleOrderClick = () => {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setData(sortedData);
  };

  const handleIconPress = (
    member: Member,
    platform: "xbox" | "playstation" | "pc",
    gamertag?: string | boolean
  ) => {
    const isValid = typeof gamertag === "string" && gamertag.trim() !== "";
    setSelectedMember({
      name: member.name,
      image: member.image,
      platform: isValid ? platform : "error",
      gamertag: isValid ? gamertag : "Não cadastrada",
      isValid: isValid,
    });
    setIsModalVisible(true);
  };

  const MemberItem = ({ item }: { item: Member }) => {
    return (
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <Card>
          <Image source={{ uri: item.image }} style={styles.memberImage} />
          <View style={styles.memberInfo}>
            <ThemedText style={styles.memberName}>{item.name}</ThemedText>
            <ThemedText style={styles.memberTitle}>Member</ThemedText>
            <ThemedText style={styles.memberFollowers}>
              {item.followers}
            </ThemedText>
            <View style={styles.memberTagsContainer}>
              {item.xbox && (
                <TouchableOpacity
                  onPress={() => handleIconPress(item, "xbox", item.xboxTag)}
                >
                  <MaterialCommunityIcons
                    name="microsoft-xbox"
                    size={24}
                    color={COLORS.xbox}
                  />
                </TouchableOpacity>
              )}
              {item.ps && (
                <TouchableOpacity
                  onPress={() =>
                    handleIconPress(item, "playstation", item.playstationTag)
                  }
                >
                  <MaterialCommunityIcons
                    name="sony-playstation"
                    size={24}
                    color={COLORS.playstation}
                  />
                </TouchableOpacity>
              )}
              {item.pc && (
                <TouchableOpacity
                  onPress={() => handleIconPress(item, "pc", item.pcTag)}
                >
                  <MaterialCommunityIcons
                    name="steam"
                    size={24}
                    color={COLORS.steam}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.membersContainerView}>
      <FlatList
        data={[...Array(8).keys()]}
        keyExtractor={(item) => `skeleton-${item}`}
        numColumns={2}
        renderItem={() => (
          <View style={{ flex: 1, paddingBottom: 20 }}>
            <Card>
              <Shimmer
                width={80}
                height={80}
                borderRadius={40}
                style={{ alignSelf: "center" }}
              />
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Shimmer width="80%" height={20} borderRadius={4} />
                <Shimmer
                  width="50%"
                  height={15}
                  borderRadius={4}
                  style={{ marginTop: 5 }}
                />
              </View>
            </Card>
          </View>
        )}
      />
    </View>
  );

  return (
    <>
      <Header HeaderTittle={"Membros"} />
      <ThemedView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.SectionStyle}>
            <TouchableOpacity onPress={handleSearchIconClick}>
              <MaterialCommunityIcons
                name={searchIconName}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Procure o seu amigo..."
              placeholderTextColor="gray"
              value={search}
              onChangeText={setSearch}
              style={[
                styles.input,
                { backgroundColor: COLORS.white, color: COLORS.black },
              ]}
            />
          </View>
          <TouchableOpacity onPress={handleOrderClick}>
            <MaterialCommunityIcons
              name="sort-alphabetical-descending-variant"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          renderSkeleton()
        ) : filteredMembers.length > 0 ? (
          <View style={styles.membersContainerView}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={filteredMembers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MemberItem item={item} />}
              numColumns={2}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              {search
                ? "Nenhum membro encontrado"
                : "Não existem membros ativos"}
            </ThemedText>
          </View>
        )}
        <GamertagModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          memberData={selectedMember}
        />
      </ThemedView>
    </>
  );
};

export default MembersScreen;
