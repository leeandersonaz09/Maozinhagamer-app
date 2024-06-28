/*
import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList } from "react-native";
import { Header, Card } from "../components";
import styles from "../Theme/styles/MembersStyles";

export default function members() {
  // Dados JSON de exemplo
  const jsonData = [
    {
      id: "1",
      name: "Wan Gengxin",
      followers: 23,
      imageUrl: "<URL-da-imagem>",
    },
    {
      id: "2",
      name: "Uzoma Buchi",
      followers: 11,
      imageUrl: "<URL-da-imagem>",
    },
    // Adicione mais perfis aqui
  ];

  const ProfileCard = ({ name, followers }) => (
    <View style={styles.Content}>
      <Card style={styles.CardContainer}>
        <View>
          <Image
            style={styles.Image}
            source={require("../assets/logo-rouded.png")}
          />

          <View style={styles.TextContent}>
            <Text style={styles.tittle}>Mãozinha Gamer</Text>
            <Text style={styles.text}>
              “Mãozinha Gamer” é um canal de jogos destacando-se por gameplay
              emocionante e momentos épicos em jogos
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header HeaderTittle={"Membros"} />
      <FlatList
        data={jsonData}
        renderItem={({ item }) => (
          <ProfileCard name={item.name} followers={item.followers} />
        )}
        keyExtractor={(item) => item.id}
        // Outras propriedades da FlatList podem ser adicionadas aqui
      />
    </View>
  );
}
*/

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Header, Card } from "../components";
import styles from "../Theme/styles/MembersStyles";

const data = [
  {
    id: 1,
    name: "Lee Brasil",
    followers: "@LeeBrasil",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: true,
    pc: true,
    ps: false,
  },
  {
    id: 2,
    name: "LoneWolf",
    followers: "@SamLoneWolf7",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: true,
    pc: false,
    ps: true,
  },
  {
    id: 3,
    name: "DOC HOLLIDAY",
    followers: "@DOCHOLLIDAY3556",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: true,
    pc: true,
    ps: true,
  },
  {
    id: 4,
    name: "Carlos Nunes",
    followers: "@VILACHA_GAMERS",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: false,
    pc: true,
    ps: true,
  },
  {
    id: 5,
    name: "Thaynara Leandro",
    followers: "@thaynaraleandro4356",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: false,
    pc: true,
    ps: true,
  },
  {
    id: 6,
    name: "As quengas de vondel",
    followers: "@AldoLP",
    image: require("../assets/logo-rouded.png"),
    playstationTag: "",
    xboxTag: "",
    pcTag: "",
    xbox: false,
    pc: true,
    ps: true,
  },
];

const MemberItem = ({ item }) => {
  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <View style={styles.memberContainer}>
        <Image source={item.image} style={styles.memberImage} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberTitle}>Member</Text>
          <Text style={styles.memberFollowers}>{item.followers}</Text>
          <View style={styles.memberTagsContainer}>
            {item.xbox ? (
              <TouchableOpacity style={styles.followButton}>
                <FontAwesome5 name="xbox" size={24} color="black" />
              </TouchableOpacity>
            ) : null}
            {item.ps ? (
              <TouchableOpacity style={styles.followButton}>
                <FontAwesome5 name="playstation" size={24} color="black" />
              </TouchableOpacity>
            ) : null}
            {item.pc ? (
              <TouchableOpacity style={styles.followButton}>
                <FontAwesome5 name="steam" size={24} color="black" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const members = () => {
  return (
    <View style={styles.container}>
      <Header HeaderTittle={"Membros"} />
      <View style={styles.containerList}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MemberItem item={item} />}
          numColumns={2} // Exibe dois itens por linha
        />
      </View>
    </View>
  );
};

export default members;
