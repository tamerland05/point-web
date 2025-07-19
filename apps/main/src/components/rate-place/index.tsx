import { useEstablishmentRatingMutation } from "@point/shared/api/point/establishments"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { hapticFeedback, openInvoice } from "@telegram-apps/sdk-react"
import { memo, useCallback, useEffect, useState } from "react"
import Img from "react-cool-img"
import toast from "react-hot-toast"
import { Rating } from "react-simple-star-rating"

export const RatePlace = memo(
  ({
    id,
    image,
    title,
    establishmentType,
    currentRating,
  }: { id: string; image: string; title: string; establishmentType: string; currentRating?: number }) => {
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

          queryClient.invalidateQueries({ queryKey: ["establishment", id] })

          navigate({ to: "/rating-left", search: { placeId: id } })
        } catch (error) {
          setRatingSelected(false)
          console.error(error)
        }
      },
      [queryClient, navigate, createInvoice, id, isPending]
    )

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      setRating(currentRating || 1)
      setRatingSelected(false)
    }, [id])

    return (
      <div className="mt-8 mb-60">
        <div className="mx-4 mb-1 text-caption-3 text-text-secondary uppercase">Establishment rating</div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-background-secondary p-4">
          <Img
            placeholder="/img-ph.svg"
            error="/img-ph.svg"
            src={image}
            className="mb-3 size-24 rounded-full border border-background"
          />
          <div className="mb-2 text-center text-title-1">{title}</div>
          <div className="mb-5 text-center text-caption-1 text-text-secondary">{establishmentType}</div>

          <Rating
            fillColor="#007AFF"
            emptyColor="rgba(0,122,255,0.200)"
            onClick={handleRating}
            initialValue={rating}
            readonly={isPending || ratingSelected}
            transition
          />
        </div>
      </div>
    )
  }
)

RatePlace.displayName = "RatePlace"
