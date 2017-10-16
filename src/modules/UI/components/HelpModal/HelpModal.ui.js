import React, {Component} from 'react'
import {
  View,
  Image,
  WebView,
  Text
} from 'react-native'
import strings from '../../../../locales/default'
import styles from './style.js'
import StylizedModal from '../Modal/index.js'
import THEME from '../../../../theme/variables/airbitz.js'
import helpImage from '../../../../assets/images/modal/help.png'
import packageJson from '../../../../../package.json'
import DeviceInfo from 'react-native-device-info'

const HTML = require('../../../../html/enUS/info.html')

const buildNumber = DeviceInfo.getBuildNumber()
const deviceInfo = packageJson.version + ' ' + buildNumber

export default class HelpModal extends Component {

  _renderWebView = () => {
    require('../../../../html/enUS/info.html')
  }

  render () {
    return (
      <StylizedModal
        style={styles.stylizedModal}
        visibilityBoolean={this.props.modal}
        onExitButtonFxn={this.props.closeModal}
        headerText='help_modal_title'
        modalMiddle={<WebView style={{height: 220, width: '100%'}} source={HTML} />}
        modalBottom={<View style={[styles.modalBottomContainer]}>
                        <Text style={styles.modalBottomText}>{strings.enUS['help_version']} {deviceInfo}</Text>
                    </View>}
        featuredIcon={<Image source={helpImage}  style={styles.modalFeaturedIcon} color={THEME.secondary} size={20} />}
      />
    )
  }
}
