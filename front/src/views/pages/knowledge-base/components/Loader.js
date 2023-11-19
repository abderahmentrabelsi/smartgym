import { Card, CardBody, CardText, CardTitle } from "reactstrap";
import Spinner from '@components/spinner/Loading-spinner'

export const Loader = () => {
  return (
    <Card className='border-primary text-center'>
      <CardBody>
        <CardTitle tag='h4'>Loading..</CardTitle>
        <CardText className="d-flex flex-column gap-1">
          <Spinner />
          I am a very expensive Large Language Model running on a slow server 🥹 <br />
          Please support this poor server by donating to my creator, or just wait a few seconds.
        </CardText>
      </CardBody>
    </Card>
  );
};
