import { type Meta, type StoryObj } from "@storybook/react";

import { BankIcon } from "@/assets/icons/bank";

import { Button } from "./index";

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    label: "Bank",
    icon: BankIcon,
  },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
    className: { control: "text" },
    icon: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Primary: Story = {};
export const Outline: Story = {};
