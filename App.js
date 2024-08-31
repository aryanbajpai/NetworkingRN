import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Switch,
  useWindowDimensions,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native";

export default function App() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const fetchData = async (limit = 10) => {
    try {
      const resp = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
      );
      const data = await resp.json();
      setPostList(data);
      setIsLoading(false);
      setError("");
    } catch (error) {
      console.error("Error fetching data: ", error);
      setIsLoading(false);
      setError("Failed to fetch post list");
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    fetchData(20);
    setRefresh(false);
  };

  const addPost = async () => {
    setIsPosting(true);
    try {
      const resp = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
        }),
      });

      const newPost = await resp.json();
      setPostList([newPost, ...postList]);
      setPostTitle("");
      setPostBody("");
      setIsPosting(false);
      setError("");
    } catch (error) {
      console.error("Error adding new post: ", error);
      setError("Failed to add new post");
      setIsPosting(false); // Ensure isPosting is reset
    }
  };

  useEffect(() => {
    fetchData(7);
  }, []); // Added empty dependency array to run only on mount

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.loadingController, { backgroundColor: "#a4b5c4" }]}
      >
        <ActivityIndicator size="large" color="#00ffff" />
        <Text style={{ color: "#071739", fontSize: 20, fontStyle: "italic" }}>
          LOADING...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#071739" : "#a4b5c4" },
      ]}
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.headingText,
              { color: isDarkMode ? "#a4b5c4" : "#071739" },
            ]}
          >
            Networking in React Native
          </Text>

          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            trackColor={{ false: "#071739", true: "#a4b5c4" }} // Fixed typo here
            thumbColor={"white"}
          />

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: isDarkMode ? "#a4b5c4" : "#cdd5db" },
            ]}
          >
            <Text
              style={{ textAlign: "center", fontSize: 25, marginBottom: 8 }}
            >
              Add New Post
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#cdd5db" : "#a4b5c4",
                  color: isDarkMode ? "black" : "white",
                },
              ]}
              placeholder="Post's Title"
              value={postTitle}
              onChangeText={setPostTitle}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#cdd5db" : "#a4b5c4",
                  color: isDarkMode ? "black" : "white",
                },
              ]}
              placeholder="Post's Body"
              value={postBody}
              onChangeText={setPostBody}
            />

            <Button
              title={isPosting ? "Adding.." : "Add Post"}
              onPress={addPost}
              disabled={isPosting}
            />
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={postList}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.card,
                    {
                      width: windowWidth > 500 ? "75%" : "100%",
                    },
                    { backgroundColor: isDarkMode ? "#a4b5c4" : "#071739" },
                    { shadowColor: isDarkMode ? "white" : "black" },
                  ]}
                >
                  <Text
                    style={[
                      styles.titleText,
                      { color: isDarkMode ? "midnightblue" : "#e3c39d" },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.bodyText,
                      { color: isDarkMode ? "#223a59" : "#cdd5db" },
                    ]}
                  >
                    {item.body}
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 16 }} />
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    color: "#db222a",
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  No Posts Yet
                </Text>
              }
              ListHeaderComponent={
                <Text
                  style={[
                    styles.headText,
                    styles.common,
                    { color: isDarkMode ? "#e5e2d3" : "#e5e2d3" },
                  ]}
                >
                  GET List from API
                </Text>
              }
              ListFooterComponent={
                <Text
                  style={[
                    styles.footText,
                    styles.common,
                    { color: isDarkMode ? "#e5e2d3" : "#e5e2d3" },
                  ]}
                >
                  End of List
                </Text>
              }
              refreshing={refresh}
              onRefresh={handleRefresh}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  headingText: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "bold",
    paddingHorizontal: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
    elevation: 8,
    marginHorizontal: "auto",
  },
  titleText: {
    fontSize: 30,
  },
  bodyText: {
    fontSize: 24,
    color: "#666666",
    padding: 5,
  },

  common: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  headText: {
    color: "#e5e2d3",
  },
  footText: {
    marginBottom: 10,
    color: "#e5e2d3",
  },

  loadingController: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },

  inputContainer: {
    width: "90%",
    backgroundColor: "#cdd5db",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
  },

  errorContainer: {
    width: '90%',
    backgroundColor: "#ffc0cb",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#d8000c",
    fontSize: 16,
    textAlign: "center",
  },
});