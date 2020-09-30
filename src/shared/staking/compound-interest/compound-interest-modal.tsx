/* tslint:disable:no-any */
// tslint:disable-next-line:import-blacklist
import { Radio } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IBucket } from "../../../server/gateway/staking";
import { AddressName } from "../../common/address-name";
import { CommonModal } from "../../common/common-modal";
import { getPowerEstimationForBucket } from "../../common/token-utils";
import { actionSmartContractCalled } from "../smart-contract-reducer";
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
  contractAddr: string;
  smartContractCalled: boolean;
  actionSmartContractCalled(payload: boolean): void;
};

// @ts-ignore
@connect(
  (state) => ({
    // @ts-ignore
    dataSource: state.buckets || [],
    // @ts-ignore
    contractAddr: state.staking && state.staking.compoundInterestContractAddr,
    // @ts-ignore
    smartContractCalled:
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
  contract: CompoundInterestContract;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount(): Promise<void> {
    this.contract = new CompoundInterestContract({
      contractAddress: this.props.contractAddr,
    });

    try {
      const bucketId = await this.contract.queryBucket();
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
    const { actionSmartContractCalled } = this.props;
    try {
      this.setState({
        confirmLoading: true,
      });
      const txHash = await this.contract.registerBucket(this.state.bucketIndex);
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
