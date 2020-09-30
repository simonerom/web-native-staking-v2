import { toRau } from "iotex-antenna/lib/account/utils";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { getIoPayAddress, lazyGetContract } from "../../common/get-antenna";
import { COMPOUND_INTEREST_ABI } from "../native-token-abi";

export const DEFAULT_DEPOSIT_BUCKET_GAS_LIMIT = "100000";

export class CompoundInterestContract {
  contract: Contract;
  types: { [key: string]: string };

  constructor({ contractAddress }: { contractAddress: string }) {
    try {
      this.contract = lazyGetContract(contractAddress, COMPOUND_INTEREST_ABI);
    } catch (e) {
      window.console.error("failed to construct delegate profile contract");
    }
  }

  async registerBucket(bucketIndex: string): Promise<string> {
    // tslint:disable-next-line:no-unnecessary-local-variable
    const bytesResult = await this.contract.methods.register(
      Number(bucketIndex),
      {
        gasLimit: DEFAULT_DEPOSIT_BUCKET_GAS_LIMIT,
        gasPrice: toRau("1", "Qev"),
      }
    );
    return bytesResult;
  }

  async unRegisterBucket(): Promise<string> {
    // tslint:disable-next-line:no-unnecessary-local-variable
    const bytesResult = await this.contract.methods.unRegister({
      gasLimit: DEFAULT_DEPOSIT_BUCKET_GAS_LIMIT,
      gasPrice: toRau("1", "Qev"),
    });
    return bytesResult;
  }

  async queryBucket(): Promise<string> {
    const address = await getIoPayAddress();
    try {
      const result = await this.contract.methods.bucket(address, {
        gasLimit: DEFAULT_DEPOSIT_BUCKET_GAS_LIMIT,
        gasPrice: toRau("1", "Qev"),
      });
      return result.toString();
    } catch (e) {
      window.console.log("error", e.toString());
    }
    return "-1";
  }
}
