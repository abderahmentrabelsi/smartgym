import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CardImg, CardSubtitle, Col, Input, Progress, Row } from "reactstrap";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";


import { useStateContext } from "../context";
import { CountBox } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";
import Breadcrumbs from "@components/breadcrumbs";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate("/");
    setIsLoading(false);
  };

  return (
    <>
      <Breadcrumbs
        title="Support a cause"
        data={[{ title: "Campaign Details" }]}
      />

      <Row>
        <Col xl="12" md="12">
          <Card>
            <CardBody>
              <CardTitle tag="h4">Campaign Metrics</CardTitle>
              <CardSubtitle className="text-muted">Track the progress of the fundraising of this campaign</CardSubtitle>
              <CardImg className="img-fluid my-2 w-100" src={state.image} alt="Card cap"
                       style={{ maxHeight: "250px" }} />
              <Progress value={calculateBarPercentage(state.target, state.amountCollected)} />
              <div className="py-1">
                <CountBox title="Days Left" value={remainingDays} />
                <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
                <CountBox title="Total Backers" value={donators.length} />
              </div>
            </CardBody>
          </Card>
        </Col>


        <Col md="6" xl="6">
          <Card color="primary" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4">
                Fund
              </CardTitle>
              <CardText className="text-white d-flex flex-column">
                <span className="mb-4">
                Fund the campaign by entering an amount and clicking the "Donate" button.
                </span>
                <Input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  className="w-100 h-50 bg-2c2f32 rounded-10 border-0 text-center font-epilogue font-normal text-16 text-secondary mt-2"
                  onClick={handleDonate}
                  color="danger"
                >
                  Donate
                </Button>
              </CardText>
            </CardBody>
          </Card>
        </Col>


        <Col md="6" xl="6">
          <Card className="bg-transparent border-primary shadow-none">
            <CardBody>
              <CardTitle tag="h4">About this campaign</CardTitle>
              <CardText>

                <div>
                  <div>
                    <span className="font-epilogue font-semibold text-18 text-uppercase">Creator</span>
                    <Row className="mt-2 align-items-center">
                      <Col className="mb-1" xl="auto" md="auto" sm="auto">
                        <img src={thirdweb} alt="user" className="rounded-circle mr-2"
                             style={{ maxWidth: 33 }} />
                      </Col>
                      <Col md="10">
                        <h4 className="font-epilogue font-semibold text-14 break-all">{state.owner}</h4>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <h4 className="font-epilogue font-semibold text-18 text-uppercase mt-3">Story</h4>
                    <p className="font-epilogue font-normal text-16 text-secondary">{state.description}</p>
                  </div>

                  <div>

                    <h4 className="font-epilogue font-semibold text-18 text-uppercase mt-1">Donators</h4>
                    {donators.length > 0 ? (
                      donators.map((item, index) => (
                        <div className="d-flex align-items-center justify-content-between">
                          <span
                            className="font-epilogue font-normal text-16 text-secondary">{index + 1}. {item.donator}</span>
                          <span className="font-epilogue font-normal text-16 text-secondary">{item.donation}</span>
                        </div>
                      ))
                    ) : (
                      <p className="font-epilogue font-normal text-16 text-secondary mt-3">No
                        donators yet. Be the first one!</p>
                    )}
                  </div>
                </div>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CampaignDetails;
