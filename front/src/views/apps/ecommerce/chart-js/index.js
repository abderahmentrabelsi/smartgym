// ** React Imports
import { Fragment, useContext } from 'react'

// ** Custom Components

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Deom Charts

import PolarAreaChart from './ChartjsPolarAreaChart'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Third Party Components
import 'chart.js/auto'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const ChartJS = () => {
  // ** Context, Hooks & Vars
  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    warningColorShade = '#ffbd1f',
    successColorShade = '#28dac6',
    infoColorShade = '#299AFF',
    yellowColor = '#ffe800',
    greyColor = '#4F5D70'

  return (
    <Fragment>
      <Row className='match-height'>

        <Col lg='300' sm='12' >
          <PolarAreaChart
            greyColor={greyColor}
            labelColor={labelColor}
            yellowColor={yellowColor}
            primary={colors.primary.main}
            infoColorShade={infoColorShade}
            warningColorShade={warningColorShade}
            successColorShade={successColorShade}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default ChartJS
