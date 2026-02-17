import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useCallback, useMemo, useState } from "react"
import Img from "react-cool-img"

import { tipReceiversQueryOptions } from "@point/shared/api/point/tips"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { Input } from "@point/ui/input"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/tips/$placeId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const address = useTonAddress()
  const [tc] = useTonConnectUI()
  const { placeId } = Route.useParams()
  const navigate = Route.useNavigate()

  const [search, setSearch] = useState("")

  const receiversQuery = useSuspenseQuery(tipReceiversQueryOptions(placeId))
  const receivers = receiversQuery.data

  const filteredReceivers = useMemo(() => {
    return receivers.employees.filter(
      (employee: { id: string; name: string; profession: string; photo: string }) =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.profession.toLowerCase().includes(search.toLowerCase())
    )
  }, [receivers, search])

  const handleProjectBankClick = useCallback(() => {
    if (!address) {
      tc.modal.open()

      return
    }
    navigate({ search: { placeWallet: placeId }, to: "/tips/$placeId/info" })
  }, [navigate, placeId, address, tc.modal.open])

  const handleEmployeeClick = useCallback(
    (id: string) => {
      if (!address) {
        tc.modal.open()

        return
      }
      navigate({ search: { id }, to: "/tips/$placeId/info" })
    },
    [navigate, address, tc.modal.open]
  )

  return (
    <>
      <Input
        className={cn("transition-all duration-300", search ? "w-full" : "w-1/4")}
        containerClassName="justify-center mb-4"
        onChange={setSearch}
        placeholder="Search"
        value={search}
      />

      <List title="Staff list">
        {!search && (
          <ListItem
            leftBottomText="All Staff"
            leftIcon={<Icon className="h-10 w-10 text-transparent" name="Frame 948" />}
            leftTopText="Project Bank"
            onClick={handleProjectBankClick}
            withSeparator
          />
        )}

        {filteredReceivers.map((employee: { id: string; name: string; profession: string; photo: string }) => (
          <ListItem
            key={employee.id}
            leftBottomText={<div className="font-normal capitalize">{employee.profession}</div>}
            leftIcon={
              <Img
                alt={employee.name}
                className="h-10 w-10 rounded-full"
                error="/user-ph.svg"
                placeholder="/user-ph.svg"
                src={employee.photo}
              />
            }
            leftTopText={employee.name}
            onClick={() => handleEmployeeClick(employee.id)}
            withSeparator
          />
        ))}
      </List>
    </>
  )
}
