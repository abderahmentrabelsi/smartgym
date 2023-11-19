import { Card, CardTitle, Button } from 'reactstrap';

const BodyPart = ({ item, setBodyPart, bodyPart }) => (
    <Button
        color={bodyPart === item ? 'selected' : 'default'}
        onClick={() => {
            setBodyPart(item);
            window.scrollTo({ top: 100, behavior: 'smooth' });
        }}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            borderBottomLeftRadius: '20px',
            cursor: 'pointer',
            gap: '47px',
            width: '230px',
            height: bodyPart === item ? '151px' : '282px',
            borderTop: bodyPart === item ? '4px solid #786df1' : undefined,
        }}
    >
        <Card body className="bodyPart-card" style={{ textAlign: 'center' }}>
            <CardTitle tag="h4" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Alegreya', color: '#3A1212', textTransform: 'capitalize' }}>
                {item}
            </CardTitle>
        </Card>
    </Button>
);

export default BodyPart;