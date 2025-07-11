// common types will be here

export interface Coordinates {
  longitude: number
  latitude: number
  address?: string
}

export interface PurposeOfFunding {
  icon: string
  title: string
  description: string
}

export interface JobPlace {
  id: string
  name: string
  address: string
}

export interface MenuItem {
  id: string
  establishmentId: string

  title: string
  description: string
  photo: string
  category: string

  cost: {
    amount: number
    currency: string
  }
}
