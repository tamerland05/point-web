import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { hapticFeedback, popup } from "@telegram-apps/sdk-react"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { invitationQueryOptions, useDeleteEmployeeMutation } from "@point/shared/api/point/employee"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/account/profile-type")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от Telegram, перезагрузите приложение")
    }

    await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
  },
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const deleteEmployeeMutation = useDeleteEmployeeMutation()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
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
      buttons: [
        { id: "go", text: "GO", type: "default" },
        { id: "cancel", type: "cancel" },
      ],
      message: "Are you sure you want to switch to a new account type? This action cannot be canceled",
      title: "Changing Account Type",
    })

    if (selected === "go") {
      await deleteEmployeeMutation.mutateAsync()
      navigate({ replace: true, to: "/account/profile-type-updated" })
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
      buttons: [
        { id: "go", text: "GO", type: "default" },
        { id: "cancel", type: "cancel" },
      ],
      message: "Are you sure you want to switch to a new account type? This action cannot be canceled",
      title: "Changing Account Type",
    })

    if (selected === "go") {
      if (isError) {
        navigate({ replace: true, to: "/account/access-restricted" })
        return
      }

      if (isSuccess) {
        navigate({ replace: true, search: { to: "employee" }, to: "/account/profile-type-updated" })
        return
      }
    }

    return
  }

  return (
    <div className="p-4 py-5">
      <List className="" title="profile type">
        <ListItem
          leftBottomText="Free access"
          leftIcon={<Icon className="size-10 text-transparent" name="User Circle Filled" />}
          leftTopText="User"
          onClick={handleUserClick}
          rightIcon={
            currentProfileType === "user" ? <Icon className="h-5 w-5 text-transparent" name="TickCircle" /> : undefined
          }
          withSeparator
        />

        <ListItem
          leftBottomText="Access by invitation"
          leftIcon={<Icon className="size-10 text-transparent" name="Users Circle Filled" />}
          leftTopText="Employee"
          onClick={handleEmployeeClick}
          rightIcon={
            currentProfileType === "employee" ? (
              <Icon className="h-5 w-5 text-transparent" name="TickCircle" />
            ) : undefined
          }
          withSeparator
        />
      </List>
    </div>
  )
}
