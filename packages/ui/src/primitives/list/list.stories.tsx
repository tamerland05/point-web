import { type Meta, type StoryObj } from "@storybook/react";

import { ArrowCircleDown2Icon } from "@/assets/icons/arrow-circle-down-2"; // Adjust the import path as necessary
import { ArrowCircleUp2Icon } from "@/assets/icons/arrow-circle-up-2"; // Adjust the import path as necessary

import { ListItem } from "../list-item/index"; // Adjust the import path as necessary
import { List } from "./index"; // Adjust the import path as necessary

const meta: Meta<typeof List> = {
  component: List,
  args: {
    // Define default args for the List component if needed
  },
  argTypes: {
    // Define argTypes for the List component if needed
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: (args) => (
    <List>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </List>
  ),
};

export const History: Story = {
  render: (args) => (
    <div className="pb-6">
      <h1 className="text-title-1 text-text mt-4 font-medium">History</h1>
      <div>
        <h2 className="mb-2 mt-5 text-lg font-semibold">Today</h2>
        <List className="p-0">
          <ListItem
            leftBottomText="0x123...abc"
            leftIcon={
              <ArrowCircleDown2Icon className="bg-accent flex h-11 w-11 items-center justify-center rounded-full stroke-white p-2" />
            }
            leftTopText={<p className="font-normal">Received</p>}
            rightBottomText="10:00 AM"
            rightTopText={<p className="text-positive font-medium">+100.00 TOKEN</p>}
            withSeparator
          />
          <ListItem
            leftBottomText="0x456...def"
            leftIcon={
              <ArrowCircleUp2Icon className="bg-accent flex h-11 w-11 items-center justify-center rounded-full stroke-white p-2" />
            }
            leftTopText={<p className="font-normal">Sent</p>}
            rightBottomText="11:00 AM"
            rightTopText={<p className="font-medium">-50.00 TOKEN</p>}
            withSeparator
          />
        </List>
      </div>
    </div>
  ),
};
