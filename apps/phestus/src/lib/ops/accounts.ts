'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies, headers as getHeaders } from 'next/headers'
import { cache } from 'react'
import { Account } from '@/payload-types'

export type AccountData = {
    email: string
    password: string
    firstName: string
    lastName: string
    username: string
    displayName?: string
    website?: string
    phone?: string
    accountType: 'personal' | 'seller'
    company?: string
}

export type Result = {
    exp?: number
    token?: string
    account?: Account
}

export interface Response {
    success: boolean
    error?: string
}

interface LoginParams {
    email: string
    password: string
}

interface ResetPasswordParams {
    token: string
    password: string
}

interface UpdateParams {
    email: string
    firstName: string
    lastName: string
    username: string
    displayName?: string
    website?: string
    phone?: string
    company?: string
}

export async function createAccount(
    accountData: AccountData,
): Promise<Response> {
    const payload = await getPayload({ config })

    try {
        const existingAccount = await payload.find({
            collection: 'accounts',
            where: {
                email: {
                    equals: accountData.email,
                },
            },
            limit: 1,
        })

        if (existingAccount.totalDocs > 0) {
            return {
                success: false,
                error: 'An account with this email already exists',
            }
        }

        const existingUsername = await payload.find({
            collection: 'accounts',
            where: {
                username: {
                    equals: accountData.username,
                },
            },
            limit: 1,
        })

        if (existingUsername.totalDocs > 0) {
            return {
                success: false,
                error: 'That username is already taken',
            }
        }

        await payload.create({
            collection: 'accounts',
            data: {
                firstName: accountData.firstName,
                lastName: accountData.lastName,
                username: accountData.username,
                displayName: accountData.displayName,
                email: accountData.email,
                website: accountData.website,
                phone: accountData.phone,
                company: accountData.company,
                password: accountData.password,
                accountType: accountData.accountType,
                isSeller: accountData.accountType === 'seller',
                status: 'active',
            },
        })

        return {
            success: true,
        }
    } catch (e) {
        console.error('Account Creation Error:', e)

        return {
            success: false,
            error: 'There was a problem creating the account',
        }
    }
}

export async function login({
    email,
    password,
}: LoginParams): Promise<Response> {
    const payload = await getPayload({ config })

    try {
        const result = await payload.login({
            collection: 'accounts',
            data: {
                email,
                password,
            },
        })

        if (!result.token) {
            return {
                success: false,
                error: 'Invalid email or password',
            }
        }

        const cookieStore = await cookies()

        cookieStore.set('payload-token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return {
            success: true,
        }
    } catch (e) {
        console.error('Login Error:', e)

        return {
            success: false,
            error: 'An error occurred during login',
        }
    }
}

export async function logout(): Promise<Response> {
    try {
        const cookieStore = await cookies()

        cookieStore.delete('payload-token')

        return {
            success: true,
        }
    } catch (e) {
        console.error('Logout Error:', e)

        return {
            success: false,
            error: 'An error occurred during logout',
        }
    }
}

export const getUser = cache(async (): Promise<Account | null> => {
    try {
        const headers = await getHeaders()
        const payload = await getPayload({ config })

        const { user } = await payload.auth({
            headers,
        })

        if (user?.collection === 'accounts') {
            return user as Account
        }

        return null
    } catch (e) {
        console.error('Get Account Error:', e)

        return null
    }
})

export async function ForgotPassword({
    email,
}: {
    email: string
}): Promise<Response> {
    const payload = await getPayload({ config })

    try {
        await payload.forgotPassword({
            collection: 'accounts',
            data: {
                email,
            },
        })

        return {
            success: true,
        }
    } catch (e) {
        console.error('Forgot Password Error:', e)

        return {
            success: false,
            error: 'There was a problem requesting a password reset',
        }
    }
}

export async function ResetPassword({
    token,
    password,
}: ResetPasswordParams): Promise<Response> {
    const payload = await getPayload({ config })

    try {
        await payload.resetPassword({
            collection: 'accounts',
            data: {
                token,
                password,
            },
            overrideAccess: true,
        })

        return {
            success: true,
        }
    } catch (e) {
        console.error('Reset Password Error:', e)

        return {
            success: false,
            error: 'There was a problem resetting your password',
        }
    }
}

export async function update({
    email,
    firstName,
    lastName,
    username,
    displayName,
    website,
    phone,
    company,
}: UpdateParams): Promise<Response> {
    const payload = await getPayload({ config })
    const user = await getUser()

    if (!user) {
        return {
            success: false,
            error: 'You must be logged in to update your account',
        }
    }

    try {
        const existingEmail = await payload.find({
            collection: 'accounts',
            where: {
                and: [
                    {
                        email: {
                            equals: email,
                        },
                    },
                    {
                        id: {
                            not_equals: user.id,
                        },
                    },
                ],
            },
            limit: 1,
        })

        if (existingEmail.totalDocs > 0) {
            return {
                success: false,
                error: 'That email is already in use',
            }
        }

        const existingUsername = await payload.find({
            collection: 'accounts',
            where: {
                and: [
                    {
                        username: {
                            equals: username,
                        },
                    },
                    {
                        id: {
                            not_equals: user.id,
                        },
                    },
                ],
            },
            limit: 1,
        })

        if (existingUsername.totalDocs > 0) {
            return {
                success: false,
                error: 'That username is already taken',
            }
        }

        await payload.update({
            collection: 'accounts',
            id: user.id,
            data: {
                email,
                firstName,
                lastName,
                username,
                displayName,
                website,
                phone,
                company,
            },
            user,
        })

        return {
            success: true,
        }
    } catch (e) {
        console.error('Account Update Error:', e)

        return {
            success: false,
            error: 'There was a problem updating your account',
        }
    }
}