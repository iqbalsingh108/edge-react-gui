// @flow

import { type EdgeCurrencyInfo } from 'edge-core-js'
import * as React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

import { disableCustomNodes, enableCustomNodes, saveCustomNodesList, setDenominationKeyRequest } from '../../actions/SettingsActions.js'
import s from '../../locales/strings.js'
import * as SETTINGS_SELECTORS from '../../modules/Settings/selectors.js'
import { type Dispatch, type State as ReduxState } from '../../types/reduxTypes.js'
import type { GuiDenomination } from '../../types/types.js'
import { SceneWrapper } from '../common/SceneWrapper.js'
import { SettingsHeaderRow } from '../common/SettingsHeaderRow.js'
import { SettingsRadioRow } from '../common/SettingsRadioRow.js'
import { SettingsRow } from '../common/SettingsRow.js'
import { SettingsSwitchRow } from '../common/SettingsSwitchRow.js'
import { SetCustomNodesModal } from '../modals/SetCustomNodesModal.ui.js'
import { type ThemeProps, withTheme } from '../services/ThemeContext.js'

type NavigationProps = {
  currencyInfo: EdgeCurrencyInfo
}
type StateProps = {
  denominations: Array<GuiDenomination>,
  selectedDenominationKey: string,
  electrumServers: Array<string>,
  disableFetchingServers: boolean,
  defaultElectrumServer: string
}
type DispatchProps = {
  disableCustomNodes(): void,
  enableCustomNodes(): void,
  saveCustomNodesList(nodes: Array<string>): void,
  selectDenomination(string): void
}
type Props = NavigationProps & StateProps & DispatchProps & ThemeProps

type State = {
  isSetCustomNodesModalVisible: boolean,
  activatedBy: string | null
}

export class CurrencySettingsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isSetCustomNodesModalVisible: false,
      activatedBy: null
    }
  }

  selectDenomination = (key: string) => () => {
    return this.props.selectDenomination(key)
  }

  closeSetCustomNodesModal = (callback: () => mixed) => {
    this.setState(
      {
        isSetCustomNodesModalVisible: false
      },
      callback
    )
  }

  openSetCustomNodesModal = (activatedBy: string) => {
    this.setState({
      isSetCustomNodesModalVisible: true,
      activatedBy
    })
  }

  enableSetCustomNodes = () => {
    this.props.enableCustomNodes()
  }

  disableSetCustomNodes = () => {
    this.props.disableCustomNodes()
  }

  onChangeEnableCustomNodes = () => {
    if (!this.props.disableFetchingServers) {
      this.setState(
        {
          isSetCustomNodesModalVisible: true
        },
        this.enableSetCustomNodes
      )
      this.openSetCustomNodesModal('switch')
    } else {
      this.disableSetCustomNodes()
    }
  }

  render() {
    const { theme } = this.props
    return (
      <SceneWrapper hasTabs={false}>
        <ScrollView>
          {this.props.defaultElectrumServer.length !== 0 && (
            <SetCustomNodesModal
              isActive={this.state.isSetCustomNodesModalVisible}
              onExit={this.closeSetCustomNodesModal}
              electrumServers={this.props.electrumServers}
              saveCustomNodesList={this.props.saveCustomNodesList}
              defaultElectrumServer={this.props.defaultElectrumServer}
              disableCustomNodes={this.props.disableCustomNodes}
              activatedBy={this.state.activatedBy}
            />
          )}
          <SettingsHeaderRow text={s.strings.settings_denominations_title} />
          {this.props.denominations.map(denomination => {
            const key = denomination.multiplier
            const left = (
              <Text style={{ fontFamily: theme.fontFaceDefault, fontSize: theme.rem(1), textAlign: 'left', flexShrink: 1, color: theme.primaryText }}>
                <Text style={{ fontFamily: theme.fontFaceSymbols }}>{denomination.symbol}</Text> - {denomination.name}
              </Text>
            )
            const isSelected = key === this.props.selectedDenominationKey
            const onPress = this.selectDenomination(key)
            return <SettingsRadioRow key={denomination.multiplier} icon={left} text="" isSelected={isSelected} onPress={onPress} />
          })}
          {this.props.defaultElectrumServer.length !== 0 && (
            <>
              <SettingsHeaderRow text={s.strings.settings_custom_nodes_title} />
              <SettingsSwitchRow
                text={s.strings.settings_enable_custom_nodes}
                value={this.props.disableFetchingServers}
                onPress={this.onChangeEnableCustomNodes}
              />
              <SettingsRow
                disabled={!this.props.disableFetchingServers}
                text={s.strings.settings_set_custom_nodes_modal_title}
                onPress={() => this.openSetCustomNodesModal('row')}
              />
            </>
          )}
        </ScrollView>
      </SceneWrapper>
    )
  }
}

export const CurrencySettingsScene = connect(
  (state: ReduxState, ownProps: NavigationProps): StateProps => {
    const { currencyInfo } = ownProps
    const { currencyCode, defaultSettings, pluginId } = currencyInfo

    const { account } = state.core
    const defaultElectrumServer = defaultSettings.electrumServers ? defaultSettings.electrumServers[0] : ''
    const userSettings = account.currencyConfig[pluginId].userSettings
    const electrumServers = userSettings ? userSettings.electrumServers : []
    const disableFetchingServers = userSettings ? userSettings.disableFetchingServers : false
    return {
      denominations: SETTINGS_SELECTORS.getDenominations(state, currencyCode),
      selectedDenominationKey: SETTINGS_SELECTORS.getDisplayDenominationKey(state, currencyCode),
      electrumServers,
      disableFetchingServers,
      defaultElectrumServer
    }
  },
  (dispatch: Dispatch, ownProps: NavigationProps): DispatchProps => ({
    disableCustomNodes() {
      dispatch(disableCustomNodes(ownProps.currencyInfo.currencyCode))
    },
    enableCustomNodes() {
      dispatch(enableCustomNodes(ownProps.currencyInfo.currencyCode))
    },
    selectDenomination(denominationKey) {
      dispatch(setDenominationKeyRequest(ownProps.currencyInfo.currencyCode, denominationKey))
    },
    saveCustomNodesList(nodesList: Array<string>) {
      dispatch(saveCustomNodesList(ownProps.currencyInfo.currencyCode, nodesList))
    }
  })
)(withTheme(CurrencySettingsComponent))
