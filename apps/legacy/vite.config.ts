import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';
import fg from 'fast-glob';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { format } from 'date-fns';

const getPkgName = (path) => {
  const json = fs.readFileSync(`${path}/package.json`, {
    encoding: 'utf-8',
  });
  const { name } = JSON.parse(json);
  return { name, path };
};

const alias = [
  {
    // for less import
    find: `~@gitee/tide-theme`,
    replacement: resolve(`../../packages/theme`),
  },
  ...fg
    .sync(['../../packages/*', '../../presets/*'], { onlyDirectories: true })
    .map((path) => getPkgName(path))
    .map(({ name, path }) => {
      return {
        find: name,
        replacement: resolve(`${path}/src/index.ts`),
      };
    }),
];

// console.log(alias);

// // https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/tide' : '/',
    define: {
      __BUILD_TIME__: JSON.stringify(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
    },
    plugins: [react()],
    resolve: {
      alias,
    },
    // css: {
    //   modules: {
    //     localsConvention: 'camelCase',
    //   },
    // },
  };
});
