const spfxProfile = require('@microsoft/eslint-config-spfx/lib/flat-profiles/react');

module.exports = [
  // Generated output is not source code, so it must never be linted.
  {
    ignores: [
      'sharepoint/**',
      'dist/**',
      'lib/**',
      'lib-commonjs/**',
      'lib-dts/**',
      'lib-esm/**',
      'release/**',
      'temp/**',
      'jest-output/**',
      'teams/**'
    ]
  },
  ...spfxProfile,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      }
    }
  }
];
