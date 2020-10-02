// tslint:disable-next-line:import-blacklist
import { SettingOutlined } from "@ant-design/icons/lib";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import RedoOutlined from "@ant-design/icons/RedoOutlined";
// tslint:disable-next-line:import-blacklist
import { Button } from "antd";
import Alert from "antd/lib/alert";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { connect } from "react-redux";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { CommonMargin } from "../common/common-margin";
import { IopayRequired } from "../common/iopay-required";
import { colors } from "../common/styles/style-color";
import { fonts } from "../common/styles/style-font";
import { VotingButton } from "../home/vote-button-modal";
import { CompoundInterestContract } from "../staking/compound-interest/compound-interest-contract";
import { CompoundInterestBucketModal } from "../staking/compound-interest/compound-interest-modal";
import { VoteNowContainer } from "../staking/vote-now-steps/vote-now-container";
import { BucketsLoader } from "./account-meta";
import { MyVotesTable } from "./my-votes-table";

const state = isBrowser && JsonGlobal("state");
const compoundInterestContractAddr =
  isBrowser && state.staking && state.staking.compoundInterestContractAddr;

type State = {
  showVoteNowModal: boolean;
  showSettingCompoundRateBucket: boolean;
};

type Props = {};

// path: /my-votes
export function MyVotes(): JSX.Element {
  return (
    <div>
      <Helmet title={`${t("my_stake.title")} - ${t("meta.description")}`} />
      <StakingContractContainer />
      <CommonMargin />
    </div>
  );
}

export class StakingContractContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showVoteNowModal: false,
      showSettingCompoundRateBucket: false,
    };
  }

  refreshPage = () => {
    window.location.reload();
  };

  render(): JSX.Element {
    return (
      <div>
        <SmartContractCalled />
        <VotingButton
          launch={() => this.setState({ showVoteNowModal: true })}
          disabled={false}
          extra={{ size: "large" }}
        >
          <span>
            <PlusOutlined />
            {t("my_stake.new_vote")}
          </span>
        </VotingButton>

        <Button
          onClick={() => this.setState({ showSettingCompoundRateBucket: true })}
          type="primary"
          size="large"
          style={{ marginLeft: 4 }}
        >
          <span>
            <SettingOutlined />
            {t("my_stake.set_compound_interest_bucket")}
          </span>
        </Button>

        <RefreshButtonStyle onClick={() => this.refreshPage()}>
          <RedoOutlined style={{ marginRight: 4 }} />
          {t("my_stake.refresh_list")}
        </RefreshButtonStyle>

        <CommonMargin />

        <MyVotesTableWrapper
          forceDisplayModal={this.state.showSettingCompoundRateBucket}
          requestDismiss={() =>
            this.setState({ showSettingCompoundRateBucket: false })
          }
        />
        <VoteNowContainer
          displayOthers={false}
          forceDisplayModal={this.state.showVoteNowModal}
          requestDismiss={() => this.setState({ showVoteNowModal: false })}
        />
      </div>
    );
  }
}
type PropsTable = {
  forceDisplayModal: boolean;
  // tslint:disable-next-line:no-any
  requestDismiss(): any;
};

type StateTable = {
  compoundInterestBucketId: string;
};
// @ts-ignore
@IopayRequired
// @ts-ignore
class MyVotesTableWrapper extends Component<PropsTable, StateTable> {
  contract: CompoundInterestContract;
  state: StateTable = {
    compoundInterestBucketId: "-1",
  };

  async componentDidMount(): Promise<void> {
    this.contract = new CompoundInterestContract({
      contractAddress: compoundInterestContractAddr,
    });
    try {
      const compoundInterestBucketId = await this.contract.queryBucket();
      this.setState({ compoundInterestBucketId: compoundInterestBucketId });
    } catch (e) {
      window.console.error(
        "%c Compound Interest query bucket error",
        "color: blue",
        e.message
      );
    }
  }

  render(): JSX.Element {
    return (
      <>
        <BucketsLoader />
        <MyVotesTable
          compoundInterestBucketId={this.state.compoundInterestBucketId}
        />
        {
          // @ts-ignore
          <CompoundInterestBucketModal
            forceDisplayModal={this.props.forceDisplayModal}
            requestDismiss={this.props.requestDismiss}
            compoundInterestBucketId={this.state.compoundInterestBucketId}
            contract={this.contract}
          />
        }
      </>
    );
  }
}

const SmartContractCalled = connect(
  (state: { smartContract: { smartContractCalled: boolean } }) => {
    return {
      smartContractCalled:
        state.smartContract && state.smartContract.smartContractCalled,
    };
  }
)(function Inner({
  smartContractCalled,
}: {
  smartContractCalled: boolean;
}): JSX.Element {
  return (
    <>
      {smartContractCalled && (
        <div>
          <Alert
            message={t("action.broadcasted")}
            type="success"
            showIcon={true}
          />
          <CommonMargin />
        </div>
      )}
    </>
  );
});

const RefreshButtonStyle = styled("span", () => ({
  ...fonts.body,
  backgroundColor: colors.white,
  color: colors.primary,
  float: "right",
  lineHeight: "55px",
  cursor: "pointer",
}));
