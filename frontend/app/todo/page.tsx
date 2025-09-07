"use client"

import React, { useEffect, useState, FC } from 'react'
import TodoModal from "@/components/todo";
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/header';
import DatePicker from 'react-datepicker';
import withAuth from '@/hoc/withAuth';
import { useActivities, useDeleteActivity, useUpdateToDoneActivity } from '@/hooks/useActivities';
import { getPriorityColor, getStatusColor } from "@/helper/helper";
import toast from "react-hot-toast";
import { ActivityPayload } from '@/services/activity';

interface Activity {
    id: number;
    nama: string;
    deskripsi: string;
    tanggal: Date;
    priority: "high" | "medium" | "low";
    status: string;
}


const Todo: FC = () => {
    const updateMutation = useUpdateToDoneActivity();
    const deleteMutation = useDeleteActivity();
    const userId = useAuthStore.getState().user?.id ?? "";

    const { token, hasHydrated } = useAuthStore();
    const [allDates, setAllDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentActivity, setCurrentActivity] = useState<ActivityPayload | null>(null);

    const { data, isLoading } = useActivities(
        selectedDate.toLocaleDateString(),
        userId
    );

    const [showModal, setShowModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
    const [confirmAction, setConfirmAction] = useState<null | { type: "complete" | "delete"; id: number }>(null);

    const toggleOpenEdit = (activity: ActivityPayload) => {
        if (hasHydrated && token) {
            setCurrentActivity(activity);
            setShowModal(true);
        }
    };

    const handleOpenModal = () => {
        if (hasHydrated && token) {
            setShowModal(true);
        }
    };

    const toggleComplete = (id: number) => {
        setConfirmAction({ type: "complete", id });
    };

    const toggleDelete = (id: number) => {
        setConfirmAction({ type: "delete", id });
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction.type === "complete") {
            updateMutation.mutate(confirmAction.id, {
                onSuccess: () => toast.success("Activity marked as done"),
            });
        } else if (confirmAction.type === "delete") {
            deleteMutation.mutate(confirmAction.id, {
                onSuccess: () => toast.success("Activity deleted successfully"),
            });
        }

        setConfirmAction(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentActivity(null);
    };

    useEffect(() => {
        if (!selectedMonth) return;

        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const dates: Date[] = [];

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(new Date(year, month, i));
        }

        setAllDates(dates);
    }, [selectedMonth]);

    return (
        <div className="h-screen w-screen  bg-black text-white flex flex-col relative">
            <Header />
            <div className="w-full  pb-[-20rem] max-w-6xl mx-auto flex flex-col gap-8 backdrop-blur-md  border border-white/10 rounded-2xl shadow-2xl p-6">
                <div className="bg-white/10 border border-white/10 rounded-xl p-6 shadow-lg">
                    <div className='flex items-center justify-between'>
                        <DatePicker
                            selected={selectedMonth}
                            onChange={(date: Date | null) => setSelectedMonth(date)}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#06bcd4] w-full"
                        />
                        <button
                            className=" bottom-10 right-10 bg-[#06bcd4] text-white px-7 py-3 rounded-full font-semibold shadow-lg hover:bg-white hover:text-black hover:shadow-xl transition-transform duration-300 cursor-pointer"
                            onClick={handleOpenModal}
                        >
                            Add New Activity
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-2 py-5">
                        {allDates.map((date, i) => {
                            const isActive = selectedDate.toDateString() === date.toDateString();

                            const dayNumber = date.getDate();
                            const dayName = date.toLocaleDateString("en-US", {
                                weekday: "short",
                            });

                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`min-w-[80px] text-center rounded-2xl p-4 transition-all duration-300 cursor-pointer 
              ${isActive
                                            ? "bg-white text-black shadow-xl scale-105"
                                            : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:shadow-lg"}`}
                                >
                                    <p
                                        className={`text-xs ${isActive
                                            ? "text-gray-700"
                                            : isWeekend
                                                ? "text-red-500"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {dayName}
                                    </p>
                                    <h3
                                        className={`text-lg font-bold ${isActive
                                            ? "text-black"
                                            : isWeekend
                                                ? "text-red-500"
                                                : "text-white"
                                            }`}
                                    >
                                        {dayNumber}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedDate &&
                            selectedDate.toDateString() === new Date().toDateString()
                            ? "Today"
                            : selectedDate?.toDateString()}{" "}
                        Todo List
                    </h2>

                    <div className="relative pl-0 h-[550px] py-5 overflow-y-scroll">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-12 h-12 border-4 border-t-transparent border-[#06bcd4] rounded-full animate-spin"></div>
                            </div>
                        ) : data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="text-sm">
                                    No tasks for {selectedDate.toDateString()} 🎉
                                </p>
                            </div>
                        ) : (
                            data?.map((event: Activity) => (
                                <div
                                    key={event.id}
                                    className="relative flex items-center mb-3 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center gap-4 mt-1.5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={event.status === "Done"}
                                                onChange={
                                                    event.status === "Done" || event.status === "Cancelled"
                                                        ? undefined
                                                        : () => toggleComplete(event.id)
                                                }
                                                disabled={event.status === "Done" || event.status === "Cancelled"}
                                                className="sr-only"
                                                id={`checkbox-${event.id}`}
                                            />

                                            <label
                                                htmlFor={`checkbox-${event.id}`}
                                                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-300
    ${event.status === "Done"
                                                        ? "bg-green-500 border-green-500 text-white cursor-not-allowed opacity-70"
                                                        : event.status === "Cancelled"
                                                            ? "bg-gray-500 border-gray-500 text-white cursor-not-allowed opacity-70"
                                                            : "border-gray-600 text-transparent cursor-pointer"
                                                    }`}
                                            >
                                                {event.status === "Done" ? "✓" : ""}
                                            </label>

                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDelete(event.id);
                                            }}
                                            disabled={event.status === "Done" || event.status === "Cancelled"}
                                            className={`transition ${event.status === "Done" || event.status === "Cancelled"
                                                ? "text-gray-500 cursor-not-allowed opacity-50"
                                                : "text-gray-400 hover:text-red-500 cursor-pointer"
                                                }`}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>


                                    <div
                                        onClick={() =>
                                            event.status === "Done" || event.status === "Cancelled"
                                                ? null
                                                : toggleOpenEdit(event)
                                        }
                                        className={`ml-4 flex-1 px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 ${event.status === "Done" || event.status === "Cancelled"
                                            ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-800 hover:bg-gray-900 hover:shadow-xl scale-[1.01] cursor-pointer"
                                            }`}
                                    >
                                        <div className="flex justify-between mt-0 items-center">
                                            <h3 className="text-white font-semibold text-lg">{event.nama}</h3>
                                            <div className="flex gap-2">
                                                <span
                                                    className={`text-xs capitalize px-2 py-1 rounded-full text-white ${getStatusColor(
                                                        event.status
                                                    )}`}
                                                >
                                                    {event.status}
                                                </span>
                                                <span
                                                    className={`text-xs capitalize px-2 py-1 rounded-full text-white ${getPriorityColor(
                                                        event.priority
                                                    )}`}
                                                >
                                                    {event.priority}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 text-sm mt-1">{event.deskripsi}</p>

                                        <div className="flex justify-between mt-3 items-center">
                                            <span className="text-xs text-gray-400">
                                                {new Date(event.tanggal).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>



                </div>

                {confirmAction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Are you sure you want to{" "}
                                <span className="text-[#06bcd4] font-semibold">
                                    {confirmAction.type === "complete" ? "mark this activity as done" : "cancel this activity"}
                                </span>
                                ?
                            </h2>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={handleConfirm}
                                    className="px-4 py-2 bg-[#06bcd4] hover:bg-[#05a9bd] text-white rounded-lg"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {showModal && (
                    <TodoModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        handleCloseModal={handleCloseModal}
                        selectedDate={selectedDate}
                        currentActivity={currentActivity}
                    />
                )}
            </div>
        </div>
    )
}

export default withAuth(Todo); 