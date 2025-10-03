"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { loadState, saveState } from "@/lib/localStorage";
import { toast } from "sonner";

interface ScheduleItem {
  id: string;
  task: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = "timeScheduleTasks";

// Predefined tasks for initial load if localStorage is empty
const initialDailyTasks: ScheduleItem[] = [
  { id: "task-1", task: "Wake up: 5:30 am", completed: false },
  { id: "task-2", task: "Study time: 5:45 am - 6:50 am", completed: false }, // Updated
  { id: "task-7", task: "Shower: 6:50 am - 7:00 am", completed: false }, // New task
  { id: "task-3", task: "Class start: 8:30 am", completed: false },
  { id: "task-4", task: "Gym: 5:30 pm - 7:00 pm", completed: false },
  { id: "task-5", task: "Cook and Study: 8:30 pm", completed: false },
  { id: "task-6", task: "Light walking: 8:45 pm - 9:00 pm", completed: false },
];

const TimeSchedule = () => {
  const [tasks, setTasks] = useState<ScheduleItem[]>(() =>
    loadState(LOCAL_STORAGE_KEY, initialDailyTasks) // Use initialDailyTasks as default
  );
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");

  useEffect(() => {
    saveState(LOCAL_STORAGE_KEY, tasks);
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      toast.error("Task cannot be empty.");
      return;
    }
    const id = crypto.randomUUID();
    setTasks([...tasks, { id, task: newTask, completed: false }]);
    setNewTask("");
    toast.success("Task added successfully!");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.info("Task status updated.");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted.");
  };

  const handleEditTask = (id: string, currentText: string) => {
    setEditingTaskId(id);
    setEditingTaskText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (editingTaskText.trim() === "") {
      toast.error("Task cannot be empty.");
      return;
    }
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, task: editingTaskText } : task
      )
    );
    setEditingTaskId(null);
    setEditingTaskText("");
    toast.success("Task updated successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Time Schedule</h1>
      <p className="text-muted-foreground">Manage your daily activities and tasks.</p>

      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Input
            placeholder="e.g., Finish project report"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks added yet. Start by adding a new task above!</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-background"
                >
                  <div className="flex items-center flex-1">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mr-3"
                    />
                    {editingTaskId === task.id ? (
                      <Input
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        onBlur={() => handleSaveEdit(task.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(task.id);
                          }
                        }}
                        className="flex-1"
                      />
                    ) : (
                      <Label
                        htmlFor={`task-${task.id}`}
                        className={task.completed ? "line-through text-muted-foreground" : ""}
                      >
                        {task.task}
                      </Label>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {editingTaskId !== task.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTask(task.id, task.task)}
                        aria-label="Edit task"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSchedule;