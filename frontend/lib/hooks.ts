import { useState, useEffect } from "react";
import { useContractEvent, useContractRead, useAccount } from "wagmi";

interface CustomContractReadResult {
  data: any;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useCustomContractRead = (
  address: any,
  abi: any,
  functionName: string,
  args: any[]
): CustomContractReadResult => {
  const [result, setResult] = useState<any>(null);
  const { data, error, isLoading, isSuccess, isError } = useContractRead({
    address,
    abi,
    functionName,
    args,
  });

  //   useEffect(() => {
  //     if (isSuccess) {
  //       // Process the data as needed
  //       setResult(data);
  //     }
  //   }, [data, isSuccess]);

  return { data, error, isLoading, isSuccess, isError };
};
