import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import '../styles/Alert.css'
const Alert = ({alerts}) => alerts !==null && alerts.length > 0 && alerts.map(alert=>(
    <div key={alert.id} className={`alert alert-${alert.alertType} alert-bar`}>
        {alert.msg}
    </div>
));

const mapStateToProps = state => ({
alerts:state.alert
})

Alert.propTypes = {
    alerts:PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Alert);