/* tslint:disable:no-any */
// tslint:disable-next-line:import-blacklist
import { Radio } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IBucket } from "../../../server/gateway/staking";
import { AddressName } from "../../common/address-name";
import { CommonModal } from "../../common/common-modal";
import { IopayRequired } from "../../common/iopay-required";
import { getPowerEstimationForBucket } from "../../common/token-utils";
import { CompoundInterestContract } from "./compound-interest-contract";

type State = {
  visible: boolean;
  bucketIndex: string;
  confirmLoading: boolean;
};

type Props = {
  forceDisplayModal: boolean;
  // tslint:disable-next-line:no-any
  requestDismiss(): any;
  dataSource?: Array<IBucket>;
};

// @ts-ignore
@IopayRequired
// @ts-ignore
@connect(
  (state: {
    buckets: Array<IBucket>;
    accountMeta: {
      address: string;
      totalStaked: string;
      pendingUnstaked: string;
      readyToWithdraw: string;
      totalVotes: string;
      balance: string;
    };
  }) => {
    return {
      dataSource: state.buckets || [],
      accountMeta: state.accountMeta,
    };
  }
)
export class CompoundInterestBucketModal extends Component<Props, State> {
  async componentDidMount(): Promise<void> {
    window.console.log("start register compound interest bucket txHash");
    try {
      const bucketId = await new CompoundInterestContract({
        contractAddress: "io108ckwzlzpkhva7cnfceajlu7wu6ql5kq95uat9",
      }).queryBucket();
      this.setState({ bucketIndex: bucketId });
    } catch (e) {
      window.console.error(
        "%c Compound Interest register error",
        "color: blue",
        e.message
      );
    }
  }

  state: State = {
    visible: this.props.forceDisplayModal,
    bucketIndex: "",
    confirmLoading: false,
  };

  handleCancel = () => {
    if (this.props.requestDismiss) {
      this.props.requestDismiss();
    }
    // @ts-ignore
    this.setState({
      visible: false,
    });
  };

  onChange = (e: any) => {
    window.console.log("radio checked", e.target.value);
    this.setState({
      bucketIndex: e.target.value,
    });
  };

  onSubmit = async () => {
    try {
      this.setState({
        confirmLoading: true,
      });
      const txHash = await new CompoundInterestContract({
        contractAddress: "io108ckwzlzpkhva7cnfceajlu7wu6ql5kq95uat9",
      }).registerBucket(this.state.bucketIndex);
      window.console.log("register compound interest bucket txHash", txHash);
    } catch (e) {
      window.console.error(
        "%c Compound Interest register error",
        "color: blue",
        e.message
      );
    } finally {
      this.setState({ confirmLoading: false });
    }
  };

  render(): JSX.Element {
    const { forceDisplayModal, dataSource } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      // tslint:disable-next-line:use-simple-attributes
      <CommonModal
        className="vote-modal"
        title={t("my_stake.set_compound_interest_bucket")}
        visible={forceDisplayModal || this.state.visible}
        onCancel={this.handleCancel}
        onOk={this.onSubmit}
      >
        <h4>{t("my_stake.select_compound_interest_bucket")}</h4>
        <Radio.Group
          onChange={this.onChange}
          value={Number(this.state.bucketIndex)}
        >
          {dataSource &&
            dataSource.length > 0 &&
            dataSource.map((item: IBucket, i: number) => {
              const no = String(item.index);
              return (
                <Radio key={i} style={radioStyle} value={item.index}>
                  <span style={{ display: "inline-flex" }}>
                    <span>{t("my_stake.order_no", { no })}</span>
                    <span
                      className="ellipsis-text"
                      style={{
                        maxWidth: "9vw",
                        minWidth: 95,
                        marginLeft: 50,
                        textAlign: "center",
                      }}
                    >
                      {/* tslint:disable-next-line:use-simple-attributes */}
                      <AddressName
                        address={item.canName || item.candidate}
                        className={"StakingLink"}
                      />
                    </span>
                    <span>
                      <b style={{ whiteSpace: "nowrap", marginLeft: 50 }}>
                        {t("my_stake.staking_power.estimate", {
                          total: getPowerEstimationForBucket(item)
                            .dp(1, 1)
                            .toLocaleString(),
                        })}
                      </b>
                    </span>
                  </span>
                </Radio>
              );
            })}
        </Radio.Group>
      </CommonModal>
    );
  }
}
