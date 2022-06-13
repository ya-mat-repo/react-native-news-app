import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { ListItem } from '../components/ListItem';
import Loading from '../components/Loading';
import { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { Article } from '../types/article';

const URL = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${Constants.manifest?.extra?.newsApiKey}`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageRef = useRef(1);
  const fetchedAllRef = useRef(false);

  useEffect(() => {
    setLoading(true);
    fetchArticles(1);
    setLoading(false);
  }, []);

  const fetchArticles = async (page: number) => {
    try {
      const response = await axios.get(`${URL}&pageSize=100&page=${page}`);
      if (response.data.articles.length > 0) {
        setArticles((prevArticles) => [
          ...prevArticles,
          ...response.data.articles,
        ]);
      } else {
        fetchedAllRef.current = true;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const onEndReached = () => {
    if (!fetchedAllRef.current) {
      pageRef.current += 1;
      fetchArticles(pageRef.current);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setArticles([]);
    pageRef.current = 1;
    fetchedAllRef.current = false;
    await fetchArticles(1);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={({ item }: { item: Article }) => (
          <ListItem
            title={item.title}
            imageUrl={item.urlToImage}
            author={item.author}
            onPress={() => navigation.navigate('Article', { article: item })}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={onEndReached}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {loading && <Loading />}
    </SafeAreaView>
  );
};
