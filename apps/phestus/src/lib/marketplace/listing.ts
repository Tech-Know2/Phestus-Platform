'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Listing, Media } from '@/payload-types'

import { getUser } from '../ops/accounts'

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
        where: {
            status: {
                equals: 'published',
            },
        },
        sort: '-createdAt',
    })

    return result.docs
}

export async function findListingBySlug(
    slug: string,
): Promise<Listing | null> {
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'listings',
        where: {
            and: [
                {
                    slug: {
                        equals: slug,
                    },
                },
                {
                    status: {
                        equals: 'published',
                    },
                },
            ],
        },
        limit: 1,
    })

    return result.docs[0] ?? null
}

export async function createListing(
    data: CreateListingDTO,
    packageId: string,
    publisherId: string,
): Promise<Listing> {
    const payload = await getPayload({ config })
    const user = await getUser()

    const listing = await payload.create({
        collection: 'listings',
        data: {
            ...data,
            package: Number(packageId),
            publisher: Number(publisherId),
            status: 'draft',
            featured: false,
            verified: false,
            official: false,
        },
        user,
    })

    return listing
}