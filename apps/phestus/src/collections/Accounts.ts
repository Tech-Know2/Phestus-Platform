import type { CollectionConfig } from 'payload'

export const Accounts: CollectionConfig = {
  slug: 'accounts',
  admin: {
    useAsTitle: 'username',
  },
  auth: true,
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Public username used across the Phestus marketplace.',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Public name displayed on the Phestus marketplace.',
      },
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'accountType',
      type: 'select',
      defaultValue: 'personal',
      options: [
        {
          label: 'Personal',
          value: 'personal',
        },
        {
          label: 'Seller',
          value: 'seller',
        },
      ],
      required: true,
    },
    {
      name: 'isSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this account can publish marketplace listings.',
      },
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Under Review',
          value: 'underReview',
        },
        {
          label: 'Suspended',
          value: 'suspended',
        },
      ],
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this customer.',
      },
    },
  ],
}
