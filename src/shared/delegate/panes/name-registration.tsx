/* tslint:disable:use-simple-attributes react-a11y-anchors */
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { FormInstance } from "antd/lib/form";
import Radio, { RadioChangeEvent } from "antd/lib/radio";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import notification from "antd/lib/notification";
import Switch from "antd/lib/switch";
import Tooltip from "antd/lib/tooltip";
// @ts-ignore
import window from "global/window";
import { toRau } from "iotex-antenna/lib/account/utils";
import {
  CandidateRegister,
  CandidateUpdate,
} from "iotex-antenna/lib/action/types";
import { t } from "onefx/lib/iso-i18n";
import React, { FormEvent, PureComponent, RefObject, useState } from "react";
import { connect } from "react-redux";
import { getStaking } from "../../../server/gateway/staking";
import { ownersToNames } from "../../common/apollo-client";
import { CommonMargin } from "../../common/common-margin";
import { formItemLayout } from "../../common/form-item-layout";
import { getIoPayAddress } from "../../common/get-antenna";
import { IopayRequired } from "../../common/iopay-required";
import { colors } from "../../common/styles/style-color2";
import {
  DEFAULT_STAKING_GAS_LIMIT,
  HERMES_CONTRACT_ADDRESS,
} from "../../common/token-utils";
import {
  getStakeDurationMaxValue,
  smallerOrEqualTo,
  validateCanName,
  validateIoAddress,
  validateStakeDuration,
} from "../../staking/field-validators";
import { actionSmartContractCalled } from "../../staking/smart-contract-reducer";

export const min = 1200000;
export const max = 1000000000000000000000;

type Props = {
  smartContractCalled: boolean;
  actionSmartContractCalled(payload: boolean): void;
  addr: string;
  tokenContractAddr?: string;
};

type State = {
  isUpdating: boolean;
  candName?: string;
  isFetchingUpdatingInfo: boolean;
  disabled: boolean;
};

const NameRegistrationContainer = IopayRequired(
  connect(
    (state: { smartContract: { smartContractCalled: boolean } }) => {
      return {
        smartContractCalled:
          state.smartContract && state.smartContract.smartContractCalled,
      };
    },
    (disptach) => ({
      actionSmartContractCalled(payload: boolean): void {
        disptach(actionSmartContractCalled(payload));
      },
    })
  )(
    class NameRegistration extends PureComponent<Props, State> {
      constructor(props: Props) {
        super(props);
        this.state = {
          candName: "",
          isUpdating: false,
          isFetchingUpdatingInfo: true,
          disabled: true,
        };
      }

      registerFormRef: RefObject<FormInstance> = React.createRef<
        FormInstance
      >();
      updateFormRef: RefObject<FormInstance> = React.createRef<FormInstance>();

      onRegister = async (e: FormEvent) => {
        const { actionSmartContractCalled } = this.props;
        e.preventDefault();
        const form = this.registerFormRef.current;
        if (!form) {
          return;
        }
        let values;
        try {
          values = (await form.validateFields()) as CandidateRegister;
          window.console.log("values", values);
        } catch (err) {
          window.console.error(
            "failed to validateFields for name-registration",
            err
          );
          return;
        }

        try {
          await getStaking().registerCandidate({
            ...values,
            stakedAmount: toRau(values.stakedAmount, "Iotx"),
            gasLimit: DEFAULT_STAKING_GAS_LIMIT,
            gasPrice: toRau("1", "Qev"),
          });
          actionSmartContractCalled(true);
          notification.success({
            message: t("name_registration.submit.success_tip"),
          });
        } catch (error) {
          notification.error({
            message: `failed to register: ${error}`,
          });
        }
      };

      onUpdate = async (e: FormEvent) => {
        const { actionSmartContractCalled } = this.props;
        e.preventDefault();
        const form = this.updateFormRef.current;
        if (!form) {
          return;
        }
        let values;
        try {
          values = (await form.validateFields()) as CandidateUpdate;
          window.console.log("values", values);
        } catch (err) {
          window.console.error(
            "failed to validateFields for name-registration",
            err
          );
          return;
        }

        try {
          await getStaking().updateCandidate({
            ...values,
            gasLimit: DEFAULT_STAKING_GAS_LIMIT,
            gasPrice: toRau("1", "Qev"),
          });
          actionSmartContractCalled(true);
          notification.success({
            message: t("name_registration.submit.success_tip"),
          });
        } catch (error) {
          notification.error({
            message: `failed to register: ${error}`,
          });
        }
      };

      handleChange = () => {
        const { isUpdating } = this.state;
        const form = isUpdating
          ? this.updateFormRef.current
          : this.registerFormRef.current;
        this.setState({ disabled: false });
        const errors = form && form.getFieldsError();
        if (!!errors) {
          errors.map((err) => {
            if (!!err.errors.length) {
              this.setState({ disabled: true });
            }
          });
        }
      };

      async componentDidMount(): Promise<void> {
        const { isFetchingUpdatingInfo } = this.state;
        const address = await getIoPayAddress();
        if (address) {
          const candName = ownersToNames[address];
          const isUpdating = Boolean(candName);
          this.setState({ isUpdating });
          const form = isUpdating
            ? this.updateFormRef.current
            : this.registerFormRef.current;
          if (form) {
            form.setFields([
              {
                name: "ownerAddress",
                // @ts-ignore
                value: address,
              },
              {
                name: "name",
                // @ts-ignore
                value: candName,
              },
            ]);
          }
          if (isUpdating && isFetchingUpdatingInfo && candName) {
            this.setState({ candName });
            const resp = await getStaking().getCandidate(candName);
            if (resp) {
              this.setState({
                isFetchingUpdatingInfo: false,
              });
              if (!form) {
                return;
              }
              form.setFields([
                {
                  name: "operatorAddress",
                  // @ts-ignore
                  value: resp.operatorAddress,
                },
                {
                  name: "rewardAddress",
                  // @ts-ignore
                  value: resp.rewardAddress,
                },
                {
                  name: "ownerAddress",
                  // @ts-ignore
                  value: address,
                },
              ]);
            }
          }
        }
      }

      // tslint:disable-next-line:max-func-body-length
      renderUpdatingForm = (): JSX.Element => {
        const { smartContractCalled } = this.props;
        const { candName } = this.state;
        return (
          // @ts-ignore
          <Form
            onSubmit={this.onUpdate}
            onFieldsChange={this.handleChange}
            ref={this.updateFormRef}
          >
            <h1>{t("profile.register_name")}</h1>
            <CommonMargin />
            {smartContractCalled && (
              <div>
                <Alert
                  message={t("contract.called")}
                  type="success"
                  showIcon={true}
                  closable={true}
                />
              </div>
            )}
            <CommonMargin />
            <div>
              <CanNameFormItem candName={candName} />
              <OwnerAddressFormItem />
              <OperatorAddressFormItem />
              <RewardAddressFormItem formRef={this.updateFormRef} />
              <Alert
                message={
                  // tslint:disable-next-line:react-no-dangerous-html
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("profile.update-candidate.other-fields", {
                        href: "/my-votes",
                        text: "my-votes",
                      }),
                    }}
                  />
                }
                type="info"
                showIcon={true}
                banner={true}
              />
              <CommonMargin />
              <Form.Item>
                <Button
                  style={{ marginRight: "10px" }}
                  type={"primary"}
                  htmlType="submit"
                  onClick={this.onUpdate}
                  disabled={this.state.disabled}
                >
                  {t("name_registration.update")}
                </Button>
              </Form.Item>
            </div>
          </Form>
        );
      };

      // tslint:disable-next-line:max-func-body-length
      renderRegisterForm = (): JSX.Element => {
        const { smartContractCalled } = this.props;
        return (
          // @ts-ignore
          <Form
            onSubmit={this.onRegister}
            ref={this.registerFormRef}
            onFieldsChange={this.handleChange}
          >
            <h1>{t("profile.register_name")}</h1>
            <p>{t("profile.register_name.desc")}</p>
            <CommonMargin />
            {smartContractCalled && (
              <div>
                <Alert
                  message={t("contract.called")}
                  type="success"
                  showIcon={true}
                  closable={true}
                />
              </div>
            )}
            <CommonMargin />
            <div className="site-layout-content">
              <CanNameFormItem />
              <StakeAmountFormItem />
              {/*
                // @ts-ignore */}
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                label={getLabel(
                  t("name_regsitration.stakedDuration"),
                  t("name_regsitration.stakedDuration.explanation")
                )}
                name={"stakedDuration"}
                rules={[
                  {
                    required: true,
                    message: t("my_stake.stakeDuration.required"),
                  },
                  {
                    validator: validateStakeDuration(
                      getStakeDurationMaxValue(),
                      0
                    ),
                  },
                ]}
              >
                <InputNumber style={{ width: 140 }} />
              </Form.Item>
              {/*
                // @ts-ignore */}
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                label={t("name_regsitration.autoStake")}
                name={"autoStake"}
                initialValue={false}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Switch />
              </Form.Item>
            </div>
            <div className="site-layout-content">
              <OwnerAddressFormItem />
              <OperatorAddressFormItem />
              <RewardAddressFormItem formRef={this.registerFormRef} />
              <Form.Item>
                <p>
                  <b>{t("profile.register_name.submit.desc")}</b>
                </p>
                <Button
                  style={{ marginRight: "10px" }}
                  type={"primary"}
                  htmlType="submit"
                  onClick={this.onRegister}
                  disabled={this.state.disabled}
                >
                  {t("name_registration.register")}
                </Button>
              </Form.Item>
            </div>
          </Form>
        );
      };

      // tslint:disable-next-line:max-func-body-length
      render(): JSX.Element {
        const { isUpdating } = this.state;

        if (isUpdating) {
          return this.renderUpdatingForm();
        }
        return this.renderRegisterForm();
      }
    }
  )
);

const getLabel = (text: string, explanation: string) => {
  return (
    <label style={{ whiteSpace: "break-spaces" }}>
      <span style={{ marginRight: "5px" }}>{text}</span>
      <Tooltip title={<p dangerouslySetInnerHTML={{ __html: explanation }} />}>
        <InfoCircleOutlined style={{ color: colors.primary }} />
      </Tooltip>
    </label>
  );
};

const CanNameFormItem = ({ candName }: { candName?: string }) => {
  return (
    // @ts-ignore
    <Form.Item
      {...formItemLayout}
      labelAlign={"left"}
      initialValue={candName || ""}
      label={getLabel(
        t("name_regsitration.name"),
        t("name_regsitration.name.explanation")
      )}
      name={"name"}
      rules={[
        {
          required: true,
          message: t("name_regsitration.name.required"),
        },
        {
          validator: validateCanName,
        },
      ]}
    >
      <Input />
    </Form.Item>
  );
};

const StakeAmountFormItem = () => {
  return (
    // @ts-ignore
    <Form.Item
      {...formItemLayout}
      labelAlign={"left"}
      label={getLabel(
        t("name_regsitration.stakedAmount"),
        t("name_regsitration.stakedAmount.explanation")
      )}
      name={"stakedAmount"}
      rules={[
        {
          required: true,
          message: t("my_stake.stakedAmount.min", {
            min: min.toLocaleString(),
          }),
        },
        {
          validator: smallerOrEqualTo(
            max,
            min,
            t("my_stake.stakedAmount.min", { min: min.toLocaleString() })
          ),
        },
      ]}
    >
      <InputNumber
        style={{ width: 140 }}
        min={min}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
      />
    </Form.Item>
  );
};

const OwnerAddressFormItem = () => {
  return (
    // @ts-ignore
    <Form.Item
      {...formItemLayout}
      labelAlign={"left"}
      label={t("name_regsitration.owner")}
      name={"ownerAddress"}
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Input disabled={true} />
    </Form.Item>
  );
};

const OperatorAddressFormItem = () => {
  return (
    // @ts-ignore
    <Form.Item
      {...formItemLayout}
      labelAlign={"left"}
      label={getLabel(
        t("name_regsitration.operator_pub_key"),
        t("name_regsitration.operator_pub_key.explanation")
      )}
      name={"operatorAddress"}
      rules={[
        {
          required: true,
          message: t("name_regsitration.operator_pub_key.required"),
        },
        {
          validator: validateIoAddress,
        },
      ]}
    >
      <Input />
    </Form.Item>
  );
};

const RewardAddressFormItem = ({
  formRef,
}: {
  formRef?: RefObject<FormInstance>;
}) => {
  const USE_HERMES = "hermes",
    USE_OWN_ADDR = "ownAddr";
  const [radioVal, setRadioVal] = useState(USE_HERMES);
  const onCheckGroupChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setRadioVal(value);
    if (formRef && formRef.current) {
      if (value === USE_HERMES) {
        formRef.current.resetFields(["rewardAddress"]);
      } else {
        formRef.current.setFields([{ name: "rewardAddress", value: "" }]);
      }
    }
  };
  return (
    <>
      {/* // @ts-ignore */}
      <Form.Item
        {...formItemLayout}
        labelAlign={"left"}
        style={{ marginBottom: "5px" }}
        label={getLabel(
          t("name_regsitration.reward_pub_key"),
          t("name_regsitration.reward_pub_key.explanation")
        )}
        name="radioVal"
        required
      >
        <Radio.Group
          onChange={onCheckGroupChange}
          defaultValue={USE_HERMES}
          value={radioVal}
        >
          <Radio value={USE_HERMES}>
            <span
              dangerouslySetInnerHTML={{
                __html: t("profile.reward-address.use_hermes_checkbox"),
              }}
            />
          </Radio>
          <Radio value={USE_OWN_ADDR} style={{ marginLeft: 0 }}>
            {t("profile.reward-address.enter_reward_addr_checkbox")}
          </Radio>
        </Radio.Group>
      </Form.Item>

      {/* // @ts-ignore */}
      <Form.Item
        {...formItemLayout}
        labelAlign={"left"}
        style={{ marginBottom: "24px" }}
        className="form-item-clear-star"
        label={<span />}
        name={"rewardAddress"}
        initialValue={HERMES_CONTRACT_ADDRESS}
        rules={[
          {
            required: true,
            message: t("name_regsitration.reward_pub_key.required"),
          },
          {
            validator: validateIoAddress,
          },
        ]}
      >
        <Input disabled={radioVal === USE_HERMES} />
      </Form.Item>
    </>
  );
};

export { NameRegistrationContainer };
