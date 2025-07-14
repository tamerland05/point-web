import { authQueryOptions } from "@point/shared/api/point/auth"
import { invitationQueryOptions, useDeleteEmployeeMutation } from "@point/shared/api/point/employee"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { hapticFeedback, popup } from "@telegram-apps/sdk-react"

export const Route = createFileRoute("/account/profile-type")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от Telegram, перезагрузите приложение")
    }

    await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
  },
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const deleteEmployeeMutation = useDeleteEmployeeMutation()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  const user = authQuery.data?.user

  const invitationQuery = useQuery(invitationQueryOptions)
  const { isError, isSuccess } = invitationQuery

  const currentProfileType = user.employee ? "employee" : "user"

  const handleUserClick = async () => {
    hapticFeedback.impactOccurred("light")
    if (currentProfileType === "user") {
      router.history.back()
      return
    }

    const selected = await popup.show({
      title: "Changing Account Type",
      message: "Are you sure you want to switch to a new account type? This action cannot be canceled",
      buttons: [
        { type: "default", text: "GO", id: "go" },
        { type: "cancel", id: "cancel" },
      ],
    })

    if (selected === "go") {
      await deleteEmployeeMutation.mutateAsync()
      navigate({ to: "/account/profile-type-updated", replace: true })
    }

    return
  }

  const handleEmployeeClick = async () => {
    hapticFeedback.impactOccurred("light")
    if (currentProfileType === "employee") {
      router.history.back()
      return
    }

    const selected = await popup.show({
      title: "Changing Account Type",
      message: "Are you sure you want to switch to a new account type? This action cannot be canceled",
      buttons: [
        { type: "default", text: "GO", id: "go" },
        { type: "cancel", id: "cancel" },
      ],
    })

    if (selected === "go") {
      if (isError) {
        navigate({ to: "/account/access-restricted", replace: true })
        return
      }

      if (isSuccess) {
        navigate({ to: "/account/profile-type-updated", search: { to: "employee" }, replace: true })
        return
      }
    }

    return
  }

  return (
    <div className="p-4 py-5">
      <List className="" title="profile type">
        <ListItem
          leftTopText="User"
          leftBottomText="Free access"
          leftIcon={<Icon className="size-10 text-transparent" name="User Circle Filled" />}
          rightIcon={
            currentProfileType === "user" ? <Icon name="TickCircle" className="h-5 w-5 text-transparent" /> : undefined
          }
          withSeparator
          onClick={handleUserClick}
        />

        <ListItem
          leftTopText="Employee"
          leftBottomText="Access by invitation"
          leftIcon={<Icon className="size-10 text-transparent" name="Users Circle Filled" />}
          rightIcon={
            currentProfileType === "employee" ? (
              <Icon name="TickCircle" className="h-5 w-5 text-transparent" />
            ) : undefined
          }
          withSeparator
          onClick={handleEmployeeClick}
        />
      </List>
    </div>
  )
}
