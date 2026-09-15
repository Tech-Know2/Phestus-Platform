'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Listing } from '@/payload-types'
import { getUser } from '../ops/accounts';

export type CreateListingDTO = {
    title: string
    slug: string
    shortDescription?: string
    description?: Listing['description']
    icon?: string | Media
    banner?: string | Media
    screenshots?: {
        image: string | Media
    }[]
    category?: string
    tags?: {
        tag: string
    }[]
    repositoryUrl?: string
    documentationUrl?: string
    supportUrl?: string
    metaTitle?: string
    metaDescription?: string
    metaImage?: string | Media
}

export async function findAllListings(): Promise<Listing[]> {
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'listings',
        limit: 100,
    })

    return result.docs
}

export async function findListingBySlug(slug: string): Promise<Listing> {
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'listings',
        where: {
            slug: { equals: slug }
        },
        limit: 1,
    })

    return result.docs[0]
}

export async function createListing(data: CreateListingDTO, packageId: string): Promise<void> {
    const payload = await getPayload({ config })
    const user = await getUser()

    payload.create({
        collection: 'listings',
        data: {
            ...data,
            package: packageId,
            publisher: publisherId,
            status: 'draft',
            featured: false,
            verified: false,
            official: false,
        },
        user,
    })
}