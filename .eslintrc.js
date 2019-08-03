module.exports = {
    'extends': 'airbnb-base',
    'parserOptions': {
        'ecmaVersion': 8,
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true
        }
    },
    'env': {
        'es6': true
    },
    rules: {
        'linebreak-style': 0,
        'indent': ['error', 4],
        'no-console': 'off',
        'object-curly-spacing': 'off',
        'arrow-parens': 2,
        'semi': 2,
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
        'no-restricted-syntax': 'off',
        'array-callback-return': 'off',
        'no-unused-vars': 'off',
        'prefer-destructuring': 'off',
        'prefer-promise-reject-errors': 'off'
    }
};