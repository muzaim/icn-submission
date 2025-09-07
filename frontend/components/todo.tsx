import * as Yup from "yup";
import React, { useState, FC } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useApiMutation } from "@/hooks/useApi";
import { ActivityPayload } from '@/services/activity';
import { createActivity } from "@/services/activity"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";
import { useUpdateActivity } from '@/hooks/useActivities';
import { fetchSuggestions } from '@/helper/ollama';
import { FormikHelpers } from "formik";


interface ActivityFormValues {
    nama: string;
    deskripsi: string;
    tanggal: Date | null;
    priority: string;
}
interface TodoModalProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseModal: () => void;
    selectedDate: Date;
    currentActivity: ActivityPayload | null
}

const validationSchema = Yup.object({
    nama: Yup.string().required("Activity name is required"),
    deskripsi: Yup.string().required("Description is required"),
    tanggal: Yup.string().required("Date is required"),
    priority: Yup.string().required("Priority is required"),
});

const TodoModal: FC<TodoModalProps> = ({ showModal, setShowModal, handleCloseModal, selectedDate, currentActivity }) => {
    const queryClient = useQueryClient();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const activityMutaion = useApiMutation(createActivity);
    const updateActivityMutation = useUpdateActivity();
    if (!showModal) return null;

    const getInitialValues = (activity?: ActivityPayload | null) => ({
        nama: activity?.nama || "",
        deskripsi: activity?.deskripsi || "",
        tanggal: activity?.tanggal ? new Date(activity.tanggal) : null,
        priority: activity?.priority || "",
    });


    const handleSubmit = (
        values: ActivityFormValues,
        { setSubmitting, resetForm }: FormikHelpers<ActivityFormValues>
    ) => {
        if (currentActivity?.id) {
            const payload = { id: currentActivity.id, ...values };

            updateActivityMutation.mutate(payload, {
                onSuccess: () => {
                    resetForm();
                    setShowModal(false);
                    queryClient.invalidateQueries({
                        queryKey: ["activities", selectedDate.toISOString()]
                    });
                    toast.success("Activity updated successfully");
                    handleCloseModal();
                },
                onError: () => toast.error("Failed to update activity"),
                onSettled: () => setSubmitting(false),
            });
        } else {
            activityMutaion.mutate(values, {
                onSuccess: () => {
                    resetForm();
                    setShowModal(false);
                    queryClient.invalidateQueries({
                        queryKey: ["activities", selectedDate.toISOString()]
                    });
                    toast.success("Successfully added new activity");
                    handleCloseModal();
                },
                onError: () => toast.error("Failed to add new activity"),
                onSettled: () => setSubmitting(false),
            });
        }
    };
    return (
        <Formik
            enableReinitialize
            initialValues={getInitialValues(currentActivity)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values, isSubmitting }) => {
                const handleGenerate = async () => {
                    if (!values.nama?.trim()) {
                        setSuggestions([]);
                        return;
                    }

                    try {
                        setLoading(true);
                        const result = await fetchSuggestions(values.nama);
                        setSuggestions(result);
                    } catch (error) {
                        console.error("Error fetching suggestions:", error);
                    } finally {
                        setLoading(false);
                    }
                };

                return (
                    <Form className=" w-screen overflow-hidden bg-black text-white flex items-center justify-center">
                        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50  ">
                            <div className="bg-gray-900 rounded-2xl p-10 w-full max-w-xl shadow-2xl relative">
                                <h2 className="text-2xl font-semibold mb-6 text-white">
                                    {currentActivity?.id ? "Edit Activity" : "Add New Activity"}
                                </h2>


                                <div className="flex flex-col gap-5">
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-9 flex flex-col h-full">
                                            <label className="text-gray-300 text-sm mb-1 block">
                                                Activity Name
                                            </label>
                                            <Field
                                                type="text"
                                                name="nama"
                                                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#06bcd4] w-full transition"
                                            />

                                        </div>

                                        <div className="col-span-3 flex items-end">
                                            <button
                                                onClick={handleGenerate}
                                                type="button"
                                                disabled={!values.nama?.trim()}
                                                className={`w-full px-4 py-2 rounded-lg font-medium transition
        ${!values.nama?.trim()
                                                        ? "bg-gray-500 cursor-not-allowed text-gray-300"
                                                        : "bg-[#06bcd4] hover:bg-[#05a9bd] text-white"
                                                    }`}
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="nama"
                                        component="div"
                                        className="text-red-400 text-sm mt-1"
                                    />


                                    {values.nama && (
                                        <div className="flex flex-col gap-2">
                                            {loading ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="w-12 h-12 border-4 border-t-transparent border-[#06bcd4] rounded-full animate-spin"></div>
                                                </div>
                                            ) : (
                                                suggestions.length > 0 &&
                                                !suggestions.includes(values.nama) && (
                                                    <>
                                                        Suggestions:
                                                        {suggestions.slice(0, 3).map((s, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => {
                                                                    setFieldValue("nama", s);
                                                                    setSuggestions([]);
                                                                }}
                                                                className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 shadow hover:bg-gray-700 cursor-pointer transition text-gray-200"
                                                            >
                                                                {s}
                                                            </div>
                                                        ))}
                                                    </>
                                                )
                                            )}
                                        </div>
                                    )}


                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Activity Description
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="deskripsi"
                                            rows="3"
                                            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#06bcd4] w-full transition resize-none"
                                        />
                                        <ErrorMessage
                                            name="deskripsi"
                                            component="div"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Date and Time
                                        </label>
                                        <DatePicker
                                            selected={values.tanggal}
                                            showTimeSelect
                                            onChange={(val) => setFieldValue("tanggal", val)}
                                            dateFormat="Pp"
                                            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#06bcd4] w-full transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-300 text-sm mb-1 block">
                                            Priority
                                        </label>
                                        <Field
                                            as="select"
                                            id="priority"
                                            name="priority"
                                            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#06bcd4] w-full transition"
                                        >
                                            <option value="">Select priority</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </Field>
                                        <ErrorMessage
                                            name="priority"
                                            component="div"
                                            className="text-red-400 text-sm mt-1"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || activityMutaion.isPending}
                                            className="px-6 py-2 rounded-lg bg-[#06bcd4] hover:bg-[#05a9bd] text-white font-medium transition disabled:opacity-50"
                                        >
                                            {isSubmitting || activityMutaion.isPending
                                                ? "Submitting..."
                                                : currentActivity?.id
                                                    ? "Update"
                                                    : "Add"}
                                        </button>

                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default TodoModal; 
