(function (window) {
  window.config = {
    //VUE_APP_BASE_API: 'http://192.168.1.64:9700', //接口
    // VUE_APP_BASE_API: 'http://192.168.1.33:8700/8756', //接口
    VUE_APP_BASE_API: 'http://192.168.1.100:8756/', //接口
    //VUE_APP_BASE_API: 'http://yun.51-x.cn/zf-vr-server', //接口
    // VUE_APP_IMG_API: 'http://192.168.1.33',
    VUE_APP_IMG_API: 'http://192.168.1.100',
    VUE_APP_OSS_API: 'http://yun.51-x.cn/oss',
    VUE_FILE_OSS_PATH: 'http://zfatt.oss-cn-beijing.aliyuncs.com/',

    VUE_FILE_BASE_PATH: 'http://192.168.1.21/cloudFile/examTopicSystemFile/',

    VUE_IS_LOCAL: false,

    VUE_APP_BASE_KEY: 'zf_stu_jp2',
    baseUrl:'/'
  };
  console.log(window.config);
})(window);
