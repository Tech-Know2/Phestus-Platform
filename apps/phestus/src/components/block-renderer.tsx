import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'

import { CallToAction } from '@/components/blocks/CTA'
import { Hero } from '@/components/blocks/Hero'
import { ImageBlock } from '@/components/blocks/Image'

const blockComponents: Record<string, React.ComponentType<any>> = {
    callToAction: CallToAction,
    hero: Hero,
    image: ImageBlock,
}

export const RenderBlocks: React.FC<{
    blocks: Page['layout']
}> = ({ blocks }) => {
    if (!blocks?.length) {
        return null
    }

    return (
        <Fragment>
            {blocks.map((block, index) => {
                const Block = blockComponents[block.blockType]

                if (!Block) {
                    console.warn(`Unknown block type: ${block.blockType}`)
                    return null
                }

                return (
                    <div className="my-16" key={block.id ?? index}>
                        <Block {...block} />
                    </div>
                )
            })}
        </Fragment>
    )
}