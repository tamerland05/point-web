import { getDefaultStore } from "jotai"

import posAxiosInstance from "@/api/point/posAxios"
import { posEstablishmentIdAtom, posLinkIdAtom, posSessionIdAtom } from "@/atoms/posTable"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface PosStartSessionResponse {
  sessionId: string
  linkId: string
  establishmentId: string
}

/** Ensures POS session metadata in jotai; auth goes via regular JWT. */
export async function ensurePosSession(linkId: string, initDataRaw: string): Promise<void> {
  const store = getDefaultStore()
  await ensureAccessTokenIsAvailable()

  const { data } = await posAxiosInstance.post<PosStartSessionResponse>(`/point/pos/links/${linkId}/sessions`, {
    init_data_raw: initDataRaw,
    initDataRaw,
  })
  store.set(posSessionIdAtom, data.sessionId)
  store.set(posLinkIdAtom, data.linkId || linkId)
  store.set(posEstablishmentIdAtom, data.establishmentId)
}
