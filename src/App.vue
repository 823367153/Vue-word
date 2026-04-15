<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted } from 'vue';
  import { computed } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

  import useLocale from '@/hooks/locale';

  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });

  // 监听测试
  // 定义监听回调（抽离成函数，方便移除）
  // 核心：监听 8080 的请求并返回 ctFormData
  const handleMessageRequest = (event: MessageEvent) => {
    // 安全校验：只处理 8080 源的请求
    if (event.origin !== 'http://192.168.1.69:8080') return;

    console.log('8887 收到 8080 的请求：', event.data);

    // 识别请求类型
    if (event.data.type === 'requestCtFormData') {
      // 读取 8887 本地存储的 ctFormData
      const ctFormData = localStorage.getItem('ctFormData');
      console.log('8887 本地 ctFormData：', ctFormData);

      // 向 8080 返回数据
      event.source.postMessage(
        {
          type: 'responseCtFormData',
          data: ctFormData || '', // 无数据返回空字符串
        },
        event.origin // 限定源，保证安全
      );
    }
  };

  // 挂载时绑定监听（全局生效）
  onMounted(() => {
    console.log('8887 全局 message 监听已绑定');
    window.addEventListener('message', handleMessageRequest);
  });

  // 卸载时移除监听（防止内存泄漏）
  onUnmounted(() => {
    window.removeEventListener('message', handleMessageRequest);
  });
</script>
<style></style>
