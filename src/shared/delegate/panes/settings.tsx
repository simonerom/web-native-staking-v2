import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { t } from "onefx/lib/iso-i18n";
import React, { ReactNode } from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { Button } from "../../common/button";
import { CommonMargin } from "../../common/common-margin";
import { Flex } from "../../common/flex";

const Settings = connect(
  (state: { base: { eth: string; userIoAddress: string | undefined } }) => ({
    eth: state.base.eth,
    userIoAddress: state.base.userIoAddress,
  })
)(
  class SettingsInner extends PureComponent<{
    eth: string;
    userIoAddress: string | undefined;
  }> {
    render(): ReactNode {
      const { eth, userIoAddress } = this.props;
      const addr = userIoAddress
        ? userIoAddress
        : eth
        ? fromBytes(Buffer.from(String(eth).replace(/^0x/, ""), "hex")).string()
        : "";

      return (
        <Flex width="100%" column={true} alignItems="flex-start">
          <h1>{t("profile.settings")}</h1>
          {
            <p
              dangerouslySetInnerHTML={{
                __html: t("profile.settings.content", {
                  ioAddress: addr,
                  ethAddress: eth,
                }),
              }}
            />
          }
          <CommonMargin />
          <div>
            <Button secondary={true} href="/logout">
              {t("auth/sign_out")}
            </Button>
          </div>
        </Flex>
      );
    }
  }
);

export { Settings };
