import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { WebView } from "react-native-webview";
import styles from "./styles";
import { COLORS } from "../../components/Theme";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const fetchVideos = () => {
    fetch(
      "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCB8jsTfkY-7YP8ULi8mfuOw&maxResults=3&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          const videoUrls = data.items.map(
            (item) => `https://www.youtube.com/embed/${item.id.videoId}`
          );
          setVideos(videoUrls);
        } else {
          console.log("Não foi possível encontrar os IDs dos vídeos");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setRefreshing(false));
  };

  const fetchShorts = () => {
    fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=4&playlistId=UUSHB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          const shortsUrls = data.items.map(
            (item) =>
              `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`
          );
          setShorts(shortsUrls);
        } else {
          console.log("Não foi possível encontrar os vídeos");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setRefreshing(false));
  };

  const fetchSubscriberCount = () => {
    fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setSubscriberCount(data.items[0].statistics.subscriberCount);
        } else {
          console.log("Não foi possível encontrar o canal");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchVideos();
    fetchShorts();
    fetchSubscriberCount();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVideos();
    fetchShorts();
    fetchSubscriberCount();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.statusbar} barStyle="light-content" />
      <ScrollView style={styles.container}>
        <Image
          style={styles.headerImage}
          source={require("../../assets/maozinha-home.jpg")}
        />
        <View
          style={[styles.contentContainer, { backgroundColor: COLORS.white }]}
        >
          <Text
            style={[
              styles.Tittle,
              {
                color: COLORS.black,
                textAlign: "center",
                marginHorizontal: 5,
                marginTop: -20,
              },
            ]}
          >
            Bem-vindo a comunidade Maozinha Gamer!
          </Text>
          <View style={{ alignItems: "center" }}>
            <View style={styles.subscriberContainer}>
              <View style={styles.container1}>
                <Text style={styles.subscriberCount}> YouTube Inscritos</Text>
              </View>
              <View style={styles.container2}>
                <Text style={[styles.subscriberCount, { color: "black" }]}>
                  {subscriberCount}
                </Text>
              </View>
            </View>

            <View style={styles.VideoContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false} // Para lista horizontal
                showsVerticalScrollIndicator={false} // Para lista vertical
                data={videos}
                renderItem={({ item }) => (
                  <WebView
                    style={styles.video}
                    javaScriptEnabled={true}
                    source={{ uri: item }}
                  />
                )}
                keyExtractor={(item) => item}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>

            <View style={styles.shortsContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false} // Para lista horizontal
                showsVerticalScrollIndicator={false} // Para lista vertical
                data={shorts}
                renderItem={({ item }) => (
                  <WebView
                    style={styles.short}
                    javaScriptEnabled={true}
                    source={{ uri: item }}
                  />
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
