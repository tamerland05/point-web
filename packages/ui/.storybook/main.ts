import type { StorybookConfig } from "@storybook/react-vite"

import { dirname, join } from "path"

/**
 * This function is used to resolve the absolute path of a package. It is needed
 * in projects that use Yarn PnP or are set up within a monorepo.
 * @param value The package name.
 * @returns The absolute path of the package.
 */
export function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, "package.json")))
}

const config = {
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    {
      name: getAbsolutePath("@storybook/addon-essentials"),
      options: {
        backgrounds: false,
      },
    },
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  docs: {
    autodocs: "tag",
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite") as "@storybook/react-vite",
    options: {
      strictMode: true,
    },
  },
  staticDirs: [getAbsolutePath("@point/assets")],
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
} satisfies StorybookConfig

export default config
