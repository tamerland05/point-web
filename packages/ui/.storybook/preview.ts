import "@point/assets/fonts/stylesheet.css"
import "./globals.css"

import type { Preview, ReactRenderer } from "@storybook/react"

import { withThemeByClassName } from "@storybook/addon-themes"
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport"

import theme from "./theme"

const customViewports = {
  "2k": {
    name: "2K",
    styles: {
      height: "1440px",
      width: "2560px",
    },
  },
  "4k": {
    name: "4K",
    styles: {
      height: "2160px",
      width: "3840px",
    },
  },
  "21/9": {
    name: "21/9",
    styles: {
      height: "1080px",
      width: "2560px",
    },
  },
  "720p": {
    name: "720p",
    styles: {
      height: "720px",
      width: "1280px",
    },
  },
  "1080p": {
    name: "1080p",
    styles: {
      height: "1080px",
      width: "1920px",
    },
  },
}

const preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      defaultTheme: "dark",
      themes: {
        dark: "dark",
        light: "light",
      },
    }),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme,
    },
    viewport: {
      viewports: {
        ...customViewports,
        ...INITIAL_VIEWPORTS,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Preview

export default preview
