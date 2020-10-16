/* tslint:disable:no-any */
// tslint:disable-next-line:import-blacklist
import { Button, Radio } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IBucket } from "../../../server/gateway/staking";
import { AddressName } from "../../common/address-name";
import { CommonModal } from "../../common/common-modal";
import { getPowerEstimationForBucket } from "../../common/token-utils";
import { actionSmartContractCalled } from "../smart-contract-reducer";

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
  contractAddr: string;
  smartContractCalled: boolean;
  actionSmartContractCalled(payload: boolean): void;
  compoundInterestBucketId: string;
  contract: any;
};

// @ts-ignore
@connect(
  (state) => ({
    // @ts-ignore
    dataSource: state.buckets || [],
    // @ts-ignore
    contractAddr: state.staking && state.staking.compoundInterestContractAddr,
    smartContractCalled:
      // @ts-ignore
      state.smartContract && state.smartContract.smartContractCalled,
  }),
  (disptach) => ({
    // tslint:disable-next-line:typedef
    actionSmartContractCalled(payload: boolean) {
      disptach(actionSmartContractCalled(payload));
    },
  })
)
export class CompoundInterestBucketModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: this.props.forceDisplayModal,
      bucketIndex: this.props.compoundInterestBucketId,
      confirmLoading: false,
    };
  }

  componentWillReceiveProps(): void {
    this.setState({
      bucketIndex: this.props.compoundInterestBucketId,
    });
  }

  handleCancel = () => {
    if (this.props.requestDismiss) {
      this.props.requestDismiss();
    }
    // @ts-ignore
    this.setState({
      visible: false,
    });
  };
  removeRegister = async () => {
    const { actionSmartContractCalled } = this.props;
    try {
      this.setState({
        confirmLoading: true,
      });
      const txHash = await this.props.contract.unRegisterBucket();
      window.console.log("unregister compound interest bucket txHash", txHash);
    } catch (e) {
      window.console.error(
        "%c Compound Interest unregister error",
        "color: blue",
        e.message
      );
    } finally {
      this.setState({ confirmLoading: false });
    }
    if (this.props.requestDismiss) {
      this.props.requestDismiss();
    }
    // @ts-ignore
    this.setState({
      visible: false,
    });
    actionSmartContractCalled(true);
  };

  onChange = (e: any) => {
    window.console.log("radio checked", e.target.value);
    this.setState({
      bucketIndex: e.target.value,
    });
  };

  onSubmit = async () => {
    const { actionSmartContractCalled } = this.props;
    try {
      this.setState({
        confirmLoading: true,
      });
      const txHash = await this.props.contract.registerBucket(
        this.state.bucketIndex
      );
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
    if (this.props.requestDismiss) {
      this.props.requestDismiss();
    }
    // @ts-ignore
    this.setState({
      visible: false,
    });
    actionSmartContractCalled(true);
  };

  render(): JSX.Element {
    const { forceDisplayModal, dataSource } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    let footer = [
      <Button key="cancel" onClick={this.handleCancel}>
        {t("button.cancel")}
      </Button>,
      <Button key="submit" type="primary" onClick={this.onSubmit}>
        {t("button.continue")}
      </Button>,
    ];

    if (this.props.compoundInterestBucketId !== "-1") {
      footer = [
        <Button key="cancel" onClick={this.handleCancel}>
          {t("button.cancel")}
        </Button>,
        <Button key="remove" type="primary" onClick={this.removeRegister}>
          {t("button.remove.bucket", {
            bucket: this.props.compoundInterestBucketId,
          })}
        </Button>,
        <Button key="submit" type="primary" onClick={this.onSubmit}>
          {t("button.continue")}
        </Button>,
      ];
    }
    return (
      // tslint:disable-next-line:use-simple-attributes
      <CommonModal
        className="vote-modal"
        title={t("my_stake.set_compound_interest_bucket")}
        visible={forceDisplayModal || this.state.visible}
        onCancel={this.handleCancel}
        onOk={this.onSubmit}
        footer={footer}
      >
        <h3>{t("my_stake.select_compound_interest_bucket")}</h3>
        <p>{t("my_stake.compound_modal.content")}</p>
        <p>{t("my_stake.compound_modal.note")}</p>
        <Radio.Group
          onChange={this.onChange}
          value={Number(this.state.bucketIndex)}
          style={{ marginTop: 20 }}
        >
          {dataSource &&
            dataSource.length > 0 &&
            dataSource
              .filter((item: IBucket) => item.autoStake)
              .map((item: IBucket, i: number) => {
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
                          marginLeft: 40,
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
                        <b style={{ whiteSpace: "nowrap", marginLeft: 40 }}>
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
