import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import data from "./data";
import { useRef } from "react";

const { width, height } = Dimensions.get("window");
const LOGO_WIDTH = 320;
const LOGO_HEIGHT = 100;
const DOT_SIZE = 30;
const TICKER_HEIGHT = 30;
const CIRCLE_SIZE = width * 0.6;

const Circle = ({ scrollX }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map(({ color }, index) => {
        const inputRange = [
          (index - 0.55) * width,
          index * width,
          (index + 0.55) * width,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, 0.2, 0],
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const Item = ({ imageUri, heading, description, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const inputRangeOpacity = [
    (index - 0.3) * width,
    index * width,
    (index + 0.3) * width,
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });
  const translateYHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.1, 0, -width * 0.1],
  });
  const translateXDescription = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.7, 0, -width * 0.7],
  });
  const opacity = scrollX.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [0, 1, 0],
  });
  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[
          styles.imageStyle,
          {
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.heading,
            {
              opacity,
              transform: [{ translateY: translateYHeading }],
            },
          ]}
        >
          {heading}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.description,
            {
              opacity,
              transform: [
                {
                  translateX: translateXDescription,
                },
              ],
            },
          ]}
        >
          {description}
        </Animated.Text>
      </View>
    </View>
  );
};

const Pagination = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-DOT_SIZE, 0, DOT_SIZE],
  });
  return (
    <View style={styles.pagination}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: "absolute",
            transform: [{ translateX }],
          },
        ]}
      />
      {data.map((item) => (
        <View key={item.key} style={styles.paginationDotContainer}>
          <View
            style={[styles.paginationDot, { backgroundColor: item.color }]}
          />
        </View>
      ))}
    </View>
  );
};

const Ticker = ({ scrollX }) => {
  return (
    <View style={styles.tickerContainer}>
      {data.map(({ type }, index) => {
        const inputRange = [-width, 0, width];
        const inputRangeOpacity = [
          (index - 0.3) * width,
          index * width,
          (index + 0.3) * width,
        ];
        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
        });
        const opacity = scrollX.interpolate({
          inputRange: inputRangeOpacity,
          outputRange: [0, 1, 0],
        });
        return (
          <Animated.Text
            key={index}
            style={[
              styles.tickerText,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            {type}
          </Animated.Text>
        );
      })}
    </View>
  );
};

export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden />
      <Circle scrollX={scrollX} />
      <FlatList
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <Item {...item} index={index} scrollX={scrollX} />
        )}
      />
      <Image source={require("./assets/urbanears.png")} style={styles.logo} />
      <Pagination scrollX={scrollX} />
      <Ticker scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemStyle: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: width * 0.95,
    height: height * 0.95,
    resizeMode: "contain",
    flex: 1,
  },
  textContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-end",
    flex: 0.5,
  },
  heading: {
    color: "#444",
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
  },
  description: {
    color: "#ccc",
    fontWeight: "600",
    textAlign: "left",
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: "contain",
    position: "absolute",
    left: -10,
    bottom: -80,
    transform: [
      { translateX: -LOGO_WIDTH / 2 },
      { translateY: -LOGO_HEIGHT / 2 },
      { rotateZ: "-90deg" },
      { translateX: LOGO_WIDTH / 2 },
      { translateY: LOGO_HEIGHT / 2 },
    ],
  },
  pagination: {
    position: "absolute",
    right: 30,
    bottom: 40,
    flexDirection: "row",
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  tickerContainer: {
    position: "absolute",
    top: Platform.OS == "android" ? StatusBar.currentHeight : 50,
    left: 20,
    overflow: "hidden",
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    textTransform: "uppercase",
    fontWeight: "800",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    top: "20%",
  },
});
