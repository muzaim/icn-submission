import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import {
	ActivityPayload,
	deleteActivity,
	getAllActivities,
	updateActivity,
	updateToDoneActivity,
} from "@/services/activity";
import { useQueryClient } from "@tanstack/react-query";

export function useActivities(date: string, userId: string) {
	return useApiQuery(
		["activities", date, userId],
		() => getAllActivities(date),
		{
			staleTime: 1000 * 60 * 5,
		}
	);
}

export function useUpdateToDoneActivity() {
	const queryClient = useQueryClient();
	return useApiMutation((id: number) => updateToDoneActivity(id), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useUpdateActivity() {
	const queryClient = useQueryClient();
	return useApiMutation(
		(activity: ActivityPayload) => updateActivity(activity),
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["activities"] });
			},
		}
	);
}

export function useDeleteActivity() {
	const queryClient = useQueryClient();
	return useApiMutation((id: number) => deleteActivity(id), {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}
