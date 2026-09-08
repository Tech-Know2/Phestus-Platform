import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'

import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import {
  revalidatePage,
  revalidateDelete,
} from '../Pages/hooks/revalidatePage'

import { generatePreviewPath } from '../../utilities/generatePreviewPath'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Docs: CollectionConfig<'docs'> = {
  slug: 'docs',

  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    title: true,
    slug: true,
  },

  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],

    meta: {
      title: 'Phestus Web Stack',
      description: 'Custom built web stack platforms designed for business owners and developers alike',
      openGraph: {
        description: 'Custom built web stack platforms designed for business owners and developers alike',
        siteName: 'Phestus',
        title: 'Phestus Web Stack',
      },
      robots: 'noindex, nofollow',
    },

    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'docs',
          req,
        }),
    },

    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'docs',
        req,
      }),

    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),

            MetaTitleField({
              hasGenerateFn: true,
            }),

            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),

            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },

    slugField(),
  ],

  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}