import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    flexGrow: 1
    // position: "relative",
    // resizeMode: "cover",
    // width: null,
    // height: null
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center"
  }
});
