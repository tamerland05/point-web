import { ShowMainButton } from "@/components/tg-internals"
import { UserProfileHeader } from "@/components/user-profile/header"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { type UpdateEmployeeDTO, useUpdateEmployeeMutation } from "@point/shared/api/point/employee"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useForm } from "@tanstack/react-form"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useMemo } from "react"
import toast from "react-hot-toast"
import z from "zod"

const editProfileSchema = z.object({
  step: z.enum(["account", "fundraising", "jobPlace"]).catch("account"),
})

export const Route = createFileRoute("/account/my-profile/edit")({
  component: RouteComponent,
  loaderDeps: (ctx) => [ctx.search.step],
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    const userData = await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    const user = userData.user

    if (!user.employee?.jobPlace && deps[0] !== "account") {
      throw redirect({ to: "/account/my-profile/edit", search: { step: "account" }, replace: true })
    }
  },
  validateSearch: zodValidator(editProfileSchema),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const ctx = Route.useRouteContext()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  const user = authQuery.data?.user
  const isUserEmployee = !!user.employee?.jobPlace

  const { mutateAsync: updateUser } = useUpdateEmployeeMutation(ctx.launchParams?.tgWebAppData?.hash)

  const form = useForm({
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      showJob: user.employee?.meta.showJob ?? false,
      showPurpose: user.employee?.meta.showPurpose ?? false,
      showTipsLeft: true,
    },
    onSubmit: async ({ formApi, value }) => {
      let data: UpdateEmployeeDTO = {
        purpose: user.employee?.purpose ?? null,
        meta: {
          showJob: value.showJob,
          showPurpose: value.showPurpose,
        },
      }

      if (!isUserEmployee) {
        data = {
          // TODO: tips and photo and usernames
          purpose: null,
          meta: null,
        }
      }

      await updateUser(data)

      formApi.reset()
    },
  })

  const handleClickOnUnavailableFunction = () => {
    toast("Function is not available yet", { id: "unavailable-function" })
  }

  const mainButtonConfig = useMemo(() => {
    const title = !isUserEmployee ? "Save" : "Continue"
    const onClick = !isUserEmployee
      ? form.handleSubmit
      : () => navigate({ to: "/account/my-profile/edit", search: { step: "fundraising" } })
    return {
      title,
      loading: form.state.isSubmitting,
      disabled: form.state.isSubmitting || !form.state.canSubmit,
      hidden: false,
      onClick,
    }
  }, [isUserEmployee, form.state.isSubmitting, form.state.canSubmit, form.handleSubmit, navigate])

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
          photo={user.photoUrl}
          name={user.firstName}
          username={user.username}
          jobPlace={!!user.employee?.jobPlace}
          isJobPlaceHidden={true}
        />
        <button type="button" className="-mt-4 mb-3 text-center text-accent" onClick={handleClickOnUnavailableFunction}>
          Select a photo
        </button>

        <List className="mb-2">
          <ListItem
            className="py-3"
            leftTopText={user.firstName || <div className="text-text-secondary">First Name</div>}
            withSeparator
            onClick={handleClickOnUnavailableFunction}
          />
          <ListItem
            className="py-3"
            leftTopText={user.lastName || <div className="text-text-secondary">Last Name</div>}
            onClick={handleClickOnUnavailableFunction}
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          The specified data will be shown to potential customers of your establishment
        </div>

        <List className="mb-2">
          <ListItem
            className="py-2"
            leftTopText={"Telegram"}
            rightTopText={<div className="-mr-4 text-text-secondary">{user.username || "Not set"}</div>}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            onClick={handleClickOnUnavailableFunction}
            withSeparator
          />
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

          <ListItem
            className="py-3"
            leftTopText={"Show Tips Left"}
            rightTopText={<div className="text-accent">{"Yes"}</div>}
            onClick={handleClickOnUnavailableFunction}
          />
        </List>
        <div className="mb-7 px-4 text-caption-2 text-text-secondary">
          Personal information available in the user's account section
        </div>
      </form>
    </ShowMainButton>
  )
}
