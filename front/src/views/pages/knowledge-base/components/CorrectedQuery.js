import { Alert } from 'reactstrap'
import { HelpCircle } from 'react-feather'
import { Link } from "react-router-dom";

const CorrectedQuery = ({userQuery, correctedQuery}) => {
  return (
    <>
      <Alert color='warning'>
        <div className='alert-body'>
          <HelpCircle size={24} />
          <span className='ms-1' style={{
            fontWeight: 'lighter',
          }}>
            It seems you are looking for <b>{correctedQuery}</b>, we've corrected that for you. If you think we're wrong, you can try searching for <Link to={`${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/search?query=${userQuery}&filter=1&qty=12&override_correct=true`}><b>{userQuery}</b></Link> again.
          </span>
        </div>
      </Alert>
    </>
  )
}
export default CorrectedQuery
