import { SpaceData } from '@subsocial/api/types'
import { HTMLProps } from 'react'
import Chip from './Chip'

type SpaceProps = HTMLProps<HTMLDivElement> & {
  spaceData: SpaceData
}

export default function Space({ spaceData, className, ...props }: SpaceProps) {
  const image = spaceData.content?.image
  const name = spaceData.content?.name
  const summary = spaceData.content?.summary
  const tags = spaceData.content?.tags

  return (
    <div className={`space ${className}`} {...props}>
      {image && (
        <img src={`https://gw.crustfiles.app/cid/${image}`} alt='space logo' />
      )}
      <div className='space-content'>
        {name && <p className='name'>{name}</p>}
        {summary && <p className='summary'>{summary}</p>}
        <div className='tags'>
          {tags?.map((tag) => (
            <Chip size='large' key={tag}>
              {tag}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}
