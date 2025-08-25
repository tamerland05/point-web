import type { Meta, StoryObj } from "@storybook/react"

import { Icon } from "../icon"
import { ListItem } from "../list-item/index" // Adjust the import path as necessary
import { List } from "./index" // Adjust the import path as necessary

const meta: Meta<typeof List> = {
  args: {
    // Define default args for the List component if needed
  },
  argTypes: {
    // Define argTypes for the List component if needed
  },
  component: List,
}

export default meta

type Story = StoryObj<typeof List>

export const Default: Story = {
  render: (_args) => (
    <List>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </List>
  ),
}

export const History: Story = {
  render: (_args) => (
    <div className="pb-6">
      <h1 className="mt-4 font-medium text-text text-title-1">History</h1>
      <div>
        <h2 className="mt-5 mb-2 font-semibold text-lg">Today</h2>
        <List className="p-0">
          <ListItem
            leftBottomText="0x123...abc"
            leftIcon={
              <Icon
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent stroke-white p-2"
                name="CoinsFill"
              />
            }
            leftTopText={<p className="font-normal">Received</p>}
            rightBottomText="10:00 AM"
            rightTopText={<p className="font-medium text-positive">+100.00 TOKEN</p>}
            withSeparator
          />
          <ListItem
            leftBottomText="0x456...def"
            leftIcon={
              <img
                alt="placeholder"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-accent stroke-white p-2"
                src="https://placehold.co/600x400"
              />
            }
            leftTopText={<p className="font-normal">I CAN USE IMAGE HERE</p>}
            rightBottomText="11:00 AM"
            rightTopText={<p className="font-medium">Wassup</p>}
            withSeparator
          />
        </List>
      </div>
    </div>
  ),
}
