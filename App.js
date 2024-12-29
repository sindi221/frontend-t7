import React, { useState, createContext, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider, Text, Button, TextInput, Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import axios from "axios";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const API_URL = "http://192.168.56.1:3000";

// Context untuk User
const UserContext = createContext();

async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Data user yang berhasil login
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

// Register Screen
function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      alert("Registration Successful. Please login.");
      navigation.navigate("Login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.Text animation="bounceInDown" style={styles.title}>
        Register an Account
      </Animatable.Text>
      <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        label="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

// Login Screen
function LoginScreen({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await login(email, password);
      setUser(userData); // Set data pengguna yang login
      navigation.navigate("Main");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput label="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        label="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
}

// Home Screen
function HomeScreen() {
  return (
    <Animatable.View animation="fadeIn" style={styles.container}>
      <Text style={styles.text}>Welcome to Home!</Text>
      <Button mode="outlined" style={styles.button}>
        Explore Now
      </Button>
    </Animatable.View>
  );
}

// Explore Screen
function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <Animatable.Text animation="fadeIn" style={styles.title}>
        Explore the World
      </Animatable.Text>
      <View style={styles.categoryContainer}>
        {["Category 1", "Category 2", "Category 3"].map((category, index) => (
          <Card style={styles.card} key={index}>
            <Card.Title title={category} />
            <Card.Content>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                style={styles.image}
              />
              <Text>Discover more about {category}!</Text>
            </Card.Content>
            <Button mode="outlined" style={styles.button}>
              Explore
            </Button>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

// Profile Screen
function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Name: {user?.username || "N/A"}</Text>
        <Text style={styles.profileText}>Email: {user?.email || "N/A"}</Text>
      </View>
      <Button mode="contained" style={styles.button} onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}

// Navigation Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Explore: "magnify",
            Profile: "account",
          };
          return <Icon name={icons[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// App Component
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserContext.Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#6200ee",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#6200ee",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
  },
  signInText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#6200ee",
    textDecorationLine: "underline",
  },
  profileContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e8eaf6",
    borderRadius: 10,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  categoryContainer: {
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
});
