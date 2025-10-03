"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';

interface ScheduleItem {
  id: string;
  task: string;
  completed: boolean;
}

const TimeSchedule = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [tasks, setTasks] = useState<ScheduleItem[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) {
        setTasks([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('id, task, completed')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to load tasks: " + error.message);
        setTasks([]);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [userId]);

  const handleAddTask = async () => {
    if (!userId) {
      toast.error("You must be logged in to add tasks.");
      return;
    }
    if (newTask.trim() === "") {
      toast.error("Task cannot be empty.");
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: userId, task: newTask, completed: false })
      .select('id, task, completed')
      .single();

    if (error) {
      toast.error("Failed to add task: " + error.message);
    } else if (data) {
      setTasks((prevTasks) => [data, ...prevTasks]);
      setNewTask("");
      toast.success("Task added successfully!");
    }
  };

  const handleToggleComplete = async (id: string, currentCompleted: boolean) => {
    if (!userId) {
      toast.error("You must be logged in to update tasks.");
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentCompleted })
      .eq('id', id)
      .eq('user_id', userId); // Ensure only user's own task is updated

    if (error) {
      toast.error("Failed to update task status: " + error.message);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      toast.info("Task status updated.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!userId) {
      toast.error("You must be logged in to delete tasks.");
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure only user's own task is deleted

    if (error) {
      toast.error("Failed to delete task: " + error.message);
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Task deleted.");
    }
  };

  const handleEditTask = (id: string, currentText: string) => {
    setEditingTaskId(id);
    setEditingTaskText(currentText);
  };

  const handleSaveEdit = async (id: string) => {
    if (!userId) {
      toast.error("You must be logged in to edit tasks.");
      return;
    }
    if (editingTaskText.trim() === "") {
      toast.error("Task cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ task: editingTaskText })
      .eq('id', id)
      .eq('user_id', userId); // Ensure only user's own task is updated

    if (error) {
      toast.error("Failed to update task: " + error.message);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, task: editingTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditingTaskText("");
      toast.success("Task updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-timebomb">Time Schedule</h1> {/* Applied font-timebomb */}
      <p className="text-muted-foreground">Manage your daily activities and tasks.</p>

      <Card>
        <CardHeader>
          <CardTitle className="font-naruto">Add New Task</CardTitle>
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
            disabled={!userId}
          />
          <Button onClick={handleAddTask} disabled={!userId}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-naruto">Today's Tasks</CardTitle>
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
                      onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                      className="mr-3"
                      disabled={!userId}
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
                        disabled={!userId}
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
                        disabled={!userId}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Delete task"
                      disabled={!userId}
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