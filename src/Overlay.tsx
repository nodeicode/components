import styled from 'styled-components'
import React, {ReactElement, useRef} from 'react'
import {get, COMMON, POSITION, SystemPositionProps, SystemCommonProps} from './constants'
import {ComponentProps} from './utils/types'
import {useOverlay, TouchOrMouseEvent} from './hooks'
import Portal from './Portal'
import sx, {SxProp} from './sx'
import {useCombinedRefs} from './hooks/useCombinedRefs'

type StyledOverlayProps = {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  visibility?: 'visible' | 'hidden'
}

const heightMap = {
  xsmall: '192px',
  small: '256px',
  medium: '320px',
  large: '432px',
  xlarge: '600px',
  auto: 'auto'
}

const widthMap = {
  small: '256px',
  medium: '320px',
  large: '480px',
  xlarge: '640px',
  xxlarge: '960px',
  auto: 'auto'
}

/*TODO replace with shadow functional color variable when it's shipped to primer/primitives*/
const StyledOverlay = styled.div<StyledOverlayProps & SystemCommonProps & SystemPositionProps & SxProp>`
  background-color: ${get('colors.bg.overlay')};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 8px 24px rgba(149, 157, 165, 0.2);
  position: absolute;
  min-width: 192px;
  max-width: 640px;
  height: ${props => heightMap[props.height || 'auto']};
  width: ${props => widthMap[props.width || 'auto']};
  border-radius: 12px;
  overflow: hidden;
  animation: overlay-appear 200ms ${get('animation.easeOutCubic')};

  @keyframes overlay-appear {
    0% {
      opacity: 0;
      transform: translateY(${get('space.2')});
    }
    100% {
      opacity: 1;
    }
  }
  visibility: ${props => props.visibility || 'visible'};
  ${COMMON};
  ${POSITION};
  ${sx};
`
export type OverlayProps = {
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef: React.RefObject<HTMLElement>
  onClickOutside: (e: TouchOrMouseEvent) => void
  onEscape: (e: KeyboardEvent) => void
  visibility?: 'visible' | 'hidden'
} & Omit<ComponentProps<typeof StyledOverlay>, 'visibility' | keyof SystemPositionProps>

/**
 * An `Overlay` is a flexible floating surface, used to display transient content such as menus,
 * selection options, dialogs, and more. Overlays use shadows to express elevation. The `Overlay`
 * component handles all behaviors needed by overlay UIs as well as the common styles that all overlays * should have.
 * @param ignoreClickRefs Optional. An array of ref objects to ignore clicks on in the `onOutsideClick` behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the `Overlay` to prevent the `Overlay` from being toggled twice.
 * @param initialFocusRef Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.
 * @param returnFocusRef Required. Ref for the element to focus when the `Overlay` is closed.
 * @param onClickOutside  Required. Function to call when clicking outside of the `Overlay`. Typically this function sets the `Overlay` visibility state to `false`.
 * @param onEscape Required. Function to call when user presses `Escape`. Typically this function sets the `Overlay` visibility state to `false`.
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param visibility Sets the visibility of the `Overlay`
 */
const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  (
    {onClickOutside, role = 'dialog', initialFocusRef, returnFocusRef, ignoreClickRefs, onEscape, visibility, ...rest},
    forwardedRef
  ): ReactElement => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const combinedRef = useCombinedRefs(overlayRef, forwardedRef)

    const overlayProps = useOverlay({
      overlayRef,
      returnFocusRef,
      onEscape,
      ignoreClickRefs,
      onClickOutside,
      initialFocusRef
    })
    return (
      <Portal>
        <StyledOverlay
          {...overlayProps}
          aria-modal="true"
          role={role}
          {...rest}
          ref={combinedRef}
          visibility={visibility}
        />
      </Portal>
    )
  }
)

Overlay.defaultProps = {
  height: 'auto',
  width: 'auto'
}

export default Overlay
