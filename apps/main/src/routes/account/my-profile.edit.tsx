import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import z from "zod"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { invitationQueryOptions, useUpdateEmployeeMutation } from "@point/shared/api/point/employee"
import { purposeIconsQueryOptions } from "@point/shared/api/point/purposeIcons"
import { useUpdateUserMutation } from "@point/shared/api/point/user"

import { AccountStep, FundraisingStep, JobPlaceStep } from "@/components/edit-steps"
import { ConnectWalletStep } from "@/components/edit-steps/ConnectWallet"

const editProfileSchema = z.object({
  fromOnboarding: z.boolean().optional().default(false),
  step: z.enum(["account", "fundraising", "job-place", "connect-wallet"]).catch("account"),
})

export const Route = createFileRoute("/account/my-profile/edit")({
  component: RouteComponent,
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    const userData = await queryClient.ensureQueryData(
      authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw)
    )
    const user = userData.user

    const [step, fromOnboarding] = deps as [string, boolean]

    if (!user.employee && step !== "account" && !fromOnboarding) {
      throw redirect({ replace: true, search: { step: "account" }, to: "/account/my-profile/edit" })
    }

    if (user.employee) {
      queryClient.ensureQueryData(purposeIconsQueryOptions)
    }
  },
  loaderDeps: (ctx) => [ctx.search.step, ctx.search.fromOnboarding] as [string, boolean],
  validateSearch: zodValidator(editProfileSchema),
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const search = Route.useSearch()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
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
          firstName={user.employee?.firstName || user.name || ""}
          fromOnboarding={search.fromOnboarding}
          isEmptyEmployee={!user.employee}
          isUserEmployee={isUserEmployee}
          lastName={user.employee?.lastName || ""}
          onUpdateEmployee={handleUpdateEmployee}
          onUpdateUser={handleUpdateUser}
          photo={user.employee ? user.employee.photo || "" : user.photoUrl || ""}
          showJob={user.employee?.meta.showJob}
          showPurpose={user.employee?.meta.showPurpose}
          showTipsLeft={user.meta.showTipsLeft}
        />
      )}

      {search.step === "fundraising" && (
        <FundraisingStep
          description={user.employee?.purpose?.description}
          fromOnboarding={search.fromOnboarding}
          onUpdateEmployee={handleUpdateEmployee}
          title={user.employee?.purpose?.title}
        />
      )}

      {search.step === "job-place" && <JobPlaceStep jobPlace={user.employee?.jobPlace} />}

      {search.step === "connect-wallet" && <ConnectWalletStep />}
    </>
  )
}
