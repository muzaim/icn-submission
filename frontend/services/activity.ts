import api from "@/lib/axios";

export interface ActivityPayload {
	id?: number;
	nama: string;
	deskripsi: string;
	tanggal: Date | null;
	priority: string;
}
export const getAllActivities = async (date: string) => {
	const res = await api.post("/activity/get-by-date", { date });
	return res.data;
};

export const deleteActivity = async (id: number) => {
	const res = await api.delete(`/activity/${id}`);
	return res.data;
};

export const updateToDoneActivity = async (id: number) => {
	const res = await api.put(`/activity/done/${id}`);
	return res.data;
};
export const updateActivity = async ({ id, ...data }: ActivityPayload) => {
	const res = await api.put(`/activity/${id}`, data);
	return res.data;
};

export const createActivity = async (payload: ActivityPayload) => {
	const { data } = await api.post("/activity", payload);
	return data;
};
