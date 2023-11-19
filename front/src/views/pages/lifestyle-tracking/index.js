// ** Reactstrap Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Components
import Dashboard from './nav-bar-options/Dashboard'

// ** Custom Component
import Breadcrumbs from '@components/breadcrumbs'

// ** Styles
import '@styles/base/pages/page-faq.scss'

const LifestyleTracking = () => {
 console.log('hello')
 const item = window.localStorage.getItem("userData");
 const user = JSON.parse(item)
  return (
    <Fragment>
      <Breadcrumbs title='Diary' data={[{ title: 'Pages' }, { title: 'Lifestyle Tracking' }]} />
      <Dashboard user={
        user
      }/>
    </Fragment>
  )
}

export default LifestyleTracking
