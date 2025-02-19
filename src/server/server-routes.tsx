import config from "config";
import Antenna from "iotex-antenna/lib";
import isWebview from "is-ua-webview";
import isMobile from "ismobilejs";
import koa from "koa";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import { Context } from "onefx/lib/types";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import {
  getIotxbyEth,
  setIdentityProviderRoutes,
} from "../shared/onefx-auth-provider/identity-provider/identity-provider-handler";
import { Staking } from "./gateway/staking";
import { MyServer } from "./start-server";

async function setAllCandidates(ctx: Context): Promise<void> {
  const st = new Staking({
    antenna: new Antenna(config.get("iotexCore")),
  });
  const height = await st.getHeight();
  const resp = await st.getAllCandidates(0, 1000, height);
  const ownersToNames: Record<string, string> = {};
  for (const c of resp) {
    ownersToNames[c.ownerAddress] = c.name;
  }
  ctx.setState("base.ownersToNames", ownersToNames);
}

export function setServerRoutes(server: MyServer): void {
  // Health checks
  server.get("health", "/health", (ctx: koa.Context) => {
    ctx.body = "OK";
  });

  setApiGateway(server);

  server.get("v2-home-redirect", "/v2", (ctx: koa.Context) => {
    ctx.redirect("/");
  });

  server.get("v2-redirect", "/v2*", (ctx: koa.Context) => {
    const target = ctx.path.replace("/v2", "");
    ctx.redirect(target);
  });

  setIdentityProviderRoutes(server);

  // @ts-ignore
  server.get(
    "delegate-profile",
    "/profile*",
    server.auth.authRequired,
    async (ctx: Context) => {
      const user = await server.auth.user.getById(ctx.state.userId);
      ctx.setState("base.iotexCore", config.get("iotexCore"));
      ctx.setState("base.webBp", config.get("webBp"));
      ctx.setState("base.eth", user!.eth);
      ctx.setState("base.userIoAddress", getIotxbyEth(user!.eth));
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.apiToken", ctx.state.jwt);
      await setAllCandidates(ctx);
      ctx.setState(
        "staking.delegateProfileContractAddr",
        // @ts-ignore
        server.config.gateways.staking.delegateProfileContractAddr
      );
      checkingAppSource(ctx);
      ctx.body = await apolloSSR(ctx, {
        VDom: <AppContainer />,
        reducer: noopReducer,
        clientScript: "v2-main.js",
      });
    }
  );

  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: Context) => {
    ctx.setState("base.next", ctx.query.next);
    ctx.setState("base.iotexCore", config.get("iotexCore"));
    ctx.setState("base.webBp", config.get("webBp"));
    ctx.setState("base.easterHeight", config.get("easterHeight"));
    ctx.setState(
      "staking.compoundInterestContractAddr",
      // @ts-ignore
      server.config.gateways.staking.compoundInterestContractAddr
    );
    await setAllCandidates(ctx);
    checkingAppSource(ctx);
    ctx.body = await apolloSSR(ctx, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "v2-main.js",
    });
  });
}

export function checkingAppSource(ctx: koa.Context): void {
  const ua = ctx.header["user-agent"];
  if (isWebview(ua)) {
    ctx.setState("base.isInAppWebview", true);
  }
  if (isMobile(ua).any) {
    ctx.setState("base.isMobile", true);
  }
  if (
    (ua && (ua.includes("IoPayAndroid") || ua.includes("IoPayiOs"))) ||
    ctx.session.app_source === "IoPay"
  ) {
    ctx.session.app_source = "IoPay";
    ctx.setState("base.isIoPayMobile", true);
  }
}
