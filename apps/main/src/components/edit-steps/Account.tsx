import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"

import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

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
        toast.error("Выберите фото")
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
    const title = !isUserEmployee ? "Сохранить" : "Продолжить"
    const submitFromUser = async () => {
      await form.handleSubmit()
      void navigate({ replace: true, to: "/account/my-profile/view" })
    }

    const submitFromEmployee = async () => {
      await form.handleSubmit()
      void navigate({ search: { fromOnboarding, step: "fundraising" }, to: "/account/my-profile/edit" })
    }

    const onClick = isUserEmployee ? submitFromEmployee : submitFromUser

    return {
      disabled: !form.state.canSubmit || form.state.isSubmitting || !form.state.isValid,
      hidden: false,
      loading: form.state.isSubmitting,
      onClick,
      title,
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
        className="flex flex-col overflow-x-hidden p-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <UserProfileHeader isJobPlaceHidden={true} name={firstName} photo={image ?? photo} username={null} />

        <input accept="image/*" className="hidden" onChange={handleChange} ref={fileInputRef} type="file" />
        {isUserEmployee && (
          <button
            className="-mt-4 text-center text-accent"
            disabled={form.state.isSubmitting}
            onClick={() => {
              fileInputRef.current?.click()
            }}
            type="button"
          >
            Выбрать фото
          </button>
        )}

        {isUserEmployee && (
          <>
            <List className="mt-3 mb-2">
              <form.Field
                // biome-ignore lint/correctness/noChildrenProp: because library docs
                children={(field) => (
                  <>
                    <ListItem
                      className={cn("py-3")}
                      leftIcon={
                        <input
                          className="mr-[50vw] w-full placeholder:text-text-secondary"
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Имя"
                          type="text"
                          value={field.state.value}
                        />
                      }
                      leftIconClassName="w-full"
                      withSeparator
                    />
                  </>
                )}
                name="firstName"
                validators={{
                  onChange: ({ value }) => (value.length > 32 ? "Имя слишком длинное" : undefined),
                }}
              />

              <form.Field
                // biome-ignore lint/correctness/noChildrenProp: because library docs
                children={(field) => (
                  <ListItem
                    className="py-3"
                    leftIcon={
                      <input
                        className="mr-[50vw] w-full placeholder:text-text-secondary"
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Фамилия"
                        type="text"
                        value={field.state.value}
                      />
                    }
                    leftIconClassName="w-full"
                  />
                )}
                name="lastName"
                validators={{
                  onChange: ({ value }) => (value.length > 32 ? "Фамилия слишком длинная" : undefined),
                }}
              />
            </List>
            <div className="mb-4 px-4 text-caption-2 text-text-secondary">
              Указанные данные будут показаны потенциальным клиентам вашего заведения
            </div>
          </>
        )}

        <List className="mt-3 mb-2">
          {isUserEmployee && (
            <form.Field
              // biome-ignore lint/correctness/noChildrenProp: because library docs
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={"Показывать место работы"}
                  onClick={() => field.handleChange(!field.state.value)}
                  rightTopText={<div className="text-accent">{field.state.value ? "Да" : "Нет"}</div>}
                  withSeparator
                />
              )}
              name="showJob"
            />
          )}

          {isUserEmployee && (
            <form.Field
              // biome-ignore lint/correctness/noChildrenProp: because library docs
              children={(field) => (
                <ListItem
                  className="py-3"
                  leftTopText={"Показывать цель сбора"}
                  onClick={() => field.handleChange(!field.state.value)}
                  rightTopText={<div className="text-accent">{field.state.value ? "Да" : "Нет"}</div>}
                  withSeparator
                />
              )}
              name="showPurpose"
            />
          )}

          <form.Field
            // biome-ignore lint/correctness/noChildrenProp: because library docs
            children={(field) => (
              <ListItem
                className="py-3"
                leftTopText={"Показывать остаток чаевых"}
                onClick={() => field.handleChange(!field.state.value)}
                rightTopText={<div className="text-accent">{field.state.value ? "Да" : "Нет"}</div>}
              />
            )}
            name="showTipsLeft"
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          Персональная информация, доступная в разделе аккаунта
        </div>

        {/* <button type="submit" className="mt-4">
						Save
					</button> */}
      </form>
    </ShowMainButton>
  )
}
