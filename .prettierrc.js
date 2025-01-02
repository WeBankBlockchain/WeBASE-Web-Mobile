module.exports = {
    printWidth: 120, // 规定一行的最大宽度，超过这个宽度则会自动换行。通常设置为100或120
    tabWidth: 2, // tab缩进大小, 默认值为 2
    useTabs: false, // 使用tab缩进, 默认false
    semi: false, // 行末分号, 默认true
    singleQuote: true, // 使用单引号, 默认false
    quoteProps: 'as-needed', // 仅在需要时在对象属性周围添加引号, 默认'as-needed'
    trailingComma: 'none', // 结尾是否强制添加逗号，默认none, 可选 none|es5|all
    bracketSpacing: true, // 对象中的空格, 默认true, 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    jsxBracketSameLine: false, // 规定是否将 JSX 元素的闭合括号放在末尾。默认为 false，即放在新的一行。
    arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号, avoid: 省略括号
    endOfLine: 'lf', // 定义换行符的类型。可选值为 "auto"、"lf" 和 "crlf"。默认为 "auto"
    jsxSingleQuote: false, // jsx中是否使用单引号, 默认false
    vueIndentScriptAndStyle: false // vue文件的script标签和Style标签下的内容需要缩进, 默认false
  }
  