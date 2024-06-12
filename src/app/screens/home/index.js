import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, SafeAreaView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './styles';
import { COLORS } from '../../components/theme';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const fetchVideos = () => {
    fetch('https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=YOUR_CHANNEL_ID&maxResults=3&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw')
      .then(response => response.json())
      .then(data => {
        if (data.items) {
          const videoUrls = data.items.map(item => `https://www.youtube.com/embed/${item.id.videoId}`);
          setVideos(videoUrls);
        } else {
          console.log('Não foi possível encontrar os IDs dos vídeos');
        }
      })
      .catch(error => console.error(error))
      .finally(() => setRefreshing(false));
  };

  const fetchSubscriberCount = () => {
    fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw')
      .then(response => response.json())
      .then(data => {
        if (data.items) {
          setSubscriberCount(data.items[0].statistics.subscriberCount);
        } else {
          console.log('Não foi possível encontrar o canal');
        }
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchVideos();
    fetchSubscriberCount();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVideos();
    fetchSubscriberCount();
  }, []);

  return (
    <View style={styles.container}>
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
          keyExtractor={item => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
      <View style={styles.subscriberContainer}>
        <Text style={styles.subscriberCount}>{subscriberCount}</Text>
        <Text style={styles.subscriberLabel}>Inscritos</Text>
      </View>
    </View>
  );
};

export default Home;
