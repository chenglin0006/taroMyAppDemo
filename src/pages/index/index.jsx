import { useMemo, useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { useDispatch } from "react-redux";
import { useToast } from 'taro-hooks'
import { View, Text } from '@tarojs/components'

export default function Index () {
  const page = useMemo(() => Taro.getCurrentInstance().page, [])
  const { Home: dispatch } = useDispatch();

  const [show] = useToast({
    mask: true,
    duration: 3000,
    title: 'initial title',
    icon: 'success',
  });

  useEffect(() => {
    dispatch.queryPayResult({
      payItemId: 1123,
      userPayId: 2234,
    }).then((res) => {
      console.log(res);
      show({
        title:res.message,
      });
    }).catch((err) => {
      show({
        title:err.msg,
        icon: 'error',
      });
    });
  }, [show, dispatch]);

  useDidShow(() => {
    const tabbar = Taro.getTabBar(page)
    tabbar?.setSelected(0)
  })

  return (
    <View className='index'>
      <Text>我是首页！</Text>
    </View>
  )
}
