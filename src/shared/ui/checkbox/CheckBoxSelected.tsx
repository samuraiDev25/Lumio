import { CSSProperties, FC, HTMLProps, ReactNode, SVGProps } from 'react'

export type IconProps = {
  autoSize?: boolean
  backgroundColor?: string
  color?: string
  size?: number
  svgProps?: SVGProps<SVGSVGElement>
} & Omit<HTMLProps<HTMLSpanElement>, 'color' | 'size'>

const CheckBoxSelected = (allProps: IconProps) => {
  const { svgProps: props, ...restProps } = allProps

  return (
    <IconWrapper
      icon={
        <svg
          fill={'none'}
          height={'100%'}
          viewBox={'0 0 24 24'}
          width={'100%'}
          xmlns={'http://www.w3.org/2000/svg'}
          {...props}
        >
          <path d={'M4 6h16v12H4z'} fill={'var(--color-bg-icon)'} />
          <path
            d={
              'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
            }
            fill={'currentColor'}
          />
        </svg>
      }
      {...restProps}
    />
  )
}

export default CheckBoxSelected

export const IconWrapper: FC<{ icon: ReactNode } & IconProps> = ({
  backgroundColor = 'var(--color-neutral-light-50)',
  color: colorProp,
  icon,
  size: sizeProp,
  ...restProps
}) => {
  const color = colorProp ? colorProp : 'currentColor'
  const size = sizeProp ? `${sizeProp}px` : '24px'

  return (
    <span
      aria-hidden={'true'}
      role={'img'}
      style={
        {
          '--color-bg-icon': backgroundColor,
          color: color,
          display: 'inline-flex',
          fontSize: 'inherit',
          height: size,
          width: size,
        } as CSSProperties
      }
      {...restProps}
    >
      {icon}
    </span>
  )
}
