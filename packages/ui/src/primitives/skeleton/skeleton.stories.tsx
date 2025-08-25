import type { Meta, StoryObj } from "@storybook/react"

import { List } from "../list"
import { ListItem } from "../list-item"
import { Skeleton } from "."

const meta: Meta<typeof Skeleton> = {
  argTypes: {
    className: { control: "text" },
    rounded: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    size: { control: "text" },
  },
  component: Skeleton,
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" {...args} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" {...args} />
        <Skeleton className="h-4 w-[200px]" {...args} />
      </div>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {}

export const LoadingListItem: Story = {
  render: (args) => (
    <ListItem
      leftBottomText={<Skeleton {...args} className="m-0.5" rounded="lg" size="caption-1" />}
      leftIcon={<Skeleton {...args} className="size-11" rounded="full" />}
      leftTopText={<Skeleton {...args} className="m-0.5" rounded="lg" size="base" />}
      rightBottomText={<Skeleton {...args} className="m-0.5 ml-auto" rounded="lg" size="caption-1" />}
      rightTopText={<Skeleton {...args} className="m-0.5" rounded="lg" size="base" />}
    />
  ),
}

export const LoadingList: Story = {
  render: (_args) => (
    <List className="w-[300px]">
      <ListItem
        leftBottomText={<Skeleton className="m-0.5" rounded="lg" size="caption-1" />}
        leftIcon={<Skeleton className="size-11" rounded="full" />}
        leftTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        rightBottomText={<Skeleton className="m-0.5 ml-auto" rounded="lg" size="caption-1" />}
        rightTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        withSeparator
      />
      <ListItem
        leftBottomText={<Skeleton className="m-0.5" rounded="lg" size="caption-1" />}
        leftIcon={<Skeleton className="size-11" rounded="full" />}
        leftTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        rightBottomText={<Skeleton className="m-0.5 ml-auto" rounded="lg" size="caption-1" />}
        rightTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        withSeparator
      />
      <ListItem
        leftBottomText={<Skeleton className="m-0.5" rounded="lg" size="caption-1" />}
        leftIcon={<Skeleton className="size-11" rounded="full" />}
        leftTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        rightBottomText={<Skeleton className="m-0.5 ml-auto" rounded="lg" size="caption-1" />}
        rightTopText={<Skeleton className="m-0.5" rounded="lg" size="base" />}
        withSeparator
      />
    </List>
  ),
}
