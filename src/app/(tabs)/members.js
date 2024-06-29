// members.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { Header, Card, PopupMenu } from "../components";
import styles from "../Theme/styles/MembersStyles";
import { COLORS } from "../Theme/theme";

const members = () => {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    retrieveMembersData();
  }, []);
  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const MemberItem = ({ item }) => {
    const [buttonRect, setButtonRect] = useState({});

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
                  onGetButtonRect={(rect) => setButtonRect(rect)}
                  buttonRect={buttonRect}
                />
              ) : null}
              {item.ps ? (
                <PopupMenu
                  name={item.name}
                  gamertag={item.playstationTag}
                  icon={"playstation"}
                  color={COLORS.playstation}
                  onGetButtonRect={(rect) => setButtonRect(rect)}
                  buttonRect={buttonRect}
                />
              ) : null}
              {item.pc ? (
                <PopupMenu
                  name={item.name}
                  gamertag={item.pcTag}
                  icon={"steam"}
                  color={COLORS.steam}
                  onGetButtonRect={(rect) => setButtonRect(rect)}
                  buttonRect={buttonRect}
                />
              ) : null}
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header HeaderTittle={"Membros"} />
      {memoizedData ? (
        <View style={styles.containerList}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={memoizedData}
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
  );
};

export default members;
