import { tipReceiversQueryOptions } from "@point/shared/api/point/tips"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { Input } from "@point/ui/input"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"
import Img from "react-cool-img"
import toast from "react-hot-toast"

export const Route = createFileRoute("/tips/$placeId/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { placeId } = Route.useParams()
  const navigate = Route.useNavigate()

  const [search, setSearch] = useState("")

  const receiversQuery = useSuspenseQuery(tipReceiversQueryOptions(placeId))
  const receivers = receiversQuery.data

  const filteredReceivers = useMemo(() => {
    return receivers.employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.profession.toLowerCase().includes(search.toLowerCase())
    )
  }, [receivers, search])

  const handleProjectBankClick = useCallback(() => {
    toast("TODO: CONNECT WALLET HERE")
    navigate({ to: "/tips/$placeId/info", search: { placeWallet: placeId } })
  }, [navigate, placeId])

  const handleEmployeeClick = useCallback(
    (id: string) => {
      toast("TODO: CONNECT WALLET HERE")
      navigate({ to: "/tips/$placeId/info", search: { id } })
    },
    [navigate]
  )

  return (
    <>
      <Input
        placeholder="Search"
        className={cn("transition-all duration-300", search ? "w-full" : "w-1/4")}
        containerClassName="justify-center mb-4"
        value={search}
        onChange={setSearch}
      />

      <List title="Staff list">
        {!search && (
          <ListItem
            leftIcon={<Icon name="Frame 948" className="h-10 w-10 text-transparent" />}
            leftTopText="Project Bank"
            leftBottomText="All Staff"
            withSeparator
            onClick={handleProjectBankClick}
          />
        )}

        {filteredReceivers.map((employee) => (
          <ListItem
            key={employee.id}
            leftIcon={<Img src={employee.icon} className="h-10 w-10 rounded-full" />}
            leftTopText={employee.name}
            leftBottomText={<div className="font-normal capitalize">{employee.profession}</div>}
            withSeparator
            onClick={() => handleEmployeeClick(employee.id)}
          />
        ))}
      </List>
    </>
  )
}
