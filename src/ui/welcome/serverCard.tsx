import { Button } from "@components";
import { Image } from "expo-image";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { View, Text, StyleSheet } from "react-native";

import { Colors } from "../../config";
import { MastodonServers } from "../../config/interface";

interface ServerCardProps {
  server: MastodonServers;
  height?: number;
  width?: number;
}

const ServerCard: React.FC<ServerCardProps> = (props) => {
  const { server, height = 450, width = 300 } = props;

  return (
    <View style={[styles.cardContainer, { width, height }]}>
      <View>
        <Image
          source={{
            uri: server.proxied_thumbnail,
          }}
          style={styles.cardImage}
        />
        <View style={styles.imageTag}>
          <View style={styles.tag}>
            <Text style={{ color: "#fff" }}>{server.categories}</Text>
          </View>
          <View style={[styles.tag, { marginLeft: 5 }]}>
            <Text style={{ color: "#fff" }}>{server.languages}</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {server.domain}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
        <Text style={{ fontSize: 16 }}>{server.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            textStyle={{ color: Colors.theme }}
            text={server.approval_required ? "申请账号" : "创建账号"}
            style={styles.button}
            onPress={() => {
              openBrowserAsync(`https://${server.domain}/auth/sign_up`);
            }}
          />
          <Button
            textStyle={{ color: Colors.theme }}
            text="登录实例"
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: "/login",
                params: {
                  domain: server.domain,
                },
              });
            }}
          />
        </View>

        <View style={styles.activeUser}>
          <View style={styles.point} />
          <Text>{`${server.last_week_users}/${server.total_users}`}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.defaultLineGreyColor,
    backgroundColor: "#fff",
    paddingBottom: 95,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
  },
  tag: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    opacity: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 95,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.theme,
  },
  activeUser: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 15,
  },
  point: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginHorizontal: 5,
  },
});

export default ServerCard;
