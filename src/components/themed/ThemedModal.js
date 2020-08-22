// @flow

import { BlurView } from '@react-native-community/blur'
import * as React from 'react'
import { type ViewStyle, StyleSheet } from 'react-native'
import { type AirshipBridge, AirshipModal } from 'react-native-airship'

import { packEdges, unpackEdges } from '../../util/edges.js'
import { useTheme } from '../services/ThemeContext.js'

// Sneak the BlurView over to the login UI:
global.ReactNativeBlurView = BlurView

type Props = {
  bridge: AirshipBridge<any>,
  children?: React.Node,
  onCancel: () => void,

  // Use this to create space at the top for an icon circle:
  iconRem?: number,

  // Control over the content area:
  flexDirection?: $PropertyType<ViewStyle, 'flexDirection'>,
  justifyContent?: $PropertyType<ViewStyle, 'justifyContent'>,
  paddingRem?: number[] | number
}

/**
 * The Airship modal, but connected to our theming system.
 */
export function ThemedModal(props: Props) {
  const { bridge, children = null, iconRem = 0, onCancel } = props
  const paddingRem = unpackEdges(props.paddingRem ?? 1)
  const theme = useTheme()

  paddingRem.top += iconRem / 2

  return (
    <AirshipModal
      bridge={bridge}
      onCancel={onCancel}
      backgroundColor={theme.modal}
      borderRadius={theme.rem(1)}
      margin={[theme.rem(iconRem / 2), 0, 0]}
      padding={packEdges(paddingRem).map(theme.rem)}
      underlay={<BlurView blurType="light" style={StyleSheet.absoluteFill} />}
    >
      {children}
    </AirshipModal>
  )
}
