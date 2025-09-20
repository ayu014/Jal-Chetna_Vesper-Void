import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const slides = [
  {
    key: "welcome",
    title: "Welcome to Jal-Chetna!",
    text: "Empowering farmers with real-time water and crop insights.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#e3f2fd",
  },
  {
    key: "dashboard",
    title: "Dashboard Overview",
    text: "View key KPIs, weather, and water data at a glance.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#fffde7",
  },
  {
    key: "search",
    title: "Search for Stations",
    text: "Find the nearest water monitoring stations easily.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#e8f5e9",
  },
  {
    key: "crop",
    title: "Crop Recommendation",
    text: "Get personalized crop suggestions based on your location and data.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#fce4ec",
  },
  {
    key: "alerts",
    title: "Alerts & Forecasts",
    text: "Stay updated with timely alerts and weather forecasts.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#f3e5f5",
  },
  {
    key: "language",
    title: "Multi-language Support",
    text: "Use the app in your preferred language for better accessibility.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#e0f7fa",
  },
  {
    key: "getstarted",
    title: "Get Started!",
    text: "Let’s begin your journey. Login to continue.",
    image: require("../../assets/images/logo.jpg"),
    bg: "#fff3e0",
  },
];

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ onFinish }) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      swiperRef.current.scrollBy(1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        onIndexChanged={setCurrentIndex}
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {slides.map((slide) => (
          <View
            style={[styles.slide, { backgroundColor: slide.bg }]}
            key={slide.key}
          >
            <View style={styles.card}>
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.text}>{slide.text}</Text>
            </View>
          </View>
        ))}
      </Swiper>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    padding: 24,
  },
  image: {
    width: CARD_WIDTH * 0.7,
    height: CARD_HEIGHT * 0.35,
    marginBottom: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a237e",
    textAlign: "center",
  },
  text: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  pagination: {
    bottom: 80,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#bdbdbd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#1a237e",
    width: 16,
    height: 10,
    borderRadius: 5,
  },
  buttonRow: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: "#757575",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#1a237e",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
