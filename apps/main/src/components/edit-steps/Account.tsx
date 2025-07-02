import type { JobPlace } from "@point/shared/types/index"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useMemo, useRef, useState } from "react"
import { ShowMainButton } from "../tg-internals"
import { UserProfileHeader } from "../user-profile/header"

interface AccountStepProps {
  isUserEmployee: boolean

  photoUrl: string | null
  firstName: string | null
  lastName: string | null
  showTipsLeft: boolean
  showJob: boolean | null
  showPurpose: boolean | null

  jobPlace: JobPlace | null

  onUpdateEmployee: (data: FormData) => Promise<void>
  onUpdateUser: ({ showTipsLeft }: { showTipsLeft: boolean }) => Promise<void>
}

export const AccountStep = ({
  isUserEmployee,
  photoUrl,
  firstName,
  lastName,
  showJob,
  showPurpose,
  showTipsLeft,

  jobPlace,

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

      employeeFormData.append("update_in", JSON.stringify(updateObj))

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
      navigate({ to: "/account/my-profile/view" })
    }

    const submitFromEmployee = async () => {
      await form.handleSubmit()
      navigate({ to: "/account/my-profile/edit", search: { step: "fundraising" } })
    }

    const onClick = isUserEmployee ? submitFromEmployee : submitFromUser

    return {
      title,
      loading: form.state.isSubmitting,
      disabled: !form.state.canSubmit || form.state.isSubmitting,
      hidden: false,
      onClick,
    }
  }, [isUserEmployee, navigate, form.state.isSubmitting, form.state.canSubmit, form.handleSubmit])

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
        <UserProfileHeader
          photo={image ?? photoUrl}
          name={firstName}
          username={null}
          jobPlace={!!jobPlace}
          isJobPlaceHidden={true}
        />

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

        <List className="mt-3 mb-2">
          {isUserEmployee ? (
            <form.Field
              name="firstName"
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={
                    <input
                      type="text"
                      placeholder="First Name"
                      className="placeholder:text-text-secondary"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  }
                  withSeparator
                />
              )}
            />
          ) : (
            <ListItem
              className="py-3"
              leftTopText={lastName || <div className="text-text-secondary">Last Name</div>}
              withSeparator
            />
          )}
          {isUserEmployee ? (
            <form.Field
              name="lastName"
              // biome-ignore lint/correctness/noChildrenProp: <explanation>
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={
                    <input
                      type="text"
                      placeholder="First Name"
                      className="placeholder:text-text-secondary"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  }
                />
              )}
            />
          ) : (
            <ListItem
              className="py-3"
              leftTopText={lastName || <div className="text-text-secondary">Last Name</div>}
              withSeparator
            />
          )}
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          The specified data will be shown to potential customers of your establishment
        </div>

        <List className="mb-2">
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
