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

const initialLearningTopics: LearningTopic[] = [
  {
    id: "topic-1",
    title: "Network Security Fundamentals",
    description: `Firewalls: Devices or software that control incoming and outgoing network traffic based on security rules, essential for perimeter defense.

Intrusion Detection Systems (IDS): Monitors network traffic for suspicious activity and alerts administrators. It can be signature-based or anomaly-based.

Encryption: Protects data privacy and integrity by converting it into a secure format during transmission or storage, using protocols such as SSL/TLS, AES, or RSA.

Common Network Vulnerabilities: Include open ports, weak passwords, unpatched software, poorly configured devices, and inadequate monitoring.

Security Practices: Regular updates and patching, strong access controls, network segmentation, VPNs, and continuous monitoring.`,
    completed: false,
  },
  {
    id: "topic-2",
    title: "Ethical Hacking & Penetration Testing",
    description: `Basics of Ethical Hacking: Ethical hacking involves authorized testing of computer systems to find security weaknesses before malicious hackers do. It operates under a strict legal and ethical framework.

Vulnerability Assessment: This is the process of identifying, quantifying, and prioritizing vulnerabilities in a system. Tools like Nessus, OpenVAS, or Qualys are commonly used for scanning.

Penetration Testing: Also called pen-testing, this simulates cyberattacks on a system to assess its security by exploiting vulnerabilities. It includes phases like planning, scanning, gaining access, maintaining access, and reporting.

Common Techniques: Includes network scanning, social engineering, exploiting software bugs, and password attacks.

Purpose: Enhances security posture by addressing vulnerabilities, improving defenses, and complying with regulations.`,
    completed: false,
  },
];

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
      <h1 className="text-3xl font-bold">Self-Learning Topics</h1>
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