import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './styles';
import { COLORS } from '../../components/theme';

const Home = () => {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    fetch('https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCB8jsTfkY-7YP8ULi8mfuOw&maxResults=3&key=AIzaSyDhrfifHXzh3rS2Tp4xmGc-6CNNugaj-SI')
      .then(response => response.json())
      .then(data => {
        if (data.items) {
          const videoUrls = data.items.map(item => `https://www.youtube.com/embed/${item.id.videoId}`);
          setVideos(videoUrls);
        } else {
          console.log('Não foi possível encontrar os IDs dos vídeos');
        }
      })
      .catch(error => console.error(error));
  }, []);

  return (
  
      <View style={styles.container}>
        <View style={styles.VideoContainer}>
          <FlatList
            horizontal
            data={videos}
            renderItem={({ item }) => (
              <WebView
                style={styles.video}
                javaScriptEnabled={true}
                source={{ uri: item }}
              />
            )}
            keyExtractor={item => item}
          />
        </View>
      </View>
 
  );
};

export default Home;

