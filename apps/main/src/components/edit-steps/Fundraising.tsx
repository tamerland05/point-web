import { useForm } from "@tanstack/react-form"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import Img from "react-cool-img"
import { toast } from "react-hot-toast"

import { type PurposeIconsDTO, purposeIconsQueryOptions } from "@point/shared/api/point/purposeIcons"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { Loader } from "@point/ui/loader"

import { ShowMainButton } from "../tg-internals"

interface FundraisingStepProps {
  title?: string
  description?: string
  fromOnboarding?: boolean

  onUpdateEmployee: (data: FormData) => Promise<void>
}

export const FundraisingStep = ({ title, description, onUpdateEmployee, fromOnboarding }: FundraisingStepProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const purposeIconsQuery = useQuery(purposeIconsQueryOptions)
  const purposeIconsIsLoading = purposeIconsQuery.isLoading
  const purposeIconsIsError = purposeIconsQuery.isError
  const purposeIcons = purposeIconsQuery.data || []

  const form = useForm({
    defaultValues: {
      description: description || "",
      icon: purposeIcons[0]?.id || ("" as string),
      title: title || "",
    },
    onSubmit: async ({ formApi, value }) => {
      if (!value.title) {
        toast.error("Please enter a title")
        return
      }

      if (!value.description) {
        toast.error("Please enter a description")
        return
      }

      const employeeFormData = new FormData()
      const updateObj = {
        purpose: {
          description: value.description,
          icon: value.icon,
          title: value.title,
        },
      }

      employeeFormData.append("update_in", JSON.stringify(updateObj))

      await onUpdateEmployee(employeeFormData)

      formApi.reset()
    },
  })

  const mainButtonConfig = useMemo(() => {
    const onClick = async () => {
      await form.handleSubmit()

      if (fromOnboarding) {
        void navigate({ search: { fromOnboarding: true, step: "connect-wallet" }, to: "/account/my-profile/edit" })
        return
      }

      void navigate({ search: { step: "job-place" }, to: "/account/my-profile/edit" })
    }

    return {
      disabled: !form.state.canSubmit || form.state.isSubmitting,
      hidden: false,
      loading: form.state.isSubmitting,
      onClick,
      title: "Continue",
    }
  }, [navigate, form.state.isSubmitting, form.state.canSubmit, form.handleSubmit, fromOnboarding])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <form
        className="flex flex-col overflow-x-hidden p-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <List className="mb-8" title="Collection Purpose">
          <form.Field
            // biome-ignore lint/correctness/noChildrenProp: because library docs
            children={(field) => (
              <ListItem
                className="py-3"
                leftIcon={
                  <input
                    className="mr-[50vw] w-full placeholder:text-text-secondary"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="A tour with the cat"
                    type="text"
                    value={field.state.value}
                  />
                }
                leftIconClassName="w-full"
                withSeparator
              />
            )}
            name="title"
          />

          {!purposeIconsIsError && (
            <form.Field
              // biome-ignore lint/correctness/noChildrenProp: because library docs
              children={(field) => (
                <ListItem
                  className="relative py-2.5"
                  leftTopText={"Add Icons"}
                  onClick={purposeIconsIsLoading ? undefined : () => setIsOpen(!isOpen)}
                  rightBottomText={
                    isOpen && (
                      <div className="absolute top-3/4 right-0 flex w-full flex-wrap gap-5 rounded-3xl bg-background-secondary p-4 shadow-xl">
                        {purposeIcons.map((icon: PurposeIconsDTO[number]) => (
                          <button
                            className="flex items-center"
                            key={icon.id}
                            onClick={() => field.handleChange(icon.id)}
                            type="button"
                          >
                            <Img
                              className={cn("h-7 w-7", {
                                "filter-[invert(31%)_sepia(62%)_saturate(4056%)_hue-rotate(200deg)_brightness(103%)_contrast(112%)]":
                                  icon.id === field.state.value,
                                "filter-[invert(70%)_sepia(19%)_saturate(28%)_hue-rotate(318deg)_brightness(100%)_contrast(91%)]":
                                  icon.id !== field.state.value,
                              })}
                              src={icon.preview}
                            />
                          </button>
                        ))}
                      </div>
                    )
                  }
                  rightIcon={
                    purposeIconsIsLoading ? (
                      <Loader />
                    ) : (
                      <Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />
                    )
                  }
                  rightTopText={
                    <Img
                      className="-mr-4 filter-[invert(70%)_sepia(19%)_saturate(28%)_hue-rotate(318deg)_brightness(100%)_contrast(91%)] h-7 w-7"
                      src={purposeIcons.find((icon: PurposeIconsDTO[number]) => icon.id === field.state.value)?.preview}
                    />
                  }
                />
              )}
              name="icon"
            />
          )}
        </List>

        <List className="mb-2" title="Short description">
          <form.Field
            // biome-ignore lint/correctness/noChildrenProp: because library docs
            children={(field) => (
              <ListItem
                className="py-3"
                leftIcon={
                  <textarea
                    className="mr-[50vw] h-fit w-full resize-none placeholder:text-text-secondary"
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="I dream of traveling around Spain with my cat."
                    value={field.state.value}
                  />
                }
                leftIconClassName="w-full"
                withSeparator
              />
            )}
            name="description"
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          Keep your thoughts as concise as possible so customers can quickly get a sense of your purpose
        </div>
      </form>
    </ShowMainButton>
  )
}
