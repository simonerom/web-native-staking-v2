import Form from "antd/lib/form";
import { t } from "onefx/lib/iso-i18n";
import React, {useEffect, useMemo, useState} from "react";
import {Candidate, getStaking} from "../../server/gateway/staking";
import { TBpCandidate } from "../../types";
import { CommonMargin } from "../common/common-margin";
import { ProbationHistoryRate } from "./probation-history-rate";

export const DelegateParams = ({ data }: { data: TBpCandidate }) => {
  const registeredName = data && data.registeredName;
  const [endEpochNumber, setEndEpochNumber] = useState(0);
  const [candidate, setCandidate] = useState(null as Candidate|null);
  useEffect(()=>{
    if(registeredName){
      const staking = getStaking();
      staking.getEpochData().then((epochData)=>{
        setEndEpochNumber(epochData.num);
      });
      staking.getCandidate(registeredName).then((candidate)=>{
        setCandidate(candidate);
      });

    }
  },[registeredName])

  const probationHistoryRate = useMemo( ()=>{
    if(endEpochNumber){
      return <ProbationHistoryRate
        endEpochNumber={endEpochNumber}
        delegateName={registeredName}
      />;
    }
    return (
      // @ts-ignore
      <Form layout={"vertical"}>
        <Form.Item label={t("delegate.params.probationHistoricalRate")}>
          {t("delegate.params.no_registered_name")}
        </Form.Item>
      </Form>
    );
  },[endEpochNumber]);

  return <CommonMargin>
    {
      // @ts-ignore
      <Form layout={"vertical"}>
        <Form.Item label={t("delegate.params.reward")}>
          {candidate?candidate.rewardAddress:""}
        </Form.Item>
        <Form.Item label={t("delegate.params.operator")}>
          {candidate?candidate.operatorAddress:""}
        </Form.Item>
      </Form>
    }
    {probationHistoryRate}
  </CommonMargin>;
};
