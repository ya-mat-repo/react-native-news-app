import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import ListItem from '../components/ListItem';
import Loading from '../components/Loading';
import { useState, useEffect, memo } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';

const URL = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${Constants.manifest?.extra?.newsApiKey}`;

export const HomeScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      setArticles(response.data.articles);
    } catch (err: any) {
      console.error(err.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            imageUrl={item.urlToImage}
            author={item.author}
            onPress={() => navigation.navigate('Article', { article: item })}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      {loading && <Loading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// export default memo(HomeScreen);