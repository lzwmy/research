module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here,0忽略通过，1警告但可编译通过，2是报错不继续编译
  'rules': {
    // allow paren-less arrow functions,允许箭头函数参数使用括号
    'arrow-parens': 0,
    // allow async-await,允许方法之间加星号，如function * generator() {},ES6提供的生成器函数
    'generator-star-spacing': 0,
    // allow debugger during development，允许在开发环境下使用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    //允许使用console
    'no-console': 0,
    // 使用 === 替代 ==，都行，0代表通过，也就是放松了规范，也可以用==， allow-null允许null和undefined==
    'eqeqeq': [0, 'allow-null'],
    // 使用浏览器全局变量时加上 window. 前缀,0不强制加
    'no-undef': 0,
    // 语句强制分号结尾,我觉得过于简洁的会非常影响阅读性，而且我认为不加分号总感觉会有隐藏的忧患
    'semi': [2, 'always']
  }
};
