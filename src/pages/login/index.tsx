import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, SafeAreaView} from 'react-native';
import {Toast} from 'react-native-ma-modal';

import {Button} from '../../components';
import {Screen, Colors} from '../../config';
import {goBack, navigate, reset, useRequest} from '../../utils';
import {getAppConfig, getToken} from '../../server/app';
import {useAppStore} from '../../store';

const fetchAppConfig = () => {
  const fn = (host: string) => {
    return getAppConfig(host);
  };
  return fn;
};

const fetchAppToken = () => {
  const fn = (url: string, param: Object) => {
    return getToken(url, param);
  };
  return fn;
};

const Login: React.FC<{}> = () => {
  const [path, setPath] = useState('fairy.id');
  const {data: loginData, run: getLoginData} = useRequest(fetchAppConfig(), {
    manual: true,
  });
  const {data: tokenData, run: getTokenData} = useRequest(fetchAppToken(), {
    manual: true,
  });
  const appStore = useAppStore();

  useEffect(() => {
    if (loginData) {
      const url = `https://${path}/oauth/authorize?scope=read%20write%20follow%20push&response_type=code&redirect_uri=${loginData?.redirect_uri}&client_id=${loginData?.client_id}`;
      navigate('WebView', {
        initUrl: url,
        callBack: (code: string) => {
          const params = {
            client_id: loginData.client_id,
            client_secret: loginData.client_secret,
            code: code,
          };
          getTokenData('https://' + path, params);
        },
      });
    }
  }, [loginData]);

  useEffect(() => {
    if (tokenData) {
      console.log('获取到的token信息');
      appStore.setHostURL('https://' + path);
      appStore.setToken(tokenData.access_token);
      reset('App');
    }
  }, [tokenData]);

  const handleLogin = () => {
    if (path.length > 0) {
      // getLoginData('https://' + path);
      getAppConfig('https://' + path);
    } else {
      Toast.show('请输入应用实例地址');
    }
  };

  return (
    <SafeAreaView style={styles.main_view}>
      <View style={styles.go_back_view}>
        <Text style={styles.go_back_text} onPress={goBack}>
          取消
        </Text>
      </View>
      <Text style={styles.login_title}>登录Mastodon</Text>
      <TextInput
        style={styles.input_style}
        placeholder={'应用实例地址，例如：acg.mn'}
        autoFocus={true}
        onChangeText={text => {
          setPath(text);
        }}
        value={path}
      />
      <Button text={'登录'} onPress={handleLogin} style={styles.button_style} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main_view: {
    flex: 1,
    alignItems: 'center',
  },
  login_title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
  },
  input_style: {
    fontSize: 18,
    textAlign: 'left',
    marginHorizontal: 20,
    marginTop: 50,
    alignItems: 'flex-start',
  },
  button_style: {
    width: Screen.width - 80,
    marginVertical: 50,
  },
  go_back_view: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
  },
  go_back_text: {
    fontSize: 16,
    color: Colors.buttonDefaultBackground,
  },
});

export default Login;
