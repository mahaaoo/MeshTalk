import { Screen } from "@components";
import User from "@ui/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Loading } from "react-native-ma-modal";

import { Account } from "../../config/interface";
import { lookupAcct } from "../../server/account";

const Users: React.FC<object> = () => {
  const { id = "", acct = "" } = useLocalSearchParams<{
    id: string;
    acct: string;
  }>();
  const [userData, setUserData] = useState<Account>({} as Account);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, ok } = await lookupAcct(acct);
      if (ok && data) {
        setUserData(data);
      }
      Loading.hide();
    };
    Loading.show();
    fetchUserData();
  }, [acct]);

  return (
    <Screen>
      <User userData={userData} id={id} />
    </Screen>
  );
};

export default Users;
