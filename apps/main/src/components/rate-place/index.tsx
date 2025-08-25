import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { hapticFeedback, openInvoice } from "@telegram-apps/sdk-react"
import { memo, useCallback, useEffect, useState } from "react"
import Img from "react-cool-img"
import toast from "react-hot-toast"
import { Rating } from "react-simple-star-rating"

import { useEstablishmentRatingMutation } from "@point/shared/api/point/establishments"
import { sleep } from "@point/shared/utils/sleep"

// TODO: when back will be updated and will send user placed rating, add currentRating to the props and set stars yellow, not blue
export const RatePlace = memo(
  ({
    id,
    image,
    title,
    establishmentType,
    userRating,
  }: {
    id: string
    image: string
    title: string
    establishmentType: string
    userRating: number | null
  }) => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()
    const [rating, setRating] = useState(1)
    const [ratingSelected, setRatingSelected] = useState(false)

    const { mutateAsync: createInvoice, isPending } = useEstablishmentRatingMutation(id)

    // Catch Rating value
    const handleRating = useCallback(
      async (rate: number) => {
        if (isPending) return

        try {
          hapticFeedback.impactOccurred("medium")
          setRating(rate)
          setRatingSelected(true)

          const toastId = toast.loading("Generating invoice...")
          const invoiceUrl = await createInvoice(rate)
          toast.remove(toastId)

          const invoiceResult = await openInvoice(invoiceUrl, "url")

          if (invoiceResult !== "paid") {
            toast.error("Invoice not paid")
            throw new Error("Invoice not paid")
          }

          await sleep(1500)
          queryClient.invalidateQueries({ queryKey: ["establishment", id] })

          void navigate({ search: { placeId: id }, to: "/rating-left" })
        } catch (error) {
          setRatingSelected(false)
          console.error(error)
        }
      },
      [queryClient, navigate, createInvoice, id, isPending]
    )

    // biome-ignore lint/correctness/useExhaustiveDependencies: we need to update rating when new place is selected
    useEffect(() => {
      setRating(userRating || 1)
      setRatingSelected(false)
    }, [id])

    return (
      <div className="my-8">
        <div className="mx-4 mb-1 text-caption-3 text-text-secondary uppercase">Establishment rating</div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-background-secondary p-4">
          <Img
            className="mb-3 size-24 rounded-full border border-background"
            error="/img-ph.svg"
            placeholder="/img-ph.svg"
            src={image}
          />
          <div className="mb-2 text-center text-title-1">{title}</div>
          <div className="mb-5 text-center text-caption-1 text-text-secondary">{establishmentType}</div>

          <Rating
            emptyColor={userRating ? undefined : "rgba(0,122,255,0.200)"}
            fillColor={userRating ? undefined : "#007AFF"}
            initialValue={rating}
            onClick={handleRating}
            readonly={isPending || ratingSelected}
            transition
          />
        </div>
      </div>
    )
  }
)

RatePlace.displayName = "RatePlace"
