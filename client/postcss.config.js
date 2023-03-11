import cssnano from "cssnano";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    cssnano({ preset: "default" }),
    postcssPresetEnv({ stage: 1 }),
    autoprefixer(),
  ],
};
