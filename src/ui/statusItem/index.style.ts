import { StyleSheet } from "react-native";

import { Colors } from "../../config";
import useDeviceStore from "../../store/useDeviceStore";

export const styles = StyleSheet.create({
  status: {
    flexDirection: "row",
    marginTop: 8,
    marginHorizontal: 15,
    marginRight: 50,
    alignItems: "center",
  },
  main: {
    backgroundColor: Colors.defaultWhite,
    marginBottom: 10,
    width: useDeviceStore.getState().width,
  },
  title: {
    flexDirection: "row",
    paddingTop: 15,
  },
  avatar: {
    paddingRight: 10,
  },
  name: {
    justifyContent: "center",
    flex: 1,
  },
  turnText: {
    color: Colors.commonToolBarText,
    marginLeft: 2,
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
  },
  content: {
    marginHorizontal: 15,
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  nameView: {
    marginRight: 30,
  },
  mentionText: {
    color: Colors.commonToolBarText,
    fontSize: 14,
  },
  sourceContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceView: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceText: {
    fontSize: 12,
    color: Colors.commonToolBarText,
    marginLeft: 8,
  },
  nameText: {
    fontSize: 12,
    color: Colors.commonToolBarText,
  },
  more: {
    position: "absolute",
    right: 5,
    padding: 10,
  },
  tool: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  toolItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toolTitle: {
    fontSize: 16,
    color: Colors.commonToolBarText,
    marginLeft: 2,
  },
  iconTurn: {
    width: 24,
    height: 22,
  },
  webCardContainer: {
    borderRadius: 8,
    borderWidth: useDeviceStore.getState().onePixel,
    borderColor: Colors.defaultLineGreyColor,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 15,
    height: 110,
  },
  webCardImage: {
    flex: 1,
  },
  webCardContent: {
    flex: 2,
  },
  webCardCardContainer: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  webCardCardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  webCardDesContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  webCardDesText: {
    lineHeight: 17,
  },
  webCardUrlContainer: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
});
