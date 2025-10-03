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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const LOCAL_STORAGE_KEY = "selfLearningTopics";

// Removed predefined learning topics for initial load. Now starts empty.
const initialLearningTopics: LearningTopic[] = [];

const SelfLearningTopics = () => {
  const [topics, setTopics] = useState<LearningTopic[]>(() =>
    loadState(LOCAL_STORAGE_KEY, initialLearningTopics)
  );
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [newTopicDescription, setNewTopicDescription] = useState<string>("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState<string>("");
  const [editingTopicDescription, setEditingTopicDescription] = useState<string>("");

  useEffect(() => {
    saveState(LOCAL_STORAGE_KEY, topics);
  }, [topics]);

  const handleAddTopic = () => {
    if (newTopicTitle.trim() === "" || newTopicDescription.trim() === "") {
      toast.error("Topic title and description cannot be empty.");
      return;
    }
    const id = crypto.randomUUID();
    setTopics([
      ...topics,
      { id, title: newTopicTitle, description: newTopicDescription, completed: false },
    ]);
    setNewTopicTitle("");
    setNewTopicDescription("");
    toast.success("Learning topic added successfully!");
  };

  const handleToggleComplete = (id: string) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic
      )
    );
    toast.info("Topic completion status updated.");
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter((topic) => topic.id !== id));
    toast.success("Topic deleted.");
  };

  const handleEditTopic = (id: string, currentTitle: string, currentDescription: string) => {
    setEditingTopicId(id);
    setEditingTopicTitle(currentTitle);
    setEditingTopicDescription(currentDescription);
  };

  const handleSaveEdit = (id: string) => {
    if (editingTopicTitle.trim() === "" || editingTopicDescription.trim() === "") {
      toast.error("Topic title and description cannot be empty.");
      return;
    }
    setTopics(
      topics.map((topic) =>
        topic.id === id
          ? { ...topic, title: editingTopicTitle, description: editingTopicDescription }
          : topic
      )
    );
    setEditingTopicId(null);
    setEditingTopicTitle("");
    setEditingTopicDescription("");
    toast.success("Topic updated successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-minecraft">Self-Learning Topics</h1> {/* Applied font-minecraft */}
      <p className="text-muted-foreground">Manage your learning topics and mark them as complete.</p>

      <Card>
        <CardHeader>
          <CardTitle>Add New Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-topic-title">Topic Title</Label>
            <Input
              id="new-topic-title"
              placeholder="e.g., Advanced React Hooks"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-topic-description">Topic Description</Label>
            <Textarea
              id="new-topic-description"
              placeholder="Provide a detailed description of the learning topic..."
              value={newTopicDescription}
              onChange={(e) => setNewTopicDescription(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleAddTopic} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Topic
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Learning Topics</CardTitle>
        </CardHeader>
        <CardContent>
          {topics.length === 0 ? (
            <p className="text-muted-foreground">No learning topics added yet. Start by adding a new topic above!</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {topics.map((topic) => (
                <AccordionItem key={topic.id} value={topic.id}>
                  <AccordionTrigger className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent hover:no-underline">
                    <div className="flex items-center flex-1">
                      <Checkbox
                        id={`topic-${topic.id}`}
                        checked={topic.completed}
                        onCheckedChange={() => handleToggleComplete(topic.id)}
                        className="mr-3"
                        // Prevent accordion from toggling when checkbox is clicked
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Label
                        htmlFor={`topic-${topic.id}`}
                        className={topic.completed ? "line-through text-muted-foreground" : ""}
                      >
                        {topic.title}
                      </Label>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border-t bg-muted/20">
                    {editingTopicId === topic.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editingTopicTitle}
                          onChange={(e) => setEditingTopicTitle(e.target.value)}
                          onBlur={() => handleSaveEdit(topic.id)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(topic.id);
                            }
                          }}
                          className="w-full"
                        />
                        <Textarea
                          value={editingTopicDescription}
                          onChange={(e) => setEditingTopicDescription(e.target.value)}
                          onBlur={() => handleSaveEdit(topic.id)}
                          className="w-full"
                          rows={5}
                        />
                        <Button onClick={() => handleSaveEdit(topic.id)} className="w-full">
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-muted-foreground whitespace-pre-wrap">{topic.description}</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTopic(topic.id, topic.title, topic.description)}
                            aria-label="Edit topic"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTopic(topic.id)}
                            aria-label="Delete topic"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfLearningTopics;