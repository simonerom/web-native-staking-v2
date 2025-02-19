// tslint:disable:no-any
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import DownOutlined from "@ant-design/icons/DownOutlined";
import MinusOutlined from "@ant-design/icons/MinusOutlined";
import Avatar from "antd/lib/avatar";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import List from "antd/lib/list";
import Table from "antd/lib/table";
import Tag from "antd/lib/tag";
import dateformat from "dateformat";
import Antenna from "iotex-antenna/lib";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { styled } from "styletron-react";
import { IBucket } from "../../server/gateway/staking";
import { TBpCandidate } from "../../types";
import { AddressName } from "../common/address-name";
import { webBpApolloClient } from "../common/apollo-client";
import { stakeBadgeStyle } from "../common/component-style";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color2";
import { media } from "../common/styles/style-media";
import { getPowerEstimationForBucket } from "../common/token-utils";
import { convertHttps } from "../common/url-utils";
import { GET_ALL_CANDIDATES_ID_NAME } from "../staking/smart-contract-gql-queries";
import { renderActionMenu } from "../staking/stake-edit/modal-menu";
import { isBurnDrop } from "../staking/staking-utils";
import { AccountMeta } from "./account-meta";

const ACCOUNT_AREA_WIDTH = 290;

type Props = {
  antenna?: Antenna;
  dataSource?: Array<IBucket>;
  compoundInterestBucketId: string;
};

type State = {
  invalidNames: string;
  showMore: Record<any, any>;
  address?: string;
  compoundInterestBucketId: string;
};

const state = isBrowser && JsonGlobal("state");
const isIoPayMobile = isBrowser && state.base.isIoPayMobile;

// @ts-ignore
@connect((state: { buckets: Array<IBucket> }) => {
  return {
    dataSource: state.buckets || [],
  };
})
class MyVotesTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invalidNames: "",
      showMore: {},
      address: "",
      compoundInterestBucketId: this.props.compoundInterestBucketId,
    };
  }

  componentWillReceiveProps(): void {
    this.setState({
      compoundInterestBucketId: this.props.compoundInterestBucketId,
    });
  }

  setRowClassName = (record: IBucket) => {
    const badgeRow = record.selfStakingBucket ? "BadgeRow" : "";
    return record.canName &&
      this.state.invalidNames &&
      this.state.invalidNames.includes(record.canName)
      ? `BorderRowWarning ${badgeRow}`
      : badgeRow;
  };
  showMore = (id: String) => {
    const { showMore } = this.state;
    // @ts-ignore
    showMore[id] = true;
    this.setState({
      showMore: { ...showMore },
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
      rewardPlan,
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
                color: colors.PRODUCING,
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

  // tslint:disable-next-line:variable-name
  renderAction = (_text: any, record: IBucket) => {
    if (record.canName || record.candidate) {
      return (
        <Flex column={true} alignItems={"baseline"} color={colors.black}>
          <span
            className="ellipsis-text"
            style={{ maxWidth: "9vw", minWidth: 95 }}
          >
            {/* tslint:disable-next-line:use-simple-attributes */}
            <AddressName
              address={record.canName || record.candidate}
              className={"StakingLink"}
            />
          </span>
          <TimeSpan>{record.roleName || ""}</TimeSpan>
          {record.canName &&
          this.state.invalidNames &&
          this.state.invalidNames.includes(record.canName) ? (
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
  renderMobileTable = (
    item: IBucket,
    bpCandidates: any,
    compoundInterestBucketId: string
  ) => {
    const no = String(item.index);
    const badgeRow = item.selfStakingBucket ? "BadgeRow" : "";

    const badges = [];
    if (item.selfStakingBucket) {
      badges.push(<StakeTag text={t("my_stake.self_staking")} />);
    }
    if (isBurnDrop(item)) {
      badges.push(<StakeTag text={t("my_stake.burn-drop")} />);
    }

    if (Number(item.index) === Number(compoundInterestBucketId)) {
      badges.push(
        <StakeTag text={t("my_stake.set_compound_interest_bucket")} />
      );
    }
    const hasBadges = badges.length > 0;
    const candidateInfo = bpCandidates[item.canName];

    const header = (
      <div>
        {hasBadges && (
          <Flex alignContent={"flex-start"} justifyContent={"left"}>
            {badges.map((item) => item)}
          </Flex>
        )}
        <Flex justifyContent={"space-between"} flexDirection={"row"}>
          <div>
            {candidateInfo && (
              <Avatar
                alt="AV"
                shape="circle"
                src={convertHttps(candidateInfo.logo)}
                size={40}
                style={{ margin: "8px 10px 8px 0" }}
              />
            )}
            <Flex
              float={"right"}
              column={true}
              color={colors.black}
              padding={"7px 0"}
              alignItems={"baseline"}
            >
              <BoldText>
                {
                  // @ts-ignore
                  t("my_stake.order_no", { no })
                }
              </BoldText>
              <BoldText style={{ whiteSpace: "nowrap" }}>
                {t("my_stake.native_staked_amount_format", {
                  amountText: item.stakedAmount.toNumber().toLocaleString(),
                })}
              </BoldText>
            </Flex>
          </div>
          <Flex>
            <Dropdown overlay={renderActionMenu(item)} trigger={["click"]}>
              <Button style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                {t("my_stake.edit.row")} <DownOutlined />
              </Button>
            </Dropdown>
          </Flex>
        </Flex>
      </div>
    );

    const data = [
      {
        title: t("my_stake.vote_for"),
        value: <span style={{ color: colors.primary }}>{item.canName}</span>,
      },
      {
        title: t("my_stake.stake_duration"),
        value: (
          <Flex column={true} alignItems={"flex-end"}>
            <span style={{ float: "right" }}>
              {
                // @ts-ignore
                t("my_stake.duration_epochs", {
                  stakeDuration: item.stakedDuration,
                })
              }
            </span>
            <TimeSpan>
              {t("my_stake.from_time", {
                startTime: item.stakeStartTime
                  ? dateformat(item.stakeStartTime, "yyyy/mm/dd")
                  : "-",
              })}
            </TimeSpan>
          </Flex>
        ),
      },
      {
        title: t("my_stake.nonDecay"),
        value: item.autoStake ? (
          <CheckOutlined
            style={{ color: colors.VERIFYING, fontSize: "20px" }}
          />
        ) : (
          <MinusOutlined style={{ color: colors.MISSED, fontSize: "24px" }} />
        ),
      },
      {
        title: t("my_stake.bucket_status"),
        value: item.status,
      },
    ];

    return (
      <List
        style={{ width: "100%", marginTop: 20 }}
        className={badgeRow}
        size="small"
        header={header}
        bordered={true}
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ minHeight: 50 }}>
            <span style={{ color: colors.text01, fontWeight: "bold" }}>
              {item.title}
            </span>
            <span style={{ float: "right" }}>{item.value}</span>
          </List.Item>
        )}
      />
    );
  };

  // tslint:disable-next-line:max-func-body-length
  render(): JSX.Element {
    const bpCandidates: any = [];
    const { dataSource } = this.props;
    const { compoundInterestBucketId } = this.state;

    // @ts-ignore
    const DisplayMyStakeCols = (bpCandidates: any): Array<any> =>
      // tslint:disable-next-line:max-func-body-length
      [
        {
          title: (
            <b style={{ marginLeft: "19px" }}>{t("my_stake.staking_bucket")}</b>
          ),
          dataIndex: "index",
          className: "BorderTop BorderLeft BorderBottom",
          // @ts-ignore
          render(text: any, record: IBucket): JSX.Element {
            const no = String(record.index);
            const badges = [];
            if (record.selfStakingBucket) {
              badges.push(<StakeTag text={t("my_stake.self_staking")} />);
            }
            if (isBurnDrop(record)) {
              badges.push(<StakeTag text={t("my_stake.burn-drop")} />);
            }
            if (record.index === Number(compoundInterestBucketId)) {
              badges.push(
                <StakeTag text={t("my_stake.set_compound_interest_bucket")} />
              );
            }
            const hasBadges = badges.length > 0;
            const candidateInfo = bpCandidates[record.canName];
            return (
              <Flex
                column={true}
                alignItems={"baseline"}
                paddingLeft={"12px"}
                paddingBottom={"5px"}
                media={{
                  [media.media700]: {
                    paddingLeft: "8px",
                  },
                }}
              >
                {hasBadges && (
                  <Flex
                    alignContent={"flex-start"}
                    justifyContent={"left"}
                    nowrap={true}
                    marginLeft={"-10px"}
                    marginTop={"-12px"}
                  >
                    {badges.map((item) => item)}
                  </Flex>
                )}
                <Flex
                  minWidth={"160px"}
                  alignContent={"flex-start"}
                  justifyContent={"left"}
                  marginTop={`${hasBadges ? "8px" : "15px"}`}
                >
                  {candidateInfo && (
                    <Avatar
                      alt="AV"
                      shape="circle"
                      src={convertHttps(candidateInfo.logo)}
                      size={40}
                      style={{ margin: "5px 10px 2px 0" }}
                    />
                  )}

                  <Flex
                    column={true}
                    alignItems={"baseline"}
                    color={colors.black}
                    width={"100px"}
                    padding={"7px 0"}
                    media={{
                      [media.media700]: {
                        width: "100%",
                      },
                    }}
                  >
                    <BoldText style={{ whiteSpace: "nowrap" }}>
                      {
                        // @ts-ignore
                        t("my_stake.order_no", { no })
                      }
                    </BoldText>
                    <BoldText style={{ whiteSpace: "nowrap" }}>
                      {t("my_stake.native_staked_amount_format", {
                        amountText: record.stakedAmount
                          .toNumber()
                          .toLocaleString(),
                      })}
                    </BoldText>
                  </Flex>
                </Flex>
                <Flex column={true} width={"100%"} padding={"1px 0 1px 0"}>
                  <StatisticSpan style={{ width: "50%" }}>
                    {t("my_stake.staking_power")}
                  </StatisticSpan>
                  <StatisticValue style={{ width: "50%" }}>
                    {t("my_stake.staking_power.estimate", {
                      total: getPowerEstimationForBucket(record)
                        .dp(1, 1)
                        .toLocaleString(),
                    })}
                  </StatisticValue>
                </Flex>
              </Flex>
            );
          },
        },
        {
          title: (
            <span style={{ whiteSpace: "nowrap" }}>
              {t("my_stake.vote_for")}
            </span>
          ),
          dataIndex: "canName",
          className: "BorderTop BorderBottom",
          render: this.renderAction,
        },
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
                      : "-",
                  })}
                </TimeSpan>
              </Flex>
            );
          },
        },
        {
          title: (
            <span style={{ whiteSpace: "nowrap" }}>
              {t("my_stake.nonDecay")}
            </span>
          ),
          dataIndex: "autoStake",
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
          },
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
          },
        },
        {
          title: "",
          className: "BorderTop BorderBottom BorderRight",
          // @ts-ignore
          render(text: any, record: IBucket): JSX.Element {
            return (
              <Dropdown overlay={renderActionMenu(record)} trigger={["click"]}>
                <Button style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {t("my_stake.edit.row")} <DownOutlined />
                </Button>
              </Dropdown>
            );
          },
        },
      ];
    // @ts-ignore
    // @ts-ignore
    return (
      <>
        {/*
                // @ts-ignore */}
        <Query
          query={GET_ALL_CANDIDATES_ID_NAME}
          client={webBpApolloClient}
          ssr={false}
        >
          {({ data }: QueryResult<{ bpCandidates: TBpCandidate }>) => {
            if (data && Array.isArray(data.bpCandidates)) {
              data.bpCandidates.forEach(
                (i: { status: string; registeredName: string | number }) => {
                  // @ts-ignore
                  bpCandidates[i.registeredName] = i;
                }
              );
            }
            return (
              <Flex
                alignItems={"flex-start"}
                media={{
                  [media.media1024]: {
                    flexDirection: "column !important",
                  },
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
                      marginRight: "0 !important",
                    },
                  }}
                >
                  {(!isIoPayMobile ||
                    !!(
                      dataSource && dataSource.length === 0
                    )) /*
            // @ts-ignore */ && (
                    <Table
                      className={"MyStakeInfo"}
                      rowClassName={this.setRowClassName}
                      style={{ width: "100%" }}
                      pagination={{ pageSize: 6 }}
                      columns={DisplayMyStakeCols(bpCandidates)}
                      dataSource={dataSource}
                      showHeader={!!(dataSource && dataSource.length > 0)}
                      rowKey="index"
                    />
                  )}
                  {isIoPayMobile && (
                    <div
                      className="mobileVotes"
                      style={{ width: "100%", marginBottom: 40 }}
                    >
                      {dataSource &&
                        dataSource.length > 0 &&
                        dataSource.map((item) => {
                          return this.renderMobileTable(
                            item,
                            bpCandidates,
                            compoundInterestBucketId
                          );
                        })}
                    </div>
                  )}
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
          }}
        </Query>
      </>
    );
  }
}

export { MyVotesTable };
const StatisticSpan = styled("span", {
  fontSize: "10px",
  color: colors.black80,
});
const StatisticValue = styled("span", {
  fontSize: "10px",
  color: colors.black95,
});
const BoldText = styled("b", {
  fontSize: "12px",
});
const TimeSpan = styled("span", {
  fontSize: "10px",
  color: colors.black80,
});
const CellSpan = styled("span", {
  fontSize: "12px",
  color: colors.black,
  padding: "3px 0",
});

export const StakeTag = ({ text }: { text: string }) => (
  <Tag color={colors.badgeTag} style={stakeBadgeStyle}>
    {text}
  </Tag>
);
