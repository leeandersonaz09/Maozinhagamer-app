import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, Card, PopupMenu } from "../components";
import styles from "../Theme/styles/MembersStyles";
import { COLORS } from "../Theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMembers } from "../utils/apiRequests"; // Certifique-se de ter a função de API

const MembersScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [barIcon, setBarIcon] = useState("account-search-outline");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para buscar dados e atualizar o cache
  const retrieveMembersData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem("membersData");
      if (cachedData) {
        setData(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  // Função de atualização para o pull-to-refresh
  const refreshMembersData = async () => {
    setIsRefreshing(true);
    try {
      const updatedData = await getMembers(); // Chama a função de API para pegar dados atualizados
      await AsyncStorage.setItem("membersData", JSON.stringify(updatedData)); // Atualiza o cache
      setData(updatedData); // Atualiza o estado com os dados atualizados
      setFilteredData(updatedData); // Sincroniza o estado dos dados filtrados
    } catch (error) {
      console.error("Erro ao atualizar dados dos membros:", error);
    }
    setIsRefreshing(false);
  };

  const searchIconBack = () => {
    if (barIcon === "arrow-left") {
      setBarIcon("account-search-outline");
      setSearch("");
      setFilteredData(data);
    }
  };

  useEffect(() => {
    retrieveMembersData();
  }, []);

  const filterItem = (e) => {
    const text = e.nativeEvent.text;
    setSearch(text);

    if (text === "") {
      setBarIcon("account-search-outline");
      setFilteredData(data);
    } else {
      setBarIcon("arrow-left");
      const filtered = data.filter(
        (item) => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
      setFilteredData(filtered);
    }
  };

  const handleOrderClick = () => {
    let sortedData = [...data];
    sortedData.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    setData(sortedData);
    setFilteredData(sortedData);
  };

  const MemberItem = ({ item }) => (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <Card>
        <Image source={{ uri: item.image }} style={styles.memberImage} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberTitle}>Member</Text>
          <Text style={styles.memberFollowers}>{item.followers}</Text>
          <View style={styles.memberTagsContainer}>
            {item.xbox && (
              <PopupMenu
                name={item.name}
                gamertag={item.xboxTag}
                icon={"xbox"}
                color={COLORS.xbox}
              />
            )}
            {item.ps && (
              <PopupMenu
                name={item.name}
                gamertag={item.playstationTag}
                icon={"playstation"}
                color={COLORS.playstation}
              />
            )}
            {item.pc && (
              <PopupMenu
                name={item.name}
                gamertag={item.pcTag}
                icon={"steam"}
                color={COLORS.steam}
              />
            )}
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header HeaderTittle={"Membros"} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.SectionStyle}>
            <TouchableOpacity onPress={searchIconBack}>
              <MaterialCommunityIcons name={barIcon} size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Procure o seu amigo..."
              placeholderTextColor="gray"
              value={search}
              onChange={(e) => filterItem(e)}
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

        {data.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={search.length > 0 ? filteredData : data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MemberItem item={item} />}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshMembersData} // Executa o pull-to-refresh
              />
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Não existem membros ativos
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MembersScreen;
