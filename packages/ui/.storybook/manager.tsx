import "@point/assets/fonts/stylesheet.css"

import type { Globals } from "@storybook/types"

import { addons, types, useGlobals } from "@storybook/manager-api"
import { useEffect } from "react"

import theme from "./theme"

addons.setConfig({
  theme: theme,
})

const ExampleToolbar = () => {
  const [globals] = useGlobals() as [Globals & { theme?: string }, ...unknown[]]

  useEffect(() => {
    const elements = document.querySelectorAll(".docs-story")

    elements.forEach((element) => {
      element.classList.add(globals.theme as string)
    })
  }, [globals])

  return null
}

const registerAddons = () => {
  addons.register("docs-theme", () => {
    addons.add("docs-theme-addon", {
      match: ({ viewMode }) => !!viewMode?.match(/^(?:story|docs)$/),
      render: ExampleToolbar,
      title: "Addon to change docs story theme",
      type: types.TOOL,
    })
  })
}

registerAddons()
