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
                <TouchableOpacity style={styles.followButton}>
                  <FontAwesome5 name="xbox" size={24} color="#2ca243" />
                </TouchableOpacity>
              ) : null}
              {item.ps ? (
                <TouchableOpacity style={styles.followButton}>
                  <FontAwesome5 name="playstation" size={24} color="#00246E" />
                </TouchableOpacity>
              ) : null}
              {item.pc ? (
                <TouchableOpacity style={styles.followButton}>
                  <FontAwesome5 name="steam" size={24} color="#2a475e" />
                </TouchableOpacity>
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
