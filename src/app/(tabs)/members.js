// members.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, Card, PopupMenu } from "../components";
import styles from "../Theme/styles/MembersStyles";
import { COLORS } from "../Theme/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const members = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [barIcon, setbarIcon] = useState("account-search-outline");

  //Get Data for the Banner from Async Storage for pass dataBanner to component Carousel
  const retrieveMembersData = async () => {
    try {
      const getItem = await AsyncStorage.getItem("membersData"); // Aguarde a conclusão da operação
      const parsedItem = await JSON.parse(getItem);
      setData(parsedItem);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  const searchIconBack = () => {
    if (barIcon == "arrow-left") {
      setbarIcon("account-search-outline");
      setSearch("");
    }
  };

  useEffect(() => {
    retrieveMembersData();
  }, []);

  const filterItem = (e) => {
    const text = e.nativeEvent.text; // Converter para minúsculas

    if (text === "") {
      setbarIcon("account-search-outline");
    } else {
      setbarIcon("arrow-left");
    }
    setSearch(text);

    //Filtrar os dados
    const filtered = data.filter(
      (item) => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    );

    setFilteredData(filtered);
  };

  const handleOrderClick = () => {
    let newList = [...data];
    newList.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    setData(newList);
  };

  const MemberItem = ({ item }) => {
    return (
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <Card>
          <Image source={{ uri: item.image }} style={styles.memberImage} />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberTitle}>Member</Text>
            <Text style={styles.memberFollowers}>{item.followers}</Text>
            <View style={styles.memberTagsContainer}>
              {item.xbox ? (
                <PopupMenu
                  name={item.name}
                  gamertag={item.xboxTag}
                  icon={"xbox"}
                  color={COLORS.xbox}
                />
              ) : null}
              {item.ps ? (
                <PopupMenu
                  name={item.name}
                  gamertag={item.playstationTag}
                  icon={"playstation"}
                  color={COLORS.playstation}
                />
              ) : null}
              {item.pc ? (
                <PopupMenu
                  name={item.name}
                  gamertag={item.pcTag}
                  icon={"steam"}
                  color={COLORS.steam}
                />
              ) : null}
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <>
      <Header HeaderTittle={"Membros"} />
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <View style={styles.SectionStyle}>
            <TouchableOpacity onPress={() => searchIconBack()}>
              <MaterialCommunityIcons name={barIcon} size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Procure o seu amigo..."
              placeholderTextColor="gray"
              value={search}
              onChange={(e) => {
                filterItem(e);
              }}
              style={[
                styles.input,
                { backgroundColor: COLORS.white, color: COLORS.black },
              ]}
            />
          </View>
          <TouchableOpacity onPress={() => handleOrderClick()}>
            <MaterialCommunityIcons
              name="sort-alphabetical-descending-variant"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        {data ? (
          <View style={styles.containerList}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={search.length > 0 ? filteredData : data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MemberItem item={item} />}
              numColumns={2} // Exibe dois itens por linha
            />
          </View>
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              Não existem membros ativos
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default members;
