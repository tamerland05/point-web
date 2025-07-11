import { AccountStep, FundraisingStep, JobPlaceStep } from "@/components/edit-steps"
import { ConnectWalletStep } from "@/components/edit-steps/ConnectWallet"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { invitationQueryOptions, useUpdateEmployeeMutation } from "@point/shared/api/point/employee"
import { purposeIconsQueryOptions } from "@point/shared/api/point/purposeIcons"
import { useUpdateUserMutation } from "@point/shared/api/point/user"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import z from "zod"

const editProfileSchema = z.object({
  step: z.enum(["account", "fundraising", "job-place", "connect-wallet"]).catch("account"),
  fromOnboarding: z.boolean().optional().default(false),
})

export const Route = createFileRoute("/account/my-profile/edit")({
  component: RouteComponent,
  loaderDeps: (ctx) => [ctx.search.step, ctx.search.fromOnboarding],
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    const userData = await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    const user = userData.user

    const step = deps[0]
    const fromOnboarding = deps[1]

    if (!user.employee && step !== "account" && !fromOnboarding) {
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

  const invitationQuery = useQuery(invitationQueryOptions)
  const { isSuccess: hasInvitation } = invitationQuery

  const isUserEmployee = !!user.employee?.jobPlace || hasInvitation

  const { mutateAsync: updateEmployee } = useUpdateEmployeeMutation(
    ctx.launchParams?.tgWebAppData?.hash,
    !user.employee
  )
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
          isEmptyEmployee={!user.employee}
          firstName={user.employee?.firstName || user.name || ""}
          lastName={user.employee?.lastName || ""}
          photo={user.employee?.photo || user.photoUrl || ""}
          showJob={user.employee?.meta.showJob}
          showPurpose={user.employee?.meta.showPurpose}
          showTipsLeft={user.meta.showTipsLeft}
          fromOnboarding={search.fromOnboarding}
          onUpdateEmployee={handleUpdateEmployee}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {search.step === "fundraising" && (
        <FundraisingStep
          title={user.employee?.purpose?.title}
          description={user.employee?.purpose?.description}
          onUpdateEmployee={handleUpdateEmployee}
          fromOnboarding={search.fromOnboarding}
        />
      )}

      {search.step === "job-place" && <JobPlaceStep jobPlace={user.employee?.jobPlace} />}

      {search.step === "connect-wallet" && <ConnectWalletStep />}
    </>
  )
}
