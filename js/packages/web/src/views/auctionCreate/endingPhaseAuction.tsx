import { Button, Col, Input, Row, Select } from 'antd';
import React from 'react';
import { AuctionState } from '.';

const { Option } = Select;

export const EndingPhaseAuction = (props: {
  attributes: AuctionState;
  setAttributes: (attr: AuctionState) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row>
        <h2>Ending Phase</h2>
        <p>Set the terms for your auction.</p>
      </Row>
      <Row>
        <Col xl={24}>
          <div>
            <span>Auction Duration</span>
            <span>This is how long the auction will last for.</span>
            <Input
              addonAfter={
                <Select
                  defaultValue={props.attributes.auctionDurationType}
                  onChange={value =>
                    props.setAttributes({
                      ...props.attributes,
                      auctionDurationType: value,
                    })
                  }
                >
                  <Option value="minutes">Minutes</Option>
                  <Option value="hours">Hours</Option>
                  <Option value="days">Days</Option>
                </Select>
              }
              autoFocus
              type="number"
              placeholder="Set the auction duration"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  auctionDuration: parseInt(info.target.value),
                })
              }
            />
          </div>

          <div>
            <span>Gap Time</span>
            <span>
              The final phase of the auction will begin when there is this much
              time left on the countdown. Any bids placed during the final phase
              will extend the end time by this same duration.
            </span>
            <Input
              addonAfter={
                <Select
                  defaultValue={props.attributes.gapTimeType}
                  onChange={value =>
                    props.setAttributes({
                      ...props.attributes,
                      gapTimeType: value,
                    })
                  }
                >
                  <Option value="minutes">Minutes</Option>
                  <Option value="hours">Hours</Option>
                  <Option value="days">Days</Option>
                </Select>
              }
              type="number"
              placeholder="Set the gap time"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  gapTime: parseInt(info.target.value),
                })
              }
            />
          </div>

          <label>
            <span>Tick Size for Ending Phase</span>
            <span>
              In order for winners to move up in the auction, they must place a
              bid that’s at least this percentage higher than the next highest
              bid.
            </span>
            <Input
              type="number"
              placeholder="Percentage"
              suffix="%"
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  tickSizeEndingPhase: parseInt(info.target.value),
                })
              }
            />
          </label>
        </Col>
      </Row>
      <Row>
        <Button type="primary" size="large" onClick={props.confirm}>
          Continue
        </Button>
      </Row>
    </>
  );
};
