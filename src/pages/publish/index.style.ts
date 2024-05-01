import { StyleSheet } from "react-native";

import Colors from "../../config/colors";
import Screen from "../../config/screen";

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.defaultWhite,
  },
  header: {
    paddingVertical: 0,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  header_text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tool: {
    width: Screen.width,
    backgroundColor: "#fff",
    position: "absolute",
  },
  input: {
    flex: 1,
    height: Screen.height / 3,
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 10,
  },
  flatlist: {
    position: "absolute",
    width: Screen.width,
    overflow: "hidden",
  },
  power: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  contentContainer: {
    width: Screen.width,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
  },
  toolBar: {
    width: Screen.width,
    height: 50,
  },
  iconErath: {
    width: 20,
    height: 20,
  },
  replayText: {
    color: Colors.theme,
    fontSize: 14,
    marginLeft: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  iconView: {
    flexDirection: "row",
  },
  iconTouch: {
    marginLeft: 20,
  },
  currentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentContentText: {
    fontSize: 16,
    color: Colors.theme,
  },
  emojiContainer: {
    width: 1,
    height: 30,
    backgroundColor: Colors.defaultLineGreyColor,
    marginHorizontal: 15,
  },
  emojiTouch: {
    marginRight: 15,
  },
  emojiItem: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
