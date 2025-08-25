import { blueDark, grayDark } from "@radix-ui/colors"
import { create } from "@storybook/theming"

// TODO: remove radix colors
export default create({
  appBg: grayDark.gray1,
  appBorderColor: grayDark.gray2,
  appBorderRadius: 6,
  appContentBg: grayDark.gray1,
  barBg: grayDark.gray1,
  barHoverColor: blueDark.blue9,
  barSelectedColor: blueDark.blue9,
  barTextColor: grayDark.gray11,
  base: "dark",
  booleanBg: grayDark.gray3,
  buttonBg: grayDark.gray3,
  buttonBorder: grayDark.gray6,
  colorPrimary: blueDark.blue9,
  colorSecondary: blueDark.blue9,
  fontBase: "var(--font-geist-sans)",
  fontCode: "var(--font-geist-mono)",
  inputBg: grayDark.gray3,
  inputBorder: grayDark.gray6,
  inputBorderRadius: 6,
  inputTextColor: grayDark.gray11,
  textColor: grayDark.gray11,
  textInverseColor: grayDark.gray1,
  textMutedColor: grayDark.gray10,
})
