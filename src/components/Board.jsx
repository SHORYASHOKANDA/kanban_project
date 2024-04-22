import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
    const [tasks, setTasks] = useState({
        completed: [],
        incomplete: [],
        backlog: [],
        inReview: []
    });

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos")
            .then(response => response.json())
            .then(json => {
                const completedTasks = json.filter(task => task.completed);
                const incompleteTasks = json.filter(task => !task.completed);
                setTasks({
                    completed: completedTasks,
                    incomplete: incompleteTasks,
                    backlog: [],
                    inReview: []
                });
            });
    }, []);

    const handleDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) return;

        const updatedTasks = moveTask(source.droppableId, destination.droppableId, draggableId);
        setTasks(updatedTasks);
    };

    const moveTask = (sourceId, destinationId, taskId) => {
        const updatedTasks = { ...tasks };
        const task = findTaskById(taskId);

        updatedTasks[sourceId] = removeTaskById(tasks[sourceId], taskId);
        task.completed = destinationId === "completed"; // Assuming "completed" is the id for completed tasks
        updatedTasks[destinationId] = [task, ...tasks[destinationId]];

        return updatedTasks;
    };

    const findTaskById = id => {
        const allTasks = [
            ...tasks.completed,
            ...tasks.incomplete,
            ...tasks.backlog,
            ...tasks.inReview
        ];
        return allTasks.find(item => item.id === id);
    };

    const removeTaskById = (array, id) => {
        return array.filter(item => item.id !== id);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "1300px",
                    margin: "0 auto"
                }}
            >
                <Column title={"TO DO"} tasks={tasks.incomplete} id={"incomplete"} />
                <Column title={"DONE"} tasks={tasks.completed} id={"completed"} />
                <Column title={"IN REVIEW"} tasks={tasks.inReview} id={"inReview"} />
                <Column title={"BACKLOG"} tasks={tasks.backlog} id={"backlog"} />
            </div>
        </DragDropContext>
    );
}
