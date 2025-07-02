import { AccountStep, FundraisingStep } from "@/components/edit-steps"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { useUpdateEmployeeMutation } from "@point/shared/api/point/employee"
import { purposeIconsQueryOptions } from "@point/shared/api/point/purposeIcons"
import { useUpdateUserMutation } from "@point/shared/api/point/user"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
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

    if (user.employee) {
      queryClient.ensureQueryData(purposeIconsQueryOptions)
    }
  },
  validateSearch: zodValidator(editProfileSchema),
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const search = Route.useSearch()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  const user = authQuery.data?.user
  const isUserEmployee = !!user.employee?.jobPlace

  const { mutateAsync: updateEmployee } = useUpdateEmployeeMutation(ctx.launchParams?.tgWebAppData?.hash)
  const handleUpdateEmployee = async (data: FormData) => {
    await updateEmployee(data)
  }

  const { mutateAsync: updateUser } = useUpdateUserMutation(ctx.launchParams?.tgWebAppData?.hash)
  const handleUpdateUser = async ({ showTipsLeft }: { showTipsLeft: boolean }) => {
    await updateUser({ showTipsLeft })
  }

  return (
    <>
      {search.step === "account" && (
        <AccountStep
          isUserEmployee={isUserEmployee}
          firstName={user.firstName}
          lastName={user.lastName}
          photoUrl={user.photoUrl}
          showJob={user.employee?.meta.showJob ?? null}
          showPurpose={user.employee?.meta.showPurpose ?? null}
          showTipsLeft={user.meta.showTipsLeft}
          jobPlace={user.employee?.jobPlace ?? null}
          onUpdateEmployee={handleUpdateEmployee}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {search.step === "fundraising" && (
        <FundraisingStep
          icon={user.employee?.purpose?.icon}
          title={user.employee?.purpose?.title}
          description={user.employee?.purpose?.description}
          onUpdateEmployee={handleUpdateEmployee}
        />
      )}
    </>
  )
}
