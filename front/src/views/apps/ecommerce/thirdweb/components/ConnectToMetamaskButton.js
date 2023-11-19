import {useStateContext} from "../context";
import {useNavigate} from "react-router-dom";
import {Badge} from 'reactstrap';
import React from "react";
import CustomButton from "@src/views/apps/ecommerce/thirdweb/components/CustomButton";

export const ConnectToMetamaskButton = () => {
    const navigate = useNavigate();
    const {connect, address} = useStateContext();

    return (
        <div className='position-relative'
             onClick={() => {
                 if (address) {
                     navigate('/apps/createcampaign');
                 } else {
                     connect();
                 }
             }}>
            <Badge pill color={address ? 'success' : 'primary'} className='badge-up'>
                {address ? 'ON' : 'OFF'}
            </Badge>
            <CustomButton

            >
                {address ? 'Create a campaign' : 'Connect'}
            </CustomButton>
        </div>
    );
};
