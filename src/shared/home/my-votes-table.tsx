// tslint:disable:no-any
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import MinusOutlined from "@ant-design/icons/MinusOutlined";
import Avatar from "antd/lib/avatar";
import Table from "antd/lib/table";
import dateformat from "dateformat";
import Antenna from "iotex-antenna/lib";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IBucket } from "../../server/gateway/staking";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";
import { media } from "../common/styles/style-media";
import { AccountMeta } from "./account-meta";

const CustomExpandIcon = () => null;
const ACCOUNT_AREA_WIDTH = 290;

type Props = {
  antenna?: Antenna;
  dataSource?: Array<IBucket>;
};
type State = {
  invalidNames: String;
  expandedRowKeys: Array<String>;
  showMore: any;
  net: String;
};

// @ts-ignore
@connect((state: { buckets: Array<IBucket> }) => {
  return {
    dataSource: state.buckets || []
  };
})
class MyVotesTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invalidNames: "",
      expandedRowKeys: [],
      showMore: {},
      net: "kovan"
    };
  }

  setRowClassName = (record: IBucket) => {
    return record.canName && this.state.invalidNames.includes(record.canName)
      ? "BorderRowWarning"
      : "";
  };
  showMore = (id: String) => {
    const { showMore } = this.state;
    // @ts-ignore
    showMore[id] = true;
    this.setState({
      showMore: { ...showMore }
    });
  };
  renderReward = (bpCandidates: any, record: IBucket) => {
    const { index } = record;
    const id = String(index);
    const bpCandidate =
      bpCandidates.find((v: any) => v.registeredName === record.canName) || {};
    const {
      blockRewardPortion,
      epochRewardPortion,
      foundationRewardPortion,
      rewardPlan
    } = bpCandidate;
    if (!rewardPlan) {
      return null;
    }
    const { showMore } = this.state;
    return (
      <p style={{ padding: "0 40px" }}>
        <span>
          {`${t("profile.block_reward_portion")}: ${blockRewardPortion} %, `}
        </span>
        <span>
          {`${t("profile.epoch_reward_portion")}: ${epochRewardPortion} %, `}
        </span>
        <span>
          {`${t(
            "profile.foundation_reward_portion"
          )}: ${foundationRewardPortion} %.`}
        </span>
        <br />
        {rewardPlan.length > 300 && !showMore[id] ? (
          <span>
            {`${rewardPlan.substr(0, 250)}...`}{" "}
            <a
              // tslint:disable-next-line:react-a11y-anchors
              role="button"
              onClick={() => this.showMore(id)}
              style={{
                paddingLeft: "5px",
                color: colors.PRODUCING
              }}
            >
              {t("voting.delegate_show_more")}
            </a>
          </span>
        ) : (
          <span>{rewardPlan}</span>
        )}
      </p>
    );
  };

  renderAction = (text: any, record: IBucket) => {
    if (record.canName) {
      return (
        <Flex column={true} alignItems={"baseline"} color={colors.black}>
          <a
            // tslint:disable-next-line:react-a11y-anchors
            href={"#"}
            style={{
              padding: "3px 0",
              color: colors.PRODUCING,
              fontWeight: "bold",
              lineHeight: 1.36
            }}
          >
            {text}
          </a>
          <TimeSpan>{record.roleName || ""}</TimeSpan>
          {this.state.invalidNames.includes(record.canName) ? (
            <TimeSpan style={{ color: colors.voteWarning }}>
              Invalid voting name.
            </TimeSpan>
          ) : null}
        </Flex>
      );
    }

    return null;
  };

  // tslint:disable-next-line:max-func-body-length
  render(): JSX.Element {
    const bpCandidates: any = [];
    const { expandedRowKeys } = this.state;
    const { dataSource } = this.props;

    // @ts-ignore
    const DisplayMyStakeCols = (bpCandidates: any): Array<any> =>
      // tslint:disable-next-line:max-func-body-length
      [
        {
          title: (
            <b style={{ marginLeft: "19px" }}>{t("my_stake.staking_bucket")}</b>
          ),
          dataIndex: "id",
          className: "BorderTop BorderLeft BorderBottom",
          // @ts-ignore

          render(text: any, record: IBucket): JSX.Element {
            const no = String(record.index);

            return (
              <Flex
                column={true}
                alignItems={"baseline"}
                paddingLeft={"40px"}
                paddingBottom={"14px"}
                media={{
                  [media.media700]: {
                    paddingLeft: "8px"
                  }
                }}
              >
                <Flex
                  minWidth={"186px"}
                  alignContent={"flex-start"}
                  justifyContent={"left"}
                >
                  <Avatar
                    shape="square"
                    src={assetURL("my-staking/box.png")}
                    size={40}
                    style={{ margin: "14px 10px 8px 0" }}
                  />
                  <Flex
                    column={true}
                    alignItems={"baseline"}
                    color={colors.black}
                    width={"100px"}
                    padding={"7px 0"}
                    media={{
                      [media.media700]: {
                        width: "100%"
                      }
                    }}
                  >
                    <BoldText>{t("my_stake.order_no", { no })}</BoldText>
                    <BoldText style={{ whiteSpace: "nowrap" }}>
                      {t("my_stake.native_staked_amount_format", {
                        amountText: record.stakedAmount
                          .toNumber()
                          .toLocaleString()
                      })}
                    </BoldText>
                  </Flex>
                </Flex>
                <Flex width={"100%"} padding={"1px 0 1px 0"}>
                  <StatisticSpan style={{ width: "50%" }}>
                    {t("my_stake.staking_power")}
                  </StatisticSpan>
                  <StatisticValue style={{ width: "50%" }}>
                    {t("my_stake.staking_power.estimate", {
                      total: "0"
                    })}
                  </StatisticValue>
                </Flex>
              </Flex>
            );
          }
        },
        // TODO(tian): vote for
        // {
        //   title: (
        //     <span style={{ whiteSpace: "nowrap" }}>
        //       {t("my_stake.vote_for")}
        //     </span>
        //   ),
        //   dataIndex: "canName",
        //   className: "BorderTop BorderBottom",
        //   render: this.renderAction
        // },
        {
          title: (
            <span style={{ whiteSpace: "nowrap" }}>
              {t("my_stake.stake_duration")}
            </span>
          ),
          dataIndex: "stakedDuration",
          className: "BorderTop BorderBottom",

          render(text: any, record: IBucket): JSX.Element {
            const timeformat = "yyyy/mm/dd";
            return (
              <Flex column={true} alignItems={"baseline"}>
                <CellSpan>
                  {t("my_stake.duration_epochs", { stakeDuration: text })}
                </CellSpan>
                <TimeSpan>
                  {t("my_stake.from_time", {
                    startTime: record.stakeStartTime
                      ? dateformat(record.stakeStartTime, timeformat)
                      : "-"
                  })}
                </TimeSpan>
              </Flex>
            );
          }
        },
        {
          title: (
            <span style={{ whiteSpace: "nowrap" }}>
              {t("my_stake.nonDecay")}
            </span>
          ),
          dataIndex: "nonDecay",
          className: "BorderTop BorderBottom",
          render(t: Boolean): JSX.Element {
            return t ? (
              <CheckOutlined
                style={{ color: colors.VERIFYING, fontSize: "20px" }}
              />
            ) : (
              <MinusOutlined
                style={{ color: colors.MISSED, fontSize: "24px" }}
              />
            );
          }
        },
        {
          title: (
            <span style={{ whiteSpace: "nowrap" }}>
              {t("my_stake.bucket_status")}
            </span>
          ),
          dataIndex: "stakeStartTime",
          className: "BorderTop BorderBottom",
          // @ts-ignore

          render(text: any, record: IBucket): JSX.Element {
            let time;
            let status;
            const bucketStatus = record.status;
            if (bucketStatus === "withdrawable") {
              status = "my_stake.status.withdrawable";
              time = new Date(
                record.withdrawWaitUntil || new Date(0)
              ).toLocaleDateString();
            } else if (bucketStatus === "unstaking") {
              status = "my_stake.status.unstaking";
              time = new Date(
                record.withdrawWaitUntil || new Date(0)
              ).toLocaleDateString();
            } else if (bucketStatus === "staking") {
              status = "my_stake.status.ongoing";
              const date = new Date(record.stakeStartTime || new Date(0));
              date.setTime(date.getTime() + record.stakedDuration * 1000);
              const today = new Date();
              if (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
              ) {
                time = date.toLocaleTimeString();
              } else {
                time = date.toLocaleDateString();
              }
            } else {
              status = "my_stake.status.no_stake_starttime";
              time = "---";
            }

            return (
              <Flex column={true} alignItems={"baseline"}>
                <CellSpan>{t(status)}</CellSpan>
                <TimeSpan>
                  {bucketStatus !== "staking"
                    ? t(`${status}.prefix`, { time })
                    : ""}
                </TimeSpan>
              </Flex>
            );
          }
        },
        {
          title: "",
          className: "BorderTop BorderBottom BorderRight"
        }
      ];
    return (
      <Flex
        alignItems={"flex-start"}
        media={{
          [media.media1024]: {
            flexDirection: "column !important"
          }
        }}
      >
        <Flex
          width="100%"
          alignItems={"flex-start"}
          overflowX={"scroll"}
          marginRight={"23px"}
          maxWidth={`calc(100% - ${ACCOUNT_AREA_WIDTH + 23}px)`}
          media={{
            [media.media1024]: {
              maxWidth: "100% !important",
              marginRight: "0 !important"
            }
          }}
        >
          {/*
        // @ts-ignore */}
          <Table
            className={"MyStakeInfo"}
            rowClassName={this.setRowClassName}
            style={{ width: "100%" }}
            pagination={{ pageSize: 6 }}
            columns={DisplayMyStakeCols(bpCandidates)}
            dataSource={dataSource}
            expandIcon={CustomExpandIcon}
            expandedRowRender={(record: IBucket) =>
              this.renderReward(bpCandidates, record)
            }
            // @ts-ignore
            expandIconAsCell={false}
            // @ts-ignore
            expandedRowKeys={expandedRowKeys}
            rowKey="id"
          />
        </Flex>
        <Flex
          column={true}
          alignItems={"baseline"}
          maxWidth={`${ACCOUNT_AREA_WIDTH}px`}
          backgroundColor={colors.black10}
          padding={"24px"}
          fontSize={"12px"}
          marginBottom={"24px"}
        >
          <AccountMeta />
        </Flex>
      </Flex>
    );
  }
}

export { MyVotesTable };
const BoldText = styled("b", {
  fontSize: "12px"
});
const StatisticSpan = styled("span", {
  fontSize: "10px",
  color: colors.black80
});
const StatisticValue = styled("span", {
  fontSize: "10px",
  color: colors.black95
});
const TimeSpan = styled("span", {
  fontSize: "10px",
  color: colors.black80
});
const CellSpan = styled("span", {
  fontSize: "12px",
  color: colors.black,
  padding: "3px 0"
});
