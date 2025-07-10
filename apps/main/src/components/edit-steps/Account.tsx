import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { ShowMainButton } from "../tg-internals"
import { UserProfileHeader } from "../user-profile/header"

interface AccountStepProps {
  isUserEmployee: boolean
  isEmptyEmployee: boolean

  photo: string
  firstName: string
  lastName: string
  showJob: boolean | undefined
  showPurpose: boolean | undefined
  showTipsLeft: boolean

  fromOnboarding: boolean

  onUpdateEmployee: (data: FormData) => Promise<void>
  onUpdateUser: ({ showTipsLeft }: { showTipsLeft: boolean }) => Promise<void>
}

export const AccountStep = ({
  isUserEmployee,
  isEmptyEmployee,
  photo,
  firstName,
  lastName,
  showJob,
  showPurpose,
  showTipsLeft,
  fromOnboarding,
  onUpdateEmployee,
  onUpdateUser,
}: AccountStepProps) => {
  const navigate = useNavigate()

  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
  }

  const image = file ? URL.createObjectURL(file) : null

  const form = useForm({
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      showJob: showJob ?? false,
      showPurpose: showPurpose ?? false,
      showTipsLeft: showTipsLeft,
    },
    onSubmit: async ({ formApi, value }) => {
      const employeeFormData = new FormData()
      const updateObj = {
        firstName: value.firstName,
        lastName: value.lastName,
        meta: { showJob: value.showJob, showPurpose: value.showPurpose },
      }

      if (isUserEmployee && !file && !photo) {
        toast.error("Please select a photo")
        return
      }

      const fieldName = isEmptyEmployee ? "create_in" : "update_in"

      employeeFormData.append(fieldName, JSON.stringify(updateObj))

      if (isUserEmployee) {
        if (file) {
          employeeFormData.append("file", file)
          employeeFormData.append("type", file.type)
        }

        await onUpdateEmployee(employeeFormData)
      }

      await onUpdateUser({ showTipsLeft: value.showTipsLeft })

      formApi.reset()
    },
  })

  const mainButtonConfig = useMemo(() => {
    const title = !isUserEmployee ? "Save" : "Continue"
    const submitFromUser = async () => {
      await form.handleSubmit()
      navigate({ to: "/account/my-profile/view", replace: true })
    }

    const submitFromEmployee = async () => {
      await form.handleSubmit()
      navigate({ to: "/account/my-profile/edit", search: { step: "fundraising", fromOnboarding } })
    }

    const onClick = isUserEmployee ? submitFromEmployee : submitFromUser

    return {
      title,
      loading: form.state.isSubmitting,
      disabled: !form.state.canSubmit || form.state.isSubmitting || !form.state.isValid,
      hidden: false,
      onClick,
    }
  }, [
    isUserEmployee,
    navigate,
    form.state.isSubmitting,
    form.state.canSubmit,
    form.handleSubmit,
    form.state.isValid,
    fromOnboarding,
  ])

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
        <UserProfileHeader photo={image ?? photo} name={firstName} username={null} isJobPlaceHidden={true} />

        <input type="file" onChange={handleChange} accept="image/*" className="hidden" ref={fileInputRef} />
        {isUserEmployee && (
          <button
            type="button"
            className="-mt-4 text-center text-accent"
            disabled={form.state.isSubmitting}
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            Select a photo
          </button>
        )}

        {isUserEmployee && (
          <>
            <List className="mt-3 mb-2">
              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) => (value.length > 32 ? "First Name is too long" : undefined),
                }}
                // biome-ignore lint/correctness/noChildrenProp: <explanation>
                children={(field) => (
                  <>
                    <ListItem
                      className={cn("py-3")}
                      leftIconClassName="w-full"
                      leftIcon={
                        <input
                          type="text"
                          placeholder="First Name"
                          className="mr-[50vw] w-full placeholder:text-text-secondary"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      }
                      withSeparator
                    />
                  </>
                )}
              />

              <form.Field
                name="lastName"
                validators={{
                  onChange: ({ value }) => (value.length > 32 ? "Last Name is too long" : undefined),
                }}
                // biome-ignore lint/correctness/noChildrenProp: <explanation>
                children={(field) => (
                  <ListItem
                    className="py-3"
                    leftIconClassName="w-full"
                    leftIcon={
                      <input
                        type="text"
                        placeholder="First Name"
                        className="mr-[50vw] w-full placeholder:text-text-secondary"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    }
                  />
                )}
              />
            </List>
            <div className="mb-4 px-4 text-caption-2 text-text-secondary">
              The specified data will be shown to potential customers of your establishment
            </div>
          </>
        )}

        <List className="mt-3 mb-2">
          {isUserEmployee && (
            <form.Field
              name="showJob"
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={"Show place of work"}
                  rightTopText={<div className="text-accent">{field.state.value ? "Yes" : "No"}</div>}
                  onClick={() => field.handleChange(!field.state.value)}
                  withSeparator
                />
              )}
            />
          )}

          {isUserEmployee && (
            <form.Field
              name="showPurpose"
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={"Show purpose of Fundraising"}
                  rightTopText={<div className="text-accent">{field.state.value ? "Yes" : "No"}</div>}
                  onClick={() => field.handleChange(!field.state.value)}
                  withSeparator
                />
              )}
            />
          )}

          <form.Field
            name="showTipsLeft"
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <ListItem
                className="py-3"
                leftTopText={"Show Tips Left"}
                rightTopText={<div className="text-accent">{field.state.value ? "Yes" : "No"}</div>}
                onClick={() => field.handleChange(!field.state.value)}
              />
            )}
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          Personal information available in the user's account section
        </div>

        {/* <button type="submit" className="mt-4">
						Save
					</button> */}
      </form>
    </ShowMainButton>
  )
}
