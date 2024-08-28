"use client";

import { Button } from "@/components/ui/button";
import CategorySelect from "./select-category";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createFlashcard } from "../actions";

export default function CreateFlashcard({
  categories,
}: {
  categories: Category[];
}) {
  // Initialize selectedCategory only if categories are available
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories.length > 0 ? categories[0] : null
  );
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await createFlashcard(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Flashcard created");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>Create a new flashcard</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          id="create-flashcard"
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              name="question"
              placeholder="What is JavaScript?"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              name="answer"
              required
              placeholder="JavaScript is a programming language."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Add to category</Label>
            {selectedCategory && (
              <>
                <input
                  name="category"
                  readOnly
                  type="text"
                  hidden
                  aria-hidden
                  aria-readonly
                  value={selectedCategory.id}
                  className="hidden"
                />
                <CategorySelect
                  defaultValue={{
                    label: selectedCategory.name,
                    value: selectedCategory.slug,
                  }}
                  onSelect={(slug) =>
                    setSelectedCategory(
                      categories.find((c) => c.slug === slug) || null
                    )
                  }
                  categories={categories.map((category) => ({
                    label: category.name,
                    value: category.slug,
                  }))}
                />
              </>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button form="create-flashcard" type="submit" disabled={!selectedCategory}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
