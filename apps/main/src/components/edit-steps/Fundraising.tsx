import { purposeIconsQueryOptions } from "@point/shared/api/point/purposeIcons"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { Loader } from "@point/ui/loader"
import { useForm } from "@tanstack/react-form"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import Img from "react-cool-img"
import { ShowMainButton } from "../tg-internals"

interface FundraisingStepProps {
  icon?: string
  title?: string
  description?: string

  onUpdateEmployee: (data: FormData) => Promise<void>
}

export const FundraisingStep = ({ icon, title, description, onUpdateEmployee }: FundraisingStepProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const purposeIconsQuery = useQuery(purposeIconsQueryOptions)
  const purposeIconsIsLoading = purposeIconsQuery.isLoading
  const purposeIconsIsError = purposeIconsQuery.isError
  const purposeIcons = purposeIconsQuery.data || []

  const form = useForm({
    defaultValues: {
      icon: icon || purposeIcons[0]?.id,
      title: title || "",
      description: description || "",
    },
    onSubmit: async ({ formApi, value }) => {
      const employeeFormData = new FormData()
      const updateObj = {
        purpose: {
          icon: value.icon,
          title: value.title,
          description: value.description,
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
      // TODO: jobPlace screen
      navigate({ to: "/account/my-profile/view", replace: true })
    }

    return {
      title: "Continue",
      loading: form.state.isSubmitting,
      disabled: !form.state.canSubmit || form.state.isSubmitting,
      hidden: false,
      onClick,
    }
  }, [navigate, form.state.isSubmitting, form.state.canSubmit, form.handleSubmit])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col p-4"
      >
        <List title="Collection Purpose" className="mb-8">
          <form.Field
            name="title"
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <ListItem
                className="py-3"
                leftIconClassName="w-full"
                leftIcon={
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full placeholder:text-text-secondary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                }
                withSeparator
              />
            )}
          />

          {!purposeIconsIsError && (
            <form.Field
              name="icon"
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => (
                <ListItem
                  className="relative py-2.5"
                  leftTopText={"Add Icons"}
                  rightTopText={
                    <Img
                      src={purposeIcons.find((icon) => icon.id === field.state.value)?.preview}
                      className="-mr-4 filter-[invert(70%)_sepia(19%)_saturate(28%)_hue-rotate(318deg)_brightness(100%)_contrast(91%)] h-7 w-7 "
                    />
                  }
                  onClick={purposeIconsIsLoading ? undefined : () => setIsOpen(!isOpen)}
                  rightBottomText={
                    isOpen && (
                      <div className="absolute top-3/4 right-0 flex w-full flex-wrap gap-5 rounded-3xl bg-background-secondary p-4 shadow-xl">
                        {purposeIcons.map((icon) => (
                          <div key={icon.id} className="flex items-center" onClick={() => field.handleChange(icon.id)}>
                            <Img
                              src={icon.preview}
                              className={cn("h-7 w-7", {
                                "filter-[invert(31%)_sepia(62%)_saturate(4056%)_hue-rotate(200deg)_brightness(103%)_contrast(112%)]":
                                  icon.id === field.state.value,
                                "filter-[invert(70%)_sepia(19%)_saturate(28%)_hue-rotate(318deg)_brightness(100%)_contrast(91%)]":
                                  icon.id !== field.state.value,
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  }
                  rightIcon={
                    purposeIconsIsLoading ? (
                      <Loader />
                    ) : (
                      <Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />
                    )
                  }
                />
              )}
            />
          )}
        </List>

        <List title="Short description" className="mb-2">
          <form.Field
            name="description"
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <ListItem
                className="py-3"
                leftIconClassName="w-full"
                leftIcon={
                  <input
                    type="text"
                    placeholder="Descripton"
                    className="w-full placeholder:text-text-secondary"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                }
                withSeparator
              />
            )}
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          Keep your thoughts as concise as possible so customers can quickly get a sense of your purpose
        </div>
      </form>
    </ShowMainButton>
  )
}
