import React, { useState, useEffect } from "react";
import { useEvents } from "../../hooks/PageData/useEvents";
import Spinner from "../../components/common/Spinner";
import EventCard from "./EventCard";
import AddNewEventButton from "./AddNewEventButton";

const Index: React.FC = () => {
	const { getUserEvents, loading, error } = useEvents();
	const [events, setEvents] = React.useState<any[]>([]);

	useEffect(() => {
		const fetchEvents = async () => {
			const response = await getUserEvents();
			if (response) {
				setEvents(response);
			}
		};
		fetchEvents();
	}, []);

	if (loading) return <Spinner />;
	if (error) return <div>An error occurred when loading the events</div>;

	return (
		<main className="flex flex-1 justify-center items-center flex-col w-full">
			<section className="container max-w-7xl my-10 px-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
					{events.map((event, index) => (
						<EventCard event={event} key={index} />
					))}
					{events.length === 0 && (
						<h2 className="col-span-full text-center text-xl font-bold">
							No events scheduled yet!
						</h2>
					)}
				</div>
			</section>
		</main>
	);
};

export default Index;
