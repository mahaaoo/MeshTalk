module.exports = {
  root: true,
  extends: ["universe/native", 'expo', "prettier"],
  plugins: ['prettier'],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    'prettier/prettier': 'warn',
  },
};
