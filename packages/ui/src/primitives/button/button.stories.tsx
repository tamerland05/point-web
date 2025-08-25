import type { Meta, StoryObj } from "@storybook/react"

import { BankIcon } from "@/assets/icons/bank"

import { Button } from "./index"

const meta: Meta<typeof Button> = {
  args: {
    icon: BankIcon,
    label: "Bank",
  },
  argTypes: {
    className: { control: "text" },
    disabled: { control: "boolean" },
    icon: { control: false },
    label: { control: "text" },
    onClick: { action: "clicked" },
  },
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}
export const Primary: Story = {}
export const Outline: Story = {}
