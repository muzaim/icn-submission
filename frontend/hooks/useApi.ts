import {
	useMutation,
	UseMutationOptions,
	useQuery,
	UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useApiMutation<TData = unknown, TVariables = void>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: UseMutationOptions<
		TData,
		AxiosError<{ message: string }>,
		TVariables
	>
) {
	return useMutation<TData, AxiosError<{ message: string }>, TVariables>({
		mutationFn,
		...options,
	});
}

export function useApiQuery<TData = unknown>(
	key: string[],
	queryFn: () => Promise<TData>,
	options?: Omit<UseQueryOptions<TData, AxiosError>, "queryKey" | "queryFn">
) {
	return useQuery<TData, AxiosError>({
		queryKey: key,
		queryFn,
		...options,
	});
}
