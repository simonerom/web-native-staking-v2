import Button from "antd/lib/button";
import Carousel from "antd/lib/carousel";
import Dropdown from "antd/lib/dropdown";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { TBpCandidate } from "../../types";
import { webBpApolloClient } from "../common/apollo-client";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { cloudinaryImage, Image } from "../common/image";
import { colors } from "../common/styles/style-color";
import { media } from "../common/styles/style-media";
import { GET_ALL_CANDIDATES_ID_NAME } from "../staking/smart-contract-gql-queries";
// @ts-ignore
import votingBannerSetting from "./mock/votingBannerSetting";
import { VotingButton } from "./vote-button-modal";

const buyIotxList = [
  {
    href: "https://www.binance.com/en/trade/IOTX_BTC",
    src: "voting-website/binance.png",
  },
  {
    href: "https://www.huobi.be/en-us/exchange/iotx_usdt/",
    src: "voting-website/huobi-brand.png",
  },
  {
    href: "https://gateio.io/trade/IOTX_USDT",
    src: "voting-website/gate.png",
  },
  {
    href: "https://upbit.com/exchange?code=CRIX.UPBIT.BTC-IOTX",
    src: "voting-website/upbit.svg",
  },
  {
    href: "https://www.kucoin.com/#/trade/IOTX-BTC",
    src: "voting-website/kucoin.png",
  },
  {
    href: "https://international.bittrex.com/Market/Index?MarketName=BTC-IOTX",
    src: "voting-website/bittrex.png",
  },
  {
    href: "https://www.mxc.com/trade/easy#IOTX_USDT",
    src: "voting-website/MXC.png",
  },
  {
    href: "https://coindcx.com/trade/IOTXBTC",
    src: "voting-website/coindcx_white.svg",
  },
  {
    href: "https://bilaxy.com/trade/IOTX_ETH",
    src: "voting-website/bilaxy.png",
  },
  {
    href: "https://www.citex.co.kr",
    src: "voting-website/citex.png",
  },
  {
    href: "https://coinone.co.kr",
    src: "voting-website/coinone.png",
  },
  {
    href: "https://hitbtc.com/exchange/IOTX-to-BTC",
    src: "voting-website/HitBTC.png",
  },
  {
    href: "https://www.hotbit.io/exchange?symbol=IOTX_USDT",
    src: "voting-website/Hotbit.png",
  },
  {
    href: "https://www.elitex.io/#/en-US/trade/home?symbol=IOTX_BTC",
    src: "voting-website/elitex.png",
  },
  {
    href: "https://changelly.com/exchange/btc/iotx",
    src: "voting-website/changelly.svg",
  },
  {
    href: "https://swapspace.co/?from=btc&to=iotx&amount=0.1",
    src: "voting-website/swapspace.svg",
  },
  {
    href: "https://simpleswap.io/",
    src: "voting-website/simpleswap.svg",
  },
  {
    href: "https://swapzone.io/?to=iotx",
    src: "voting-website/swapzone.png",
  },
];

interface AdminSettingItem {
  href: string;
  desktop: string;
  mobile: string;
}

const BannerTitle = (): JSX.Element => {
  return (
    <div style={{ textAlign: "left" }}>
      {/*
        // @ts-ignore */}
      <BannerTitleSpan
        style={{
          fontSize: 20,
          lineHeight: 2,
          padding: "0",
          color: colors.black,
        }}
        // @ts-ignore
        media={{
          [media.palm]: { fontSize: "16px" },
        }}
      >
        {t("voting.banner_title")}
      </BannerTitleSpan>
    </div>
  );
};
type Props = {
  displayMobileList: Boolean;
  isInAppWebview: Boolean;
  showVotingModal(record: Object | null): void;
  isMobile?: boolean;
  isIoPayMobile?: boolean;
  openApp(): void;
};
type State = { showBuyIotx: Boolean; isBlur: Boolean };

// @ts-ignore
@connect((state) => ({
  // @ts-ignore
  isIoPayMobile: state.base.isIoPayMobile,
  // @ts-ignore
  isInAppWebview: state.base.isInAppWebview,
  // @ts-ignore
  isMobile: state.base.isMobile,
}))
class VotingBanner extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showBuyIotx: false,
      isBlur: false,
    };
  }

  showBuyIotxBtn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { showBuyIotx } = this.state;
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showBuyIotx: !showBuyIotx,
    });
  };
  getCarouselData = (
    data: Array<AdminSettingItem>
  ): Array<AdminSettingItem> => {
    if (!data) {
      return [];
    }

    const getImgUrl = (url: string) =>
      /^http[s]?:\/\/.*/.test(url) ? url : assetURL(url);
    return data.map(({ desktop, mobile, href }) => ({
      href,
      desktop: getImgUrl(desktop),
      mobile: getImgUrl(mobile),
    }));
  };
  showBuyIotxByhover = (showBuyIotx: Boolean) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    const { displayMobileList } = this.props;
    if (!displayMobileList) {
      this.setState({
        showBuyIotx,
      });
    }
  };

  ioPayIsInstall = () => {
    this.props.openApp();
    setTimeout(() => {
      if (!this.state.isBlur) {
        location.href = "https://iopay.iotex.io";
      }
    }, 3000);
  };

  componentDidMount(): void {
    window.onblur = () => {
      this.setState({
        isBlur: true,
      });
    };
  }

  // tslint:disable-next-line:max-func-body-length
  render(): JSX.Element {
    const { items } = votingBannerSetting;
    const {
      isInAppWebview,
      displayMobileList,
      isIoPayMobile,
      isMobile,
    } = this.props;
    return (
      // @ts-ignore
      <Image
        className="vote-banner"
        style={{
          backgroundSize: "cover",
          position: "relative",
          width: "100%",
        }}
      >
        <Flex width="100%">
          <Flex column={true} width="50%" media={flexMedia}>
            <div
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <BannerTitle />
              <Query
                query={GET_ALL_CANDIDATES_ID_NAME}
                client={webBpApolloClient}
                ssr={false}
              >
                {({ data }: QueryResult<{ bpCandidates: TBpCandidate }>) => {
                  if (!data || !Array.isArray(data.bpCandidates)) {
                    return null;
                  }
                  const delegatesCount = String(data.bpCandidates.length);

                  return (
                    <div
                      style={{
                        marginTop: "16px",
                      }}
                    >
                      {displayMobileList && !isInAppWebview ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t("voting.banner_content.other_browser", {
                              delegatesCount,
                            }),
                          }}
                        />
                      ) : (
                        t("voting.banner_content", { delegatesCount })
                      )}
                    </div>
                  );
                }}
              </Query>

              <CommonMargin
                style={{
                  display: "flex",
                  marginLeft: 0,
                  marginTop: "24px",
                }}
              >
                {isMobile && !isIoPayMobile ? (
                  <VotingButton
                    launch={() => {
                      this.ioPayIsInstall();
                    }}
                    extra={{
                      style: {
                        background: colors.primary,
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    {t("my_stake.button.vote_with_iopay")}
                  </VotingButton>
                ) : (
                  <VotingButton
                    launch={() => {
                      this.props.showVotingModal(null);
                    }}
                    extra={{
                      style: {
                        background: colors.primary,
                        borderColor: colors.primary,
                      },
                    }}
                  >
                    {t("candidates.vote_now")}
                  </VotingButton>
                )}
                <BuyButtonWrapper>
                  {this.props.displayMobileList ? (
                    <Button
                      type="default"
                      style={{ width: "100%" }}
                      onClick={this.showBuyIotxBtn}
                    >
                      {t("voting.buy_iotx")}
                    </Button>
                  ) : (
                    <Dropdown
                      // @ts-ignore
                      visible={this.state.showBuyIotx}
                      overlay={<div />}
                      onVisibleChange={(showBuyIotx) =>
                        this.setState({ showBuyIotx })
                      }
                    >
                      <Button
                        type="default"
                        style={{ width: "100%" }}
                        onClick={this.showBuyIotxBtn}
                      >
                        {t("voting.buy_iotx")}
                      </Button>
                    </Dropdown>
                  )}
                </BuyButtonWrapper>
              </CommonMargin>
            </div>
          </Flex>
          <Flex
            width="50%"
            media={{
              [media.lap]: {
                width: "100%",
                height: "140px",
                padding: "0px",
              },
              [media.palm]: {
                width: "100%",
                height: "120px",
                padding: "0px",
              },
            }}
            height="220px"
            column={true}
            center={true}
            padding={"24px 0 24px 24px"}
          >
            <IotexCarousel>
              {this.getCarouselData(items).map(
                ({ href, desktop, mobile }, index) => (
                  <LinkWrapper href={href} key={index}>
                    <Img bannerUrl={{ desktop, mobile }} />
                  </LinkWrapper>
                )
              )}
            </IotexCarousel>
          </Flex>

          <OverLay
            className="BannerContainer"
            style={{
              display: this.state.showBuyIotx ? "flex" : "none",
              justifyContent: "space-between",
            }}
            onMouseEnter={this.showBuyIotxByhover(true)}
            onMouseLeave={this.showBuyIotxByhover(false)}
          >
            {buyIotxList.map((item, index) => (
              <a key={index} href={item.href} target="_blank" rel="noreferrer">
                <Image
                  width={"195px"}
                  height={"auto"}
                  src={assetURL(item.src)}
                />
              </a>
            ))}
          </OverLay>
        </Flex>
      </Image>
    );
  }
}

export { VotingBanner };

const BuyButtonWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  marginLeft: "40px",
});
const flexMedia = {
  [media.lap]: {
    width: "100%",
    padding: "0px",
  },
  [media.palm]: {
    width: "100%",
    padding: "0px",
  },
};
const BannerTitleSpan = styled("span", () => ({
  fontWeight: "bold",
  lineHeight: "1.36",
  fontSize: "20px",
  padding: "0.3em",
  textAlign: "center",
  [media.palm]: { fontSize: "16px" },
  [media.lap]: { fontSize: "16px" },
}));

const IotexCarousel = styled(Carousel, {
  width: "100%",
  height: "100%",
});
const LinkWrapper = styled("a", {
  width: "100%",
  height: "100%",
});
// tslint:disable-next-line:no-any
const Img = ({ bannerUrl = {} }: any) => {
  const desktop =
    bannerUrl.desktop &&
    (bannerUrl.desktop.indexOf("http") === -1
      ? bannerUrl.desktop
      : cloudinaryImage(bannerUrl.desktop).changeWidth(500).cdnUrl());
  const mobile =
    bannerUrl.mobile &&
    (bannerUrl.mobile.indexOf("http") === -1
      ? bannerUrl.mobile
      : cloudinaryImage(bannerUrl.mobile).changeWidth(500).cdnUrl());
  const ImageBg = styled("div", {
    backgroundImage: `url("${desktop}")`,
    [media.palm]: {
      backgroundImage: `url("${mobile}")`,
    },
    [media.lap]: {
      backgroundImage: `url("${mobile}")`,
    },
    backgroundSize: "contain",
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  });
  return <ImageBg />;
};
const OverLay = styled("div", {
  width: "100%",
  position: "absolute",
  background: "#0d0f1a",
  top: "calc(100% - 8px)",
  padding: "16px",
  zIndex: 10,
  textAlign: "center",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  [media.lap]: {
    top: "calc(100% - 140px)",
  },
  [media.palm]: {
    top: "calc(100% - 120px)",
  },
});
