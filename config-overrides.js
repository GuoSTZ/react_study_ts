const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    // style: true
  }),
  addLessLoader({  
    javascriptEnabled: true,    
    // modifyVars: { "@primary-color": "#1DA57A" },  
  }),
  //增加路径别名的处理 
  // addWebpackAlias({  
  //   '@': path.resolve('./src')  
  // })
);