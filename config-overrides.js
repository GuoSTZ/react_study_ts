const { override, fixBabelImports, addLessLoader, addPostcssPlugins } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    // style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modules: true,
    modifyVars: {
      '@red-6': '#FF3D55', //红色系基础色
      '@volcano-6': '#FF6537', //橙色系基础色
      '@gold-6': '#FACA46', //黄色系基础色
      '@green-6': '#1AD999', //绿色系基础色
      '@blue-6': '#3385FF', //蓝色系基础色
      '@purple-6': '#935DD9', //紫色系基础色
      '@primary-color': '#3385FF', //基础主色
      '@heading-color': '#081333', //表格表头文字主色
      '@text-color': '#38415C', //文本主色，比如面包屑的当前文字主色,表格行文字颜色
      '@text-color-secondary': '#82899E', //次文本主色
      '@disabled-color': '#AFB5C7', //禁用颜色
      '@border-color-base': '#CED2DE', //边框颜色，组件的外框
      '@background-color-base': '#F0F1F5', //基础背景色
      '@border-color-split': '#E6E9F0' //分割线颜色，组件内部的边框
    }
  }),
  //增加路径别名的处理 
  // addWebpackAlias({  
  //   '@': path.resolve('./src')  
  // })

  // px转换rem
  // addPostcssPlugins([require('postcss-pxtorem')({
  //   rootValue: 192,
  //   propList: ['*']
  //   // propList: ['*', '!border*', '!font-size*', '!letter-spacing'],
  //   // propWhiteList: []
  // }),])
);