const eslint = exports;

eslint.env = {
  browser: true,
  node: true,
  es6: true,
};

eslint.extends = [
  'eslint:recommended',
  'plugin:react/recommended',
  'llama',
];

// Adds support for cutting-edge JS features.
eslint.parser = 'babel-eslint';

eslint.plugins = [
  'react',
  'babel',
];

// Enable ES modules.
eslint.parserOptions = {
  sourceType: 'module',
};

eslint.rules = {
  'require-jsdoc': ['error', {
    require: {
      ArrowFunctionExpression: false,
      FunctionDeclaration: true,
      MethodDefinition: false,
      ClassDeclaration: true,
    },
  }],
  'jsx-quotes': ['error', 'prefer-single']
};
